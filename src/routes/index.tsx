import { createFileRoute, Link } from "@tanstack/react-router";
import { QuantumField } from "@/components/QuantumField";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Protocolo Soberano de Harmonia Quântica" },
      { name: "description", content: "Protocolo Soberano de Harmonia Quântica — sistema operacional de alinhamento estratégico, foco e presença executiva." },
      { property: "og:title", content: "Protocolo Soberano de Harmonia Quântica" },
      { property: "og:description", content: "Clareza. Direção. Domínio." },

    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Quantum field */}
      <QuantumField />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-3">
          <span className="text-signal text-xl">◬</span>
          <span className="text-mono text-tracked text-[10px] text-muted-foreground">
            Protocolo Soberano · v1.0
          </span>
        </div>
        <div className="flex items-center gap-3 text-mono text-tracked text-[10px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-elite animate-pulse-signal" />
          <span>Sistema online</span>
        </div>
      </header>

      {/* Center */}
      <section className="relative z-10 mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        {/* Concentric rings */}
        <div className="relative mb-12 flex h-72 w-72 items-center justify-center md:h-96 md:w-96">
          <div className="absolute inset-0 rounded-full border border-border/60 animate-orbit-slow">
            <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal signal-ring" />
          </div>
          <div className="absolute inset-12 rounded-full border border-border/40 animate-orbit-reverse">
            <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-elite" />
          </div>
          <div className="absolute inset-24 rounded-full border border-border/30" />
          <div className="relative flex h-32 w-32 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-signal/15 blur-2xl animate-pulse-signal" />
            <div className="absolute inset-2 rounded-full border border-signal/40 animate-pulse-signal" />
            <span className="relative text-5xl text-signal">◬</span>
          </div>
        </div>

        <p className="text-mono text-tracked mb-4 text-[10px] text-muted-foreground">
          Central operacional · Alta performance
        </p>

        {/* Nome do protocolo — destaque disruptivo */}
        <div className="protocol-title-frame mb-6 px-2">
          <h1 className="protocol-title text-balance font-light leading-[0.95] tracking-[-0.02em] text-4xl md:text-6xl lg:text-7xl">
            {"PROTOCOLO SOBERANO".split("").map((c, i) => (
              <span
                key={`a-${i}`}
                className="protocol-char"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {c === " " ? "\u00A0" : c}
              </span>
            ))}
            <br />
            <span className="text-mono text-tracked text-base md:text-xl lg:text-2xl text-signal/90">
              {"DE HARMONIA QUÂNTICA".split("").map((c, i) => (
                <span
                  key={`b-${i}`}
                  className="protocol-char"
                  style={{ animationDelay: `${800 + i * 35}ms` }}
                >
                  {c === " " ? "\u00A0" : c}
                </span>
              ))}
            </span>
          </h1>
        </div>

        <div className="clarity-statement mb-3 text-xl font-light md:text-2xl">
          <span className="clarity-word">Clareza.</span>{" "}
          <span className="clarity-word">Direção.</span>{" "}
          <span className="clarity-word text-signal">Domínio.</span>
        </div>
        <p className="mb-12 max-w-xl text-sm text-muted-foreground md:text-base">
          Uma infraestrutura de foco, posicionamento e presença para quem opera
          em ambientes de decisão.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to="/app"
            className="group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-all hover:scale-[1.02]"
          >
            Iniciar calibração
            <span className="text-signal-glow text-base transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            to="/arquetipos"
            className="text-mono text-tracked rounded-full border border-border px-6 py-3 text-[10px] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            Ver arquétipos
          </Link>
          <Link
            to="/como-utilizar"
            className="text-mono text-tracked rounded-full border border-signal/40 px-6 py-3 text-[10px] text-signal/90 transition-all hover:border-signal hover:text-signal hover:shadow-[0_0_20px_color-mix(in_oklab,var(--signal-glow)_40%,transparent)]"
          >
            Como Utilizar
          </Link>
        </div>
      </section>

      {/* Pillars */}
      <section className="relative z-10 border-t border-border/60">
        <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-5">
          {[
            { code: "01", label: "Frequência" },
            { code: "02", label: "Imagem Estratégica" },
            { code: "03", label: "Networking" },
            { code: "04", label: "Performance" },
            { code: "05", label: "Hierarquia" },
          ].map((pillar) => (
            <div
              key={pillar.code}
              className="border-b border-r border-border/60 px-6 py-8 last:border-r-0 md:border-b-0"
            >
              <div className="text-mono text-tracked text-[10px] text-signal">{pillar.code}</div>
              <div className="mt-2 text-sm text-foreground">{pillar.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
