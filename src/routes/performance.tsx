import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { LEVELS, progressToNext } from "@/lib/levels";
import { useRemoteStats } from "@/lib/use-remote-stats";
import { useEntitlement } from "@/lib/use-entitlement";

export const Route = createFileRoute("/performance")({
  head: () => ({ meta: [{ title: "Performance · Protocolo Soberano" }] }),
  component: Performance,
});

const DAYS = [3, 5, 4, 7, 6, 8, 9, 6, 7, 9, 8, 9, 10, 8];

function Performance() {
  const max = Math.max(...DAYS);
  const { stats } = useRemoteStats();
  const ent = useEntitlement();
  const { current, next, ratio, missing } = progressToNext({
    sessions: stats.sessions,
    streak: stats.streak,
    reports: stats.reports,
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 pb-32 pt-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Módulo 05 · Performance</div>
            <h1 className="text-3xl font-light text-foreground md:text-4xl">Mapa de evolução</h1>
          </div>
          <div className="text-mono text-tracked text-right text-[10px] text-muted-foreground">
            Patente atual
            <div className="mt-1 flex items-center gap-2 text-foreground">
              <span className="text-elite text-base">{current.glyph}</span>
              <span className="text-base">{current.name}</span>
            </div>
          </div>
        </div>

        {/* Patente atual + progresso */}
        <div className="glass-panel mb-6 rounded-lg p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-foreground">
              {next ? `Progressão para ${next.name}` : "Núcleo Alpha — patente máxima"}
            </div>
            <div className="text-mono text-tracked text-[10px] text-signal">
              {Math.round(ratio * 100)}%
            </div>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-signal to-elite"
              style={{ width: `${ratio * 100}%` }}
            />
          </div>

          {/* trilha de pedras preciosas */}
          <div className="mt-4 grid grid-cols-3 gap-px bg-border/60 text-center sm:grid-cols-6">
            {LEVELS.map((p) => {
              const reached = LEVELS.findIndex((l) => l.id === p.id) <= LEVELS.findIndex((l) => l.id === current.id);
              return (
                <div key={p.id} className="bg-card px-2 py-3">
                  <div className={`text-base ${reached ? "text-signal" : "text-muted-foreground/40"}`}>{p.glyph}</div>
                  <div className={`text-mono text-tracked mt-1 text-[9px] ${reached ? "text-signal" : "text-muted-foreground/60"}`}>
                    {p.name}
                  </div>
                </div>
              );
            })}
          </div>

          {next && (
            <div className="mt-5 rounded-md border border-border/40 bg-card/40 p-4">
              <div className="text-mono text-tracked mb-2 text-[9px] text-elite">
                O que falta para {next.name}
              </div>
              {missing.length === 0 ? (
                <p className="text-xs text-muted-foreground">Você está no limiar — execute para consolidar.</p>
              ) : (
                <ul className="space-y-1.5 text-xs text-foreground/90">
                  {missing.map((m) => (
                    <li key={m.metric} className="flex items-center justify-between">
                      <span>{m.label}</span>
                      <span className="text-mono text-[10px] text-signal">
                        {m.have} / {m.need}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-[10px] text-muted-foreground">{next.description}</p>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="glass-panel mb-6 rounded-lg p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-foreground">Constância · 14 dias</div>
            <div className="text-mono text-tracked text-[10px] text-signal">+18%</div>
          </div>
          <div className="flex h-40 items-end gap-1.5">
            {DAYS.map((d, i) => (
              <div key={i} className="flex-1">
                <div
                  className="w-full rounded-sm bg-gradient-to-t from-signal/80 to-signal/20"
                  style={{ height: `${(d / max) * 100}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div className="mb-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border/60 md:grid-cols-4">
          {[
            { l: "Sessões totais", v: String(stats.sessions), t: "histórico" },
            { l: "Tempo em foco", v: `${Math.round(stats.totalMinutes / 60)}h`, t: `${stats.totalMinutes}min` },
            { l: "Streak ativo", v: `${stats.streak}d`, t: "consecutivos" },
            { l: "Relatos validados", v: String(stats.reports), t: "rede" },
          ].map((s) => (
            <div key={s.l} className="bg-card/40 p-5">
              <div className="text-mono text-tracked text-[9px] text-muted-foreground">{s.l}</div>
              <div className="mt-2 text-xl font-light text-foreground">{s.v}</div>
              <div className="text-mono text-[10px] text-signal">{s.t}</div>
            </div>
          ))}
        </div>

        {/* Instituto Venditti */}
        <a
          href="https://institutovenditti.org"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-panel group flex items-center justify-between rounded-lg border border-elite/30 p-6 transition-all hover:border-elite/60"
        >
          <div>
            <div className="text-mono text-tracked mb-2 text-[10px] text-elite">Instituto Venditti</div>
            <div className="text-base font-medium text-foreground">Conheça o que oferecemos e os próximos eventos</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Mentorias presenciais, formação executiva e calendário oficial de imersões.
            </p>
          </div>
          <span className="text-elite transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>
    </AppShell>
  );
}
