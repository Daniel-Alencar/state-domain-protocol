import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth-context";

export type PlanTier = "free" | "iniciado" | "soberano";

export type Entitlement = {
  tier: PlanTier;
  active: boolean;
  loading: boolean;
  /** Access for a feature requiring a minimum tier */
  has: (min: PlanTier) => boolean;
};

const ORDER: Record<PlanTier, number> = { free: 0, iniciado: 1, soberano: 2 };

export function useEntitlement(): Entitlement {
  const { user } = useAuth();
  const [tier, setTier] = useState<PlanTier>("free");
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    if (!user) {
      setTier("free"); setActive(false); setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("subscriptions")
      .select("plan_tier,status")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!alive) return;
        setTier((data?.plan_tier as PlanTier) ?? "free");
        setActive((data?.status ?? "active") === "active");
        setLoading(false);
      });
    return () => { alive = false; };
  }, [user]);

  return {
    tier, active, loading,
    has: (min) => active && ORDER[tier] >= ORDER[min],
  };
}
