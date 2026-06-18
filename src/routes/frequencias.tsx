import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { FREQUENCIES, type Frequency } from "@/lib/frequencies";
import { start, stop, stopAll, subscribe, isRunning } from "@/lib/binaural-engine";
import { bumpSession } from "@/lib/active-state";
import { useEntitlement } from "@/lib/use-entitlement";
import { FREE_FREQUENCY_IDS } from "@/lib/plans";
import { toast } from "sonner";

export const Route = createFileRoute("/frequencias")({
  head: () => ({
    meta: [
      { title: "Frequências · Protocolo Soberano" },
      { name: "description", content: "Frequências binaurais operacionais do Protocolo Soberano. Sinais calibrados para foco, presença, recuperação e alta performance." },
    ],
  }),
  component: Frequencias,
});

function fmt(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const r = (s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
}

type Status = ReturnType<typeof getStub>;
function getStub() {
  return [] as { freqId: string; carrier: number; beat: number; elapsed: number; duration: number }[];
}

const BAND_META: Record<string, { color: string; label: string; range: string; effect: string }> = {
  Delta: { color: "#6366f1", label: "Delta", range: "0.5 – 4 Hz", effect: "Reparo profundo e regeneração" },
  Theta: { color: "#8b5cf6", label: "Theta", range: "4 – 8 Hz", effect: "Intuição, criatividade e meditação" },
  Alpha: { color: "#06b6d4", label: "Alpha", range: "8 – 14 Hz", effect: "Relaxamento alerta e fluxo" },
  Beta:  { color: "#f59e0b", label: "Beta",  range: "14 – 30 Hz", effect: "Foco, execução e ação" },
  Gamma: { color: "#ef4444", label: "Gamma", range: "30+ Hz", effect: "Processamento cognitivo elevado" },
};

function Frequencias() {
  const [active, setActive] = useState<Status>([]);
  const ent = useEntitlement();
  const isFree = ent.tier === "free";

  useEffect(() => subscribe(setActive), []);

  function toggle(f: Frequency & { freqIdKey: string }) {
    if (isRunning(f.freqIdKey)) {
      stop(f.freqIdKey);
      toast("Frequência encerrada", { description: f.name });
      return;
    }
    start({ freqId: f.freqIdKey, carrier: f.carrier, beat: f.beat, minutes: f.minutes });
    bumpSession(f.minutes, { frequencyIds: [f.id] });
    toast(`Frequência ativa · ${f.name}`, {
      description: `Use fones · ${f.carrier} Hz · batida ${f.beat} Hz (${f.band})`,
    });
  }

  const list = FREQUENCIES.map((f) => ({ ...f, freqIdKey: `freq:${f.id}` }));
  const totalRunning = active.length;

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 pb-32 pt-10">
        {/* Hero header */}
        <div className="mb-12">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Módulo 02 · Frequência</div>
          <h1 className="text-3xl font-light text-foreground md:text-4xl mb-4">Calibração de estado</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Sinais binaurais operacionais. Cada frequência combina uma{" "}
            <span className="text-foreground">portadora</span> (Hz base) com uma{" "}
            <span className="text-foreground">batida binaural</span> (diferença entre ouvidos) para induzir
            um estado cerebral específico. Múltiplas frequências podem ser ativadas em{" "}
            <span className="text-foreground">sobreposição</span>.
          </p>

          {/* How it works mini-guide */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="glass-panel rounded-lg p-4">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full border border-signal/30 text-signal text-sm">1</div>
              <div className="text-sm font-medium text-foreground">Use fones de ouvido</div>
              <div className="mt-1 text-[11px] text-muted-foreground">A batida binaural só funciona com canais separados (L/R).</div>
            </div>
            <div className="glass-panel rounded-lg p-4">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full border border-signal/30 text-signal text-sm">2</div>
              <div className="text-sm font-medium text-foreground">Escolha seu estado</div>
              <div className="mt-1 text-[11px] text-muted-foreground">Cada frequência é calibrada para um objetivo específico.</div>
            </div>
            <div className="glass-panel rounded-lg p-4">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full border border-signal/30 text-signal text-sm">3</div>
              <div className="text-sm font-medium text-foreground">Ative e opere</div>
              <div className="mt-1 text-[11px] text-muted-foreground">Deixe a frequência rodar em segundo plano enquanto trabalha.</div>
            </div>
          </div>

          {/* Brain wave band legend */}
          <div className="mt-8 glass-panel rounded-lg p-5">
            <div className="text-mono text-tracked mb-4 text-[9px] text-signal">Bandas cerebrais</div>
            <div className="grid gap-3 sm:grid-cols-5">
              {Object.entries(BAND_META).map(([key, band]) => (
                <div key={key} className="flex items-start gap-3">
                  <div
                    className="mt-1 h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: band.color, boxShadow: `0 0 8px ${band.color}50` }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-foreground">{band.label}</div>
                    <div className="text-[10px] text-muted-foreground">{band.range}</div>
                    <div className="mt-0.5 text-[10px] text-foreground/70">{band.effect}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isFree && (
            <div className="mt-6 flex items-center gap-3 rounded-lg border border-border/40 bg-card/40 px-4 py-3">
              <span className="text-[10px] text-muted-foreground">
                Plano Grátis · 4 de 9 frequências disponíveis.
              </span>
              <Link
                to="/planos"
                className="text-mono text-tracked shrink-0 rounded-full border border-signal/40 px-3 py-1 text-[9px] text-signal hover:bg-signal/10"
              >
                Ver planos
              </Link>
            </div>
          )}
        </div>

        {/* Active frequencies panel */}
        {totalRunning > 0 && (
          <div className="glass-panel mb-8 overflow-hidden rounded-lg p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-mono text-tracked text-[10px] text-signal">
                <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-signal" />
                {totalRunning} {totalRunning === 1 ? "frequência ativa" : "frequências em sobreposição"}
              </div>
              <button
                onClick={() => { stopAll(); toast("Todas as frequências encerradas"); }}
                className="text-mono text-tracked rounded-full border border-border/60 px-3 py-1 text-[10px] text-muted-foreground hover:text-foreground hover:border-foreground/40"
              >
                Encerrar tudo
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {active.map((s) => {
                const f = list.find((x) => x.freqIdKey === s.freqId);
                const remaining = Math.max(0, s.duration - s.elapsed);
                const pct = s.duration > 0 ? (s.elapsed / s.duration) * 100 : 0;
                return (
                  <div key={s.freqId} className="rounded-md border border-border/40 p-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-foreground">{f?.name ?? s.freqId}</span>
                      <span className="text-muted-foreground">{fmt(remaining)}</span>
                    </div>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border/60">
                      <div className="h-full bg-signal transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Frequency cards grid */}
        <div className="text-mono text-tracked mb-4 text-[9px] text-signal">
          {list.length} frequências disponíveis
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((f) => {
            const running = active.some((s) => s.freqId === f.freqIdKey);
            const locked = isFree && !FREE_FREQUENCY_IDS.has(f.id);
            const bandInfo = BAND_META[f.band];

            if (locked) {
              return (
                <div
                  key={f.id}
                  className="glass-panel relative flex flex-col overflow-hidden rounded-xl opacity-50 cursor-default select-none"
                >
                  {/* Band color top accent */}
                  <div className="h-1 w-full" style={{ backgroundColor: bandInfo.color }} />

                  <div className="flex flex-1 flex-col p-5">
                    {/* Band badge */}
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-medium"
                        style={{ backgroundColor: `${bandInfo.color}20`, color: bandInfo.color }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: bandInfo.color }} />
                        {bandInfo.label}
                      </span>
                      <span className="text-mono text-tracked text-[9px] text-muted-foreground">{f.duration}</span>
                    </div>

                    {/* Name and intent */}
                    <div className="text-lg font-medium text-foreground">{f.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground leading-relaxed">{f.intent}</div>

                    {/* Technical specs */}
                    <div className="mt-3 flex items-center gap-4">
                      <div>
                        <div className="text-lg font-light text-foreground/60">{f.carrier}</div>
                        <div className="text-mono text-tracked text-[8px] text-muted-foreground">Hz portadora</div>
                      </div>
                      <div className="h-6 w-px bg-border/40" />
                      <div>
                        <div className="text-lg font-light text-foreground/60">{f.beat}</div>
                        <div className="text-mono text-tracked text-[8px] text-muted-foreground">Hz batida</div>
                      </div>
                    </div>

                    {f.awakens && (
                      <div className="mt-3 text-mono text-tracked text-[9px] text-muted-foreground/60">
                        Desperta: {f.awakens}
                      </div>
                    )}
                  </div>

                  {/* Locked footer */}
                  <div className="flex items-center justify-between border-t border-border/30 bg-background/60 px-4 py-2.5">
                    <span className="text-mono text-tracked text-[9px] text-muted-foreground">Plano Básico ou superior</span>
                    <Link
                      to="/planos"
                      className="text-mono text-tracked text-[9px] text-signal hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Upgrade →
                    </Link>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={f.id}
                onClick={() => toggle(f)}
                className={`group glass-panel relative flex flex-col overflow-hidden rounded-xl text-left transition-all ${
                  running ? "border-signal/60 signal-ring" : "hover:border-signal/30"
                }`}
              >
                {/* Band color top accent */}
                <div
                  className="h-1 w-full transition-all"
                  style={{ backgroundColor: running ? bandInfo.color : `${bandInfo.color}60` }}
                />

                <div className="flex flex-1 flex-col p-5">
                  {/* Band badge + duration */}
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-medium"
                      style={{ backgroundColor: `${bandInfo.color}20`, color: bandInfo.color }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: bandInfo.color }} />
                      {bandInfo.label}
                    </span>
                    <span className="text-mono text-tracked text-[9px] text-muted-foreground">{f.duration}</span>
                  </div>

                  {/* Name and intent */}
                  <div className="text-lg font-medium text-foreground">{f.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground leading-relaxed">{f.intent}</div>

                  {/* Technical specs */}
                  <div className="mt-3 flex items-center gap-4">
                    <div>
                      <div className="text-lg font-light text-foreground">{f.carrier}</div>
                      <div className="text-mono text-tracked text-[8px] text-muted-foreground">Hz portadora</div>
                    </div>
                    <div className="h-6 w-px bg-border/40" />
                    <div>
                      <div className="text-lg font-light text-foreground">{f.beat}</div>
                      <div className="text-mono text-tracked text-[8px] text-muted-foreground">Hz batida</div>
                    </div>
                  </div>

                  {f.awakens && (
                    <div className="mt-3 text-mono text-tracked text-[9px] text-signal">
                      Desperta: {f.awakens}
                    </div>
                  )}
                </div>

                {/* Play/Stop indicator */}
                <div className={`flex items-center justify-center border-t px-4 py-3 transition-all ${
                  running ? "border-signal/30 bg-signal/5" : "border-border/30 bg-card/40 group-hover:bg-signal/5"
                }`}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
                        running ? "border-signal bg-signal/20" : "border-border"
                      }`}
                    >
                      {running ? (
                        <span className="h-2 w-2 rounded-sm bg-signal" />
                      ) : (
                        <span className="ml-0.5 border-l-[5px] border-y-[4px] border-y-transparent border-l-foreground" />
                      )}
                    </div>
                    <span className="text-mono text-tracked text-[9px] text-muted-foreground">
                      {running ? "Parar" : "Ativar"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-10 text-[11px] text-muted-foreground">
          Aviso operacional: tons binaurais não substituem orientação clínica. Não usar ao dirigir nem em quadros de epilepsia fotossensível.
        </p>
      </div>
    </AppShell>
  );
}
