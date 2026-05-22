import { useEffect, useState } from "react";

const KEY = "ps:active-archetypes"; // agora um JSON array
const LEGACY_KEY = "ps:active-archetype";
const STATS_KEY = "ps:user-stats";

type Listener = (value: string[]) => void;
const listeners = new Set<Listener>();

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as string[];
    // migração do formato antigo (um único arquétipo)
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    return legacy ? [legacy] : [];
  } catch {
    return [];
  }
}

function write(next: string[]) {
  if (typeof window === "undefined") return;
  const uniq = Array.from(new Set(next));
  window.localStorage.setItem(KEY, JSON.stringify(uniq));
  listeners.forEach((l) => l(uniq));
}

export function getActiveArchetypes(): string[] {
  return read();
}

export function isArchetypeActive(id: string): boolean {
  return read().includes(id);
}

export const MAX_ACTIVE_ARCHETYPES = 3;

export function canAddArchetype(): boolean {
  return read().length < MAX_ACTIVE_ARCHETYPES;
}

export function addActiveArchetype(id: string): boolean {
  const cur = read();
  if (cur.includes(id)) return true;
  if (cur.length >= MAX_ACTIVE_ARCHETYPES) return false;
  write([...cur, id]);
  return true;
}

export function removeActiveArchetype(id: string) {
  const cur = read();
  if (!cur.includes(id)) return;
  write(cur.filter((x) => x !== id));
}

export function toggleActiveArchetype(id: string): boolean {
  const cur = read();
  if (cur.includes(id)) { write(cur.filter((x) => x !== id)); return true; }
  if (cur.length >= MAX_ACTIVE_ARCHETYPES) return false;
  write([...cur, id]);
  return true;
}

export function clearAllActiveArchetypes() {
  write([]);
}

/** Compatibilidade: continua funcionando para quem usa um único arquétipo. */
export function setActiveArchetype(id: string) {
  addActiveArchetype(id);
}

export function clearActiveArchetype() {
  clearAllActiveArchetypes();
}

export function useActiveArchetypes(): string[] {
  const [value, setValue] = useState<string[]>(() => read());
  useEffect(() => {
    setValue(read());
    const l: Listener = (v) => setValue(v);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return value;
}

/** Retorna o arquétipo "primário" (último acionado) para compatibilidade. */
export function useActiveArchetype(): string | null {
  const arr = useActiveArchetypes();
  return arr.length ? arr[arr.length - 1] : null;
}

// ===== Stats locais (placeholder até integração com backend) =====

export type UserStats = {
  sessions: number;
  streak: number;
  reports: number;
  totalMinutes: number;
};

const DEFAULT_STATS: UserStats = { sessions: 0, streak: 0, reports: 0, totalMinutes: 0 };

function readStats(): UserStats {
  if (typeof window === "undefined") return DEFAULT_STATS;
  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
}

const statsListeners = new Set<(s: UserStats) => void>();

export function getUserStats() {
  return readStats();
}

export function bumpSession(minutes = 0, payload?: { archetypeId?: string | null; frequencyIds?: string[] }) {
  if (typeof window === "undefined") return;
  const cur = readStats();
  const next: UserStats = {
    ...cur,
    sessions: cur.sessions + 1,
    totalMinutes: cur.totalMinutes + minutes,
  };
  window.localStorage.setItem(STATS_KEY, JSON.stringify(next));
  statsListeners.forEach((l) => l(next));

  void (async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("sessions").insert({
        user_id: user.id,
        archetype_id: payload?.archetypeId ?? null,
        frequency_ids: payload?.frequencyIds ?? [],
        duration_seconds: Math.max(0, Math.round(minutes * 60)),
      });
      const m = await import("./use-remote-stats");
      m.notifyStatsChanged();
    } catch {
      /* ignore */
    }
  })();
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats>(() => readStats());
  useEffect(() => {
    setStats(readStats());
    const l = (s: UserStats) => setStats(s);
    statsListeners.add(l);
    return () => {
      statsListeners.delete(l);
    };
  }, []);
  return stats;
}
