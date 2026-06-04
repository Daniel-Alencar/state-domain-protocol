import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/SiteFooter";
import { QuantumField } from "@/components/QuantumField";

export const Route = createFileRoute("/a-ciencia-do-protocolo")({
  head: () => ({
    meta: [
      { title: "A Ciência do Protocolo — Física Quântica, Ressonância Harmônica e Harmonia Quântica" },
      { name: "description", content: "A base científica do Protocolo Soberano: física quântica, ressonância harmônica, harmonia quântica e neuroacústica aplicadas à performance e ao universo quântico interior." },
      { name: "keywords", content: "física quântica, harmonia quântica, ressonância harmônica, universo quântico, neuroacústica, frequências binaurais, treinamento empresarial" },
      { property: "og:title", content: "A Ciência do Protocolo Soberano de Harmonia Quântica" },
      { property: "og:description", content: "Física quântica, ressonância harmônica e neuroacústica aplicadas à alta performance." },
      { property: "og:url", content: "https://state-domain-protocol.lovable.app/a-ciencia-do-protocolo" },
    ],
    links: [
      { rel: "canonical", href: "https://state-domain-protocol.lovable.app/a-ciencia-do-protocolo" },
    ],
  }),
  component: ACienciaDoProtocolo,
});

function ACienciaDoProtocolo() {
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
          A Ciência do Protocolo
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-foreground/90 md:text-base">
          O que é o Protocolo Soberano de Harmonia Quântica?
        </p>
      </section>

      {/* Content */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 py-12">
        <div className="space-y-8">
          {/* Intro */}
          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <p className="mb-4 text-base leading-relaxed text-foreground/90 md:text-lg">
              O <strong>Protocolo Soberano de Harmonia Frequencial Quântica</strong> é um método científico e prático de reprogramação mental e biológica que utiliza a <strong>engenharia neuroacústica</strong>. Ele consiste na sobreposição de determinações e decretos de comando gravados em áudio sobre frequências sonoras puras, especificamente <strong>batidas binaurais</strong>.
            </p>
            <p className="text-sm leading-relaxed text-foreground/90 md:text-base">
              A mecânica baseia-se na <strong>sincronização bihemisférica</strong>: ao enviar frequências ligeiramente diferentes para cada ouvido, o cérebro é forçado a criar uma terceira frequência interna (a batida binaural). Esse processo altera o estado de onda cerebral (reduzindo o ruído do consciente/ego) e abre as portas do subconsciente para gravar novas diretrizes de comportamento, saúde e prosperidade, sem a interferência de dúvidas ou crenças limitantes.
            </p>
          </div>

          {/* Origem */}
          <h2 className="mt-12 mb-6 text-center text-2xl font-light text-signal md:text-3xl">
            De onde vem esse conhecimento ancestral?
          </h2>

          {/* 1. Pitágoras */}
          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <div className="mb-4 flex items-center gap-4">
              <span className="text-mono text-tracked text-[10px] text-signal">01</span>
              <h3 className="text-xl font-medium">A Escola de Pitágoras e o Egito Antigo</h3>
            </div>
            <p className="mb-3 text-sm font-medium text-signal/80">
              A Geometria Sagrada do Som
            </p>
            <p className="mb-4 text-sm leading-relaxed text-foreground/90 md:text-base">
              O que hoje chamamos de frequências de Solfeggio e assinaturas harmônicas nasceu nos Templos de Iniciação do Egito e foi traduzido matematicamente por Pitágoras na Grécia Antiga sob o nome de <em>"A Harmonia das Esferas"</em>.
            </p>
            <div className="rounded-xl border border-border/40 bg-background/40 p-4 md:p-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-signal">Como operavam</p>
              <p className="text-sm leading-relaxed text-foreground/90 md:text-base">
                Os antigos sabiam que o universo físico é sustentado por proporções geométricas e intervalos musicais. Nos templos egípcios, salas de pedra específicas eram projetadas como câmaras de ressonância acústica. Os iniciados entravam nessas câmaras para entoar vogais e mantras em tons exatos para curar o corpo (limpeza biológica) e alterar o estado de consciência para receber revelações técnicas. Eles chamavam isso de sintonizar a <strong>"Música Universal"</strong>.
              </p>
            </div>
          </div>

          {/* 2. Xamanismo */}
          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <div className="mb-4 flex items-center gap-4">
              <span className="text-mono text-tracked text-[10px] text-signal">02</span>
              <h3 className="text-xl font-medium">O Xamanismo Primitivo e os Tambores</h3>
            </div>
            <p className="mb-3 text-sm font-medium text-signal/80">
              O Binaural Ancestral
            </p>
            <p className="mb-4 text-sm leading-relaxed text-foreground/90 md:text-base">
              A mecânica de sincronizar os dois hemisférios cerebrais através do som (as batidas binaurais que usamos no aplicativo) vem diretamente do xamanismo ancestral e das tradições tribais mais antigas do planeta.
            </p>
            <div className="rounded-xl border border-border/40 bg-background/40 p-4 md:p-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-signal">Como operavam</p>
              <p className="text-sm leading-relaxed text-foreground/90 md:text-base">
                Ao utilizar batidas repetitivas de tambores em uma frequência constante e ligeiramente oscilante (geralmente entre 4,5 e 7 batidas por segundo), eles alteravam deliberadamente o estado cerebral da tribo para ondas Theta. Sob esse transe induzido pelo som, o ego dos guerreiros e caçadores era desligado, permitindo que eles acessassem o arquétipo do predador (o Lobo, a Pantera) antes do combate, ou entrassem em estado de cura física profunda.
              </p>
            </div>
          </div>

          {/* 3. Hermetismo */}
          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <div className="mb-4 flex items-center gap-4">
              <span className="text-mono text-tracked text-[10px] text-signal">03</span>
              <h3 className="text-xl font-medium">A Tradição Hermética e o Caibalion</h3>
            </div>
            <p className="mb-3 text-sm font-medium text-signal/80">
              A Lei da Vibração
            </p>
            <p className="mb-4 text-sm leading-relaxed text-foreground/90 md:text-base">
              Toda a base do colapso de onda quântico que é utilizada nos decretos de comando está escrita no <em>Caibalion</em>, o livro que reúne a filosofia hermética do Egito Antigo, atribuída a Hermes Trismegisto.
            </p>
            <div className="rounded-xl border border-border/40 bg-background/40 p-4 md:p-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-signal">O Princípio Máximo</p>
              <p className="text-sm leading-relaxed text-foreground/90 md:text-base">
                O terceiro princípio hermético é a <strong>Lei da Vibração</strong>, que dita: <em>"Nada está parado; tudo se move; tudo vibra"</em>. Os reis e sacerdotes da antiguidade sabiam que a matéria é apenas energia condensada e que, para alterar a matéria (atrair riqueza ou extirpar uma doença), bastava projetar a palavra com a frequência vibracional correta. O decreto falado com autoridade máxima era visto como um disparo eletromagnético sobre o tecido da realidade.
              </p>
            </div>
          </div>

          {/* Arquétipos */}
          <h2 className="mt-12 mb-6 text-center text-2xl font-light text-signal md:text-3xl">
            A Relação com os Arquétipos e as Frequências
          </h2>

          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <p className="mb-6 text-sm leading-relaxed text-foreground/90 md:text-base">
              Os <strong>arquétipos</strong> são padrões universais de energia, comportamento e poder (como o Rei, o Tubarão, a Fênix, o Estrategista). Cada um desses padrões possui uma assinatura vibracional única, uma <em>"geometria acústica"</em> que pode ser traduzida em frequências portadoras e frequências de batida específicas.
            </p>
            <p className="mb-6 text-sm leading-relaxed text-foreground/90 md:text-base">
              Quando sintonizamos a frequência exata de um arquétipo através do áudio, estamos operando por <strong>harmonia frequencial quântica natural</strong>: o seu cérebro e as suas células se alinham com aquela assinatura de poder superior divinal.
            </p>

            <div className="space-y-4">
              <div className="rounded-xl border-l-2 border-signal/60 bg-background/40 p-4">
                <p className="mb-2 text-sm font-medium text-foreground">
                  Alta performance e fechamento de contratos de elite
                </p>
                <p className="text-sm leading-relaxed text-foreground/90">
                  O protocolo aciona frequências em ondas <strong>Beta</strong> vinculadas ao Tubarão e ao Estrategista, injetando prontidão e sangue-frio no sistema.
                </p>
              </div>
              <div className="rounded-xl border-l-2 border-signal/60 bg-background/40 p-4">
                <p className="mb-2 text-sm font-medium text-foreground">
                  Purificação biológica e eliminação de anomalias
                </p>
                <p className="text-sm leading-relaxed text-foreground/90">
                  O protocolo aciona frequências em ondas <strong>Theta/Delta</strong> vinculadas ao Mago Transmutação e à Fênix, ativando a varredura celular e a autorregeneração enquanto o corpo descansa.
                </p>
              </div>
            </div>
          </div>

          {/* Para que serve */}
          <h2 className="mt-12 mb-6 text-center text-2xl font-light text-signal md:text-3xl">
            A que se Presta o Protocolo?
          </h2>

          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <p className="mb-6 text-sm leading-relaxed text-foreground/90 md:text-base">
              O método não é um exercício de contemplação passiva ou misticismo abstrato; é um <strong>manual de instruções prático para o colapso de realidade</strong>. Ele se presta a:
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Assumir a Soberania Mental",
                  desc: "Devolver ao indivíduo o comando central sobre seus pensamentos, eliminando a autossabotagem e a ansiedade geradas pelo ambiente externo e ego."
                },
                {
                  title: "Blindagem Biológica",
                  desc: "Comandar o organismo para que rode estritamente em sua matriz original, expelindo inflamações, disfunções e cansaço crônico."
                },
                {
                  title: "Expansão Material de Elite",
                  desc: "Alinhar o comportamento com o das mentes mais ricas do mundo atual, atraindo por magnetismo oportunidades e clientes de alto valor."
                },
                {
                  title: "Elevação de Frequência",
                  desc: "Colocar o indivíduo em estado de alta frequência vibracional, aproximando-o da frequência divinal."
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-border/40 bg-background/40 p-4">
                  <h4 className="mb-2 text-sm font-medium text-signal">{item.title}</h4>
                  <p className="text-sm leading-relaxed text-foreground/90">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Impactos */}
          <h2 className="mt-12 mb-6 text-center text-2xl font-light text-signal md:text-3xl">
            Os Impactos Práticos na Sua Vida
          </h2>

          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <p className="mb-6 text-sm leading-relaxed text-foreground/90 md:text-base">
              A aplicação disciplinada e diária deste protocolo — respeitando as janelas de tempo ao acordar e ao deitar — gera impactos mensuráveis na matéria:
            </p>

            <div className="space-y-4">
              <div className="rounded-xl border border-border/40 bg-background/40 p-4 md:p-6">
                <h4 className="mb-2 text-sm font-medium text-signal">No Campo Profissional e Financeiro</h4>
                <p className="text-sm leading-relaxed text-foreground/90">
                  Velocidade de decisão cirúrgica, comunicação magnética e autoridade instantânea em reuniões e palestras. O mercado deixa de ser um ambiente de disputa e passa a se curvar à sua jurisdição comercial.
                </p>
              </div>
              <div className="rounded-xl border border-border/40 bg-background/40 p-4 md:p-6">
                <h4 className="mb-2 text-sm font-medium text-signal">No Campo Biológico</h4>
                <p className="text-sm leading-relaxed text-foreground/90">
                  Restauração da saúde vital. O corpo passa a rejeitar o declínio, otimizando a circulação, a acuidade sensorial (visão, audição e fala) e a regeneração tecidual profunda.
                </p>
              </div>
              <div className="rounded-xl border border-border/40 bg-background/40 p-4 md:p-6">
                <h4 className="mb-2 text-sm font-medium text-signal">No Campo Pessoal e Familiar</h4>
                <p className="text-sm leading-relaxed text-foreground/90">
                  Eliminação do orgulho estéril e dos ruídos de comunicação, permitindo liderar o ecossistema familiar e de parcerias estratégicas com sabedoria, justiça e foco de longo prazo.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-signal/20 bg-signal/5 p-4 md:p-6">
              <p className="text-sm leading-relaxed text-foreground/90 md:text-base">
                Em suma, o <strong>Protocolo Soberano de Harmonia Quântica</strong> é a ferramenta técnica que transforma intenção pura em realidade concreta, sintonizando o hardware biológico na frequência da Fonte Primordial.
              </p>
            </div>
          </div>

          {/* Nota */}
          <div className="rounded-2xl border border-signal/30 bg-signal/10 p-6 md:p-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-signal text-lg">⚠️</span>
              <h3 className="text-lg font-medium text-signal">NOTA DE DIRETRIZ E APROVEITAMENTO</h3>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-foreground/90 md:text-base">
              Para extrair o rendimento máximo e o correto alinhamento das forças envolvidas neste método, o uso das frequências e decretos deve ser rigorosamente orientado. A manipulação incorreta de assinaturas sonoras e arquétipos pode gerar ruído e saturação no sistema cognitivo. <strong>Não deve ser executado sem fones de ouvido.</strong>
            </p>
            <p className="text-sm leading-relaxed text-foreground/90 md:text-base">
              Para a segurança mental e para que a transformação de sua realidade realmente ocorra sem barreiras, é altamente recomendável a realização prévia do curso <em>"Harmonia Frequencial Quântica para Transformação de Realidades"</em>, onde toda a base técnica e o manual de instruções prático são fornecidos em sua totalidade.
            </p>
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

      <SiteFooter />
    </div>
  );
}
