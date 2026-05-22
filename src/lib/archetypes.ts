export type ArchetypeGroup = "classico" | "ancestral";

export type Archetype = {
  id: string;
  name: string;
  glyph: string;
  group: ArchetypeGroup;
  /** Função operacional resumida. */
  function: string;
  /** Estado mental induzido. */
  state: string;
  /** Pelo menos três características-chave. */
  characteristics: string[];
  /** Protocolo prático. */
  protocol: string;
  /** Postura corporal. */
  posture: string;
  /** Ambiente ideal. */
  environment: string;
  /** Frequência portadora (Hz) — som ouvido em ambos os canais. */
  carrier: number;
  /** Diferença binaural (Hz) entre canais — a batida cerebral. */
  beat: number;
  /** Banda cerebral induzida pela batida. */
  band: "Delta" | "Theta" | "Alpha" | "Beta" | "Gamma";
  /** Identificador único da assinatura sonora (para o motor). */
  freqId: string;
};

function bandFor(beat: number): Archetype["band"] {
  if (beat < 4) return "Delta";
  if (beat < 8) return "Theta";
  if (beat < 14) return "Alpha";
  if (beat < 30) return "Beta";
  return "Gamma";
}

function build(a: Omit<Archetype, "band" | "freqId">): Archetype {
  return { ...a, band: bandFor(a.beat), freqId: `arq:${a.id}` };
}

