export type PlanTier = "free" | "basico" | "premium";

export const PLAN_ORDER: Record<PlanTier, number> = { free: 0, basico: 1, premium: 2 };

export const FREE_FREQUENCY_IDS = new Set(["clareza", "presenca", "recuperacao", "foco"]);

export type Plan = {
  id: PlanTier;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  annualSavingsPct: number;
  highlight?: boolean;
  features: string[];
  locked: string[];
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Grátis",
    priceMonthly: 0,
    priceAnnual: 0,
    annualSavingsPct: 0,
    features: [
      "Frequências: Clareza, Presença, Recuperação e Foco",
      "Relatos, Rede e Performance",
    ],
    locked: [
      "Frequências completas (9 no total)",
      "Arquétipos Clássicos",
      "Arquétipos Ancestrais",
      "Determinações com IA + loop",
    ],
  },
  {
    id: "basico",
    name: "Básico",
    priceMonthly: 29.90,
    priceAnnual: 238.90,
    annualSavingsPct: Math.round((1 - 238.90 / (29.90 * 12)) * 100),
    features: [
      "Todas as frequências (9 no total)",
      "Arquétipos Clássicos (15 estados)",
      "Relatos, Rede e Performance",
    ],
    locked: [
      "Arquétipos Ancestrais (13 forças)",
      "Determinações com IA + loop",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    priceMonthly: 89.90,
    priceAnnual: 690.00,
    annualSavingsPct: Math.round((1 - 690.00 / (89.90 * 12)) * 100),
    highlight: true,
    features: [
      "Acesso completo a tudo",
      "Todas as frequências (9 no total)",
      "Arquétipos Clássicos e Ancestrais",
      "Determinações com análise de IA",
      "Play em loop",
    ],
    locked: [],
  },
];
