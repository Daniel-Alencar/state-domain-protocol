/**
 * Motor binaural — Web Audio API.
 * Dois osciladores (esquerdo / direito) separados por `beat` Hz geram
 * a batida binaural percebida pelo cérebro. Requer fones de ouvido.
 */

type EngineState = {
  ctx: AudioContext;
  left: OscillatorNode;
  right: OscillatorNode;
  gain: GainNode;
  freqId: string;
  startedAt: number;
  durationMs: number;
};

let state: EngineState | null = null;
type Listener = (status: { freqId: string | null; running: boolean; elapsed: number; duration: number }) => void;
const listeners = new Set<Listener>();
let raf: number | null = null;

function emit() {
  const status = getStatus();
  listeners.forEach((l) => l(status));
}

function tick() {
  emit();
  if (state) {
    const elapsed = Date.now() - state.startedAt;
    if (elapsed >= state.durationMs) {
      stop();
      return;
    }
    raf = requestAnimationFrame(tick);
  }
}

export function start(opts: {
  freqId: string;
  carrier: number;
  beat: number;
  minutes: number;
  volume?: number;
}) {
  stop();
  const AC: typeof AudioContext =
    (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
  const ctx = new AC();

  const merger = ctx.createChannelMerger(2);
  const gain = ctx.createGain();
  gain.gain.value = 0;

  const left = ctx.createOscillator();
  const right = ctx.createOscillator();
  left.type = "sine";
  right.type = "sine";
  left.frequency.value = opts.carrier;
  right.frequency.value = opts.carrier + opts.beat;

  const lGain = ctx.createGain();
  const rGain = ctx.createGain();
  lGain.gain.value = 1;
  rGain.gain.value = 1;

  left.connect(lGain).connect(merger, 0, 0);
  right.connect(rGain).connect(merger, 0, 1);
  merger.connect(gain).connect(ctx.destination);

  const target = opts.volume ?? 0.18;
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(target, now + 1.2);

  left.start();
  right.start();

  state = {
    ctx,
    left,
    right,
    gain,
    freqId: opts.freqId,
    startedAt: Date.now(),
    durationMs: opts.minutes * 60_000,
  };

  if (raf) cancelAnimationFrame(raf);
  raf = requestAnimationFrame(tick);
  emit();
}

export function stop() {
  if (!state) return;
  const { ctx, left, right, gain } = state;
  const now = ctx.currentTime;
  try {
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.4);
  } catch {
    /* noop */
  }
  setTimeout(() => {
    try { left.stop(); } catch { /* noop */ }
    try { right.stop(); } catch { /* noop */ }
    try { ctx.close(); } catch { /* noop */ }
  }, 500);
  state = null;
  if (raf) cancelAnimationFrame(raf);
  raf = null;
  emit();
}

export function getStatus() {
  if (!state) return { freqId: null, running: false, elapsed: 0, duration: 0 };
  return {
    freqId: state.freqId,
    running: true,
    elapsed: Date.now() - state.startedAt,
    duration: state.durationMs,
  };
}

export function subscribe(l: Listener) {
  listeners.add(l);
  l(getStatus());
  return () => {
    listeners.delete(l);
  };
}
