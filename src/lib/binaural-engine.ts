/**
 * Motor binaural multi-canal — Web Audio API.
 * Permite múltiplas frequências em sobreposição. Cada sessão tem seu
 * próprio par de osciladores e ganho, mas todas compartilham o mesmo
 * AudioContext (mais leve em iOS/Android).
 *
 * Requer fones de ouvido — a batida só é percebida com canais separados.
 */

type Session = {
  left: OscillatorNode;
  right: OscillatorNode;
  gain: GainNode;
  merger: ChannelMergerNode;
  freqId: string;
  carrier: number;
  beat: number;
  startedAt: number;
  durationMs: number;
};

type SessionStatus = {
  freqId: string;
  carrier: number;
  beat: number;
  elapsed: number;
  duration: number;
};

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
// Volume "percebido" salvo (0..1, o que o slider mostra).
let masterVolume = 0.35;
// Escala aplicada ao GainNode para que o slider em 100% não estoure o ouvido
// quando combinado com voz por cima. 100% slider → 0.4 de ganho real.
const MASTER_SCALE = 0.4;
const sessions = new Map<string, Session>();

type Listener = (active: SessionStatus[]) => void;
const listeners = new Set<Listener>();
let raf: number | null = null;

const VOLUME_KEY = "ps:master-volume";
if (typeof window !== "undefined") {
  const stored = Number(window.localStorage.getItem(VOLUME_KEY));
  if (!Number.isNaN(stored) && stored > 0) masterVolume = stored;
}

function ensureCtx(): AudioContext {
  if (!ctx) {
    const AC: typeof AudioContext =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = masterVolume * MASTER_SCALE;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setMasterVolume(v: number) {
  masterVolume = Math.max(0, Math.min(1, v));
  if (typeof window !== "undefined") {
    window.localStorage.setItem(VOLUME_KEY, String(masterVolume));
  }
  if (masterGain && ctx) {
    masterGain.gain.setTargetAtTime(masterVolume * MASTER_SCALE, ctx.currentTime, 0.05);
  }
}

export function getMasterVolume() {
  return masterVolume;
}

function snapshot(): SessionStatus[] {
  const now = Date.now();
  return Array.from(sessions.values()).map((s) => ({
    freqId: s.freqId,
    carrier: s.carrier,
    beat: s.beat,
    elapsed: now - s.startedAt,
    duration: s.durationMs,
  }));
}

function emit() {
  const snap = snapshot();
  listeners.forEach((l) => l(snap));
}

function tick() {
  const now = Date.now();
  const expired: string[] = [];
  sessions.forEach((s, id) => {
    if (now - s.startedAt >= s.durationMs) expired.push(id);
  });
  expired.forEach((id) => stop(id));
  emit();
  if (sessions.size > 0) {
    raf = requestAnimationFrame(tick);
  } else {
    raf = null;
  }
}

export function start(opts: {
  freqId: string;
  carrier: number;
  beat: number;
  minutes: number;
  volume?: number;
}) {
  // Se já estiver tocando essa mesma freq, reinicia o contador.
  if (sessions.has(opts.freqId)) stop(opts.freqId);

  const audio = ensureCtx();
  const merger = audio.createChannelMerger(2);
  const gain = audio.createGain();
  gain.gain.value = 0;

  const left = audio.createOscillator();
  const right = audio.createOscillator();
  left.type = "sine";
  right.type = "sine";
  left.frequency.value = opts.carrier;
  right.frequency.value = opts.carrier + opts.beat;

  const lGain = audio.createGain();
  const rGain = audio.createGain();
  lGain.gain.value = 1;
  rGain.gain.value = 1;

  left.connect(lGain).connect(merger, 0, 0);
  right.connect(rGain).connect(merger, 0, 1);
  merger.connect(gain).connect(masterGain ?? audio.destination);

  // baseline por sessão; o masterGain controla o volume agregado das frequências.
  const baseTarget = opts.volume ?? 0.5;
  const overlapDamping = 1 / Math.max(1, sessions.size + 1);
  const target = baseTarget * Math.max(0.55, overlapDamping + 0.4);

  const now = audio.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(target, now + 1.2);

  left.start();
  right.start();

  sessions.set(opts.freqId, {
    left,
    right,
    gain,
    merger,
    freqId: opts.freqId,
    carrier: opts.carrier,
    beat: opts.beat,
    startedAt: Date.now(),
    durationMs: opts.minutes * 60_000,
  });

  void import("./wake-lock").then((m) => m.enableWakeLock());

  if (raf == null) raf = requestAnimationFrame(tick);
  emit();
}

export function stop(freqId: string) {
  const s = sessions.get(freqId);
  if (!s || !ctx) return;
  const now = ctx.currentTime;
  try {
    s.gain.gain.cancelScheduledValues(now);
    s.gain.gain.setValueAtTime(s.gain.gain.value, now);
    s.gain.gain.linearRampToValueAtTime(0, now + 0.4);
  } catch {
    /* noop */
  }
  setTimeout(() => {
    try { s.left.stop(); } catch { /* noop */ }
    try { s.right.stop(); } catch { /* noop */ }
  }, 500);
  sessions.delete(freqId);
  if (sessions.size === 0) void import("./wake-lock").then((m) => m.disableWakeLock());
  emit();
}

export function stopAll() {
  Array.from(sessions.keys()).forEach((id) => stop(id));
}

export function isRunning(freqId: string) {
  return sessions.has(freqId);
}

export function getActive(): SessionStatus[] {
  return snapshot();
}

export function subscribe(l: Listener) {
  listeners.add(l);
  l(snapshot());
  return () => {
    listeners.delete(l);
  };
}
