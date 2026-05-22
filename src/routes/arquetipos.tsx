import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ARCHETYPES, type Archetype } from "@/lib/archetypes";
import {
  addActiveArchetype,
  removeActiveArchetype,
  useActiveArchetypes,
  bumpSession,
} from "@/lib/active-state";
import { start, stop, isRunning } from "@/lib/binaural-engine";
import { toast } from "sonner";

export const Route = createFileRoute("/arquetipos")({
  head: () => ({ meta: [{ title: "Arquétipos · Protocolo Soberano" }] }),
  component: Arquetipos,
});

const DEFAULT_DURATION = 25; // minutos

function Arquetipos() {
  const [selected, setSelected] = useState<Archetype>(ARCHETYPES[0]);
  const activeIds = useActiveArchetypes();
  const isActive = activeIds.includes(selected.id);
  const audioOn = isRunning(selected.freqId);

  function activate(a: Archetype) {
    addActiveArchetype(a.id);
    if (!isRunning(a.freqId)) {
      start({ freqId: a.freqId, carrier: a.carrier, beat: a.beat, minutes: DEFAULT_DURATION });
      bumpSession(DEFAULT_DURATION, { archetypeId: a.id, frequencyIds: [a.freqId] });
    }
    toast(`Arquétipo ativo · ${a.name}`, {
      description: `${a.carrier} Hz · batida ${a.beat} Hz (${a.band}) — som binaural, use fones`,
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
      toast("Frequência encerrada", { description: a.name });
    } else {
      start({ freqId: a.freqId, carrier: a.carrier, beat: a.beat, minutes: DEFAULT_DURATION });
      bumpSession(DEFAULT_DURATION, { archetypeId: a.id, frequencyIds: [a.freqId] });
      toast(`Frequência ativa · ${a.name}`, { description: `${a.carrier}/${a.beat} Hz binaural` });
    }
  }

  const classicos = ARCHETYPES.filter((a) => a.group === "classico");
  const ancestrais = ARCHETYPES.filter((a) => a.group === "ancestral");

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 pb-32 pt-10">
        <div className="mb-10">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Módulo 03 · Arquétipos</div>
          <h1 className="text-3xl font-light text-foreground md:text-4xl">Estados operacionais</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Cada arquétipo carrega sua própria assinatura sonora. Ao ativar, a
            frequência do arquétipo entra automaticamente em execução.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <ArchetypeGroup
              title="Arquétipos Clássicos"
              code="A"
              items={classicos}
              selectedId={selected.id}
              activeId={activeId}
              onSelect={setSelected}
            />

            <div className="glass-panel rounded-lg border border-elite/30 p-4">
              <div className="text-mono text-tracked mb-2 text-[10px] text-elite">B · Sete Forças Ancestrais</div>
              <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                Há uma curiosidade simbólica nisso tudo: <span className="text-foreground">o Leão impõe, a Águia enxerga, a Coruja compreende, o Rei organiza, o Tigre conquista, o Cavalo avança, o Sábio decifra e o Golfinho conecta.</span> Civilizações antigas estruturavam seus mitos em torno dessas forças humanas — e o trabalho da Águia, em três alturas (força, visão e elevação), foi sempre tratado como o eixo do céu. A tecnologia sonora moderna apenas trocou os tambores, cantos e mantras por frequências digitais.
              </p>
              <ArchetypeGroup
                title=""
                code=""
                items={ancestrais}
                selectedId={selected.id}
                activeId={activeId}
                onSelect={setSelected}
                inline
              />
            </div>
          </div>

          <div className="glass-panel sticky top-6 h-fit overflow-hidden rounded-xl">
            <div className="relative border-b border-border/60 p-8">
              <div
                className="absolute inset-0 opacity-30"
                style={{ background: "radial-gradient(circle at 30% 20%, color-mix(in oklab, var(--signal) 30%, transparent), transparent 60%)" }}
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
              <div className="text-mono text-tracked mb-3 text-[9px] text-signal">Características</div>
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
              <div className="text-mono text-tracked mb-2 text-[9px] text-signal">Assinatura sonora</div>
              <div className="flex items-baseline justify-between">
                <div className="text-foreground">
                  <span className="text-2xl font-light">{selected.carrier}</span>
                  <span className="text-mono text-tracked text-[10px] text-muted-foreground"> Hz portadora</span>
                </div>
                <div className="text-foreground">
                  <span className="text-2xl font-light">{selected.beat}</span>
                  <span className="text-mono text-tracked text-[10px] text-muted-foreground"> Hz batida</span>
                </div>
                <div className="text-mono text-tracked text-[10px] text-elite">{selected.band}</div>
              </div>
            </div>

            <div className="border-t border-border/60 p-6">
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  onClick={() => activate(selected)}
                  disabled={isActive && audioOn}
                  className="text-mono text-tracked w-full rounded-full bg-foreground px-6 py-3 text-[11px] text-background transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
                >
                  {isActive && audioOn ? "Arquétipo em execução" : `Ativar ${selected.name}`}
                </button>
                <button
                  onClick={() => toggleAudio(selected)}
                  className="text-mono text-tracked w-full rounded-full border border-border/60 px-6 py-3 text-[11px] text-foreground hover:border-signal/60"
                >
                  {audioOn ? "Pausar frequência" : "Apenas tocar frequência"}
                </button>
              </div>
              <p className="mt-3 text-center text-[10px] text-muted-foreground">
                Use fones de ouvido. Várias frequências podem rodar em sobreposição.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ArchetypeGroup({
  title, code, items, selectedId, activeId, onSelect, inline,
}: {
  title: string;
  code: string;
  items: Archetype[];
  selectedId: string;
  activeId: string | null;
  onSelect: (a: Archetype) => void;
  inline?: boolean;
}) {
  return (
    <div>
      {!inline && (
        <div className="mb-3 flex items-center gap-2 text-mono text-tracked text-[10px] text-signal">
          <span>{code}</span>
          <span className="text-muted-foreground">·</span>
          <span>{title}</span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
        {items.map((a) => {
          const isSel = selectedId === a.id;
          const isAct = activeId === a.id;
          return (
            <button
              key={a.id}
              onClick={() => onSelect(a)}
              className={`glass-panel flex items-center gap-3 rounded-lg p-3 text-left transition-all ${
                isSel ? "border-signal/60" : "hover:border-foreground/40"
              }`}
            >
              <span className={`text-2xl ${isSel ? "text-signal" : "text-foreground/70"}`}>{a.glyph}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-medium text-foreground">{a.name}</span>
                  {isAct && <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-signal" />}
                </div>
                <div className="truncate text-[11px] text-muted-foreground">{a.function}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
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
