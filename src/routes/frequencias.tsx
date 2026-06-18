import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FREQUENCIES } from "@/lib/frequencies";
import { QuantumField } from "@/components/QuantumField";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/frequencias")({
  head: () => ({
    meta: [
      { title: "Frequências · Protocolo Soberano" },
      { name: "description", content: "Frequências binaurais operacionais do Protocolo Soberano. Sinais calibrados para foco, presença, recuperação e alta performance." },
    ],
  }),
  component: FrequenciasInfo,
});

const BAND_META: Record<string, { color: string; label: string; range: string; effect: string }> = {
  Delta: { color: "#6366f1", label: "Delta", range: "0.5 – 4 Hz", effect: "Reparo profundo e regeneração" },
  Theta: { color: "#8b5cf6", label: "Theta", range: "4 – 8 Hz", effect: "Intuição, criatividade e meditação" },
  Alpha: { color: "#06b6d4", label: "Alpha", range: "8 – 14 Hz", effect: "Relaxamento alerta e fluxo" },
  Beta:  { color: "#f59e0b", label: "Beta",  range: "14 – 30 Hz", effect: "Foco, execução e ação" },
  Gamma: { color: "#ef4444", label: "Gamma", range: "30+ Hz", effect: "Processamento cognitivo elevado" },
};

