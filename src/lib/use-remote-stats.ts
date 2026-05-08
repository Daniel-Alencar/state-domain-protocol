import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth-context";

export type RemoteStats = {
  sessions: number;
  streak: number;
  reports: number;
  totalMinutes: number;
};

const DEFAULT: RemoteStats = { sessions: 0, streak: 0, reports: 0, totalMinutes: 0 };

let bumpListeners = new Set<() => void>();
export function notifyStatsChanged() { bumpListeners.forEach((l) => l()); }

export function useRemoteStats(): { stats: RemoteStats; loading: boolean; refresh: () => void } {
  const { user } = useAuth();
  const [stats, setStats] = useState<RemoteStats>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const l = () => setTick((t) => t + 1);
    bumpListeners.add(l);
    return () => { bumpListeners.delete(l); };
  }, []);

  useEffect(() => {
    let alive = true;
    if (!user) { setStats(DEFAULT); setLoading(false); return; }
    setLoading(true);
    (async () => {
      const [{ data: rpc }, { data: minRow }] = await Promise.all([
        supabase.rpc("get_my_stats"),
        supabase.from("sessions").select("duration_seconds").eq("user_id", user.id),
      ]);
      if (!alive) return;
      const row = rpc?.[0] ?? { total_sessions: 0, active_streak: 0, validated_reports: 0 };
      const totalMinutes = Math.round(
        (minRow ?? []).reduce((acc, r: { duration_seconds: number }) => acc + (r.duration_seconds || 0), 0) / 60,
      );
      setStats({
        sessions: row.total_sessions ?? 0,
        streak: row.active_streak ?? 0,
        reports: row.validated_reports ?? 0,
        totalMinutes,
      });
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [user, tick]);

  return { stats, loading, refresh: () => setTick((t) => t + 1) };
}
