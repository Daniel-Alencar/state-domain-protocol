import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  addDetermination,
  removeDetermination,
  updateDetermination,
  setActiveDetermination,
  useActiveDetermination,
  useDeterminations,
  useDeterminationVolume,
  setDeterminationVolume,
  type Determination,
} from "@/lib/determinations";
import { ARCHETYPES, getArchetype, type Archetype } from "@/lib/archetypes";
import {
  addActiveArchetype,
  useActiveArchetypes,
  MAX_ACTIVE_ARCHETYPES,
} from "@/lib/active-state";
import {
  start,
  isRunning,
  stop,
  setMasterVolume,
  getMasterVolume,
} from "@/lib/binaural-engine";
import { analyzeDetermination } from "@/lib/determinations.functions";
import { useServerFn } from "@tanstack/react-start";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export const Route = createFileRoute("/determinacoes")({
  head: () => ({ meta: [{ title: "Determinações · Protocolo Soberano" }] }),
  component: Determinacoes,
});

type SpeechRecognitionLike = {
  lang: string; continuous: boolean; interimResults: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void; stop: () => void;
};

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

function activateOne(a: Archetype) {
  const ok = addActiveArchetype(a.id);
  if (!ok) return false;
  if (!isRunning(a.freqId)) {
    start({ freqId: a.freqId, carrier: a.carrier, beat: a.beat, minutes: 25 });
  }
  return true;
}

