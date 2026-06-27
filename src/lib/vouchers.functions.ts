import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => supabaseAdmin as any;

export type VoucherRedemption = {
  id: string;
  voucher_id: string;
  user_id: string;
  user_email: string | null;
  redeemed_at: string;
};

export type Voucher = {
  id: string;
  code: string;
  plan_tier: string;
  max_redemptions: number;
  redeemed_count: number;
  expires_at: string | null;
  created_by: string | null;
  created_at: string;
  voucher_redemptions: VoucherRedemption[];
};

async function assertAdmin(userId: string) {
  const { data } = await db()
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Acesso negado: apenas administradores.");
}

// ─── USER: resgatar voucher ───────────────────────────────────────────────────

export const redeemVoucher = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ code: z.string().min(1).max(100) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const code = data.code.trim().toUpperCase();

    const { data: voucher, error: vErr } = await db()
      .from("vouchers")
      .select("*")
      .ilike("code", code)
      .maybeSingle();

    if (vErr || !voucher) {
      return { ok: false as const, message: "Voucher não encontrado." };
    }

    if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
      return { ok: false as const, message: "Este voucher está expirado." };
    }

    if (voucher.redeemed_count >= voucher.max_redemptions) {
      return { ok: false as const, message: "Este voucher já foi totalmente utilizado." };
    }

    const { data: existing } = await db()
      .from("voucher_redemptions")
      .select("id")
      .eq("voucher_id", voucher.id)
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      return { ok: false as const, message: "Você já resgatou este voucher." };
    }

    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);
    const userEmail = authUser?.user?.email ?? null;

    const { error: insertErr } = await db()
      .from("voucher_redemptions")
      .insert({ voucher_id: voucher.id, user_id: userId, user_email: userEmail });

    if (insertErr) {
      if (insertErr.code === "23505") {
        return { ok: false as const, message: "Você já resgatou este voucher." };
      }
      console.error("[redeemVoucher] insert error", insertErr);
      return { ok: false as const, message: "Erro ao registrar o resgate. Tente novamente." };
    }

    await db()
      .from("vouchers")
      .update({ redeemed_count: voucher.redeemed_count + 1 })
      .eq("id", voucher.id);

    const { error: subErr } = await db()
      .from("subscriptions")
      .update({ plan_tier: voucher.plan_tier, status: "active", current_period_end: null })
      .eq("user_id", userId);

    if (subErr) {
      console.error("[redeemVoucher] subscription update error", subErr);
    }

    return { ok: true as const, planTier: voucher.plan_tier as string };
  });

// ─── ADMIN: listar vouchers ───────────────────────────────────────────────────

export const adminListVouchers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({}).parse(input ?? {}))
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await db()
      .from("vouchers")
      .select("*, voucher_redemptions(id, user_id, user_email, redeemed_at)")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Erro ao listar vouchers.");
    return { vouchers: (data ?? []) as Voucher[] };
  });

// ─── ADMIN: criar voucher ─────────────────────────────────────────────────────

export const adminCreateVoucher = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        code: z
          .string()
          .min(3)
          .max(64)
          .transform((v) => v.trim().toUpperCase()),
        planTier: z.enum(["basico", "premium"]),
        maxRedemptions: z.number().int().min(1).max(1000),
        expiresAt: z.string().nullable(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await db().from("vouchers").insert({
      code: data.code,
      plan_tier: data.planTier,
      max_redemptions: data.maxRedemptions,
      expires_at: data.expiresAt || null,
      created_by: context.userId,
    });
    if (error) {
      if (error.code === "23505") throw new Error("Já existe um voucher com este código.");
      throw new Error("Erro ao criar voucher.");
    }
    return { ok: true as const };
  });

// ─── ADMIN: deletar voucher ───────────────────────────────────────────────────

export const adminDeleteVoucher = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await db().from("vouchers").delete().eq("id", data.id);
    if (error) throw new Error("Erro ao deletar voucher.");
    return { ok: true as const };
  });
