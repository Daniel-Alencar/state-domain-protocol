import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth-context";
import { type PlanTier, PLAN_ORDER } from "./plans";

export type { PlanTier };

export type Entitlement = {
  tier: PlanTier;
  active: boolean;
  loading: boolean;
  /** Returns true if the user's plan meets the minimum required tier. */
  has: (min: PlanTier) => boolean;
};

// Maps legacy DB values ("iniciado", "soberano") to new tier names.
function normalizeTier(raw: string | null | undefined): PlanTier {
  if (raw === "iniciado") return "basico";
  if (raw === "soberano") return "premium";
  if (raw === "basico" || raw === "premium") return raw;
  return "free";
}

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
        setTier(normalizeTier(data?.plan_tier));
        setActive((data?.status ?? "active") === "active");
        setLoading(false);
      });
    return () => { alive = false; };
  }, [user]);

  return {
    tier, active, loading,
    has: (min) => active && PLAN_ORDER[tier] >= PLAN_ORDER[min],
  };
}
