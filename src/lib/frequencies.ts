export type Frequency = {
  id: string;
  name: string;
  intent: string;
  duration: string;
  /** Minutos para o motor de áudio. */
  minutes: number;
  /** Frequência portadora (Hz) ouvida em ambos os ouvidos. */
  carrier: number;
  /** Diferença binaural (Hz) entre ouvidos — cria a "batida" cerebral. */
  beat: number;
  /** Categoria de onda cerebral que o beat induz. */
  band: "Delta" | "Theta" | "Alpha" | "Beta" | "Gamma";
  /** Estado que desperta. */
  awakens?: string;
};

export const FREQUENCIES: Frequency[] = [
  { id: "fonte",       name: "Frequência da Fonte", intent: "Reconexão com o eixo essencial e reparo celular.", duration: "30 min", minutes: 30, carrier: 528, beat: 8,  band: "Alpha", awakens: "Restauração interna · presença pura" },
  { id: "foco",        name: "Foco Absoluto",      intent: "Eliminação de ruído cognitivo.",                    duration: "25 min", minutes: 25, carrier: 200, beat: 18, band: "Beta",  awakens: "Atenção sustentada" },
  { id: "blindagem",   name: "Blindagem",          intent: "Estabilidade sob pressão externa.",                 duration: "15 min", minutes: 15, carrier: 110, beat: 7,  band: "Theta", awakens: "Imutabilidade emocional" },
  { id: "execucao",    name: "Execução",           intent: "Conversão de plano em ação.",                       duration: "45 min", minutes: 45, carrier: 220, beat: 14, band: "Beta",  awakens: "Movimento contínuo" },
  { id: "clareza",     name: "Clareza",            intent: "Reorganização do campo mental.",                    duration: "20 min", minutes: 20, carrier: 136, beat: 10, band: "Alpha", awakens: "Visão limpa" },
  { id: "expansao",    name: "Expansão",           intent: "Ampliação de horizonte estratégico.",               duration: "30 min", minutes: 30, carrier: 144, beat: 6,  band: "Theta", awakens: "Perspectiva superior" },
  { id: "influencia",  name: "Influência",         intent: "Calibração de presença social.",                    duration: "15 min", minutes: 15, carrier: 174, beat: 12, band: "Alpha", awakens: "Magnetismo controlado" },
  { id: "recuperacao", name: "Recuperação",        intent: "Reconstrução pós-esforço.",                         duration: "40 min", minutes: 40, carrier: 96,  beat: 3,  band: "Delta", awakens: "Reparo profundo" },
  { id: "presenca",    name: "Presença",           intent: "Ocupação plena do momento.",                        duration: "10 min", minutes: 10, carrier: 128, beat: 8,  band: "Alpha", awakens: "Aqui e agora" },
];
