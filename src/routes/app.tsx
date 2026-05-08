import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SignalCore } from "@/components/SignalCore";
import { ARCHETYPES } from "@/lib/archetypes";
import { useActiveArchetype } from "@/lib/active-state";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Centro · Protocolo Soberano" }] }),
  component: Cockpit,
});

function Cockpit() {
  const activeId = useActiveArchetype();
  const active = ARCHETYPES.find((a) => a.id === activeId) ?? ARCHETYPES[1]; // Rocha como padrão

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Conexão estabelecida. O campo está pronto para sua direção."
      : hour < 18
      ? "Sinal estabilizado. Qual direção será executada agora?"
      : "Protocolo de domínio ativo. O ambiente responde à sua presença.";

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 pb-32 pt-10 md:pt-16">
        <div className="mb-12 text-center">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">
            {activeId ? `Arquétipo ativo · ${active.name}` : "Frequência Base · sem arquétipo"}
          </div>
          <p className="mx-auto max-w-xl text-lg font-light text-foreground md:text-xl">{greeting}</p>
        </div>

        <div className="flex justify-center">
          <SignalCore label={active.name} glyph={active.glyph} state={active.state} />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-3">
          <ActionCard to="/frequencias" code="01" title="Ativar Frequência" desc="Calibrar estado mental." />
          <ActionCard to="/performance" code="02" title="Registrar Resultado" desc="Logar protocolo executado." />
          <ActionCard to="/arquetipos" code="03" title="Preparar Presença" desc="Selecionar arquétipo." />
        </div>

        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border/60 md:grid-cols-4">
          <Stat label="Constância" value="14d" trend="+3" />
          <Stat label="Patente" value="Eixo Ativo" trend="42%" />
          <Stat label="Foco médio" value="2h 18m" trend="+11%" />
          <Stat label="Reconhecimentos" value="07" trend="semana" />
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/manual"
            className="text-mono text-tracked text-[10px] text-muted-foreground hover:text-signal"
          >
            Abrir Manual do Protocolo →
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function ActionCard({ to, code, title, desc }: { to: string; code: string; title: string; desc: string }) {
  return (
    <Link
      to={to}
      className="group glass-panel relative overflow-hidden rounded-lg p-5 transition-all hover:border-signal/40"
    >
      <div className="text-mono text-tracked mb-3 text-[10px] text-signal">{code}</div>
      <div className="mb-1 text-sm font-medium text-foreground">{title}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
      <span className="absolute right-4 top-4 text-muted-foreground transition-all group-hover:text-signal group-hover:translate-x-1">→</span>
    </Link>
  );
}

function Stat({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="bg-card/40 px-5 py-4">
      <div className="text-mono text-tracked text-[9px] text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-lg font-medium text-foreground">{value}</span>
        <span className="text-mono text-[10px] text-signal">{trend}</span>
      </div>
    </div>
  );
}
