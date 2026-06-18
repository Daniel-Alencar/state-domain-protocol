import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ARCHETYPES, type Archetype } from "@/lib/archetypes";
import { QuantumField } from "@/components/QuantumField";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/arquetipos")({
  head: () => ({
    meta: [
      { title: "Arquétipos · Protocolo Soberano" },
      { name: "description", content: "Arquétipos operacionais e forças ancestrais do Protocolo Soberano. Estados mentais com assinaturas sonoras únicas para alta performance." },
    ],
  }),
  component: ArquetiposInfo,
});

function ArquetiposInfo() {
  const [selected, setSelected] = useState<Archetype>(ARCHETYPES[0]);

  const classicos = ARCHETYPES.filter((a) => a.group === "classico");
  const ancestrais = ARCHETYPES.filter((a) => a.group === "ancestral");

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
            search={{ redirect: "/arquetipos" }}
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
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-8 pb-12">
        <Link to="/" className="text-mono text-tracked mb-6 inline-flex items-center gap-2 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
          ← Voltar ao início
        </Link>

        <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Módulo 03 · Arquétipos</div>
        <h1 className="text-3xl font-light text-foreground md:text-4xl mb-4">Estados operacionais</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Cada arquétipo representa um <span className="text-foreground">estado mental específico</span>{" "}
          com sua própria assinatura sonora binaural. Ao ativar um arquétipo dentro do protocolo,
          a frequência entra automaticamente em execução, calibrando seu cérebro para operar naquele modo.
        </p>

        {/* Key concepts */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="glass-panel rounded-lg p-5">
            <div className="mb-3 text-2xl">◼</div>
            <div className="text-sm font-medium text-foreground">Estado mental</div>
            <div className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
              Cada arquétipo ativa um modo operacional diferente — estabilidade, liderança, precisão, etc.
            </div>
          </div>
          <div className="glass-panel rounded-lg p-5">
            <div className="mb-3 text-2xl">≈</div>
            <div className="text-sm font-medium text-foreground">Assinatura sonora</div>
            <div className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
              Frequências binaurais calibradas (portadora + batida) que induzem a onda cerebral associada.
            </div>
          </div>
          <div className="glass-panel rounded-lg p-5">
            <div className="mb-3 text-2xl">◬</div>
            <div className="text-sm font-medium text-foreground">Protocolo de uso</div>
            <div className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
              Instruções de postura, ambiente e comportamento para maximizar o efeito do arquétipo.
            </div>
          </div>
        </div>
      </section>

      {/* Archetype browser */}
      <section className="relative z-10 border-t border-border/60 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
            {/* Left: archetype selectors */}
            <div className="space-y-8">
              {/* Clássicos */}
              <div>
                <div className="mb-3 flex items-center gap-2 text-mono text-tracked text-[10px] text-signal">
                  <span>A</span>
                  <span className="text-muted-foreground">·</span>
                  <span>Arquétipos Clássicos</span>
                  <span className="ml-auto text-[9px] text-muted-foreground">{classicos.length} estados</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
                  {classicos.map((a) => {
                    const isSel = selected.id === a.id;
                    return (
                      <button
                        key={a.id}
                        onClick={() => setSelected(a)}
                        className={`glass-panel flex items-center gap-3 rounded-lg p-3 text-left transition-all ${
                          isSel ? "border-signal/60" : "hover:border-foreground/40"
                        }`}
                      >
                        <span className={`text-2xl ${isSel ? "text-signal" : "text-foreground/70"}`}>
                          {a.glyph}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-foreground">{a.name}</div>
                          <div className="truncate text-[11px] text-muted-foreground">{a.function}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ancestrais */}
              <div className="glass-panel rounded-lg border border-elite/30 p-4">
                <div className="text-mono text-tracked mb-2 text-[10px] text-elite">
                  B · Sete Forças Ancestrais
                </div>
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                  Há uma curiosidade simbólica nisso tudo:{" "}
                  <span className="text-foreground">
                    o Leão impõe, a Águia enxerga, a Coruja compreende, o Rei organiza, o Tigre
                    conquista, o Cavalo avança, o Sábio decifra e o Golfinho conecta.
                  </span>{" "}
                  Civilizações antigas estruturavam seus mitos em torno dessas forças humanas — e o
                  trabalho da Águia, em três alturas (força, visão e elevação), foi sempre tratado
                  como o eixo do céu.
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
                  {ancestrais.map((a) => {
                    const isSel = selected.id === a.id;
                    return (
                      <button
                        key={a.id}
                        onClick={() => setSelected(a)}
                        className={`glass-panel flex items-center gap-3 rounded-lg p-3 text-left transition-all ${
                          isSel ? "border-signal/60" : "hover:border-foreground/40"
                        }`}
                      >
                        <span className={`text-2xl ${isSel ? "text-signal" : "text-foreground/70"}`}>
                          {a.glyph}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-foreground">{a.name}</div>
                          <div className="truncate text-[11px] text-muted-foreground">{a.function}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: detail panel */}
            <div className="glass-panel sticky top-6 h-fit overflow-hidden rounded-xl">
              <div className="relative border-b border-border/60 p-8">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%, color-mix(in oklab, var(--signal) 30%, transparent), transparent 60%)",
                  }}
                />
                <div className="relative flex items-center gap-5">
                  <span className="text-7xl text-signal">{selected.glyph}</span>
                  <div>
                    <div className="text-mono text-tracked text-[10px] text-muted-foreground">
                      {selected.group === "ancestral" ? "Força ancestral" : "Estado operacional"}
                    </div>
                    <div className="text-3xl font-light text-foreground">{selected.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{selected.function}</div>
                  </div>
                </div>
              </div>

              <div className="border-b border-border/60 p-5">
                <div className="text-mono text-tracked mb-3 text-[9px] text-signal">
                  Características
                </div>
                <ul className="space-y-1.5">
                  {selected.characteristics.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-foreground/90">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-signal" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-px bg-border/60 sm:grid-cols-2">
                <Field label="Estado mental" value={selected.state} />
                <Field label="Postura" value={selected.posture} />
                <Field label="Ambiente" value={selected.environment} />
                <Field label="Protocolo" value={selected.protocol} />
              </div>

              <div className="border-t border-border/60 bg-card/40 p-5">
                <div className="text-mono text-tracked mb-2 text-[9px] text-signal">
                  Assinatura sonora
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-foreground">
                    <span className="text-2xl font-light">{selected.carrier}</span>
                    <span className="text-mono text-tracked text-[10px] text-muted-foreground">
                      {" "}Hz portadora
                    </span>
                  </div>
                  <div className="text-foreground">
                    <span className="text-2xl font-light">{selected.beat}</span>
                    <span className="text-mono text-tracked text-[10px] text-muted-foreground">
                      {" "}Hz batida
                    </span>
                  </div>
                  <div className="text-mono text-tracked text-[10px] text-elite">
                    {selected.bandLabel}
                  </div>
                </div>
              </div>

              {/* CTA inside detail panel */}
              <div className="border-t border-border/60 p-6 text-center">
                <p className="mb-3 text-[11px] text-muted-foreground">
                  Para ativar arquétipos e reproduzir as frequências binaurais, inicie seu protocolo.
                </p>
                <Link
                  to="/app"
                  className="text-mono text-tracked inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[11px] text-background hover:bg-foreground/90 transition-colors"
                >
                  Iniciar protocolo →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 border-t border-border/60 py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">
            {classicos.length + ancestrais.length} arquétipos disponíveis
          </div>
          <h2 className="text-2xl font-light text-foreground md:text-3xl mb-4">
            Ative seus estados operacionais
          </h2>
          <p className="mb-8 text-sm text-muted-foreground">
            Crie sua conta para acessar os arquétipos e calibrar seu estado com frequências binaurais.
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card p-5">
      <div className="text-mono text-tracked mb-2 text-[9px] text-signal">{label}</div>
      <div className="text-sm leading-relaxed text-foreground/90">{value}</div>
    </div>
  );
}
