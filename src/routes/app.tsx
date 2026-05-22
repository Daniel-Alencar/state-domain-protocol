import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SignalCore } from "@/components/SignalCore";
import { ARCHETYPES, getArchetype } from "@/lib/archetypes";
import {
  useActiveArchetypes,
  removeActiveArchetype,
  clearAllActiveArchetypes,
} from "@/lib/active-state";
import { isRunning, stop, stopAll } from "@/lib/binaural-engine";
import {
  useActiveDetermination,
  setActiveDetermination,
  listDeterminations,
} from "@/lib/determinations";
import { toast } from "sonner";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Centro · Protocolo Soberano" }] }),
  component: Cockpit,
});

function Cockpit() {
  const activeIds = useActiveArchetypes();
  const activeDetId = useActiveDetermination();
  const determinations = listDeterminations();
  const activeDet = determinations.find((d) => d.id === activeDetId);

  const primary = activeIds.length
    ? getArchetype(activeIds[activeIds.length - 1])!
    : ARCHETYPES[0];

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Conexão estabelecida. O campo está pronto para sua direção."
      : hour < 18
      ? "Sinal estabilizado. Qual direção será executada agora?"
      : "Protocolo de domínio ativo. O ambiente responde à sua presença.";

  function deactivate(id: string) {
    const a = getArchetype(id);
    removeActiveArchetype(id);
    if (a && isRunning(a.freqId)) stop(a.freqId);
    toast("Arquétipo desligado", { description: a?.name });
  }

  function deactivateAll() {
    clearAllActiveArchetypes();
    stopAll();
    setActiveDetermination(null);
    toast("Todos os arquétipos e a determinação foram desligados.");
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 pb-32 pt-10 md:pt-16">
        <div className="mb-12 text-center">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">
            {activeIds.length
              ? `${activeIds.length} arquétipo(s) em execução`
              : "Frequência Base · sem arquétipo"}
          </div>
          <p className="mx-auto max-w-xl text-lg font-light text-foreground md:text-xl">{greeting}</p>
        </div>

        <div className="flex justify-center">
          <SignalCore label={primary.name} glyph={primary.glyph} state={primary.state} />
        </div>

        {/* ===== Painel de estados ativos ===== */}
        <div className="mt-10 glass-panel rounded-xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-mono text-tracked text-[10px] text-signal">
              Estados em execução
            </div>
            {(activeIds.length > 0 || activeDet) && (
              <button
                onClick={deactivateAll}
                className="text-mono text-tracked rounded-full border border-destructive/60 px-3 py-1 text-[10px] text-destructive hover:bg-destructive/10"
              >
                Desligar tudo
              </button>
            )}
          </div>

          {activeIds.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum arquétipo ativo. Vá em <Link to="/arquetipos" className="text-signal">Arquétipos</Link> e acione um estado.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {activeIds.map((id) => {
                const a = getArchetype(id);
                if (!a) return null;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 rounded-full border border-signal/40 bg-signal/5 pl-3 pr-1 py-1"
                  >
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
                    <span className="text-[11px] text-foreground">
                      {a.glyph} {a.name} <span className="text-muted-foreground">· {a.carrier}/{a.beat} Hz</span>
                    </span>
                    <button
                      onClick={() => deactivate(id)}
                      className="ml-1 rounded-full bg-background/60 px-2 py-0.5 text-[10px] text-muted-foreground hover:text-destructive"
                      aria-label={`Desligar ${a.name}`}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {activeDet && (
            <div className="mt-4 flex items-center justify-between rounded-md border border-elite/40 bg-elite/5 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-elite" />
                <span className="text-[11px] text-foreground">
                  Determinação em loop · <span className="text-muted-foreground">{activeDet.title}</span>
                </span>
              </div>
              <button
                onClick={() => setActiveDetermination(null)}
                className="text-mono text-tracked rounded-full border border-border/60 px-2 py-0.5 text-[10px] text-muted-foreground hover:text-destructive"
              >
                parar
              </button>
            </div>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-4">
          <ActionCard to="/frequencias" code="01" title="Ativar Frequência" desc="Calibrar estado mental." />
          <ActionCard to="/arquetipos" code="02" title="Preparar Presença" desc="Selecionar arquétipo." />
          <ActionCard to="/determinacoes" code="03" title="Gravar Determinação" desc="Sua voz em loop." />
          <ActionCard to="/performance" code="04" title="Registrar Resultado" desc="Logar protocolo." />
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
