import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/manual")({
  head: () => ({
    meta: [
      { title: "Manual · Protocolo Soberano" },
      { name: "description", content: "Manual operacional do Protocolo Soberano: filosofia, módulos e ritual de uso." },
    ],
  }),
  component: Manual,
});

function Section({ code, title, children }: { code: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border/60 py-10">
      <div className="text-mono text-tracked mb-3 text-[10px] text-signal">{code}</div>
      <h2 className="mb-5 text-2xl font-light text-foreground md:text-3xl">{title}</h2>
      <div className="space-y-4 text-sm leading-relaxed text-foreground/80">{children}</div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-border/40 py-3 sm:grid-cols-[180px_1fr] sm:gap-6">
      <div className="text-mono text-tracked text-[10px] text-muted-foreground">{k}</div>
      <div className="text-sm text-foreground/90">{v}</div>
    </div>
  );
}

function Manual() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-6 pb-32 pt-10">
        <div className="mb-10">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Documento operacional</div>
          <h1 className="text-4xl font-light text-foreground md:text-5xl">Manual do Protocolo</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Este sistema não é um app de motivação. É um instrumento de alinhamento pessoal,
            estratégico e executivo. Leia uma vez. Opere todos os dias.
          </p>
        </div>

        <Section code="01" title="O que é o Protocolo">
          <p>
            O Protocolo Soberano é uma camada de comando sobre o seu próprio sistema operacional
            humano. Substitui ruído por <span className="text-foreground">sinal</span>, reação por
            <span className="text-foreground"> postura</span>, vontade por <span className="text-foreground">ritual</span>.
          </p>
          <p>
            Não há feed, não há curtidas, não há entretenimento. Há estado, frequência, arquétipo,
            execução e registro. A interface é silenciosa de propósito — toda atenção é devolvida
            ao operador.
          </p>
        </Section>

        <Section code="02" title="Princípios">
          <Row k="Sinal &gt; Ruído" v="Reduza estímulos. Aumente clareza. O som mais alto é o que está dentro." />
          <Row k="Postura primeiro" v="Posição corporal define química mental. Calibre o corpo antes de calibrar a fala." />
          <Row k="Ritual &gt; vontade" v="Você não precisa querer. Precisa repetir. A constância vence a inspiração." />
          <Row k="Presença é poder" v="Quem ocupa o espaço dirige a sala. Treine ocupação, não performance." />
          <Row k="Tudo registra" v="O que não é medido se dilui. Logue cada protocolo executado." />
        </Section>

        <Section code="03" title="Os 5 módulos">
          <Row k="01 · Centro" v="Cockpit. Estado atual, arquétipo ativo, métricas de constância." />
          <Row k="02 · Frequência" v="Sinais binaurais para calibrar foco, blindagem, execução, clareza, expansão, influência, recuperação e presença." />
          <Row k="03 · Arquétipos" v="18 modos operacionais. Selecione o arquétipo conforme o cenário. Ative para fixar o estado no Centro." />
          <Row k="04 · Rede" v="Não é rede social. É feed de resultados — protocolo executado, resultado obtido, validação estratégica." />
          <Row k="05 · Performance" v="Mapa de evolução, patente, constância, foco médio, reconhecimentos." />
        </Section>

        <Section code="04" title="Ritual diário (3 ciclos)">
          <Row k="06h–10h · Abertura" v="Centro → escolher arquétipo do dia → frequência Foco Absoluto ou Execução por 25–45 min." />
          <Row k="13h–16h · Calibração" v="Reentrar no Centro. Trocar arquétipo conforme o cenário. Frequência Clareza ou Influência." />
          <Row k="20h–23h · Recolhimento" v="Frequência Recuperação ou Presença. Registrar resultado do dia em Performance." />
        </Section>

        <Section code="05" title="Como funcionam as frequências">
          <p>
            Cada sessão emite duas senoidais puras com diferença em Hz entre os ouvidos. O cérebro
            interpreta a diferença como uma <span className="text-foreground">batida binaural</span> e
            tende a se acoplar à banda alvo: Delta (sono profundo), Theta (intuição), Alpha
            (clareza), Beta (foco), Gamma (alta performance).
          </p>
          <Row k="Requisito" v="Fones de ouvido estéreo. Sem fones, a batida não se forma." />
          <Row k="Volume" v="Confortável e baixo. O efeito é da diferença, não do volume." />
          <Row k="Duração" v="Definida por sessão (10 a 45 min). Encerra automaticamente." />
          <Row k="Aviso" v="Não usar ao dirigir, operar máquinas, nem em casos de epilepsia fotossensível." />
        </Section>

        <Section code="06" title="Como usar os arquétipos">
          <p>
            Arquétipo não é fantasia. É um <span className="text-foreground">estado operacional</span> com
            postura, ritmo de fala, ambiente e protocolo definidos. Antes de uma reunião, escolha o
            arquétipo apropriado, leia o protocolo, ajuste o corpo, entre.
          </p>
          <Row k="Negociação velada" v="Serpente · Estrategista · Mercador" />
          <Row k="Crise / pressão" v="Rocha · Templário · Guardião" />
          <Row k="Decisão de longo prazo" v="Águia · Estrategista · Oráculo" />
          <Row k="Fechamento" v="Tubarão · Arqueiro · Mercador" />
          <Row k="Palco / autoridade" v="Leão · Diamante · Maestro" />
          <Row k="Reconstrução" v="Fênix · Samurai · Templário" />
        </Section>

        <Section code="07" title="Patentes de evolução">
          <Row k="Frequência Base" v="Operador iniciando alinhamento. Constância em formação." />
          <Row k="Eixo Ativo" v="Ritual diário consolidado. Estado é defendido sob ruído." />
          <Row k="Sinal Soberano" v="Presença reconhecida pelo ambiente. Influência sem esforço." />
          <Row k="Núcleo Alpha" v="Operador que reorganiza o campo onde entra. Topo." />
        </Section>

        <Section code="08" title="O que este sistema NÃO é">
          <p>· Não é app motivacional. Não há frase do dia.</p>
          <p>· Não é rede social. Não há like, follower, scroll infinito.</p>
          <p>· Não é meditação espiritual. É calibração executiva.</p>
          <p>· Não é curso. Não há aula, não há vídeo, não há lição.</p>
          <p>O sistema só funciona se for <span className="text-foreground">operado</span> — não consumido.</p>
        </Section>

        <div className="mt-12 flex flex-wrap gap-3 border-t border-border/60 pt-8">
          <Link
            to="/app"
            className="text-mono text-tracked rounded-full bg-foreground px-6 py-3 text-[11px] text-background"
          >
            Entrar no Centro
          </Link>
          <Link
            to="/arquetipos"
            className="text-mono text-tracked rounded-full border border-border px-6 py-3 text-[11px] text-foreground hover:border-signal/60"
          >
            Escolher arquétipo
          </Link>
          <Link
            to="/frequencias"
            className="text-mono text-tracked rounded-full border border-border px-6 py-3 text-[11px] text-foreground hover:border-signal/60"
          >
            Ativar frequência
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
