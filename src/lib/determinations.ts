import { useEffect, useState } from "react";
import { enableWakeLock, disableWakeLock } from "./wake-lock";
import { supabase } from "@/integrations/supabase/client";

export type Determination = {
  id: string;
  title: string;
  transcript: string;
  audioDataUrl: string;
  suggestedArchetypes: string[];
  rationale?: string;
  preset?: string[];
  createdAt: number;
};

const BASE = "ps:determinations";
const ACTIVE_KEY = "ps:determination-active";
const VOL_KEY = "ps:determination-volume";

// Namespace por usuário: gravações de um usuário nunca aparecem para outro
// que use o mesmo navegador.
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

export function addDetermination(d: Omit<Determination, "id" | "createdAt">) {
  const next: Determination = { ...d, id: crypto.randomUUID(), createdAt: Date.now() };
  write([next, ...read()]);
  return next;
}

export function updateDetermination(id: string, patch: Partial<Omit<Determination, "id" | "createdAt">>) {
  write(read().map((d) => (d.id === id ? { ...d, ...patch } : d)));
}

export function removeDetermination(id: string) {
  write(read().filter((d) => d.id !== id));
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

export function getDeterminationVolume() { return determinationVolume; }
export function setDeterminationVolume(v: number) {
  determinationVolume = Math.max(0, Math.min(1, v));
  if (typeof window !== "undefined") window.localStorage.setItem(VOL_KEY, String(determinationVolume));
  if (audioEl) audioEl.volume = determinationVolume;
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

export function getActiveDeterminationId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_KEY);
}

export function setActiveDetermination(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) window.localStorage.setItem(ACTIVE_KEY, id);
  else window.localStorage.removeItem(ACTIVE_KEY);

  if (audioEl) { try { audioEl.pause(); } catch { /* noop */ } audioEl = null; }

  if (id) {
    const item = read().find((d) => d.id === id);
    if (item) {
      audioEl = new Audio(item.audioDataUrl);
      audioEl.loop = true;
      audioEl.volume = determinationVolume;
      void audioEl.play().catch(() => { /* iOS exige gesto */ });
      enableWakeLock();
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
