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
const sessions = new Map<string, Session>();

type Listener = (active: SessionStatus[]) => void;
const listeners = new Set<Listener>();
let raf: number | null = null;

function ensureCtx(): AudioContext {
  if (!ctx) {
    const AC: typeof AudioContext =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
  }
  // iOS exige resume após interação
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
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
  merger.connect(gain).connect(audio.destination);

  // Volume mais baixo quando há sobreposição, para não saturar.
  const baseTarget = opts.volume ?? 0.16;
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
