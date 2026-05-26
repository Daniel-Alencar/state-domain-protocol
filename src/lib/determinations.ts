import { useEffect, useState } from "react";
import { enableWakeLock, disableWakeLock } from "./wake-lock";
import { supabase } from "@/integrations/supabase/client";
import { putAudio, getAudioBlob, deleteAudio } from "./determinations-audio";

export type Determination = {
  id: string;
  title: string;
  transcript: string;
  /** Legado: gravações antigas guardadas como base64 no localStorage. Novas usam IndexedDB. */
  audioDataUrl?: string;
  hasAudio?: boolean;
  suggestedArchetypes: string[];
  rationale?: string;
  preset?: string[];
  createdAt: number;
};

const BASE = "ps:determinations";
const ACTIVE_KEY = "ps:determination-active";
const VOL_KEY = "ps:determination-volume";

let currentUserId: string | null = null;
function storageKey() {
  return currentUserId ? `${BASE}:${currentUserId}` : `${BASE}:anon`;
}

type Listener = (d: Determination[]) => void;
const listeners = new Set<Listener>();

function read(): Determination[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey());
    return raw ? (JSON.parse(raw) as Determination[]) : [];
  } catch {
    return [];
  }
}

function write(next: Determination[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(), JSON.stringify(next));
  listeners.forEach((l) => l(next));
}

if (typeof window !== "undefined") {
  supabase.auth.getUser().then(({ data }) => {
    currentUserId = data.user?.id ?? null;
    listeners.forEach((l) => l(read()));
  });
  supabase.auth.onAuthStateChange((_e, session) => {
    const next = session?.user?.id ?? null;
    if (next === currentUserId) return;
    try { setActiveDetermination(null); } catch { /* noop */ }
    currentUserId = next;
    listeners.forEach((l) => l(read()));
  });
}

export function listDeterminations() { return read(); }

/**
 * Salva uma nova determinação. O áudio vai para IndexedDB (sem limite prático),
 * apenas metadados ficam no localStorage.
 */
export async function addDetermination(input: {
  title: string;
  transcript: string;
  audioBlob: Blob;
  suggestedArchetypes: string[];
  rationale?: string;
  preset?: string[];
}): Promise<Determination> {
  const id = crypto.randomUUID();
  await putAudio(id, input.audioBlob);
  const next: Determination = {
    id,
    title: input.title,
    transcript: input.transcript,
    hasAudio: true,
    suggestedArchetypes: input.suggestedArchetypes,
    rationale: input.rationale,
    preset: input.preset,
    createdAt: Date.now(),
  };
  write([next, ...read()]);
  return next;
}

export function updateDetermination(id: string, patch: Partial<Omit<Determination, "id" | "createdAt">>) {
  write(read().map((d) => (d.id === id ? { ...d, ...patch } : d)));
}

export function removeDetermination(id: string) {
  write(read().filter((d) => d.id !== id));
  void deleteAudio(id).catch(() => { /* noop */ });
  if (getActiveDeterminationId() === id) setActiveDetermination(null);
}

