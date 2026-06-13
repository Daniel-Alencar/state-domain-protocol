import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useEntitlement, type PlanTier } from "@/lib/use-entitlement";
import { QuantumField } from "@/components/QuantumField";
import { useActiveArchetype } from "@/lib/active-state";

type NavItem = {
  to: string;
  label: string;
  code: string;
  minTier?: PlanTier;
};

const items: NavItem[] = [
  { to: "/app",          label: "Centro",       code: "01" },
  { to: "/frequencias",  label: "Frequência",   code: "02" },
  { to: "/arquetipos",   label: "Arquétipos",   code: "03", minTier: "basico" },
  { to: "/determinacoes",label: "Determinações", code: "04", minTier: "premium" },
  { to: "/relatos",      label: "Relatos",      code: "05" },
  { to: "/networking",   label: "Rede",         code: "06" },
  { to: "/performance",  label: "Performance",  code: "07" },
  { to: "/planos",       label: "Planos",       code: "08" },
];

const PLAN_LABEL: Record<PlanTier, string> = {
  free: "Grátis",
  basico: "Básico",
  premium: "Premium",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const ent = useEntitlement();
  const activeArchetype = useActiveArchetype();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login", search: { redirect: pathname } });
    }
  }, [loading, user, navigate, pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-mono text-tracked text-[10px] text-muted-foreground">
        Carregando núcleo…
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground" data-archetype={activeArchetype ?? "default"}>
      <div className="pointer-events-none fixed inset-0">
        <QuantumField variant={activeArchetype} intensity={0.7} />
      </div>

      <header className="relative z-10 flex items-center justify-between border-b border-border/60 px-6 py-4">
        <Link to="/app" className="flex items-center gap-3">
          <span className="text-signal text-lg">◬</span>
          <span className="text-mono text-tracked text-[10px] text-muted-foreground">Protocolo Soberano</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {items.map((item) => {
            const active = pathname === item.to || (item.to !== "/app" && pathname.startsWith(item.to));
            const locked = item.minTier ? !ent.has(item.minTier) : false;
            return (
              <Link key={item.to} to={item.to} className="group flex items-center gap-2 text-mono text-tracked text-xs">
                <span className={active ? "text-signal" : "text-foreground/50"}>{item.code}</span>
                <span className={active ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"}>
                  {item.label}
                </span>
                {locked && (
                  <span className="text-[8px] text-muted-foreground/60">↑</span>
                )}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/planos"
            className="text-mono text-tracked hidden text-[9px] text-elite sm:inline hover:text-signal transition-colors"
          >
            {PLAN_LABEL[ent.tier].toUpperCase()}
          </Link>
          <span className="text-mono text-tracked hidden text-[10px] text-muted-foreground md:inline">
            {user.email}
          </span>
          <button
            onClick={async () => { await signOut(); navigate({ to: "/login", search: { redirect: "/app" } }); }}
            className="text-mono text-tracked rounded-full border border-border/60 px-3 py-1 text-[9px] text-muted-foreground hover:text-foreground hover:border-foreground/40"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="relative z-10">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/60 bg-background/95 backdrop-blur-lg md:hidden">
        <div className="grid grid-cols-8 gap-0 px-1 py-2">
          {items.map((item) => {
            const active = pathname === item.to || (item.to !== "/app" && pathname.startsWith(item.to));
            const locked = item.minTier ? !ent.has(item.minTier) : false;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex min-w-0 flex-col items-center gap-0.5 px-0.5 py-1 text-center text-mono text-tracked text-[10px] leading-tight ${
                  active ? "text-signal" : locked ? "text-foreground/40" : "text-foreground/80"
                }`}
              >
                <span className={`text-[10px] ${active ? "text-signal" : "text-foreground/60"}`}>{item.code}</span>
                <span className="truncate w-full">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
