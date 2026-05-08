import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { FREQUENCIES, type Frequency } from "@/lib/frequencies";
import { start, stop, subscribe } from "@/lib/binaural-engine";
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

function Frequencias() {
  const [status, setStatus] = useState({ freqId: null as string | null, running: false, elapsed: 0, duration: 0 });

  useEffect(() => subscribe(setStatus), []);

  function toggle(f: Frequency) {
    if (status.running && status.freqId === f.id) {
      stop();
      toast("Frequência encerrada", { description: f.name });
      return;
    }
    start({ freqId: f.id, carrier: f.carrier, beat: f.beat, minutes: f.minutes });
    toast(`Frequência ativa · ${f.name}`, {
      description: `Use fones · ${f.carrier} Hz · batida ${f.beat} Hz (${f.band})`,
    });
  }

  const remaining = status.running ? Math.max(0, status.duration - status.elapsed) : 0;
  const pct = status.running && status.duration > 0 ? (status.elapsed / status.duration) * 100 : 0;

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 pb-32 pt-10">
        <div className="mb-10">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Módulo 02 · Frequência</div>
          <h1 className="text-3xl font-light text-foreground md:text-4xl">Calibração de estado</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Sinais binaurais operacionais. <span className="text-foreground">Use fones de ouvido</span> — a batida só é
            percebida com canais separados.
          </p>
        </div>

        {status.running && (
          <div className="glass-panel mb-6 overflow-hidden rounded-lg p-4">
            <div className="flex items-center justify-between text-mono text-tracked text-[10px]">
              <span className="text-signal">Em execução</span>
              <span className="text-muted-foreground">restam {fmt(remaining)}</span>
            </div>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-border/60">
              <div className="h-full bg-signal transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FREQUENCIES.map((f) => {
            const isActive = status.running && status.freqId === f.id;
            return (
              <button
                key={f.id}
                onClick={() => toggle(f)}
                className={`group glass-panel relative overflow-hidden rounded-lg p-5 text-left transition-all ${
                  isActive ? "border-signal/60 signal-ring" : "hover:border-signal/30"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-mono text-tracked text-[9px] text-muted-foreground">
                      {f.duration} · {f.band} · {f.beat} Hz
                    </div>
                    <div className="mt-2 text-base font-medium text-foreground">{f.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{f.intent}</div>
                  </div>
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all ${
                      isActive ? "border-signal bg-signal/20" : "border-border"
                    }`}
                  >
                    {isActive ? (
                      <span className="h-2.5 w-2.5 rounded-sm bg-signal" />
                    ) : (
                      <span className="ml-0.5 border-l-[6px] border-y-[5px] border-y-transparent border-l-foreground" />
                    )}
                  </div>
                </div>
                {isActive && (
                  <div className="mt-4 flex items-center gap-2 text-mono text-tracked text-[9px] text-signal">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-signal" />
                    Sinal ativo · {fmt(remaining)} restantes
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-8 text-[11px] text-muted-foreground">
          Aviso operacional: tons binaurais não substituem orientação clínica. Não usar ao dirigir nem em quadros de
          epilepsia fotossensível.
        </p>
      </div>
    </AppShell>
  );
}
