import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  adminListVouchers,
  adminCreateVoucher,
  adminDeleteVoucher,
  type Voucher,
  type VoucherRedemption,
} from "@/lib/vouchers.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · Protocolo Soberano" }] }),
  component: AdminPage,
});

const TIER_LABEL: Record<string, string> = { basico: "Básico", premium: "Premium" };

function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [fetching, setFetching] = useState(false);

  const [code, setCode] = useState("");
  const [planTier, setPlanTier] = useState<"basico" | "premium">("premium");
  const [maxRedemptions, setMaxRedemptions] = useState(1);
  const [expiresAt, setExpiresAt] = useState("");
  const [creating, setCreating] = useState(false);

  const doList = useServerFn(adminListVouchers);
  const doCreate = useServerFn(adminCreateVoucher);
  const doDelete = useServerFn(adminDeleteVoucher);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate({ to: "/login", search: { redirect: "/admin" } });
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin === true) loadVouchers();
  }, [isAdmin]);

  async function loadVouchers() {
    setFetching(true);
    try {
      const res = await doList({ data: {} });
      setVouchers(res.vouchers);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar vouchers.");
    } finally {
      setFetching(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Informe o código do voucher.");
      return;
    }
    setCreating(true);
    try {
      await doCreate({ data: { code, planTier, maxRedemptions, expiresAt: expiresAt || null } });
      toast.success("Voucher criado com sucesso.");
      setCode("");
      setMaxRedemptions(1);
      setExpiresAt("");
      await loadVouchers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar voucher.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string, voucherCode: string) {
    if (!confirm(`Deletar o voucher "${voucherCode}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await doDelete({ data: { id } });
      toast.success("Voucher deletado.");
      setVouchers((prev) => prev.filter((v) => v.id !== id));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao deletar voucher.");
    }
  }

  function generateCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const part = (n: number) =>
      Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setCode(`${part(4)}-${part(4)}-${part(4)}`);
  }

  if (authLoading || isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-mono text-tracked text-[10px] text-muted-foreground">
        Verificando acesso…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="text-center">
          <div className="mb-4 text-5xl text-muted-foreground/20">✕</div>
          <h1 className="text-xl font-light text-foreground">Acesso negado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta área é restrita a administradores.
          </p>
          <a
            href="/app"
            className="mt-6 inline-block text-mono text-tracked text-[11px] text-signal hover:underline"
          >
            Voltar ao app
          </a>
        </div>
      </div>
    );
  }

  const total = vouchers.length;
  const totalRedeemed = vouchers.reduce((s, v) => s + v.redeemed_count, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/60 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-mono text-tracked text-[10px] text-signal mb-0.5">
            Administração · Protocolo Soberano
          </div>
          <h1 className="text-2xl font-light text-foreground">Gestão de Vouchers</h1>
        </div>
        <a
          href="/app"
          className="text-mono text-tracked text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Voltar ao app
        </a>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10 space-y-10">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard label="Total de vouchers" value={String(total)} />
          <StatCard label="Total resgatados" value={String(totalRedeemed)} />
          <StatCard
            label="Vouchers ativos"
            value={String(
              vouchers.filter(
                (v) =>
                  v.redeemed_count < v.max_redemptions &&
                  (!v.expires_at || new Date(v.expires_at) > new Date()),
              ).length,
            )}
          />
        </div>

        {/* Create voucher */}
        <section className="glass-panel rounded-xl border border-signal/30 p-6">
          <div className="text-mono text-tracked mb-4 text-[10px] text-signal">
            Criar novo voucher
          </div>
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
            {/* Code */}
            <div className="sm:col-span-2 flex gap-2">
              <div className="flex-1">
                <label className="text-mono text-tracked text-[10px] text-foreground/80 block mb-1">
                  Código
                </label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="EX: SOBERANO-2026-VIP"
                  className="w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 font-mono text-sm text-foreground tracking-widest focus:border-signal/60 focus:outline-none"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={generateCode}
                  className="text-mono text-tracked whitespace-nowrap rounded-md border border-border/60 px-3 py-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Gerar código
                </button>
              </div>
            </div>

            {/* Plan tier */}
            <div>
              <label className="text-mono text-tracked text-[10px] text-foreground/80 block mb-1">
                Plano concedido
              </label>
              <select
                value={planTier}
                onChange={(e) => setPlanTier(e.target.value as "basico" | "premium")}
                className="w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm text-foreground focus:border-signal/60 focus:outline-none"
              >
                <option value="premium">Premium · acesso completo</option>
                <option value="basico">Básico</option>
              </select>
            </div>

            {/* Max redemptions */}
            <div>
              <label className="text-mono text-tracked text-[10px] text-foreground/80 block mb-1">
                Máximo de resgates
              </label>
              <input
                type="number"
                min={1}
                max={1000}
                value={maxRedemptions}
                onChange={(e) => setMaxRedemptions(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm text-foreground focus:border-signal/60 focus:outline-none"
              />
            </div>

            {/* Expiration */}
            <div className="sm:col-span-2">
              <label className="text-mono text-tracked text-[10px] text-foreground/80 block mb-1">
                Expiração do resgate{" "}
                <span className="text-muted-foreground/60">
                  (opcional — após esta data o código não pode ser mais utilizado; o acesso
                  concedido é vitalício)
                </span>
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm text-foreground focus:border-signal/60 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={creating}
                className="text-mono text-tracked rounded-full bg-foreground px-6 py-2.5 text-[11px] text-background disabled:opacity-40 transition-opacity"
              >
                {creating ? "Criando…" : "Criar voucher"}
              </button>
            </div>
          </form>
        </section>

        {/* Voucher list */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="text-mono text-tracked text-[10px] text-signal">Vouchers criados</div>
            <button
              onClick={loadVouchers}
              disabled={fetching}
              className="text-mono text-tracked text-[10px] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
            >
              {fetching ? "Atualizando…" : "↺ Atualizar lista"}
            </button>
          </div>

          {fetching && vouchers.length === 0 ? (
            <div className="text-sm text-muted-foreground">Carregando…</div>
          ) : vouchers.length === 0 ? (
            <div className="glass-panel rounded-xl border border-border/40 p-8 text-center text-sm text-muted-foreground">
              Nenhum voucher criado ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {vouchers.map((v) => (
                <VoucherRow
                  key={v.id}
                  voucher={v}
                  onDelete={() => handleDelete(v.id, v.code)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-panel rounded-xl border border-border/40 p-4">
      <div className="text-mono text-tracked text-[10px] text-muted-foreground mb-1">{label}</div>
      <div className="text-3xl font-light text-foreground">{value}</div>
    </div>
  );
}

function VoucherRow({
  voucher,
  onDelete,
}: {
  voucher: Voucher;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const expired = voucher.expires_at ? new Date(voucher.expires_at) < new Date() : false;
  const exhausted = voucher.redeemed_count >= voucher.max_redemptions;
  const inactive = expired || exhausted;

  return (
    <div
      className={`glass-panel rounded-xl border p-4 transition-opacity ${
        inactive ? "border-border/30 opacity-60" : "border-border/50"
      }`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <code className="font-mono text-base tracking-widest text-foreground">{voucher.code}</code>

        <span
          className={`text-mono text-tracked rounded-full border px-2 py-0.5 text-[10px] ${
            voucher.plan_tier === "premium"
              ? "border-signal/40 text-signal"
              : "border-elite/40 text-elite"
          }`}
        >
          {TIER_LABEL[voucher.plan_tier] ?? voucher.plan_tier}
        </span>

        <span className="text-mono text-tracked text-[10px] text-muted-foreground">
          {voucher.redeemed_count}/{voucher.max_redemptions} resgates
        </span>

        {voucher.expires_at && (
          <span
            className={`text-mono text-tracked text-[10px] ${expired ? "text-destructive" : "text-muted-foreground"}`}
          >
            {expired ? "Expirou" : "Expira"} em{" "}
            {new Date(voucher.expires_at).toLocaleString("pt-BR")}
          </span>
        )}

        {exhausted && (
          <span className="text-mono text-tracked text-[10px] text-destructive">Esgotado</span>
        )}

        <div className="ml-auto flex items-center gap-2">
          {voucher.voucher_redemptions.length > 0 && (
            <button
              onClick={() => setOpen((x) => !x)}
              className="text-mono text-tracked text-[10px] text-signal hover:text-signal/70 transition-colors"
            >
              {open
                ? "Ocultar"
                : `${voucher.voucher_redemptions.length} resgate(s)`}
            </button>
          )}
          <button
            onClick={onDelete}
            className="text-mono text-tracked rounded-full border border-destructive/50 px-3 py-1 text-[10px] text-destructive hover:bg-destructive/10 transition-colors"
          >
            Deletar
          </button>
        </div>
      </div>

      {open && voucher.voucher_redemptions.length > 0 && (
        <RedemptionList redemptions={voucher.voucher_redemptions} />
      )}
    </div>
  );
}

function RedemptionList({ redemptions }: { redemptions: VoucherRedemption[] }) {
  return (
    <div className="mt-3 border-t border-border/30 pt-3 space-y-1.5">
      <div className="text-mono text-tracked text-[9px] text-muted-foreground mb-2">
        Resgates realizados
      </div>
      {redemptions.map((r) => (
        <div key={r.id} className="flex items-center gap-3 text-[11px]">
          <span className="font-mono text-foreground/80">{r.user_email ?? r.user_id}</span>
          <span className="text-muted-foreground/40">·</span>
          <span className="text-muted-foreground/60">
            {new Date(r.redeemed_at).toLocaleString("pt-BR")}
          </span>
        </div>
      ))}
    </div>
  );
}