export function useDeterminations() {
  const [items, setItems] = useState<Determination[]>(() => read());
  useEffect(() => {
    setItems(read());
    const l: Listener = (v) => setItems(v);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return items;
}

// ===== Volume da determinação =====
let determinationVolume = 1;
if (typeof window !== "undefined") {
  const v = Number(window.localStorage.getItem(VOL_KEY));
  if (!Number.isNaN(v) && v > 0) determinationVolume = v;
}
const volListeners = new Set<(v: number) => void>();

// Boost máximo aplicado quando o slider está em 100%. Voz gravada por mic
// chega com nível baixo (~ -20 dBFS); permitimos ganho > 1 via WebAudio para
// equiparar à percepção das frequências binaurais.
const DET_MAX_GAIN = 6;

function gainFromVolume(v: number) {
  return Math.max(0, Math.min(1, v)) * DET_MAX_GAIN;
}

export function getDeterminationVolume() { return determinationVolume; }
export function setDeterminationVolume(v: number) {
  determinationVolume = Math.max(0, Math.min(1, v));
  if (typeof window !== "undefined") window.localStorage.setItem(VOL_KEY, String(determinationVolume));
  if (gainNode && audioCtx) {
    gainNode.gain.setTargetAtTime(gainFromVolume(determinationVolume), audioCtx.currentTime, 0.05);
  } else if (audioEl) {
    // Fallback (sem WebAudio): cap em 1.
    audioEl.volume = Math.min(1, gainFromVolume(determinationVolume));
  }
  volListeners.forEach((l) => l(determinationVolume));
}
export function useDeterminationVolume() {
  const [v, setV] = useState(getDeterminationVolume);
  useEffect(() => { const l = (x: number) => setV(x); volListeners.add(l); return () => { volListeners.delete(l); }; }, []);
  return v;
}

// ===== Tocador em loop =====
const activeListeners = new Set<(id: string | null) => void>();
let audioEl: HTMLAudioElement | null = null;
let currentObjectUrl: string | null = null;
let audioCtx: AudioContext | null = null;
let gainNode: GainNode | null = null;
let sourceNode: MediaElementAudioSourceNode | null = null;

export function getActiveDeterminationId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_KEY);
}

function teardownAudio() {
  if (audioEl) { try { audioEl.pause(); } catch { /* noop */ } audioEl = null; }
  if (sourceNode) { try { sourceNode.disconnect(); } catch { /* noop */ } sourceNode = null; }
  if (gainNode) { try { gainNode.disconnect(); } catch { /* noop */ } gainNode = null; }
  if (currentObjectUrl) { try { URL.revokeObjectURL(currentObjectUrl); } catch { /* noop */ } currentObjectUrl = null; }
}

function attachWebAudio(el: HTMLAudioElement) {
  try {
    if (!audioCtx) {
      const AC: typeof AudioContext =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") void audioCtx.resume();
    sourceNode = audioCtx.createMediaElementSource(el);
    gainNode = audioCtx.createGain();
    gainNode.gain.value = gainFromVolume(determinationVolume);
    sourceNode.connect(gainNode).connect(audioCtx.destination);
    el.volume = 1; // o ganho é feito no GainNode
  } catch {
    // Se WebAudio falhar, cai para o volume nativo (cap em 1).
    el.volume = Math.min(1, gainFromVolume(determinationVolume));
  }
}

export function setActiveDetermination(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) window.localStorage.setItem(ACTIVE_KEY, id);
  else window.localStorage.removeItem(ACTIVE_KEY);

  teardownAudio();

  if (id) {
    const item = read().find((d) => d.id === id);
    if (item) {
      // Caminho novo: blob no IndexedDB.
      if (item.hasAudio) {
        void (async () => {
          try {
            const blob = await getAudioBlob(id);
            if (!blob) return;
            currentObjectUrl = URL.createObjectURL(blob);
            audioEl = new Audio(currentObjectUrl);
            audioEl.loop = true;
            audioEl.crossOrigin = "anonymous";
            attachWebAudio(audioEl);
            await audioEl.play().catch(() => { /* iOS exige gesto */ });
            enableWakeLock();
          } catch (e) {
            console.error("[determinations] failed to play audio", e);
          }
        })();
      } else if (item.audioDataUrl) {
        // Legado.
        audioEl = new Audio(item.audioDataUrl);
        audioEl.loop = true;
        attachWebAudio(audioEl);
        void audioEl.play().catch(() => { /* iOS exige gesto */ });
        enableWakeLock();
      }
    }
  } else {
    disableWakeLock();
  }
  activeListeners.forEach((l) => l(id));
}

export function useActiveDetermination(): string | null {
  const [id, setId] = useState<string | null>(() => getActiveDeterminationId());
  useEffect(() => {
    setId(getActiveDeterminationId());
    const l = (v: string | null) => setId(v);
    activeListeners.add(l);
    return () => { activeListeners.delete(l); };
  }, []);
  return id;
}
