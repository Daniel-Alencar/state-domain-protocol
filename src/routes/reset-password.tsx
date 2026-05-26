import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Redefinir senha · Protocolo Soberano" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Senha redefinida", { description: "Você já está autenticado." });
      navigate({ to: "/app" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Falha ao redefinir senha";
      toast.error("Erro", { description: msg });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div className="pointer-events-none fixed inset-0 grid-faint opacity-[0.04]" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-signal mb-2 text-3xl">◬</div>
          <h1 className="mt-3 text-2xl font-light text-foreground">Definir nova senha</h1>
        </div>
        <form onSubmit={submit} className="glass-panel space-y-3 rounded-xl p-6">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nova senha (mín. 8)"
              className="w-full rounded-md border border-border/60 bg-card/40 px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-signal/60 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="text-mono text-tracked w-full rounded-full bg-foreground px-4 py-3 text-[11px] text-background disabled:opacity-60"
          >
            {busy ? "Salvando…" : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
