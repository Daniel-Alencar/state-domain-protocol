import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: (s.redirect as string) || "/app" }),
  head: () => ({ meta: [{ title: "Acesso · Protocolo Soberano" }] }),
  component: Login,
});

function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: redirect });
  }, [user, navigate, redirect]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
            data: { display_name: name || email },
          },
        });
        if (error) throw error;
        toast("Cadastro registrado", { description: "Confira seu e-mail para confirmar acesso." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: redirect });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Falha de autenticação";
      toast.error("Acesso negado", { description: msg });
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/app" });
    if (r.error) toast.error("Google indisponível", { description: r.error.message });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div className="pointer-events-none fixed inset-0 grid-faint opacity-[0.04]" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-signal mb-2 text-3xl">◬</div>
          <div className="text-mono text-tracked text-[10px] text-muted-foreground">Protocolo Soberano</div>
          <h1 className="mt-3 text-2xl font-light text-foreground">
            {mode === "login" ? "Entrar no núcleo" : "Iniciar perfil"}
          </h1>
        </div>

        <form onSubmit={submit} className="glass-panel space-y-3 rounded-xl p-6">
          {mode === "signup" && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome operacional"
              className="w-full rounded-md border border-border/60 bg-card/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-signal/60 focus:outline-none"
            />
          )}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className="w-full rounded-md border border-border/60 bg-card/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-signal/60 focus:outline-none"
          />
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha (mín. 8)"
            className="w-full rounded-md border border-border/60 bg-card/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-signal/60 focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy}
            className="text-mono text-tracked w-full rounded-full bg-foreground px-4 py-3 text-[11px] text-background disabled:opacity-60"
          >
            {busy ? "Calibrando…" : mode === "login" ? "Entrar" : "Criar acesso"}
          </button>

          <div className="relative my-2 text-center">
            <div className="absolute inset-x-0 top-1/2 h-px bg-border/60" />
            <span className="relative bg-card/0 px-3 text-mono text-tracked text-[9px] text-muted-foreground">ou</span>
          </div>

          <button
            type="button"
            onClick={google}
            className="text-mono text-tracked w-full rounded-full border border-border/60 px-4 py-3 text-[11px] text-foreground hover:border-signal/60"
          >
            Continuar com Google
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="text-mono text-tracked mx-auto mt-5 block text-[10px] text-muted-foreground hover:text-foreground"
        >
          {mode === "login" ? "Não tem acesso? Iniciar perfil →" : "Já operacional? Entrar →"}
        </button>
      </div>
    </div>
  );
}
