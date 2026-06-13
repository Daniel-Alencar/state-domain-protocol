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
  head: () => ({ meta: [{ title: "Frequência · Protocolo Soberano" }] }),
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
        <div className="mb-8">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Módulo 02 · Frequência</div>
          <h1 className="text-3xl font-light text-foreground md:text-4xl">Calibração de estado</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Sinais binaurais operacionais. Múltiplas frequências podem ser ativadas em{" "}
            <span className="text-foreground">sobreposição</span> para calibrar vários estados ao mesmo tempo.
            <br />
            <span className="text-foreground">Use fones de ouvido</span> — a batida só é percebida com canais separados (funciona em iOS e Android).
          </p>
          {isFree && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-border/40 bg-card/40 px-4 py-3">
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

        {totalRunning > 0 && (
          <div className="glass-panel mb-6 overflow-hidden rounded-lg p-4">
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {list.map((f) => {
            const running = active.some((s) => s.freqId === f.freqIdKey);
            const locked = isFree && !FREE_FREQUENCY_IDS.has(f.id);

            if (locked) {
              return (
                <div
                  key={f.id}
                  className="glass-panel relative overflow-hidden rounded-lg p-5 opacity-50 cursor-default select-none"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-mono text-tracked text-[9px] text-muted-foreground">
                        {f.duration} · {f.band} · {f.carrier}/{f.beat} Hz
                      </div>
                      <div className="mt-2 text-base font-medium text-foreground">{f.name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{f.intent}</div>
                      {f.awakens && (
                        <div className="text-mono text-tracked mt-2 text-[9px] text-signal">
                          Desperta: {f.awakens}
                        </div>
                      )}
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/40">
                      <span className="text-[14px] text-muted-foreground">↑</span>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-border/30 bg-background/60 px-4 py-2">
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
                className={`group glass-panel relative overflow-hidden rounded-lg p-5 text-left transition-all ${
                  running ? "border-signal/60 signal-ring" : "hover:border-signal/30"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-mono text-tracked text-[9px] text-muted-foreground">
                      {f.duration} · {f.band} · {f.carrier}/{f.beat} Hz
                    </div>
                    <div className="mt-2 text-base font-medium text-foreground">{f.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{f.intent}</div>
                    {f.awakens && (
                      <div className="text-mono text-tracked mt-2 text-[9px] text-signal">
                        Desperta: {f.awakens}
                      </div>
                    )}
                  </div>
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all ${
                      running ? "border-signal bg-signal/20" : "border-border"
                    }`}
                  >
                    {running ? (
                      <span className="h-2.5 w-2.5 rounded-sm bg-signal" />
                    ) : (
                      <span className="ml-0.5 border-l-[6px] border-y-[5px] border-y-transparent border-l-foreground" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-8 text-[11px] text-muted-foreground">
          Aviso operacional: tons binaurais não substituem orientação clínica. Não usar ao dirigir nem em quadros de epilepsia fotossensível.
        </p>
      </div>
    </AppShell>
  );
}
