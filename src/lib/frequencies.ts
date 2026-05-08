export type Frequency = {
  id: string;
  name: string;
  intent: string;
  duration: string;
};

export const FREQUENCIES: Frequency[] = [
  { id: "foco", name: "Foco Absoluto", intent: "Eliminação de ruído cognitivo.", duration: "25 min" },
  { id: "blindagem", name: "Blindagem", intent: "Estabilidade sob pressão externa.", duration: "15 min" },
  { id: "execucao", name: "Execução", intent: "Conversão de plano em ação.", duration: "45 min" },
  { id: "clareza", name: "Clareza", intent: "Reorganização do campo mental.", duration: "20 min" },
  { id: "expansao", name: "Expansão", intent: "Ampliação de horizonte estratégico.", duration: "30 min" },
  { id: "influencia", name: "Influência", intent: "Calibração de presença social.", duration: "15 min" },
  { id: "recuperacao", name: "Recuperação", intent: "Reconstrução pós-esforço.", duration: "40 min" },
  { id: "presenca", name: "Presença", intent: "Ocupação plena do momento.", duration: "10 min" },
];
