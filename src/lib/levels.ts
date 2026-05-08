/**
 * Sistema de níveis — pedras preciosas.
 * Critérios combinados: sessões totais, dias de constância (streak ativo)
 * e relatos/testemunhos validados na rede.
 */

export type Level = {
  id: string;
  name: string;
  glyph: string;
  /** Sessões totais necessárias. */
  sessions: number;
  /** Streak ativo (dias consecutivos). */
  streak: number;
  /** Relatos / testemunhos validados na rede. */
  reports: number;
  /** Resumo da patente. */
  description: string;
};

export const LEVELS: Level[] = [
  { id: "quartzo",   name: "Quartzo",   glyph: "◯", sessions: 0,   streak: 0,  reports: 0,  description: "Iniciação. O sinal foi reconhecido." },
  { id: "onix",      name: "Ônix",      glyph: "●", sessions: 30,  streak: 7,  reports: 1,  description: "Constância básica. Primeira camada de blindagem." },
  { id: "topazio",   name: "Topázio",   glyph: "◆", sessions: 90,  streak: 21, reports: 3,  description: "Disciplina ativa. Presença reconhecida pela rede." },
  { id: "esmeralda", name: "Esmeralda", glyph: "❖", sessions: 180, streak: 45, reports: 6,  description: "Domínio operacional. Direção estratégica firme." },
  { id: "safira",    name: "Safira",    glyph: "✦", sessions: 320, streak: 75, reports: 10, description: "Autoridade calibrada. Influência consistente." },
  { id: "diamante",  name: "Diamante",  glyph: "◈", sessions: 520, streak: 120, reports: 18, description: "Núcleo Alpha. Presença inquebrável." },
];

export type UserStats = {
  sessions: number;
  streak: number;
  reports: number;
};

function meets(stats: UserStats, lv: Level) {
  return stats.sessions >= lv.sessions && stats.streak >= lv.streak && stats.reports >= lv.reports;
}

export function currentLevel(stats: UserStats): Level {
  let lv = LEVELS[0];
  for (const candidate of LEVELS) {
    if (meets(stats, candidate)) lv = candidate;
  }
  return lv;
}

export function nextLevel(stats: UserStats): Level | null {
  const current = currentLevel(stats);
  const idx = LEVELS.findIndex((l) => l.id === current.id);
  return LEVELS[idx + 1] ?? null;
}

export function progressToNext(stats: UserStats): {
  current: Level;
  next: Level | null;
  /** 0..1 progresso médio das três métricas. */
  ratio: number;
  /** Lista do que falta para o próximo nível. */
  missing: { metric: "sessions" | "streak" | "reports"; need: number; have: number; label: string }[];
} {
  const current = currentLevel(stats);
  const next = nextLevel(stats);
  if (!next) return { current, next: null, ratio: 1, missing: [] };

  const sRatio = Math.min(1, stats.sessions / next.sessions);
  const kRatio = next.streak === 0 ? 1 : Math.min(1, stats.streak / next.streak);
  const rRatio = next.reports === 0 ? 1 : Math.min(1, stats.reports / next.reports);
  const ratio = (sRatio + kRatio + rRatio) / 3;

  const missing: ReturnType<typeof progressToNext>["missing"] = [];
  if (stats.sessions < next.sessions)
    missing.push({ metric: "sessions", need: next.sessions, have: stats.sessions, label: "sessões totais" });
  if (stats.streak < next.streak)
    missing.push({ metric: "streak", need: next.streak, have: stats.streak, label: "dias de constância" });
  if (stats.reports < next.reports)
    missing.push({ metric: "reports", need: next.reports, have: stats.reports, label: "relatos validados" });

  return { current, next, ratio, missing };
}
