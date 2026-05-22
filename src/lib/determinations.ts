import { useEffect, useState } from "react";

export type Determination = {
  id: string;
  title: string;
  transcript: string;
  /** data URL (base64) do áudio gravado. */
  audioDataUrl: string;
  /** Arquétipos sugeridos pela IA. */
  suggestedArchetypes: string[];
  createdAt: number;
};

const KEY = "ps:determinations";
const ACTIVE_KEY = "ps:determination-active";

type Listener = (d: Determination[]) => void;
const listeners = new Set<Listener>();

function read(): Determination[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Determination[]) : [];
  } catch {
    return [];
  }
}

function write(next: Determination[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l(next));
}

export function listDeterminations() {
  return read();
}

export function addDetermination(d: Omit<Determination, "id" | "createdAt">) {
  const next: Determination = { ...d, id: crypto.randomUUID(), createdAt: Date.now() };
  write([next, ...read()]);
  return next;
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
    return () => {
      listeners.delete(l);
    };
  }, []);
  return items;
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

  // Para o áudio atual
  if (audioEl) {
    try { audioEl.pause(); } catch { /* noop */ }
    audioEl = null;
  }

  if (id) {
    const item = read().find((d) => d.id === id);
    if (item) {
      audioEl = new Audio(item.audioDataUrl);
      audioEl.loop = true;
      audioEl.volume = 0.85;
      void audioEl.play().catch(() => { /* iOS exige gesto */ });
    }
  }
  activeListeners.forEach((l) => l(id));
}

export function useActiveDetermination(): string | null {
  const [id, setId] = useState<string | null>(() => getActiveDeterminationId());
  useEffect(() => {
    setId(getActiveDeterminationId());
    const l = (v: string | null) => setId(v);
    activeListeners.add(l);
    return () => {
      activeListeners.delete(l);
    };
  }, []);
  return id;
}
