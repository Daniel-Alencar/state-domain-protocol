import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useEntitlement, type PlanTier } from "@/lib/use-entitlement";
import { QuantumField } from "@/components/QuantumField";
import { useActiveArchetype } from "@/lib/active-state";
import { supabase } from "@/integrations/supabase/client";

type NavItem = {
  to: string;
  label: string;
  code: string;
  /** Short label for mobile bottom bar */
  short?: string;
  minTier?: PlanTier;
};

const items: NavItem[] = [
  { to: "/app",          label: "Centro",       code: "01" },
  { to: "/frequencias",  label: "Frequência",   code: "02", short: "Freq" },
  { to: "/arquetipos",   label: "Arquétipos",   code: "03", minTier: "basico", short: "Arq" },
  { to: "/determinacoes",label: "Determinações", code: "04", minTier: "premium", short: "Det" },
  { to: "/relatos",      label: "Relatos",      code: "05" },
  { to: "/networking",   label: "Rede",         code: "06" },
  { to: "/performance",  label: "Performance",  code: "07", short: "Perf" },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login", search: { redirect: pathname } });
    }
  }, [loading, user, navigate, pathname]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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

      {/* ===== Desktop header ===== */}
      <header className="relative z-10 border-b border-border/60">
        {/* Top row: logo + user actions */}
        <div className="flex items-center justify-between px-6 py-3">
          <Link to="/app" className="flex items-center gap-3">
            <span className="text-signal text-lg">◬</span>
            <span className="text-mono text-tracked text-[10px] text-muted-foreground">Protocolo Soberano</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border/40 md:hidden"
            aria-label="Menu"
          >
            <span className="flex flex-col gap-1">
              <span className={`block h-px w-4 bg-foreground transition-all ${mobileMenuOpen ? "translate-y-[3px] rotate-45" : ""}`} />
              <span className={`block h-px w-4 bg-foreground transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-px w-4 bg-foreground transition-all ${mobileMenuOpen ? "-translate-y-[3px] -rotate-45" : ""}`} />
            </span>
          </button>

          {/* Desktop user area */}
          <div className="hidden items-center gap-4 md:flex">
            {isAdmin && (
              <Link
                to="/admin"
                className="text-mono text-tracked text-[9px] text-signal/70 hover:text-signal transition-colors"
              >
                ADMIN
              </Link>
            )}
            <Link
              to="/planos"
              className="text-mono text-tracked text-[9px] text-elite hover:text-signal transition-colors"
            >
              {PLAN_LABEL[ent.tier].toUpperCase()}
            </Link>
            <span className="text-mono text-tracked text-[10px] text-muted-foreground truncate max-w-[180px]">
              {user.email}
            </span>
            <button
              onClick={async () => { await signOut(); navigate({ to: "/login", search: { redirect: "/app" } }); }}
              className="text-mono text-tracked rounded-full border border-border/60 px-3 py-1.5 text-[9px] text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Desktop navigation row */}
        <nav className="hidden border-t border-border/40 md:block">
          <div className="mx-auto flex max-w-6xl items-center overflow-x-auto px-6">
            {items.map((item) => {
              const active = pathname === item.to || (item.to !== "/app" && pathname.startsWith(item.to));
              const locked = item.minTier ? !ent.has(item.minTier) : false;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-mono text-tracked text-[11px] transition-colors ${
                    active ? "text-foreground" : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  <span className={active ? "text-signal" : "text-foreground/40 group-hover:text-foreground/60"}>
                    {item.code}
                  </span>
                  <span>{item.label}</span>
                  {locked && (
                    <span className="text-[8px] text-muted-foreground/60">↑</span>
                  )}
                  {active && (
                    <span className="absolute bottom-0 left-2 right-2 h-px bg-signal" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* ===== Mobile slide-down menu ===== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu panel */}
          <div className="relative z-10 border-b border-border/60 bg-background/95 backdrop-blur-lg px-6 pb-6 pt-16">
            {/* Close button area (visual hint) */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-mono text-tracked text-[10px] text-signal">Navegação</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border/40 text-xs text-muted-foreground"
              >
                ✕
              </button>
            </div>

            {/* Nav links */}
            <nav className="grid grid-cols-2 gap-2">
              {items.map((item) => {
                const active = pathname === item.to || (item.to !== "/app" && pathname.startsWith(item.to));
                const locked = item.minTier ? !ent.has(item.minTier) : false;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`glass-panel flex items-center gap-3 rounded-lg p-3 transition-all ${
                      active ? "border-signal/50" : "hover:border-foreground/30"
                    }`}
                  >
                    <span className={`text-mono text-tracked text-[10px] ${active ? "text-signal" : "text-foreground/40"}`}>
                      {item.code}
                    </span>
                    <span className={`text-sm ${active ? "text-foreground font-medium" : "text-foreground/80"}`}>
                      {item.label}
                    </span>
                    {locked && (
                      <span className="ml-auto text-[8px] text-muted-foreground/60">↑</span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User info + sign out */}
            <div className="mt-6 border-t border-border/40 pt-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-mono text-tracked text-[9px] text-muted-foreground truncate">
                    {user.email}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Link
                      to="/planos"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-mono text-tracked text-[9px] text-elite"
                    >
                      Plano {PLAN_LABEL[ent.tier]}
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-mono text-tracked text-[9px] text-signal/70"
                      >
                        · Admin
                      </Link>
                    )}
                  </div>
                </div>
                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await signOut();
                    navigate({ to: "/login", search: { redirect: "/app" } });
                  }}
                  className="text-mono text-tracked rounded-full border border-destructive/40 bg-destructive/10 px-4 py-2 text-[10px] text-destructive transition-colors hover:bg-destructive/20"
                >
                  Sair da conta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Main content ===== */}
      <main className="relative z-10 pb-16 md:pb-0">{children}</main>

      {/* ===== Mobile bottom bar (quick access, 4+1 items) ===== */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/60 bg-background/95 backdrop-blur-lg md:hidden">
        <div className="grid grid-cols-5 gap-0 px-1 py-2">
          {/* Show first 4 nav items + "More" menu trigger */}
          {items.slice(0, 4).map((item) => {
            const active = pathname === item.to || (item.to !== "/app" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 py-1 text-center text-mono text-tracked text-[9px] leading-tight transition-colors ${
                  active ? "text-signal" : "text-foreground/60"
                }`}
              >
                <span className={`text-[10px] ${active ? "text-signal" : "text-foreground/40"}`}>{item.code}</span>
                <span className="truncate w-full px-0.5">{item.short ?? item.label}</span>
              </Link>
            );
          })}
          {/* "More" button to open full menu */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`flex flex-col items-center gap-0.5 py-1 text-center text-mono text-tracked text-[9px] leading-tight text-foreground/60`}
          >
            <span className="text-[10px] text-foreground/40">···</span>
            <span>Mais</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
