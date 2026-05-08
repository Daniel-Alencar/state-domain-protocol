type Props = {
  label?: string;
  glyph?: string;
  state?: string;
};

export function SignalCore({ label = "Rocha", glyph = "◼", state = "Frequência base" }: Props) {
  return (
    <div className="relative flex aspect-square w-full max-w-[460px] items-center justify-center animate-breathe">
      {/* Outer cinematic rings */}
      <div className="absolute inset-0 rounded-full border border-border/40 animate-orbit-slow">
        <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" />
      </div>
      <div className="absolute inset-10 rounded-full border border-border/30 animate-orbit-reverse">
        <div className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-elite" />
      </div>
      <div className="absolute inset-20 rounded-full border border-border/20" />

      {/* Soft halo */}
      <div className="absolute inset-8 rounded-full" style={{
        background: "radial-gradient(circle, color-mix(in oklab, var(--signal) 18%, transparent) 0%, transparent 65%)",
        filter: "blur(20px)",
      }} />

      {/* Core */}
      <div className="relative flex h-44 w-44 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-signal/10 blur-2xl animate-pulse-signal" />
        <div className="absolute inset-2 rounded-full border border-signal/40 signal-ring animate-pulse-signal" />
        <div className="relative flex flex-col items-center gap-2">
          <span className="text-5xl text-signal" aria-hidden>{glyph}</span>
          <span className="text-mono text-tracked text-[10px] text-muted-foreground">{state}</span>
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
      </div>
    </div>
  );
}
