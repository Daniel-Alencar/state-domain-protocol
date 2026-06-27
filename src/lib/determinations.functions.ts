import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ARCHETYPES } from "@/lib/archetypes";

const InputSchema = z.object({
  transcript: z.string().min(3).max(4000),
});

export const analyzeDetermination = createServerFn({ method: "POST" })
  .inputValidator((input) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return { suggestedArchetypes: [] as string[], rationale: "IA indisponível." };
    }

    const catalog = ARCHETYPES.map(
      (a) => `${a.id} :: ${a.name} — função: ${a.function} — estado: ${a.state}`,
    ).join("\n");

    const systemPrompt = `Você é um analista do Protocolo Soberano. O usuário gravou uma "determinação" (uma intenção/afirmação em primeira pessoa). Sua tarefa é selecionar entre 1 e 4 arquétipos do catálogo abaixo cujas frequências binaurais NÃO conflitem com o conteúdo da determinação e potencializem o que está sendo declarado.

CATÁLOGO (use APENAS estes ids):
${catalog}

Regras:
- Não escolha arquétipos com função oposta ao que o usuário declara.
- Prefira combinações coerentes (ex: foco + execução; visão + estratégia).
- Devolva um JSON com a forma exata pedida via tool calling.`;

    const body = {
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Determinação transcrita:\n"""${data.transcript}"""` },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "suggest_archetypes",
            description: "Retorna os arquétipos sugeridos.",
            parameters: {
              type: "object",
              properties: {
                ids: {
                  type: "array",
                  items: { type: "string" },
                  description: "ids do catálogo (1 a 4).",
                },
                rationale: { type: "string", description: "explicação curta em português" },
              },
              required: ["ids", "rationale"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "suggest_archetypes" } },
    };

    try {
      const res = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("AI gateway error", res.status, text);
        return { suggestedArchetypes: [] as string[], rationale: `Erro IA (${res.status}).` };
      }
      const json = await res.json();
      const call = json.choices?.[0]?.message?.tool_calls?.[0];
      if (!call) return { suggestedArchetypes: [] as string[], rationale: "Sem sugestão." };
      const args = JSON.parse(call.function?.arguments ?? "{}") as { ids?: string[]; rationale?: string };
      const validIds = (args.ids ?? []).filter((id) => ARCHETYPES.some((a) => a.id === id));
      return { suggestedArchetypes: validIds.slice(0, 4), rationale: args.rationale ?? "" };
    } catch (err) {
      console.error("analyzeDetermination failed", err);
      return { suggestedArchetypes: [] as string[], rationale: "Falha na análise." };
    }
  });