function FrequenciasInfo() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <QuantumField />

      {/* Public header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-signal text-xl">◬</span>
          <span className="text-mono text-tracked text-[10px] text-muted-foreground">
            Protocolo Soberano · v1.0
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            search={{ redirect: "/frequencias" }}
            className="text-mono text-tracked rounded-full border border-border/60 px-4 py-2 text-[10px] text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
          >
            Entrar
          </Link>
          <Link
            to="/app"
            className="text-mono text-tracked rounded-full bg-foreground px-4 py-2 text-[10px] text-background hover:bg-foreground/90 transition-colors"
          >
            Iniciar protocolo
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pt-8 pb-12">
        <Link to="/" className="text-mono text-tracked mb-6 inline-flex items-center gap-2 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
          ← Voltar ao início
        </Link>

        <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Módulo 02 · Frequência</div>
        <h1 className="text-3xl font-light text-foreground md:text-4xl mb-4">Frequências binaurais</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          O Protocolo Soberano utiliza <span className="text-foreground">frequências binaurais</span> —
          sinais sonoros que criam uma terceira frequência no cérebro ao enviar frequências
          levemente diferentes para cada ouvido. Cada frequência combina uma{" "}
          <span className="text-foreground">portadora</span> (Hz base) com uma{" "}
          <span className="text-foreground">batida binaural</span> (diferença entre ouvidos) para induzir
          estados cerebrais específicos.
        </p>

        {/* How it works */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="glass-panel rounded-lg p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-signal/30 text-signal text-lg">🎧</div>
            <div className="text-sm font-medium text-foreground">Use fones de ouvido</div>
            <div className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
              A batida binaural só é percebida com canais separados (L/R). Funciona em iOS e Android.
            </div>
          </div>
          <div className="glass-panel rounded-lg p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-signal/30 text-signal text-lg">⟁</div>
            <div className="text-sm font-medium text-foreground">Escolha seu estado</div>
            <div className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
              Cada frequência é calibrada para um objetivo específico — foco, recuperação, presença, etc.
            </div>
          </div>
          <div className="glass-panel rounded-lg p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-signal/30 text-signal text-lg">◬</div>
            <div className="text-sm font-medium text-foreground">Sobreposição</div>
            <div className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
              Múltiplas frequências podem ser ativadas ao mesmo tempo para calibrar estados combinados.
            </div>
          </div>
        </div>
      </section>

      {/* Brain wave bands */}
      <section className="relative z-10 border-t border-border/60 py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-mono text-tracked mb-6 text-[10px] text-signal">Bandas cerebrais</div>
          <p className="mb-8 max-w-2xl text-sm text-muted-foreground leading-relaxed">
            Cada frequência binaural induz uma <span className="text-foreground">banda de onda cerebral</span> específica.
            Entenda o que cada banda faz:
          </p>
          <div className="grid gap-4 sm:grid-cols-5">
            {Object.entries(BAND_META).map(([key, band]) => (
              <div key={key} className="glass-panel rounded-lg p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className="h-3.5 w-3.5 rounded-full"
                    style={{ backgroundColor: band.color, boxShadow: `0 0 12px ${band.color}50` }}
                  />
                  <div className="text-sm font-medium text-foreground">{band.label}</div>
                </div>
                <div className="text-mono text-tracked text-[9px] text-muted-foreground mb-2">{band.range}</div>
                <div className="text-xs text-foreground/80 leading-relaxed">{band.effect}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequency catalog */}
      <section className="relative z-10 border-t border-border/60 py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Catálogo</div>
          <h2 className="text-2xl font-light text-foreground md:text-3xl mb-2">
            {FREQUENCIES.length} frequências disponíveis
          </h2>
          <p className="mb-8 text-sm text-muted-foreground">
            Conheça cada frequência, para que serve e qual estado cerebral ela induz.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FREQUENCIES.map((f) => {
              const bandInfo = BAND_META[f.band];
              const isExpanded = expandedId === f.id;

              return (
                <button
                  key={f.id}
                  onClick={() => setExpandedId(isExpanded ? null : f.id)}
                  className="glass-panel group relative flex flex-col overflow-hidden rounded-xl text-left transition-all hover:border-signal/30"
                >
                  {/* Band color top accent */}
                  <div className="h-1 w-full" style={{ backgroundColor: `${bandInfo.color}80` }} />

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
                    <div className="mt-4 flex items-center gap-4">
                      <div>
                        <div className="text-xl font-light text-foreground">{f.carrier}</div>
                        <div className="text-mono text-tracked text-[8px] text-muted-foreground">Hz portadora</div>
                      </div>
                      <div className="h-8 w-px bg-border/40" />
                      <div>
                        <div className="text-xl font-light text-foreground">{f.beat}</div>
                        <div className="text-mono text-tracked text-[8px] text-muted-foreground">Hz batida</div>
                      </div>
                    </div>

                    {/* Awakens (always visible) */}
                    {f.awakens && (
                      <div className="mt-4 rounded-md border border-signal/20 bg-signal/5 px-3 py-2">
                        <div className="text-mono text-tracked text-[8px] text-signal/70 mb-0.5">Desperta</div>
                        <div className="text-xs text-signal">{f.awakens}</div>
                      </div>
                    )}
                  </div>

                  {/* Expand indicator */}
                  <div className="flex items-center justify-center border-t border-border/30 bg-card/40 px-4 py-2.5 transition-colors group-hover:bg-signal/5">
                    <span className="text-mono text-tracked text-[9px] text-muted-foreground">
                      {isExpanded ? "Fechar detalhes ↑" : "Ver detalhes ↓"}
                    </span>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-border/30 bg-card/60 px-5 py-4 space-y-2">
                      <div className="text-[11px] text-muted-foreground">
                        <span className="text-foreground">Portadora:</span> {f.carrier} Hz — frequência base ouvida em ambos os ouvidos.
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        <span className="text-foreground">Batida binaural:</span> {f.beat} Hz — diferença entre ouvidos que cria a onda cerebral {f.band}.
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        <span className="text-foreground">Duração recomendada:</span> {f.duration} de uso contínuo com fones de ouvido.
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        <span className="text-foreground">Banda induzida:</span> {bandInfo.label} ({bandInfo.range}) — {bandInfo.effect.toLowerCase()}.
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 border-t border-border/60 py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Pronto para começar?</div>
          <h2 className="text-2xl font-light text-foreground md:text-3xl mb-4">
            Ative suas frequências
          </h2>
          <p className="mb-8 text-sm text-muted-foreground">
            Crie sua conta para acessar as frequências binaurais e calibrar seu estado operacional.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/app"
              className="group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-3.5 text-base font-medium text-background transition-all hover:scale-[1.02]"
            >
              Iniciar seu protocolo
              <span className="text-signal-glow text-base transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/planos"
              className="text-mono text-tracked rounded-full border border-border px-6 py-3 text-xs text-foreground/85 transition-colors hover:border-foreground hover:text-foreground"
            >
              Ver planos
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
