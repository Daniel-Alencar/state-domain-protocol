import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ARCHETYPES } from "@/lib/archetypes";

export const Route = createFileRoute("/arquetipos")({
  head: () => ({ meta: [{ title: "Arquétipos · Protocolo Soberano" }] }),
  component: Arquetipos,
});

function Arquetipos() {
  const [selected, setSelected] = useState(ARCHETYPES[0]);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 pb-32 pt-10">
        <div className="mb-10">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Módulo 03 · Arquétipos</div>
          <h1 className="text-3xl font-light text-foreground md:text-4xl">Estados operacionais</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Cada arquétipo é um modo de operação. Selecione o estado, ative o
            protocolo, ocupe o ambiente.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* List */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
            {ARCHETYPES.map((a) => {
              const active = selected.id === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => setSelected(a)}
                  className={`glass-panel flex items-center gap-3 rounded-lg p-3 text-left transition-all ${
                    active ? "border-signal/60" : "hover:border-foreground/40"
                  }`}
                >
                  <span className={`text-2xl ${active ? "text-signal" : "text-foreground/70"}`}>{a.glyph}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground">{a.name}</div>
                    <div className="truncate text-[11px] text-muted-foreground">{a.function}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail */}
          <div className="glass-panel sticky top-6 h-fit overflow-hidden rounded-xl">
            <div className="relative border-b border-border/60 p-8">
              <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 30% 20%, color-mix(in oklab, var(--signal) 30%, transparent), transparent 60%)" }} />
              <div className="relative flex items-center gap-5">
                <span className="text-7xl text-signal">{selected.glyph}</span>
                <div>
                  <div className="text-mono text-tracked text-[10px] text-muted-foreground">
                    Estado operacional
                  </div>
                  <div className="text-3xl font-light text-foreground">{selected.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{selected.function}</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-px bg-border/60 sm:grid-cols-2">
              <Field label="Estado mental" value={selected.state} />
              <Field label="Postura" value={selected.posture} />
              <Field label="Ambiente" value={selected.environment} />
              <Field label="Protocolo" value={selected.protocol} />
            </div>
            <div className="border-t border-border/60 p-6">
              <button className="text-mono text-tracked w-full rounded-full bg-foreground px-6 py-3 text-[11px] text-background transition-transform hover:scale-[1.01]">
                Ativar arquétipo {selected.name}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card p-5">
      <div className="text-mono text-tracked mb-2 text-[9px] text-signal">{label}</div>
      <div className="text-sm leading-relaxed text-foreground/90">{value}</div>
    </div>
  );
}
