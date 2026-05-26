import { createFileRoute, Link } from "@tanstack/react-router";
import { QuantumField } from "@/components/QuantumField";

export const Route = createFileRoute("/treinamento-maestria-frequencial")({
  head: () => ({
    meta: [
      { title: "Treinamento em Maestria Frequencial — Protocolo Soberano de Harmonia Quântica" },
      { name: "description", content: "Habilitação de Sinal: Por que a Maestria é Obrigatória para operar o Protocolo Soberano." },
    ],
  }),
  component: TreinamentoMaestriaFrequencial,
});

function TreinamentoMaestriaFrequencial() {
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

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-8 pb-4 text-center">
        <h1 className="protocol-title mb-4 text-3xl font-light leading-tight md:text-5xl">
          Treinamento em Maestria Frequencial
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
          Habilitação de Sinal: Por que a Maestria é Obrigatória?
        </p>
      </section>

      {/* Content */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 py-12">
        <div className="space-y-8">
          {/* Intro */}
          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <p className="mb-4 text-base leading-relaxed text-foreground/90 md:text-lg">
              O aplicativo <strong>Protocolo Soberano de Harmonia Quântica</strong> é um acelerador de partículas mental. Ele entrega a você as frequências puras e o isolamento acústico necessário para o colapso de realidade. No entanto, o hardware biológico necessita da calibração correta para processar essa potência sem gerar saturação ou rebote neurológico.
            </p>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              Ouvir as frequências sem o método de ancoragem correto é como ligar uma máquina industrial de alta voltagem em uma rede elétrica residencial: o sistema entra em sobrecarga.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              Para que a sua voz e as assinaturas sonoras dos arquétipos operem em sinergia perfeita, o treinamento <strong>Harmonia Frequencial Quântica para Transformação de Realidades</strong> é o seu manual de instruções definitivo.
            </p>
          </div>

          {/* O Que Você Vai Destravar */}
          <h2 className="mt-12 mb-6 text-center text-2xl font-light text-signal md:text-3xl">
            O Que Você Vai Destravar no Treinamento
          </h2>

          {/* 1. Engenharia dos Decretos */}
          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <div className="mb-4 flex items-center gap-4">
              <span className="text-mono text-tracked text-[10px] text-signal">01</span>
              <h3 className="text-xl font-medium">A Engenharia dos Decretos</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              Como redigir determinações matematicamente exatas, utilizando os códigos de comando que o subconsciente aceita de forma imediata, sem passar pelo filtro de dúvida do ego.
            </p>
          </div>

          {/* 2. Ciclos de Sintonização */}
          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <div className="mb-4 flex items-center gap-4">
              <span className="text-mono text-tracked text-[10px] text-signal">02</span>
              <h3 className="text-xl font-medium">Ciclos de Sintonização Limpa</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              O cronograma exato de dias e janelas biológicas para rodar cada combo de arquétipos, impedindo o conflito de sinal (como misturar frequências de alerta com frequências de cura).
            </p>
          </div>

          {/* 3. Ancoragem Biofísica */}
          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <div className="mb-4 flex items-center gap-4">
              <span className="text-mono text-tracked text-[10px] text-signal">03</span>
              <h3 className="text-xl font-medium">Ancoragem Biofísica</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              Exercícios corporais e de respiração ancestral para fixar a frequência na matéria, transformando o estímulo sonoro em ação imediata e atração magnética de contratos e saúde.
            </p>
          </div>

          {/* Aviso de Segurança */}
          <div className="rounded-2xl border border-signal/30 bg-signal/10 p-6 md:p-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-signal text-lg">⚠️</span>
              <h3 className="text-lg font-medium text-signal">AVISO DE SEGURANÇA OPERACIONAL</h3>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90 md:text-base">
              Não permita que a sua mente flutue em tentativas de erro e acerto. O sucesso financeiro, a blindagem da saúde e a soberania familiar exigem técnica milimétrica.
            </p>
          </div>

          {/* Botão de Ação Central */}
          <div className="flex justify-center py-8">
            <a
              href="#"
              className="group inline-flex items-center gap-3 rounded-full bg-signal px-8 py-4 text-sm font-medium text-background transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_color-mix(in_oklab,var(--signal-glow)_50%,transparent)]"
            >
              Acessar Treinamento Oficial e Iniciar o Protocolo
              <span className="text-base transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>

          {/* Selo */}
          <div className="pb-12 pt-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-background/60 px-6 py-3">
              <span className="text-signal text-sm">◬</span>
              <span className="text-mono text-tracked text-[10px] text-signal">
                Está feito. Está selado.
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
