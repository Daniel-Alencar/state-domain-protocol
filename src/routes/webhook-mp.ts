import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

async function handlePost(ctx: { request: Request }): Promise<Response> {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;

  if (!accessToken || !serviceKey || !supabaseUrl) {
    console.error("[webhook-mp] Missing env vars.");
    return new Response("Config error", { status: 500 });
  }

  let body: { type?: string; data?: { id?: string | number } };
  try {
    body = await ctx.request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  // MP also sends topic webhooks without payment data — ignore them safely
  if (body.type !== "payment" || !body.data?.id) {
    return new Response("OK", { status: 200 });
  }

  const paymentId = String(body.data.id);

  const payRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!payRes.ok) {
    console.error("[webhook-mp] Payment fetch failed:", payRes.status);
    return new Response("Payment fetch error", { status: 500 });
  }

  const payment = (await payRes.json()) as {
    status: string;
    external_reference?: string;
  };

  if (payment.status !== "approved") {
    return new Response("OK", { status: 200 });
  }

  // external_reference format: "userId:planTier:billing"
  const [userId, planTier, billing] = (payment.external_reference ?? "").split(":");

  if (!userId || !["basico", "premium"].includes(planTier)) {
    console.error("[webhook-mp] Invalid reference:", payment.external_reference);
    return new Response("Bad reference", { status: 400 });
  }

  const periodEnd = new Date();
  if (billing === "annual") {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  }

  // Use service role to bypass RLS on subscriptions table
  const supabase = createClient(supabaseUrl, serviceKey);

  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      plan_tier: planTier,
      status: "active",
      current_period_end: periodEnd.toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    console.error("[webhook-mp] Supabase upsert error:", error);
    return new Response("DB error", { status: 500 });
  }

  console.log(`[webhook-mp] Plan ${planTier} activated for user ${userId}`);
  return new Response("OK", { status: 200 });
}

export const Route = createFileRoute("/webhook-mp")({
  server: {
    handlers: {
      POST: handlePost,
      GET: async (_ctx: { request: Request }) => new Response("Webhook MP · OK", { status: 200 }),
    },
  },
});
