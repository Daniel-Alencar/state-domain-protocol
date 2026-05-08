import { useEffect, useState } from "react";

const KEY = "ps:active-archetype";
const STATS_KEY = "ps:user-stats";

type Listener = (value: string | null) => void;
const listeners = new Set<Listener>();

function read(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function setActiveArchetype(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, id);
  listeners.forEach((l) => l(id));
}

export function clearActiveArchetype() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  listeners.forEach((l) => l(null));
}

export function useActiveArchetype() {
  const [value, setValue] = useState<string | null>(() => read());
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

  // Sync to backend (fire-and-forget)
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
