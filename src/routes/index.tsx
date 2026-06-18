import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { QuantumField } from "@/components/QuantumField";
import { SiteFooter } from "@/components/SiteFooter";
import { PLANS } from "@/lib/plans";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Protocolo Soberano de Harmonia Quântica — Treinamento Empresarial e Ressonância Harmônica" },
      { name: "description", content: "Protocolo Soberano de Harmonia Quântica: treinamento empresarial em ressonância harmônica, harmonia quântica, universo quântico e física quântica aplicada à alta performance e presença executiva." },
      { name: "keywords", content: "treinamento empresarial, ressonância harmônica, harmonia quântica, universo quântico, física quântica, frequências binaurais, alta performance, mentalidade quântica, alinhamento executivo, neuroacústica" },
      { property: "og:title", content: "Protocolo Soberano de Harmonia Quântica" },
      { property: "og:description", content: "Treinamento empresarial em ressonância harmônica e física quântica aplicada. Clareza. Direção. Domínio." },
      { property: "og:url", content: "https://state-domain-protocol.lovable.app/" },
    ],
    links: [
      { rel: "canonical", href: "https://state-domain-protocol.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Protocolo Soberano de Harmonia Quântica",
          url: "https://state-domain-protocol.lovable.app",
          inLanguage: "pt-BR",
          about: [
            "Treinamento empresarial",
            "Ressonância harmônica",
            "Harmonia quântica",
            "Universo quântico",
            "Física quântica",
          ],
        }),
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

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
        <div className="protocol-title-frame mb-10 px-2">
          <h1 className="protocol-title text-balance font-light leading-[0.95] tracking-[-0.01em] text-4xl md:text-6xl lg:text-7xl">
            PROTOCOLO SOBERANO
            <br />
            <span className="text-mono text-tracked text-base md:text-xl lg:text-2xl text-signal/90">
              DE HARMONIA QUÂNTICA
            </span>
          </h1>
        </div>

        {/* Separador visual entre título e tagline */}
        <div className="mb-6 flex items-center gap-3 opacity-70">
          <span className="h-px w-10 bg-border" />
          <span className="text-signal text-xs">◬</span>
          <span className="h-px w-10 bg-border" />
        </div>

        <div className="clarity-statement text-mono text-tracked mb-6 text-lg md:text-2xl font-medium">
          <span className="clarity-word text-foreground">CLAREZA</span>
          <span className="mx-3 text-signal/70">·</span>
          <span className="clarity-word text-foreground">DIREÇÃO</span>
          <span className="mx-3 text-signal/70">·</span>
          <span className="clarity-word text-signal">DOMÍNIO</span>
        </div>
        <p className="mb-12 max-w-2xl text-base text-foreground/85 md:text-xl leading-relaxed">
          Uma infraestrutura de foco, posicionamento e presença para quem opera
          em ambientes de decisão.
        </p>

        {/* CTA buttons */}
        <div className="flex w-full max-w-3xl flex-col items-center gap-4">
          {/* Primary: full-width */}
          <Link
            to="/app"
            className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-foreground px-7 py-4 text-base font-medium text-background transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_color-mix(in_oklab,var(--signal-glow)_25%,transparent)]"
          >
            Iniciar seu protocolo
            <span className="text-signal-glow text-base transition-transform group-hover:translate-x-1">→</span>
          </Link>

          {/* Secondary: grid of navigation buttons */}
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <Link
              to="/frequencias"
              className="text-mono text-tracked rounded-full border border-signal/40 px-4 py-3 text-[11px] md:text-xs text-signal text-center transition-all hover:border-signal hover:shadow-[0_0_20px_color-mix(in_oklab,var(--signal-glow)_40%,transparent)]"
            >
              Ver frequências
            </Link>
            <Link
              to="/arquetipos"
              className="text-mono text-tracked rounded-full border border-border px-4 py-3 text-[11px] md:text-xs text-foreground/85 text-center transition-colors hover:border-foreground hover:text-foreground"
            >
              Ver arquétipos
            </Link>
            <Link
              to="/como-utilizar"
              className="text-mono text-tracked rounded-full border border-signal/40 px-4 py-3 text-[11px] md:text-xs text-signal text-center transition-all hover:border-signal hover:shadow-[0_0_20px_color-mix(in_oklab,var(--signal-glow)_40%,transparent)]"
            >
              Como Utilizar
            </Link>
            <Link
              to="/a-ciencia-do-protocolo"
              className="text-mono text-tracked rounded-full border border-border px-4 py-3 text-[11px] md:text-xs text-foreground/85 text-center transition-colors hover:border-foreground hover:text-foreground"
            >
              A ciência do Protocolo
            </Link>
            <Link
              to="/treinamento-maestria-frequencial"
              className="col-span-2 sm:col-span-1 lg:col-span-1 text-mono text-tracked rounded-full border border-signal/40 px-4 py-3 text-[11px] md:text-xs text-signal text-center transition-all hover:border-signal hover:shadow-[0_0_20px_color-mix(in_oklab,var(--signal-glow)_40%,transparent)]"
            >
              Maestria Frequencial
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="relative z-10 border-t border-border/60 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 text-center">
            <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Módulo · Acesso</div>
            <h2 className="text-3xl font-light text-foreground md:text-4xl">Planos de acesso</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Escolha o nível de acesso ideal para sua jornada.
            </p>
          </div>

          {/* Toggle mensal / anual */}
          <div className="mb-8 flex justify-center">
            <div className="flex rounded-full border border-border/60 bg-card/40 p-1">
              <button
                onClick={() => setBilling("monthly")}
                className={`text-mono text-tracked rounded-full px-5 py-2 text-[11px] transition-colors ${
                  billing === "monthly"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBilling("annual")}
                className={`text-mono text-tracked flex items-center gap-2 rounded-full px-5 py-2 text-[11px] transition-colors ${
                  billing === "annual"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Anual
                {billing !== "annual" && (
                  <span className="rounded-full bg-signal/20 px-1.5 py-0.5 text-[9px] text-signal">
                    até 36% off
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Cards de plano */}
          <div className="grid gap-6 sm:grid-cols-3">
            {PLANS.map((plan) => {
              const price =
                plan.id === "free"
                  ? 0
                  : billing === "monthly"
                    ? plan.priceMonthly
                    : plan.priceAnnual;

              return (
                <div
                  key={plan.id}
                  className={`glass-panel relative flex flex-col overflow-hidden rounded-xl p-6 ${
                    plan.highlight
                      ? "border-signal/50 shadow-[0_0_40px_color-mix(in_oklab,var(--signal-glow)_15%,transparent)]"
                      : ""
                  }`}
                >
                  {plan.highlight && (
                    <div className="text-mono text-tracked absolute right-3 top-3 rounded-full border border-signal/30 bg-signal/15 px-2 py-0.5 text-[9px] text-signal">
                      Recomendado
                    </div>
                  )}

                  <div className="mb-5 mt-5">
                    <div className="text-2xl font-medium text-foreground">{plan.name}</div>
                  </div>

                  {plan.id === "free" ? (
                    <div className="mb-6">
                      <span className="text-4xl font-light text-foreground">Grátis</span>
                      <div className="text-mono text-tracked mt-1 text-[10px] text-muted-foreground">
                        sempre
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 space-y-1">
                      <div>
                        <span className="text-4xl font-light text-foreground">
                          R${" "}
                          {price.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                        <span className="text-mono text-tracked ml-1 text-[10px] text-muted-foreground">
                          /{billing === "monthly" ? "mês" : "ano"}
                        </span>
                      </div>
                      {billing === "annual" && (
                        <div className="text-mono text-tracked text-[10px] text-signal">
                          economize {plan.annualSavingsPct}% em relação ao mensal
                        </div>
                      )}
                    </div>
                  )}

                  <ul className="mb-6 flex-1 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground/90">
                        <span className="mt-0.5 shrink-0 text-signal">✓</span>
                        {f}
                      </li>
                    ))}
                    {plan.locked.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-muted-foreground/40 line-through"
                      >
                        <span className="mt-0.5 shrink-0">✕</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/planos"
                    className={`text-mono text-tracked w-full rounded-full px-4 py-2.5 text-center text-[11px] transition-colors ${
                      plan.highlight
                        ? "bg-foreground text-background hover:bg-foreground/90"
                        : "border border-border/60 text-foreground/85 hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    {plan.id === "free" ? "Começar grátis" : `Assinar ${plan.name}`}
                  </Link>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-[11px] text-muted-foreground">
            Pagamento processado pelo Mercado Pago · Cancele quando quiser
          </p>
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
              <div className="text-mono text-tracked text-xs text-signal">{pillar.code}</div>
              <div className="mt-2 text-base md:text-lg text-foreground">{pillar.label}</div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