function Determinacoes() {
  const items = useDeterminations();
  const activeId = useActiveDetermination();
  const activeArchetypes = useActiveArchetypes();
  const analyze = useServerFn(analyzeDetermination);
  const detVolume = useDeterminationVolume();
  const [masterVol, setMasterVol] = useState<number>(() => getMasterVolume());

  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [title, setTitle] = useState("");
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recogRef = useRef<SpeechRecognitionLike | null>(null);

  async function startRec() {
    try {
      setTranscript(""); setPendingBlob(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setPendingBlob(new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" }));
      };
      mr.start();
      mediaRef.current = mr;

      const Recog = getSpeechRecognition();
      if (Recog) {
        const r = new Recog();
        r.lang = "pt-BR"; r.continuous = true; r.interimResults = true;
        r.onresult = (e) => {
          let text = "";
          for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript + " ";
          setTranscript(text.trim());
        };
        r.onerror = () => { /* ignore */ };
        r.onend = () => { /* ignore */ };
        try { r.start(); recogRef.current = r; } catch { /* noop */ }
      }
      setRecording(true);
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível acessar o microfone.");
    }
  }

  function stopRec() {
    mediaRef.current?.stop();
    if (recogRef.current) { try { recogRef.current.stop(); } catch { /* noop */ } recogRef.current = null; }
    setRecording(false);
  }

  /** Analisa com IA E salva — fluxo único. */
  async function analyzeAndSave() {
    if (!pendingBlob) { toast.error("Grave o áudio primeiro."); return; }
    const text = transcript.trim();
    let suggested: string[] = [];
    let rationale = "";

    if (text.length >= 3) {
      setAnalyzing(true);
      try {
        const res = await analyze({ data: { transcript: text } });
        suggested = res.suggestedArchetypes ?? [];
        rationale = res.rationale ?? "";
      } catch (err) {
        console.error(err);
        toast("IA indisponível agora — salvando sem sugestão.");
      } finally {
        setAnalyzing(false);
      }
    } else {
      toast("Sem transcrição — salvando o áudio sem análise da IA.");
    }

    const dataUrl = await blobToDataUrl(pendingBlob);
    addDetermination({
      title: title.trim() || `Determinação ${new Date().toLocaleString("pt-BR")}`,
      transcript: text,
      audioDataUrl: dataUrl,
      suggestedArchetypes: suggested,
      rationale,
      preset: suggested.slice(0, MAX_ACTIVE_ARCHETYPES),
    });
    toast.success(rationale ? "Determinação analisada e salva." : "Determinação salva.");
    setPendingBlob(null); setTranscript(""); setTitle("");
  }

  function play(d: Determination) {
    // pré-programados acionam automaticamente os arquétipos (até 3)
    const preset = (d.preset ?? d.suggestedArchetypes ?? []).slice(0, MAX_ACTIVE_ARCHETYPES);
    let activated = 0;
    for (const id of preset) {
      const a = getArchetype(id); if (!a) continue;
      if (activeArchetypes.length + activated >= MAX_ACTIVE_ARCHETYPES) break;
      if (activateOne(a)) activated++;
    }
    setActiveDetermination(d.id);
    toast.success(`Loop ativo · ${d.title}`, {
      description: activated ? `${activated} arquétipo(s) acionado(s) automaticamente.` : undefined,
    });
  }

  function stopPlay() { setActiveDetermination(null); }

  useEffect(() => () => stopRec(), []);

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 pb-32 pt-10">
        <div className="mb-8">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Módulo 07 · Determinações</div>
          <h1 className="text-3xl font-light text-foreground md:text-4xl">Voz em loop sobre frequência</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Grave sua voz declarando uma determinação. Enquanto escuta as frequências
            dos arquétipos, esta gravação roda em loop ilimitado — mesmo com a tela
            do celular desligada (até você sair do site ou parar manualmente).
          </p>
        </div>

        {/* ===== Engenharia de Volumes ===== */}
        <div className="glass-panel mb-6 rounded-xl p-5">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Engenharia de volumes</div>
          <div className="grid gap-5 md:grid-cols-2">
            <VolumeControl
              label="Voz (sua determinação)"
              hint="Recomendado: 100% — clara, nítida, no centro."
              value={detVolume}
              onChange={setDeterminationVolume}
            />
            <VolumeControl
              label="Frequências (arquétipos)"
              hint="Recomendado: 30–40% — colchão sonoro ao fundo."
              value={masterVol}
              onChange={(v) => { setMasterVol(v); setMasterVolume(v); }}
            />
          </div>
        </div>

        {/* ===== Regra do Teto + Disclaimer de bandas ===== */}
        <div className="glass-panel mb-8 rounded-lg border border-elite/40 p-4">
          <div className="text-mono text-tracked mb-2 text-[10px] text-elite">A regra do teto · máximo de 3 arquétipos</div>
          <p className="mb-3 text-xs leading-relaxed text-foreground/80">
            Não jogue 10 arquétipos na mesma esteira de áudio — o cérebro sofre
            sobrecarga de sinal. Máximo de <span className="text-foreground">3 por ciclo</span>
            (um para o corpo, um para a mente, um para o negócio).
          </p>
          <details className="text-xs">
            <summary className="cursor-pointer text-signal">Separação por frequência de batida (o segredo)</summary>
            <div className="mt-3 space-y-3 text-foreground/80">
              <p>
                Misture apenas arquétipos da mesma banda cerebral (ou bandas vizinhas).
                Misturar <span className="text-foreground">Beta (alerta)</span> com
                <span className="text-foreground"> Theta (sono)</span> gera paradoxo de comando.
              </p>
              <BandBreakdown />
            </div>
          </details>
        </div>

        {/* ===== Gravador ===== */}
        <section className="glass-panel rounded-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-mono text-tracked text-[9px] text-signal">Nova determinação</div>
              <div className="text-lg font-light text-foreground">Gravar voz</div>
            </div>
            <div className="flex items-center gap-2">
              {!recording ? (
                <button onClick={startRec} className="text-mono text-tracked rounded-full bg-foreground px-5 py-2 text-[11px] text-background">
                  ● Iniciar gravação
                </button>
              ) : (
                <button onClick={stopRec} className="text-mono text-tracked rounded-full bg-destructive px-5 py-2 text-[11px] text-destructive-foreground">
                  ■ Parar
                </button>
              )}
            </div>
          </div>

          {recording && (
            <div className="mb-4 flex items-center gap-2 text-[11px] text-signal">
              <span className="h-2 w-2 animate-pulse rounded-full bg-signal" />
              Gravando… fale sua determinação em primeira pessoa.
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
            <div>
              <label className="text-mono text-tracked text-[9px] text-muted-foreground">Título (opcional)</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex.: Foco para a entrega de sexta"
                className="mt-1 w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm text-foreground focus:border-signal/60 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-mono text-tracked text-[9px] text-muted-foreground">Transcrição (auto / editável)</label>
              <textarea
                value={transcript} onChange={(e) => setTranscript(e.target.value)} rows={3}
                placeholder="Se o navegador não suportar transcrição automática, digite aqui o que foi gravado para a IA analisar."
                className="mt-1 w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm text-foreground focus:border-signal/60 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              disabled={!pendingBlob || analyzing}
              onClick={analyzeAndSave}
              className="text-mono text-tracked rounded-full bg-signal px-5 py-2 text-[11px] text-background disabled:opacity-40"
            >
              {analyzing ? "Analisando…" : "Analisar com IA e salvar"}
            </button>
            {pendingBlob && (
              <span className="text-mono text-tracked text-[10px] text-muted-foreground">
                Áudio pronto · {(pendingBlob.size / 1024).toFixed(0)} KB
              </span>
            )}
          </div>
        </section>

        {/* ===== Lista ===== */}
        <section className="mt-10">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Suas determinações</div>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma gravação ainda.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {items.map((d) => (
                <DeterminationCard
                  key={d.id}
                  d={d}
                  isActive={activeId === d.id}
                  onPlay={() => play(d)}
                  onStop={stopPlay}
                  onRemove={() => removeDetermination(d.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function VolumeControl({
  label, hint, value, onChange,
}: { label: string; hint: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-mono text-tracked text-[9px] text-muted-foreground">{label}</span>
        <span className="text-mono text-tracked text-[10px] text-foreground">{Math.round(value * 100)}%</span>
      </div>
      <Slider value={[value * 100]} max={100} step={1} onValueChange={([v]) => onChange(v / 100)} />
      <p className="mt-1 text-[10px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function BandBreakdown() {
  const grouped = ARCHETYPES.reduce<Record<string, Archetype[]>>((acc, a) => {
    (acc[a.band] ??= []).push(a);
    return acc;
  }, {});
  const order: Archetype["band"][] = ["Delta", "Theta", "Alpha", "Beta", "Gamma"];
  return (
    <div className="grid gap-2 md:grid-cols-2">
      {order.map((b) =>
        grouped[b] ? (
          <div key={b} className="rounded-md border border-border/40 p-2">
            <div className="text-mono text-tracked mb-1 text-[9px] text-elite">
              {b} · mixes recomendados juntos
            </div>
            <div className="flex flex-wrap gap-1">
              {grouped[b].map((a) => (
                <span key={a.id} className="rounded-full border border-border/40 px-2 py-0.5 text-[10px]">
                  {a.glyph} {a.name} <span className="text-muted-foreground">· {a.beat} Hz</span>
                </span>
              ))}
            </div>
          </div>
        ) : null,
      )}
      <div className="rounded-md border border-destructive/40 bg-destructive/5 p-2 md:col-span-2">
        <div className="text-mono text-tracked mb-1 text-[9px] text-destructive">EVITAR misturas entre bandas opostas</div>
        <p className="text-[11px] text-foreground/80">
          Ex.: Tubarão (18 Hz Beta — alerta) com Fênix (5 Hz Theta — sono) no mesmo áudio
          gera paradoxo: o cérebro não sabe se acelera ou se dorme.
        </p>
      </div>
    </div>
  );
}

function DeterminationCard({
  d, isActive, onPlay, onStop, onRemove,
}: {
  d: Determination; isActive: boolean;
  onPlay: () => void; onStop: () => void; onRemove: () => void;
}) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(d.title);
  const [preset, setPreset] = useState<string[]>(
    (d.preset ?? d.suggestedArchetypes ?? []).slice(0, MAX_ACTIVE_ARCHETYPES),
  );

  function saveTitle() {
    const t = titleDraft.trim();
    if (t && t !== d.title) updateDetermination(d.id, { title: t });
    setEditingTitle(false);
  }

  function togglePreset(id: string) {
    setPreset((cur) => {
      let next: string[];
      if (cur.includes(id)) next = cur.filter((x) => x !== id);
      else if (cur.length >= MAX_ACTIVE_ARCHETYPES) {
        toast.error(`Máximo de ${MAX_ACTIVE_ARCHETYPES} arquétipos por mix.`);
        return cur;
      } else next = [...cur, id];
      updateDetermination(d.id, { preset: next });
      return next;
    });
  }

  return (
    <div className={`glass-panel rounded-lg p-4 ${isActive ? "border-signal/60" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {editingTitle ? (
              <input
                autoFocus value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") { setTitleDraft(d.title); setEditingTitle(false); } }}
                className="w-full rounded-md border border-signal/40 bg-background/60 px-2 py-1 text-sm text-foreground focus:outline-none"
              />
            ) : (
              <button onClick={() => { setTitleDraft(d.title); setEditingTitle(true); }} className="truncate text-left text-sm font-medium text-foreground hover:text-signal">
                {d.title}
              </button>
            )}
            {isActive && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />}
          </div>
          <div className="text-mono text-tracked text-[9px] text-muted-foreground">
            {new Date(d.createdAt).toLocaleString("pt-BR")} · toque no título para editar
          </div>
        </div>
        <button onClick={onRemove} className="text-mono text-tracked rounded-full border border-border/60 px-2 py-0.5 text-[9px] text-muted-foreground hover:text-destructive">
          excluir
        </button>
      </div>

      {d.transcript && <p className="mt-2 line-clamp-3 text-xs text-foreground/80">{d.transcript}</p>}

      <div className="mt-3 flex items-center gap-2">
        {isActive ? (
          <button onClick={onStop} className="text-mono text-tracked rounded-full bg-destructive px-4 py-1.5 text-[10px] text-destructive-foreground">
            Parar loop
          </button>
        ) : (
          <button onClick={onPlay} className="text-mono text-tracked rounded-full bg-foreground px-4 py-1.5 text-[10px] text-background">
            ▶ Tocar em loop
          </button>
        )}
        <audio src={d.audioDataUrl} controls className="h-8 max-w-[180px]" />
      </div>

      {/* Sugestão da IA + justificativa */}
      {(d.suggestedArchetypes?.length ?? 0) > 0 && (
        <div className="mt-3 rounded-md border border-signal/30 bg-signal/5 p-3">
          <div className="text-mono text-tracked mb-1 text-[9px] text-signal">Sugestão da IA</div>
          {d.rationale && <p className="mb-2 text-[11px] text-foreground/80">{d.rationale}</p>}
          <div className="flex flex-wrap gap-1">
            {d.suggestedArchetypes.map((id) => {
              const a = getArchetype(id); if (!a) return null;
              return (
                <span key={id} className="rounded-full border border-signal/40 px-2 py-0.5 text-[10px] text-foreground">
                  {a.glyph} {a.name} <span className="text-muted-foreground">· {a.bandLabel}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Pré-programação de arquétipos (até 3) — pré-aprovados pela IA */}
      <div className="mt-3 rounded-md border border-signal/40 bg-signal/5 p-3">
        <div className="text-mono text-tracked mb-2 flex items-center justify-between text-[9px] text-signal">
          <span>Pré-aprovados ({preset.length}/{MAX_ACTIVE_ARCHETYPES}) · acionam ao tocar em loop</span>
          <span className="text-muted-foreground">clique no × para remover</span>
        </div>

        {preset.length === 0 ? (
          <p className="text-[11px] text-muted-foreground">
            Nenhum arquétipo selecionado — tocará só a gravação.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {preset.map((id) => {
              const a = getArchetype(id); if (!a) return null;
              return (
                <button
                  key={id}
                  onClick={() => togglePreset(id)}
                  title="Remover do mix"
                  className="group inline-flex items-center gap-1 rounded-full border border-signal/60 bg-signal/10 px-2 py-0.5 text-[10px] text-foreground hover:border-destructive/60 hover:bg-destructive/10"
                >
                  <span>{a.glyph} {a.name}</span>
                  <span className="text-muted-foreground group-hover:text-destructive">×</span>
                </button>
              );
            })}
          </div>
        )}

        <details className="mt-2">
          <summary className="cursor-pointer text-[10px] text-signal">
            {preset.length < MAX_ACTIVE_ARCHETYPES ? "Adicionar / trocar arquétipos…" : "Trocar arquétipos…"}
          </summary>
          <div className="mt-2 max-h-44 overflow-y-auto pr-1">
            {(["Delta", "Theta", "Alpha", "Beta", "Gamma"] as const).map((band) => {
              const group = ARCHETYPES.filter((a) => a.band === band);
              if (group.length === 0) return null;
              return (
                <div key={band} className="mb-2">
                  <div className="text-mono text-tracked text-[9px] text-muted-foreground">{band}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {group.map((a) => {
                      const on = preset.includes(a.id);
                      return (
                        <button
                          key={a.id} onClick={() => togglePreset(a.id)}
                          className={`rounded-full border px-2 py-0.5 text-[10px] ${on ? "border-signal bg-signal/10 text-signal" : "border-border/60 text-muted-foreground hover:text-foreground"}`}
                        >
                          {a.glyph} {a.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      </div>
    </div>
  );
}
