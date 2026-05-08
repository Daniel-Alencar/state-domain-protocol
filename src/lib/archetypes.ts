export type Archetype = {
  id: string;
  name: string;
  function: string;
  state: string;
  protocol: string;
  posture: string;
  environment: string;
  glyph: string;
};

export const ARCHETYPES: Archetype[] = [
  { id: "leao", name: "Leão", function: "Liderança e imposição", state: "Autoridade firme", protocol: "Voz baixa, ritmo lento, contato visual sustentado.", posture: "Ombros abertos, respiração diafragmática.", environment: "Reuniões decisivas, palco, comando.", glyph: "◬" },
  { id: "rocha", name: "Rocha", function: "Estabilidade", state: "Imutabilidade interna", protocol: "Pausas longas. Não reagir a ruído.", posture: "Centro de gravidade baixo.", environment: "Pressão hostil, crise.", glyph: "◼" },
  { id: "aguia", name: "Águia", function: "Visão estratégica", state: "Distância analítica", protocol: "Subir o ponto de vista antes de agir.", posture: "Cabeça erguida, varredura ampla.", environment: "Planejamento, decisão de longo prazo.", glyph: "▲" },
  { id: "serpente", name: "Serpente", function: "Inteligência social", state: "Leitura silenciosa", protocol: "Falar pouco. Observar padrões.", posture: "Movimento mínimo, precisão alta.", environment: "Política, negociação velada.", glyph: "∽" },
  { id: "tubarao", name: "Tubarão", function: "Fechamento", state: "Foco terminal", protocol: "Mover quando o sinal aparece. Sem hesitação.", posture: "Avanço contínuo.", environment: "Vendas, fechamento de contrato.", glyph: "◢" },
  { id: "coruja", name: "Coruja", function: "Observação", state: "Vigília precisa", protocol: "Coletar dados antes de opinar.", posture: "Imobilidade atenta.", environment: "Auditoria, due diligence.", glyph: "◉" },
  { id: "pantera", name: "Pantera", function: "Presença silenciosa", state: "Magnetismo controlado", protocol: "Entrar sem anunciar. Ocupar o espaço.", posture: "Passos suaves, eixo firme.", environment: "Ambientes de elite.", glyph: "◆" },
  { id: "lobo", name: "Lobo", function: "Liderança de tribo", state: "Coesão", protocol: "Proteger o grupo. Definir direção.", posture: "Postura aberta para os seus.", environment: "Equipe, time de execução.", glyph: "⟁" },
  { id: "samurai", name: "Samurai", function: "Disciplina", state: "Código interno", protocol: "Ritual de preparação. Zero desvio.", posture: "Linha vertical perfeita.", environment: "Execução repetitiva de alto padrão.", glyph: "│" },
  { id: "fenix", name: "Fênix", function: "Recuperação", state: "Reconstrução", protocol: "Aceitar o colapso. Reerguer com nova forma.", posture: "Respiração longa, ombros leves.", environment: "Pós-derrota, virada.", glyph: "✧" },
  { id: "oraculo", name: "Oráculo", function: "Intuição estratégica", state: "Escuta interna", protocol: "Silêncio antes de decidir.", posture: "Imóvel, atenção difusa.", environment: "Decisão sem dados completos.", glyph: "◯" },
  { id: "maestro", name: "Maestro", function: "Comunicação", state: "Coordenação fluida", protocol: "Cadência clara. Sinalização precisa.", posture: "Mãos visíveis, gestos contidos.", environment: "Apresentação, condução de equipe.", glyph: "≡" },
];
