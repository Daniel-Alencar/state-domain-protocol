import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/performance")({
  head: () => ({ meta: [{ title: "Performance · Protocolo Soberano" }] }),
  component: Performance,
});

const DAYS = [3, 5, 4, 7, 6, 8, 9, 6, 7, 9, 8, 9, 10, 8];

function Performance() {
  const max = Math.max(...DAYS);
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 pb-32 pt-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Módulo 05 · Performance</div>
            <h1 className="text-3xl font-light text-foreground md:text-4xl">Mapa de evolução</h1>
          </div>
          <div className="text-mono text-tracked text-[10px] text-muted-foreground">
            Patente: <span className="text-elite">Eixo Ativo</span>
          </div>
        </div>

        {/* Patente progress */}
        <div className="glass-panel mb-6 rounded-lg p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-foreground">Progressão para Domínio Pleno</div>
            <div className="text-mono text-tracked text-[10px] text-signal">62%</div>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-gradient-to-r from-signal to-elite" style={{ width: "62%" }} />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-px bg-border/60 text-center">
            {["Frequência Base", "Eixo Ativo", "Domínio Pleno", "Núcleo Alpha"].map((p, i) => (
              <div key={p} className="bg-card px-2 py-2">
                <div className={`text-mono text-tracked text-[9px] ${i <= 1 ? "text-signal" : "text-muted-foreground/60"}`}>
                  {p}
                </div>
              </div>
            ))}
          </div>
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
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border/60 md:grid-cols-4">
          {[
            { l: "Sessões totais", v: "147", t: "30d" },
            { l: "Tempo em foco", v: "62h", t: "+9h" },
            { l: "Streak ativo", v: "14d", t: "recorde" },
            { l: "Arquétipo top", v: "Rocha", t: "41% uso" },
          ].map((s) => (
            <div key={s.l} className="bg-card/40 p-5">
              <div className="text-mono text-tracked text-[9px] text-muted-foreground">{s.l}</div>
              <div className="mt-2 text-xl font-light text-foreground">{s.v}</div>
              <div className="text-mono text-[10px] text-signal">{s.t}</div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
