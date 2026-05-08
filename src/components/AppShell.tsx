import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useEntitlement } from "@/lib/use-entitlement";
import { QuantumField } from "@/components/QuantumField";
import { useActiveArchetype } from "@/lib/active-state";

const items = [
  { to: "/app", label: "Centro", code: "01" },
  { to: "/frequencias", label: "Frequência", code: "02" },
  { to: "/arquetipos", label: "Arquétipos", code: "03" },
  { to: "/relatos", label: "Relatos", code: "04" },
  { to: "/networking", label: "Rede", code: "05" },
  { to: "/performance", label: "Performance", code: "06" },
] as const;

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
            return (
              <Link key={item.to} to={item.to} className="group flex items-center gap-2 text-mono text-tracked text-[10px]">
                <span className={active ? "text-signal" : "text-muted-foreground/60"}>{item.code}</span>
                <span className={active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-mono text-tracked hidden text-[9px] text-elite sm:inline">
            {ent.tier.toUpperCase()}
          </span>
          <span className="text-mono text-tracked hidden text-[10px] text-muted-foreground md:inline">
            {user.email}
          </span>
          <button
            onClick={async () => { await signOut(); navigate({ to: "/login" }); }}
            className="text-mono text-tracked rounded-full border border-border/60 px-3 py-1 text-[9px] text-muted-foreground hover:text-foreground hover:border-foreground/40"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="relative z-10">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/60 bg-background/90 backdrop-blur-lg md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {items.map((item) => {
            const active = pathname === item.to || (item.to !== "/app" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 text-mono text-tracked text-[8px] ${
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
