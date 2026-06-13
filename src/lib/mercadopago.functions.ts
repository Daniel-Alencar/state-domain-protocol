import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  planId: z.enum(["basico", "premium"]),
  billing: z.enum(["monthly", "annual"]),
  userId: z.string(),
  userEmail: z.string().email(),
});

const ITEMS = {
  basico: {
    monthly: { price: 29.9,  label: "Mensal" },
    annual:  { price: 238.9, label: "Anual"  },
  },
  premium: {
    monthly: { price: 89.9,  label: "Mensal" },
    annual:  { price: 690.0, label: "Anual"  },
  },
} as const;

const PLAN_NAMES: Record<string, string> = { basico: "Básico", premium: "Premium" };

export const createCheckout = createServerFn({ method: "POST" })
  .inputValidator((input) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado.");

    const appUrl = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
    const item = ITEMS[data.planId][data.billing];
    const planName = PLAN_NAMES[data.planId];

    const preference = {
      items: [
        {
          id: `${data.planId}-${data.billing}`,
          title: `Protocolo Soberano · Plano ${planName} ${item.label}`,
          quantity: 1,
          unit_price: item.price,
          currency_id: "BRL",
        },
      ],
      payer: { email: data.userEmail },
      back_urls: {
        success: `${appUrl}/planos?status=sucesso&plan=${data.planId}`,
        failure: `${appUrl}/planos?status=falha`,
        pending: `${appUrl}/planos?status=pendente`,
      },
      auto_return: "approved",
      external_reference: `${data.userId}:${data.planId}:${data.billing}`,
      notification_url: `${appUrl}/webhook-mp`,
      statement_descriptor: "PROT SOBERANO",
    };

    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preference),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[mp] preference failed:", res.status, text);
      throw new Error(`Mercado Pago retornou erro ${res.status}.`);
    }

    const json = (await res.json()) as {
      id: string;
      init_point: string;
      sandbox_init_point: string;
    };

    const isProduction = process.env.NODE_ENV === "production";
    return {
      checkoutUrl: isProduction ? json.init_point : json.sandbox_init_point,
      preferenceId: json.id,
    };
  });
