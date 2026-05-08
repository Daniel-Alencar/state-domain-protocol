import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { FREQUENCIES } from "@/lib/frequencies";

export const Route = createFileRoute("/frequencias")({
  head: () => ({ meta: [{ title: "Frequência · Protocolo Soberano" }] }),
  component: Frequencias,
});

function Frequencias() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 pb-32 pt-10">
        <div className="mb-10">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Módulo 02 · Frequência</div>
          <h1 className="text-3xl font-light text-foreground md:text-4xl">Calibração de estado</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Sinais sonoros operacionais. Selecione a intenção e mantenha sessão contínua.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FREQUENCIES.map((f) => {
            const isActive = active === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActive(isActive ? null : f.id)}
                className={`group glass-panel relative overflow-hidden rounded-lg p-5 text-left transition-all ${
                  isActive ? "border-signal/60 signal-ring" : "hover:border-signal/30"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-mono text-tracked text-[9px] text-muted-foreground">
                      {f.duration} · sessão contínua
                    </div>
                    <div className="mt-2 text-base font-medium text-foreground">{f.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{f.intent}</div>
                  </div>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
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
                    Em execução
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
