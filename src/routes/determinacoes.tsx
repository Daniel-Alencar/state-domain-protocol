import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  addDetermination,
  removeDetermination,
  setActiveDetermination,
  useActiveDetermination,
  useDeterminations,
  type Determination,
} from "@/lib/determinations";
import { ARCHETYPES, getArchetype } from "@/lib/archetypes";
import {
  addActiveArchetype,
  useActiveArchetypes,
} from "@/lib/active-state";
import { start, isRunning, stop } from "@/lib/binaural-engine";
import { analyzeDetermination } from "@/lib/determinations.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

export const Route = createFileRoute("/determinacoes")({
  head: () => ({ meta: [{ title: "Determinações · Protocolo Soberano" }] }),
  component: Determinacoes,
});

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
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

function Determinacoes() {
  const items = useDeterminations();
  const activeId = useActiveDetermination();
  const activeArchetypes = useActiveArchetypes();
  const analyze = useServerFn(analyzeDetermination);

  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [title, setTitle] = useState("");
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [suggested, setSuggested] = useState<string[]>([]);
  const [rationale, setRationale] = useState("");

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recogRef = useRef<SpeechRecognitionLike | null>(null);

  async function startRec() {
    try {
      setTranscript("");
      setPendingBlob(null);
      setSuggested([]);
      setRationale("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
        setPendingBlob(blob);
      };
      mr.start();
      mediaRef.current = mr;

      const Recog = getSpeechRecognition();
      if (Recog) {
        const r = new Recog();
        r.lang = "pt-BR";
        r.continuous = true;
        r.interimResults = true;
        r.onresult = (e) => {
          let text = "";
          for (let i = 0; i < e.results.length; i++) {
            text += e.results[i][0].transcript + " ";
          }
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

  async function runAnalysis(text: string) {
    if (!text || text.length < 3) {
      toast.error("Transcrição vazia. Escreva o conteúdo abaixo para a IA analisar.");
      return;
    }
    setAnalyzing(true);
    try {
      const res = await analyze({ data: { transcript: text } });
      setSuggested(res.suggestedArchetypes);
      setRationale(res.rationale);
      if (res.suggestedArchetypes.length === 0) toast("IA não retornou sugestão. Você pode salvar mesmo assim.");
    } catch (err) {
      console.error(err);
      toast.error("Falha ao analisar.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function save() {
    if (!pendingBlob) { toast.error("Grave o áudio primeiro."); return; }
    const text = transcript.trim();
    const dataUrl = await blobToDataUrl(pendingBlob);
    const det = addDetermination({
      title: title.trim() || `Determinação ${new Date().toLocaleString("pt-BR")}`,
      transcript: text,
      audioDataUrl: dataUrl,
      suggestedArchetypes: suggested,
    });
    toast.success("Determinação salva.");
    // limpa formulário
    setPendingBlob(null);
    setTranscript("");
    setTitle("");
    setSuggested([]);
    setRationale("");
    return det;
  }

  function play(d: Determination) {
    setActiveDetermination(d.id);
    toast.success(`Determinação em loop · ${d.title}`);
  }

  function stopPlay() {
    setActiveDetermination(null);
  }

  function activateSuggestion(ids: string[]) {
    ids.forEach((id) => {
      const a = getArchetype(id);
      if (!a) return;
      addActiveArchetype(id);
      if (!isRunning(a.freqId)) {
        start({ freqId: a.freqId, carrier: a.carrier, beat: a.beat, minutes: 25 });
      }
    });
    toast.success(`${ids.length} arquétipo(s) acionado(s). Use fones.`);
  }

  useEffect(() => () => stopRec(), []); // cleanup

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 pb-32 pt-10">
        <div className="mb-8">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Módulo 07 · Determinações</div>
          <h1 className="text-3xl font-light text-foreground md:text-4xl">Voz em loop sobre frequência</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Grave sua própria voz declarando uma determinação. Enquanto escuta as
            frequências dos arquétipos, esta gravação roda em loop ilimitado.
          </p>
        </div>

        <div className="glass-panel mb-8 rounded-lg border border-elite/40 p-4">
          <div className="text-mono text-tracked mb-2 text-[10px] text-elite">Disclaimer</div>
          <p className="text-xs leading-relaxed text-foreground/80">
            A determinação ouvida deve guardar <span className="text-foreground">relação direta</span> com
            os arquétipos acionados. Após a gravação, a IA do Protocolo analisa o
            conteúdo e sugere quais arquétipos podem ser ouvidos individualmente
            ou em conjunto sem conflito com o que está sendo declarado.
          </p>
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
                <button
                  onClick={startRec}
                  className="text-mono text-tracked rounded-full bg-foreground px-5 py-2 text-[11px] text-background"
                >
                  ● Iniciar gravação
                </button>
              ) : (
                <button
                  onClick={stopRec}
                  className="text-mono text-tracked rounded-full bg-destructive px-5 py-2 text-[11px] text-destructive-foreground"
                >
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
                className="mt-1 w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm text-foreground focus:outline-none focus:border-signal/60"
              />
            </div>
            <div>
              <label className="text-mono text-tracked text-[9px] text-muted-foreground">Transcrição (auto / editável)</label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={3}
                placeholder="Se o navegador não suportar transcrição automática, digite aqui o que foi gravado para a IA analisar."
                className="mt-1 w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm text-foreground focus:outline-none focus:border-signal/60"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              disabled={!pendingBlob || analyzing}
              onClick={() => runAnalysis(transcript)}
              className="text-mono text-tracked rounded-full border border-signal/60 px-5 py-2 text-[11px] text-signal disabled:opacity-50"
            >
              {analyzing ? "Analisando…" : "Analisar com IA"}
            </button>
            <button
              disabled={!pendingBlob}
              onClick={save}
              className="text-mono text-tracked rounded-full bg-signal px-5 py-2 text-[11px] text-background disabled:opacity-40"
            >
              Salvar determinação
            </button>
            {pendingBlob && (
              <span className="text-mono text-tracked text-[10px] text-muted-foreground">
                Áudio pronto · {(pendingBlob.size / 1024).toFixed(0)} KB
              </span>
            )}
          </div>

          {suggested.length > 0 && (
            <div className="mt-5 rounded-md border border-signal/30 bg-signal/5 p-4">
              <div className="text-mono text-tracked mb-2 text-[9px] text-signal">Sugestão da IA</div>
              <p className="mb-3 text-xs text-foreground/80">{rationale}</p>
              <div className="flex flex-wrap gap-2">
                {suggested.map((id) => {
                  const a = getArchetype(id);
                  if (!a) return null;
                  return (
                    <span key={id} className="rounded-full border border-signal/40 px-3 py-1 text-[11px] text-foreground">
                      {a.glyph} {a.name}
                    </span>
                  );
                })}
              </div>
              <button
                onClick={() => activateSuggestion(suggested)}
                className="text-mono text-tracked mt-3 rounded-full bg-foreground px-4 py-1.5 text-[10px] text-background"
              >
                Acionar arquétipos sugeridos
              </button>
            </div>
          )}
        </section>

        {/* ===== Lista ===== */}
        <section className="mt-10">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Suas determinações</div>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma gravação ainda.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {items.map((d) => {
                const isActive = activeId === d.id;
                return (
                  <div key={d.id} className={`glass-panel rounded-lg p-4 ${isActive ? "border-signal/60" : ""}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium text-foreground">{d.title}</span>
                          {isActive && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />}
                        </div>
                        <div className="text-mono text-tracked text-[9px] text-muted-foreground">
                          {new Date(d.createdAt).toLocaleString("pt-BR")}
                        </div>
                      </div>
                      <button
                        onClick={() => removeDetermination(d.id)}
                        className="text-mono text-tracked rounded-full border border-border/60 px-2 py-0.5 text-[9px] text-muted-foreground hover:text-destructive"
                      >
                        excluir
                      </button>
                    </div>
                    {d.transcript && <p className="mt-2 line-clamp-3 text-xs text-foreground/80">{d.transcript}</p>}
                    {d.suggestedArchetypes.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {d.suggestedArchetypes.map((id) => {
                          const a = getArchetype(id);
                          if (!a) return null;
                          const on = activeArchetypes.includes(id);
                          return (
                            <button
                              key={id}
                              onClick={() => {
                                addActiveArchetype(id);
                                if (!isRunning(a.freqId)) {
                                  start({ freqId: a.freqId, carrier: a.carrier, beat: a.beat, minutes: 25 });
                                }
                              }}
                              className={`rounded-full border px-2 py-0.5 text-[10px] ${on ? "border-signal text-signal" : "border-border/60 text-muted-foreground hover:text-foreground"}`}
                            >
                              {a.glyph} {a.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      {isActive ? (
                        <button
                          onClick={stopPlay}
                          className="text-mono text-tracked rounded-full bg-destructive px-4 py-1.5 text-[10px] text-destructive-foreground"
                        >
                          Parar loop
                        </button>
                      ) : (
                        <button
                          onClick={() => play(d)}
                          className="text-mono text-tracked rounded-full bg-foreground px-4 py-1.5 text-[10px] text-background"
                        >
                          ▶ Tocar em loop
                        </button>
                      )}
                      <audio src={d.audioDataUrl} controls className="h-8 max-w-[180px]" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
