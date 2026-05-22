// Mantém o aparelho acordado enquanto houver áudio em execução.
// Em browsers que não suportam (iOS Safari antigo), falha silenciosamente.

let sentinel: WakeLockSentinel | null = null;
let active = false;

type WakeLockSentinel = { released: boolean; release: () => Promise<void>; addEventListener: (t: string, cb: () => void) => void };

async function acquire() {
  try {
    const nav = navigator as unknown as { wakeLock?: { request: (t: string) => Promise<WakeLockSentinel> } };
    if (!nav.wakeLock) return;
    sentinel = await nav.wakeLock.request("screen");
    sentinel.addEventListener("release", () => { sentinel = null; });
  } catch {
    /* iOS pode bloquear sem gesto */
  }
}

async function release() {
  try { await sentinel?.release(); } catch { /* noop */ }
  sentinel = null;
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (active && document.visibilityState === "visible" && !sentinel) void acquire();
  });
}

export function enableWakeLock() {
  if (active) return;
  active = true;
  void acquire();
}

export function disableWakeLock() {
  active = false;
  void release();
}
