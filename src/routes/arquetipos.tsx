import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ARCHETYPES, type Archetype } from "@/lib/archetypes";
import {
  addActiveArchetype,
  clearAllActiveArchetypes,
  MAX_ACTIVE_ARCHETYPES,
  removeActiveArchetype,
  useActiveArchetypes,
  bumpSession,
} from "@/lib/active-state";
import { start, stop, isRunning, subscribe } from "@/lib/binaural-engine";
import { useEntitlement } from "@/lib/use-entitlement";
import { toast } from "sonner";

export const Route = createFileRoute("/arquetipos")({
  head: () => ({
    meta: [
      { title: "Arquétipos · Protocolo Soberano" },
      { name: "description", content: "Arquétipos operacionais e forças ancestrais do Protocolo Soberano. Estados mentais com assinaturas sonoras únicas para alta performance." },
    ],
  }),
  component: Arquetipos,
});

const DEFAULT_DURATION = 25;

function Arquetipos() {
  const ent = useEntitlement();
  const [selected, setSelected] = useState<Archetype>(ARCHETYPES[0]);
  const [runningIds, setRunningIds] = useState<string[]>([]);
  const activeIds = useActiveArchetypes();
  const isActive = activeIds.includes(selected.id);
  const audioOn = runningIds.includes(selected.freqId);

  useEffect(() => subscribe((active) => setRunningIds(active.map((s) => s.freqId))), []);

  const canActivate = ent.tier !== "free";
  const isPremium = ent.has("premium");

  function runningArchetypeIds(extraId?: string) {
    const ids = runningIds
      .map((freqId) => ARCHETYPES.find((a) => a.freqId === freqId)?.id)
      .filter((id): id is string => Boolean(id));
    return Array.from(new Set(extraId ? [...ids, extraId] : ids));
  }

  function syncActiveState(extraId?: string) {
    clearAllActiveArchetypes();
    runningArchetypeIds(extraId)
      .slice(0, MAX_ACTIVE_ARCHETYPES)
      .forEach((id) => addActiveArchetype(id));
  }

  function activate(a: Archetype) {
    const actualRunning = runningArchetypeIds();
    if (!actualRunning.includes(a.id) && actualRunning.length >= MAX_ACTIVE_ARCHETYPES) {
      toast.error(
        "Limite de 3 arquétipos ativos. Pare uma frequência ativa ou pare o loop da determinação.",
      );
      return;
    }
    if (!isRunning(a.freqId)) {
      start({ freqId: a.freqId, carrier: a.carrier, beat: a.beat, minutes: DEFAULT_DURATION });
    }
    const ok = addActiveArchetype(a.id);
    if (!ok && !activeIds.includes(a.id)) {
      syncActiveState(a.id);
    }
    bumpSession(DEFAULT_DURATION, { archetypeId: a.id, frequencyIds: [a.freqId] });
    toast(`Arquétipo ativo · ${a.name}`, {
      description: `${a.carrier} Hz · batida ${a.beat} Hz (${a.bandLabel}) — som binaural, use fones`,
    });
  }

  function deactivate(a: Archetype) {
    removeActiveArchetype(a.id);
    if (isRunning(a.freqId)) stop(a.freqId);
    toast("Arquétipo desligado", { description: a.name });
  }

  function toggleAudio(a: Archetype) {
    if (isRunning(a.freqId)) {
      stop(a.freqId);
      removeActiveArchetype(a.id);
      toast("Frequência encerrada", { description: a.name });
    } else {
      start({ freqId: a.freqId, carrier: a.carrier, beat: a.beat, minutes: DEFAULT_DURATION });
      addActiveArchetype(a.id);
      bumpSession(DEFAULT_DURATION, { archetypeId: a.id, frequencyIds: [a.freqId] });
      toast(`Frequência ativa · ${a.name}`, { description: `${a.carrier}/${a.beat} Hz binaural` });
    }
  }

  const classicos = ARCHETYPES.filter((a) => a.group === "classico");
  const ancestrais = ARCHETYPES.filter((a) => a.group === "ancestral");

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 pb-32 pt-10">
        {/* Header */}
        <div className="mb-12">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">
            Módulo 03 · Arquétipos
          </div>
          <h1 className="text-3xl font-light text-foreground md:text-4xl">Estados operacionais</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Cada arquétipo representa um <span className="text-foreground">estado mental específico</span>{" "}
            com sua própria assinatura sonora binaural. Ao ativar um arquétipo, a frequência entra
            automaticamente em execução, calibrando seu cérebro para operar naquele modo.
          </p>

          {/* Key concepts */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="glass-panel rounded-lg p-4">
              <div className="mb-2 text-2xl">◼</div>
              <div className="text-sm font-medium text-foreground">Estado mental</div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                Cada arquétipo ativa um modo operacional diferente — estabilidade, liderança, precisão, etc.
              </div>
            </div>
            <div className="glass-panel rounded-lg p-4">
              <div className="mb-2 text-2xl">≈</div>
              <div className="text-sm font-medium text-foreground">Assinatura sonora</div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                Frequências binaurais calibradas (portadora + batida) que induzem a onda cerebral associada.
              </div>
            </div>
            <div className="glass-panel rounded-lg p-4">
              <div className="mb-2 text-2xl">◬</div>
              <div className="text-sm font-medium text-foreground">Protocolo de uso</div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                Instruções de postura, ambiente e comportamento para maximizar o efeito do arquétipo.
              </div>
            </div>
          </div>

          {!canActivate && (
            <div className="mt-6 flex items-center gap-3 rounded-lg border border-border/40 bg-card/40 px-4 py-3">
              <span className="text-[10px] text-muted-foreground">
                Plano Grátis · Explore todos os arquétipos abaixo. Para ativar as frequências, faça upgrade.
              </span>
              <Link
                to="/planos"
                className="text-mono text-tracked shrink-0 rounded-full border border-signal/40 px-3 py-1 text-[9px] text-signal hover:bg-signal/10"
              >
                Ver planos
              </Link>
            </div>
          )}
        </div>

        {/* Main layout */}
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
                  const isAct = activeIds.includes(a.id);
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
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-sm font-medium text-foreground">{a.name}</span>
                          {isAct && (
                            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-signal" />
                          )}
                        </div>
                        <div className="truncate text-[11px] text-muted-foreground">{a.function}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ancestrais */}
            <div>
              {isPremium ? (
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
                    como o eixo do céu. A tecnologia sonora moderna apenas trocou os tambores, cantos e
                    mantras por frequências digitais.
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
                    {ancestrais.map((a) => {
                      const isSel = selected.id === a.id;
                      const isAct = activeIds.includes(a.id);
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
                            <div className="flex items-center gap-1.5">
                              <span className="truncate text-sm font-medium text-foreground">{a.name}</span>
                              {isAct && (
                                <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-signal" />
                              )}
                            </div>
                            <div className="truncate text-[11px] text-muted-foreground">{a.function}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="glass-panel rounded-lg border border-border/30 p-4">
                  <div className="text-mono text-tracked mb-2 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>B · Sete Forças Ancestrais</span>
                    <span className="text-[9px] text-elite">↑ Premium</span>
                  </div>
                  <p className="mb-4 text-xs text-muted-foreground leading-relaxed">
                    Há uma curiosidade simbólica nisso tudo:{" "}
                    <span className="text-foreground/60">
                      o Leão impõe, a Águia enxerga, a Coruja compreende, o Rei organiza, o Tigre
                      conquista, o Cavalo avança, o Sábio decifra e o Golfinho conecta.
                    </span>{" "}
                    13 arquétipos ancestrais com assinaturas sonoras profundas.
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
                    {ancestrais.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setSelected(a)}
                        className={`glass-panel flex items-center gap-3 rounded-lg p-3 text-left transition-all ${
                          selected.id === a.id ? "border-signal/60" : "hover:border-foreground/40"
                        }`}
                      >
                        <span className={`text-2xl ${selected.id === a.id ? "text-signal" : "text-foreground/70"}`}>
                          {a.glyph}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-foreground">{a.name}</div>
                          <div className="truncate text-[11px] text-muted-foreground">{a.function}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <Link
                    to="/planos"
                    className="text-mono text-tracked mt-4 flex items-center justify-center gap-2 rounded-full border border-signal/30 px-4 py-2 text-[11px] text-signal hover:bg-signal/10 transition-colors"
                  >
                    Desbloquear com Plano Premium
                  </Link>
                </div>
              )}
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
                    {" "}
                    Hz portadora
                  </span>
                </div>
                <div className="text-foreground">
                  <span className="text-2xl font-light">{selected.beat}</span>
                  <span className="text-mono text-tracked text-[10px] text-muted-foreground">
                    {" "}
                    Hz batida
                  </span>
                </div>
                <div className="text-mono text-tracked text-[10px] text-elite">
                  {selected.bandLabel}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="border-t border-border/60 p-6">
              {canActivate ? (
                <>
                  {/* Ancestral archetypes require premium */}
                  {selected.group === "ancestral" && !isPremium ? (
                    <div className="text-center">
                      <p className="mb-3 text-[11px] text-muted-foreground">
                        Arquétipos ancestrais estão disponíveis no Plano Premium.
                      </p>
                      <Link
                        to="/planos"
                        className="text-mono text-tracked inline-flex items-center gap-2 rounded-full border border-signal/30 px-6 py-3 text-[11px] text-signal hover:bg-signal/10 transition-colors"
                      >
                        Ver planos de acesso
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {isActive ? (
                          <button
                            onClick={() => deactivate(selected)}
                            className="text-mono text-tracked w-full rounded-full bg-destructive px-6 py-3 text-[11px] text-destructive-foreground"
                          >
                            Desligar {selected.name}
                          </button>
                        ) : (
                          <button
                            onClick={() => activate(selected)}
                            className="text-mono text-tracked w-full rounded-full bg-foreground px-6 py-3 text-[11px] text-background"
                          >
                            Ativar {selected.name}
                          </button>
                        )}
                        <button
                          onClick={() => toggleAudio(selected)}
                          className="text-mono text-tracked w-full rounded-full border border-border/60 px-6 py-3 text-[11px] text-foreground hover:border-signal/60"
                        >
                          {audioOn ? "Pausar frequência" : "Tocar apenas frequência"}
                        </button>
                        <a
                          href="/app"
                          className="text-mono text-tracked w-full rounded-full border border-signal/40 px-6 py-3 text-center text-[11px] text-signal hover:bg-signal/10"
                        >
                          Ver todos ativos
                        </a>
                      </div>
                      <p className="mt-3 text-center text-[10px] text-muted-foreground">
                        Som binaural verdadeiro (canais separados L/R). Use fones — várias frequências rodam
                        em sobreposição.
                      </p>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <p className="mb-3 text-[11px] text-muted-foreground">
                    Para ativar arquétipos e reproduzir as frequências, faça upgrade do seu plano.
                  </p>
                  <Link
                    to="/planos"
                    className="text-mono text-tracked inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[11px] text-background hover:bg-foreground/90 transition-colors"
                  >
                    Ver planos de acesso
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
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
