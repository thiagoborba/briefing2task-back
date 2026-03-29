export interface BriefingResult {
  titulo?: string;
  resumo?: string;
  objetivo?: string;
  publico_alvo?: string;
  canal?: string;
  entregaveis?: string | string[];
  prazo?: string;
  prioridade?: string;
  checklist?: string[];
  informacoes_faltantes?: string[];
  perguntas_de_alinhamento?: string[];
}
