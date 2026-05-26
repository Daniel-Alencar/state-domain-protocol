import { createFileRoute, Link } from "@tanstack/react-router";
import { QuantumField } from "@/components/QuantumField";

export const Route = createFileRoute("/como-utilizar")({
  head: () => ({
    meta: [
      { title: "Como Utilizar — Protocolo Soberano de Harmonia Quântica" },
      { name: "description", content: "Guia de uso do Protocolo Soberano de Harmonia Quântica." },
    ],
  }),
  component: ComoUtilizar,
});

function ComoUtilizar() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <QuantumField />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-signal text-xl">◬</span>
          <span className="text-mono text-tracked text-[10px] text-muted-foreground">
            Protocolo Soberano · v1.0
          </span>
        </Link>
        <Link
          to="/"
          className="text-mono text-tracked text-[10px] text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Voltar
        </Link>
      </header>

      {/* Content */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-8 text-center text-3xl font-light md:text-4xl">
          Como Utilizar
        </h1>

        <div className="space-y-8">
          <Step
            number="01"
            title="Escolha seus Arquétipos"
            desc="Na seção Arquétipos, selecione os 3 que mais ressoam com sua frequência atual. Eles definirão as ondas de som que serão reproduzidas em loop."
          />
          <Step
            number="02"
            title="Grave sua Determinação"
            desc="Acesse Determinações e grave em áudio sua intenção, afirmação ou direcionamento estratégico. A transcrição automática converterá sua fala em texto."
          />
          <Step
            number="03"
            title="Análise de IA"
            desc="Cada gravação recebe análise automática com sugestão dos 3 arquétipos mais alinhados ao conteúdo transcrito."
          />
          <Step
            number="04"
            title="Toque em Loop"
            desc="Na lista de gravações, clique em Tocar em Loop. O áudio será reproduzido continuamente junto com as frequências dos arquétipos pré-aprovados."
          />
          <Step
            number="05"
            title="Repita quantas vezes quiser"
            desc="Não há limite de gravações. Cada uma é independente — escolha qualquer gravação para ouvir e analisar a qualquer momento."
          />
        </div>
      </section>
    </div>
  );
}

function Step({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="glass-panel rounded-xl p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="text-mono text-tracked text-[10px] text-signal">{number}</div>
        <div>
          <h3 className="mb-2 text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}
