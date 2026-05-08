import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/networking")({
  head: () => ({ meta: [{ title: "Rede · Protocolo Soberano" }] }),
  component: Networking,
});

const POSTS = [
  {
    user: "G. Marques",
    rank: "Domínio Pleno",
    archetype: "Tubarão",
    objective: "Fechar contrato anual com cliente travado há 4 meses.",
    protocol: "Frequência Execução · 45min · presença reduzida ao essencial.",
    result: "Assinatura confirmada em 22 minutos de reunião.",
    signal: 142,
  },
  {
    user: "R. Veras",
    rank: "Eixo Ativo",
    archetype: "Rocha",
    objective: "Manter centro durante reestruturação interna.",
    protocol: "Blindagem em loop por 3 dias. Zero reação a ruído.",
    result: "Time estabilizou. Decisão executada sem desgaste.",
    signal: 88,
  },
  {
    user: "L. Tahan",
    rank: "Núcleo Alpha",
    archetype: "Águia",
    objective: "Reposicionar empresa em novo nicho.",
    protocol: "Expansão · 7 dias de mapeamento estratégico.",
    result: "Nova tese aprovada por board.",
    signal: 311,
  },
];

function Networking() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-6 pb-32 pt-10">
        <div className="mb-10">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Módulo 04 · Rede</div>
          <h1 className="text-3xl font-light text-foreground md:text-4xl">Feed de Resultados</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Sem opinião. Sem ruído. Apenas registros de execução validados pela rede.
          </p>
        </div>

        <div className="space-y-4">
          {POSTS.map((p, i) => (
            <article key={i} className="glass-panel overflow-hidden rounded-lg">
              <header className="flex items-center justify-between border-b border-border/60 px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary text-sm">
                    {p.user.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm text-foreground">{p.user}</div>
                    <div className="text-mono text-tracked text-[9px] text-muted-foreground">{p.rank}</div>
                  </div>
                </div>
                <div className="text-mono text-tracked rounded-full border border-signal/30 px-3 py-1 text-[9px] text-signal">
                  {p.archetype}
                </div>
              </header>
              <div className="grid grid-cols-1 divide-y divide-border/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <Block label="Objetivo" value={p.objective} />
                <Block label="Protocolo" value={p.protocol} />
                <Block label="Resultado" value={p.result} />
              </div>
              <footer className="flex items-center justify-between border-t border-border/60 px-5 py-3">
                <button className="text-mono text-tracked group flex items-center gap-2 text-[10px] text-muted-foreground hover:text-signal">
                  <span className="text-signal">◬</span> Reconhecimento de Sinal
                  <span className="text-foreground">· {p.signal}</span>
                </button>
                <button className="text-mono text-tracked text-[10px] text-muted-foreground hover:text-elite">
                  Validação Estratégica
                </button>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4">
      <div className="text-mono text-tracked mb-2 text-[9px] text-signal">{label}</div>
      <div className="text-xs leading-relaxed text-foreground/90">{value}</div>
    </div>
  );
}
