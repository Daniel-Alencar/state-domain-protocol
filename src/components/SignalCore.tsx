type Props = {
  label?: string;
  glyph?: string;
  state?: string;
};

export function SignalCore({ label = "Rocha", glyph = "◼", state = "Frequência base" }: Props) {
  return (
    <div className="relative flex aspect-square w-full max-w-[420px] items-center justify-center">
      {/* Outer orbit rings */}
      <div className="absolute inset-0 rounded-full border border-border/60 animate-orbit-slow">
        <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" />
      </div>
      <div className="absolute inset-8 rounded-full border border-border/40 animate-orbit-reverse">
        <div className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-elite" />
      </div>
      <div className="absolute inset-16 rounded-full border border-border/30" />

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