export const ARCHETYPES: Archetype[] = [
  // ===== Clássicos =====
  build({
    id: "rocha", name: "Rocha", glyph: "◼", group: "classico",
    function: "Estabilidade",
    state: "Imutabilidade interna",
    characteristics: ["Estabilidade emocional", "Resistência à pressão", "Firmeza moral"],
    protocol: "Pausas longas. Não reagir a ruído.",
    posture: "Centro de gravidade baixo.",
    environment: "Pressão hostil, crise.",
    carrier: 110, beat: 7,
  }),
  build({
    id: "serpente", name: "Serpente", glyph: "∽", group: "classico",
    function: "Inteligência social",
    state: "Leitura silenciosa",
    characteristics: ["Inteligência adaptativa", "Persuasão silenciosa", "Transformação interna"],
    protocol: "Falar pouco. Observar padrões.",
    posture: "Movimento mínimo, precisão alta.",
    environment: "Política, negociação velada.",
    carrier: 174, beat: 8,
  }),
  build({
    id: "tubarao", name: "Tubarão", glyph: "◢", group: "classico",
    function: "Fechamento",
    state: "Foco terminal",
    characteristics: ["Instinto predador", "Decisão rápida", "Frieza operacional"],
    protocol: "Mover quando o sinal aparece. Sem hesitação.",
    posture: "Avanço contínuo.",
    environment: "Vendas, fechamento de contrato.",
    carrier: 160, beat: 18,
  }),
  build({
    id: "pantera", name: "Pantera", glyph: "◆", group: "classico",
    function: "Presença silenciosa",
    state: "Magnetismo controlado",
    characteristics: ["Magnetismo silencioso", "Elegância letal", "Autoconfiança"],
    protocol: "Entrar sem anunciar. Ocupar o espaço.",
    posture: "Passos suaves, eixo firme.",
    environment: "Ambientes de elite.",
    carrier: 196, beat: 9,
  }),
  build({
    id: "lobo", name: "Lobo", glyph: "⟁", group: "classico",
    function: "Liderança de tribo",
    state: "Coesão",
    characteristics: ["Lealdade estratégica", "Liderança de grupo", "Sobrevivência inteligente"],
    protocol: "Proteger o grupo. Definir direção.",
    posture: "Postura aberta para os seus.",
    environment: "Equipe, time de execução.",
    carrier: 147, beat: 12,
  }),
  build({
    id: "samurai", name: "Samurai", glyph: "│", group: "classico",
    function: "Disciplina",
    state: "Código interno",
    characteristics: ["Disciplina absoluta", "Honra", "Controle emocional"],
    protocol: "Ritual de preparação. Zero desvio.",
    posture: "Linha vertical perfeita.",
    environment: "Execução repetitiva de alto padrão.",
    carrier: 256, beat: 13,
  }),
  build({
    id: "fenix", name: "Fênix", glyph: "✧", group: "classico",
    function: "Recuperação",
    state: "Reconstrução",
    characteristics: ["Renascimento", "Superação extrema", "Transformação de dor em poder"],
    protocol: "Aceitar o colapso. Reerguer com nova forma.",
    posture: "Respiração longa, ombros leves.",
    environment: "Pós-derrota, virada.",
    carrier: 396, beat: 5,
  }),
  build({
    id: "oraculo", name: "Oráculo", glyph: "◯", group: "classico",
    function: "Intuição estratégica",
    state: "Escuta interna",
    characteristics: ["Intuição refinada", "Leitura de padrões", "Sensibilidade mental"],
    protocol: "Silêncio antes de decidir.",
    posture: "Imóvel, atenção difusa.",
    environment: "Decisão sem dados completos.",
    carrier: 417, beat: 4,
  }),
  build({
    id: "maestro", name: "Maestro", glyph: "≡", group: "classico",
    function: "Comunicação",
    state: "Coordenação fluida",
    characteristics: ["Coordenação mental", "Harmonia entre áreas da vida", "Controle de caos"],
    protocol: "Cadência clara. Sinalização precisa.",
    posture: "Mãos visíveis, gestos contidos.",
    environment: "Apresentação, condução de equipe.",
    carrier: 320, beat: 11,
  }),
  build({
    id: "diamante", name: "Diamante", glyph: "◇", group: "classico",
    function: "Imagem inquebrável",
    state: "Refinamento absoluto",
    characteristics: ["Valor interno", "Resistência psicológica", "Clareza mental"],
    protocol: "Cuidado obsessivo com detalhe e padrão.",
    posture: "Verticalidade, simetria, contenção.",
    environment: "Eventos de alto valor, exposição pública.",
    carrier: 528, beat: 8,
  }),
  build({
    id: "templario", name: "Templário", glyph: "✚", group: "classico",
    function: "Convicção operacional",
    state: "Missão acima do humor",
    characteristics: ["Proteção espiritual", "Fé inabalável", "Disciplina guerreira"],
    protocol: "Repetir o ritual mesmo sem vontade.",
    posture: "Frontal, mãos firmes, olhar fixo.",
    environment: "Longas jornadas, projetos de anos.",
    carrier: 369, beat: 7,
  }),
  build({
    id: "estrategista", name: "Estrategista", glyph: "⌖", group: "classico",
    function: "Arquitetura de movimento",
    state: "Cálculo frio",
    characteristics: ["Pensamento frio", "Planejamento avançado", "Visão sistêmica"],
    protocol: "Mapear três jogadas à frente antes de agir.",
    posture: "Levemente recuado, ângulo aberto.",
    environment: "Sala de guerra, diretoria, tabuleiro.",
    carrier: 240, beat: 15,
  }),
  build({
    id: "mercador", name: "Mercador", glyph: "◊", group: "classico",
    function: "Conversão e troca",
    state: "Leitura de valor",
    characteristics: ["Persuasão comercial", "Leitura social", "Expansão financeira"],
    protocol: "Calibrar oferta ao desejo do outro.",
    posture: "Aberta, gesto convidativo, ritmo solto.",
    environment: "Negociação, parceria, capital.",
    carrier: 333, beat: 12,
  }),
  build({
    id: "arqueiro", name: "Arqueiro", glyph: "↗", group: "classico",
    function: "Precisão de alvo",
    state: "Foco terminal único",
    characteristics: ["Precisão mental", "Foco em objetivos", "Paciência calculada"],
    protocol: "Eliminar tudo que não é o alvo.",
    posture: "Eixo travado, respiração suspensa.",
    environment: "Execução crítica, deadline curto.",
    carrier: 432, beat: 10,
  }),
  build({
    id: "guardiao", name: "Guardião", glyph: "▣", group: "classico",
    function: "Proteção do território",
    state: "Vigilância serena",
    characteristics: ["Proteção da família", "Responsabilidade", "Força silenciosa"],
    protocol: "Definir limite antes que seja testado.",
    posture: "Perna firme, peito aberto, mãos visíveis.",
    environment: "Família, equipe, marca, reputação.",
    carrier: 150, beat: 8,
  }),

  // ===== Sete Forças Ancestrais =====
  build({
    id: "leao", name: "Leão", glyph: "◬", group: "ancestral",
    function: "Liderança e imposição",
    state: "Autoridade firme",
    characteristics: ["Liderança dominante", "Coragem social", "Presença imponente"],
    protocol: "Voz baixa, ritmo lento, contato visual sustentado.",
    posture: "Ombros abertos, respiração diafragmática.",
    environment: "Reuniões decisivas, palco, comando.",
    carrier: 128, beat: 14,
  }),
  build({
    id: "aguia-forca", name: "Águia · Força e Poder", glyph: "▲", group: "ancestral",
    function: "Comando elevado",
    state: "Autoridade em altura",
    characteristics: ["Autoridade elevada", "Energia de comando", "Domínio estratégico"],
    protocol: "Decisão imediata após varredura. Sem retorno.",
    posture: "Cabeça erguida, peito aberto.",
    environment: "Diretoria, palco executivo.",
    carrier: 144, beat: 16,
  }),
  build({
    id: "aguia-visao", name: "Águia · Visão de Longo Alcance", glyph: "▲", group: "ancestral",
    function: "Visão estratégica",
    state: "Antecipação fria",
    characteristics: ["Clareza estratégica", "Antecipação", "Inteligência observadora"],
    protocol: "Subir o ponto de vista antes de agir. Olhar três jogadas à frente.",
    posture: "Cabeça erguida, varredura ampla.",
    environment: "Planejamento, decisão de longo prazo.",
    carrier: 222, beat: 10,
  }),
  build({
    id: "aguia-elevacao", name: "Águia · Elevação", glyph: "▲", group: "ancestral",
    function: "Expansão de perspectiva",
    state: "Distanciamento sereno",
    characteristics: ["Expansão de consciência", "Distanciamento emocional", "Perspectiva superior"],
    protocol: "Sair do plano emocional. Observar o todo.",
    posture: "Respiração longa, ombros leves.",
    environment: "Decisão sob carga emocional.",
    carrier: 432, beat: 6,
  }),
  build({
    id: "coruja", name: "Coruja", glyph: "◉", group: "ancestral",
    function: "Observação profunda",
    state: "Vigília precisa",
    characteristics: ["Sabedoria analítica", "Observação profunda", "Intuição racional"],
    protocol: "Coletar dados antes de opinar.",
    posture: "Imobilidade atenta.",
    environment: "Auditoria, due diligence.",
    carrier: 285, beat: 7,
  }),
  build({
    id: "rei", name: "Rei", glyph: "♛", group: "ancestral",
    function: "Organização soberana",
    state: "Ordem e prosperidade",
    characteristics: ["Autoridade natural", "Capacidade de comando", "Sensação de ordem e prosperidade"],
    protocol: "Definir a regra. Distribuir função. Sustentar o trono.",
    posture: "Eixo central, gesto pausado.",
    environment: "Decisão final, governança, mesa de comando.",
    carrier: 256, beat: 14,
  }),
  build({
    id: "tigre", name: "Tigre", glyph: "❖", group: "ancestral",
    function: "Conquista veloz",
    state: "Intensidade competitiva",
    characteristics: ["Intensidade competitiva", "Coragem agressiva", "Ação veloz e decidida"],
    protocol: "Atacar o objetivo no instante exato. Sem segunda chance.",
    posture: "Corpo carregado, respiração curta e potente.",
    environment: "Competição direta, prova de fogo.",
    carrier: 182, beat: 17,
  }),
  build({
    id: "cavalo", name: "Cavalo", glyph: "➤", group: "ancestral",
    function: "Avanço contínuo",
    state: "Liberdade em movimento",
    characteristics: ["Liberdade mental", "Resistência e constância", "Energia de movimento e progresso"],
    protocol: "Manter o ritmo. Não parar a marcha.",
    posture: "Tórax aberto, passo longo.",
    environment: "Jornadas longas, execução diária.",
    carrier: 136, beat: 12,
  }),
  build({
    id: "sabio", name: "Sábio", glyph: "✦", group: "ancestral",
    function: "Compreensão profunda",
    state: "Serenidade intelectual",
    characteristics: ["Conhecimento profundo", "Prudência estratégica", "Serenidade intelectual"],
    protocol: "Estudar antes de opinar. Falar só o necessário.",
    posture: "Sentado firme, ombros relaxados.",
    environment: "Mentoria, leitura, conselho.",
    carrier: 288, beat: 6,
  }),
  build({
    id: "golfinho", name: "Golfinho", glyph: "◐", group: "ancestral",
    function: "Conexão social criativa",
    state: "Alegria fluida",
    characteristics: ["Comunicação harmoniosa", "Inteligência social", "Alegria e criatividade fluida"],
    protocol: "Entrar leve. Conectar antes de pedir.",
    posture: "Ombros soltos, sorriso contido.",
    environment: "Equipes criativas, networking, eventos sociais.",
    carrier: 432, beat: 8,
  }),
  build({
    id: "mago-manifestacao", name: "Mago · Manifestação", glyph: "✶", group: "ancestral",
    function: "Materialização de intenção",
    state: "Vontade focada em forma",
    characteristics: ["Vontade dirigida", "Visualização criadora", "Fé operacional"],
    protocol: "Definir a imagem final. Repetir afirmação. Agir como se já fosse.",
    posture: "Mãos abertas para frente, eixo elevado.",
    environment: "Início de projeto, criação, lançamento.",
    carrier: 432, beat: 10,
  }),
  build({
    id: "mago-transmutacao", name: "Mago · Transmutação", glyph: "✶", group: "ancestral",
    function: "Reconfiguração de estado",
    state: "Alquimia interna",
    characteristics: ["Conversão de emoção em força", "Quebra de padrão", "Reescrita simbólica"],
    protocol: "Nomear o estado pesado. Reescrever em três palavras. Respirar 4-7-8.",
    posture: "Mãos cruzadas no peito, respiração profunda.",
    environment: "Bloqueio emocional, mudança de fase.",
    carrier: 396, beat: 7,
  }),
  build({
    id: "mago-visao-oculta", name: "Mago · Visão Oculta", glyph: "✶", group: "ancestral",
    function: "Leitura do invisível",
    state: "Percepção sutil",
    characteristics: ["Percepção simbólica", "Intuição operacional", "Leitura de subtexto"],
    protocol: "Silêncio absoluto antes de ler a cena. Anotar a primeira imagem.",
    posture: "Olhos semicerrados, respiração lenta.",
    environment: "Negociação opaca, decisão com pouca informação.",
    carrier: 528, beat: 5,
  }),
];

export function getArchetype(id: string | null | undefined) {
  if (!id) return null;
  return ARCHETYPES.find((a) => a.id === id) ?? null;
}
