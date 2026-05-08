import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { ARCHETYPES } from "@/lib/archetypes";
import { toast } from "sonner";

export const Route = createFileRoute("/relatos")({
  head: () => ({ meta: [{ title: "Relatos · Protocolo Soberano" }] }),
  component: Relatos,
});

type Report = {
  id: string;
  title: string;
  body: string;
  status: "pending" | "validated" | "rejected";
  archetype_id: string | null;
  created_at: string;
};

function Relatos() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [archetype, setArchetype] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    if (!user) return;
    const { data } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setReports((data as Report[]) ?? []);
  }
  useEffect(() => { void load(); }, [user]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("reports").insert({
      user_id: user.id,
      title,
      body,
      archetype_id: archetype || null,
    });
    setBusy(false);
    if (error) {
      toast.error("Não foi possível registrar", { description: error.message });
      return;
    }
    setTitle(""); setBody(""); setArchetype("");
    toast("Relato enviado para validação");
    await load();
  }

  const statusLabel: Record<Report["status"], { l: string; c: string }> = {
    pending: { l: "em análise", c: "text-muted-foreground" },
    validated: { l: "validado", c: "text-signal" },
    rejected: { l: "recusado", c: "text-destructive" },
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-6 pb-32 pt-10">
        <div className="mb-8">
          <div className="text-mono text-tracked mb-3 text-[10px] text-signal">Módulo 04 · Relatos</div>
          <h1 className="text-3xl font-light text-foreground md:text-4xl">Registro operacional</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Documente impactos reais da prática. Cada relato validado contribui para sua progressão de patente.
          </p>
        </div>

        <form onSubmit={submit} className="glass-panel mb-8 space-y-3 rounded-xl p-5">
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do relato"
            className="w-full rounded-md border border-border/60 bg-card/40 px-3 py-2 text-sm text-foreground focus:border-signal/60 focus:outline-none"
          />
          <select
            value={archetype}
            onChange={(e) => setArchetype(e.target.value)}
            className="w-full rounded-md border border-border/60 bg-card/40 px-3 py-2 text-sm text-foreground focus:border-signal/60 focus:outline-none"
          >
            <option value="">Arquétipo associado (opcional)</option>
            {ARCHETYPES.map((a) => (
              <option key={a.id} value={a.id}>{a.glyph} {a.name}</option>
            ))}
          </select>
          <textarea
            required
            minLength={40}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            placeholder="Descreva contexto, decisão tomada, resultado observado…"
            className="w-full rounded-md border border-border/60 bg-card/40 px-3 py-2 text-sm text-foreground focus:border-signal/60 focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy}
            className="text-mono text-tracked rounded-full bg-foreground px-5 py-2.5 text-[11px] text-background disabled:opacity-60"
          >
            {busy ? "Enviando…" : "Submeter relato"}
          </button>
        </form>

        <div className="space-y-2">
          {reports.length === 0 && (
            <p className="text-center text-xs text-muted-foreground">Nenhum relato ainda.</p>
          )}
          {reports.map((r) => {
            const s = statusLabel[r.status];
            return (
              <div key={r.id} className="glass-panel rounded-lg p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{r.title}</span>
                  <span className={`text-mono text-tracked text-[9px] ${s.c}`}>{s.l}</span>
                </div>
                <p className="text-xs text-muted-foreground">{r.body}</p>
                <div className="mt-2 text-mono text-tracked text-[9px] text-muted-foreground/60">
                  {new Date(r.created_at).toLocaleString("pt-BR")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
