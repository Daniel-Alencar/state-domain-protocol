import { Link, useLocation } from "@tanstack/react-router";

const items = [
  { to: "/app", label: "Centro", code: "01" },
  { to: "/frequencias", label: "Frequência", code: "02" },
  { to: "/arquetipos", label: "Arquétipos", code: "03" },
  { to: "/networking", label: "Rede", code: "04" },
  { to: "/performance", label: "Performance", code: "05" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* faint grid */}
      <div className="pointer-events-none fixed inset-0 grid-faint opacity-[0.04]" />
      {/* radial vignette */}
      <div className="pointer-events-none fixed inset-0" style={{ background: "radial-gradient(ellipse at top, transparent 40%, rgba(0,0,0,0.8) 100%)" }} />

      <header className="relative z-10 flex items-center justify-between border-b border-border/60 px-6 py-4">
        <Link to="/app" className="flex items-center gap-3">
          <span className="text-signal text-lg">◬</span>
          <span className="text-mono text-tracked text-[10px] text-muted-foreground">Protocolo Soberano</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {items.map((item) => {
            const active = pathname === item.to || (item.to !== "/app" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-center gap-2 text-mono text-tracked text-[10px]"
              >
                <span className={active ? "text-signal" : "text-muted-foreground/60"}>{item.code}</span>
                <span className={active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-3 text-mono text-tracked text-[10px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-signal" />
          <span>Sinal · Estável</span>
        </div>
      </header>

      <main className="relative z-10">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/60 bg-background/90 backdrop-blur-lg md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {items.map((item) => {
            const active = pathname === item.to || (item.to !== "/app" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 text-mono text-tracked text-[9px] ${
                  active ? "text-signal" : "text-muted-foreground"
                }`}
              >
                <span className="text-[10px]">{item.code}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
