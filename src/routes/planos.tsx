import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { PLANS, type PlanTier } from "@/lib/plans";
import { useEntitlement } from "@/lib/use-entitlement";
import { useAuth } from "@/lib/auth-context";
import { createCheckout } from "@/lib/mercadopago.functions";
import { redeemVoucher } from "@/lib/vouchers.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/planos")({
  head: () => ({ meta: [{ title: "Planos · Protocolo Soberano" }] }),
  component: PlanosPage,
});

const STATUS_BANNER = {
  sucesso: {
    bg: "border-signal/40 bg-signal/5",
    text: "Pagamento confirmado · Seu plano será ativado em instantes.",
    icon: "✓",
  },
  pendente: {
    bg: "border-elite/40 bg-elite/5",
    text: "Pagamento em análise · Você receberá uma confirmação em breve.",
    icon: "○",
  },
  falha: {
    bg: "border-destructive/40 bg-destructive/5",
    text: "Pagamento não concluído · Tente novamente ou escolha outro método.",
    icon: "✕",
  },
} as const;

function PlanosPage() {
  const ent = useEntitlement();
  const { user } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const status = searchParams.get("status") as "sucesso" | "falha" | "pendente" | null;
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [loadingPlan, setLoadingPlan] = useState<PlanTier | null>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [voucherResult, setVoucherResult] = useState<{ ok: boolean; message: string } | null>(null);
  const doCheckout = useServerFn(createCheckout);
  const doRedeem = useServerFn(redeemVoucher);

  async function handleSubscribe(planId: "basico" | "premium") {
    if (!user?.email) {
      toast.error("Faça login para continuar.");
      return;
    }
    setLoadingPlan(planId);
    try {
      const { checkoutUrl } = await doCheckout({
        data: { planId, billing, userId: user.id, userEmail: user.email },
      });
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error("[planos] checkout error:", err);
      toast.error("Erro ao iniciar o pagamento. Tente novamente em instantes.");
      setLoadingPlan(null);
    }
  }

  async function handleRedeem() {
    if (!voucherCode.trim()) return;
    if (!user) { toast.error("Faça login para resgatar um voucher."); return; }
    setRedeeming(true);
    setVoucherResult(null);
    try {
      const res = await doRedeem({ data: { code: voucherCode.trim() } });
      setVoucherResult({ ok: res.ok, message: res.ok
        ? `Acesso ${res.planTier === "premium" ? "Premium" : "Básico"} ativado com sucesso! Recarregando…`
        : res.message,
      });
      if (res.ok) {
        setTimeout(() => window.location.reload(), 1800);
      }
    } catch (err: unknown) {
      setVoucherResult({ ok: false, message: err instanceof Error ? err.message : "Erro ao resgatar. Tente novamente." });
    } finally {
      setRedeeming(false);
    }
  }

  const banner = status ? STATUS_BANNER[status] : null;

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 pb-32 pt-10">
        {/* Status banner (pós-pagamento) */}
        {banner && (
          <div
            className={`mb-8 flex items-center gap-3 rounded-lg border px-5 py-4 ${banner.bg}`}
          >
            <span className="text-lg text-foreground">{banner.icon}</span>
            <p className="text-sm text-foreground/90">{banner.text}</p>
          </div>
        )}

        <div className="mb-10 text-center">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Módulo · Acesso</div>
          <h1 className="text-3xl font-light text-foreground md:text-4xl">Planos de acesso</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Plano atual:{" "}
            <span className="text-foreground font-medium">
              {ent.tier === "free" ? "Grátis" : ent.tier === "basico" ? "Básico" : "Premium"}
            </span>
          </p>
        </div>

        {/* Toggle mensal / anual */}
        <div className="mb-8 flex justify-center">
          <div className="flex rounded-full border border-border/60 bg-card/40 p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`text-mono text-tracked rounded-full px-5 py-2 text-[11px] transition-colors ${
                billing === "monthly"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`text-mono text-tracked flex items-center gap-2 rounded-full px-5 py-2 text-[11px] transition-colors ${
                billing === "annual"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Anual
              {billing !== "annual" && (
                <span className="rounded-full bg-signal/20 px-1.5 py-0.5 text-[9px] text-signal">
                  até 36% off
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Cards de plano */}
        <div className="grid gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => {
            const isCurrent = ent.tier === plan.id;
            const isLoading = loadingPlan === plan.id;
            const price =
              plan.id === "free"
                ? 0
                : billing === "monthly"
                  ? plan.priceMonthly
                  : plan.priceAnnual;

            return (
              <div
                key={plan.id}
                className={`glass-panel relative flex flex-col overflow-hidden rounded-xl p-6 ${
                  plan.highlight
                    ? "border-signal/50 shadow-[0_0_40px_color-mix(in_oklab,var(--signal-glow)_15%,transparent)]"
                    : ""
                } ${isCurrent ? "border-elite/50" : ""}`}
              >
                {plan.highlight && (
                  <div className="text-mono text-tracked absolute right-3 top-3 rounded-full border border-signal/30 bg-signal/15 px-2 py-0.5 text-[9px] text-signal">
                    Recomendado
                  </div>
                )}
                {isCurrent && (
                  <div className="text-mono text-tracked absolute left-3 top-3 rounded-full border border-elite/30 bg-elite/15 px-2 py-0.5 text-[9px] text-elite">
                    Atual
                  </div>
                )}

                <div className="mb-5 mt-5">
                  <div className="text-2xl font-medium text-foreground">{plan.name}</div>
                </div>

                {plan.id === "free" ? (
                  <div className="mb-6">
                    <span className="text-4xl font-light text-foreground">Grátis</span>
                    <div className="text-mono text-tracked mt-1 text-[10px] text-muted-foreground">
                      sempre
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 space-y-1">
                    <div>
                      <span className="text-4xl font-light text-foreground">
                        R${" "}
                        {price.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span className="text-mono text-tracked ml-1 text-[10px] text-muted-foreground">
                        /{billing === "monthly" ? "mês" : "ano"}
                      </span>
                    </div>
                    {billing === "annual" && (
                      <div className="text-mono text-tracked text-[10px] text-signal">
                        economize {plan.annualSavingsPct}% em relação ao mensal
                      </div>
                    )}
                  </div>
                )}

                <ul className="mb-6 flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground/90">
                      <span className="mt-0.5 shrink-0 text-signal">✓</span>
                      {f}
                    </li>
                  ))}
                  {plan.locked.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-muted-foreground/40 line-through"
                    >
                      <span className="mt-0.5 shrink-0">✕</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div className="text-mono text-tracked w-full rounded-full border border-elite/40 px-4 py-2.5 text-center text-[11px] text-elite">
                    Plano atual
                  </div>
                ) : plan.id === "free" ? (
                  <div className="text-mono text-tracked w-full rounded-full border border-border/30 px-4 py-2.5 text-center text-[11px] text-muted-foreground">
                    Plano gratuito
                  </div>
                ) : (
                  <button
                    disabled={isLoading || loadingPlan !== null}
                    onClick={() => handleSubscribe(plan.id as "basico" | "premium")}
                    className="text-mono text-tracked w-full rounded-full bg-foreground px-4 py-2.5 text-[11px] text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? "Redirecionando…" : `Assinar ${plan.name}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-[11px] text-muted-foreground">
          Pagamento processado pelo Mercado Pago · Cancele quando quiser
        </p>

        {/* ===== Voucher ===== */}
        <div className="mt-10 glass-panel rounded-xl border border-elite/30 p-6">
          <div className="text-mono text-tracked mb-2 text-[10px] text-elite">
            Acesso via voucher
          </div>
          <h2 className="text-xl font-light text-foreground mb-1">Tem um código de acesso?</h2>
          <p className="mb-5 text-sm text-muted-foreground">
            Insira o código para ativar acesso vitalício sem pagamento.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={voucherCode}
              onChange={(e) => {
                setVoucherCode(e.target.value.toUpperCase());
                setVoucherResult(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleRedeem()}
              placeholder="XXXX-XXXX-XXXX"
              className="flex-1 rounded-md border border-border/60 bg-background/40 px-3 py-2.5 font-mono text-sm text-foreground tracking-widest focus:border-elite/60 focus:outline-none"
            />
            <button
              disabled={redeeming || !voucherCode.trim()}
              onClick={handleRedeem}
              className="text-mono text-tracked rounded-full bg-foreground px-6 py-2.5 text-[11px] text-background disabled:opacity-40 transition-opacity"
            >
              {redeeming ? "Verificando…" : "Resgatar"}
            </button>
          </div>
          {voucherResult && (
            <p
              className={`mt-3 text-sm ${voucherResult.ok ? "text-signal" : "text-destructive"}`}
            >
              {voucherResult.ok ? "✓ " : "✕ "}
              {voucherResult.message}
            </p>
          )}
        </div>

        {status === "sucesso" && (
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Se o plano não atualizar em alguns minutos,{" "}
            <button
              onClick={() => window.location.reload()}
              className="text-signal underline-offset-2 hover:underline"
            >
              recarregue a página
            </button>
            .
          </p>
        )}
      </div>
    </AppShell>
  );
}
