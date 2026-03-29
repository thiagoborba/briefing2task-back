import type { BriefingResult } from '../types';

export function formatBriefingResult(raw: Record<string, unknown>): BriefingResult {
  const toStringArray = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.map(String);
    if (typeof value === 'string' && value.trim()) return [value];
    return [];
  };

  return {
    titulo: typeof raw.titulo === 'string' ? raw.titulo : undefined,
    resumo: typeof raw.resumo === 'string' ? raw.resumo : undefined,
    objetivo: typeof raw.objetivo === 'string' ? raw.objetivo : undefined,
    publico_alvo: typeof raw.publico_alvo === 'string' ? raw.publico_alvo : undefined,
    canal: typeof raw.canal === 'string' ? raw.canal : undefined,
    entregaveis: Array.isArray(raw.entregaveis)
      ? raw.entregaveis.map(String)
      : typeof raw.entregaveis === 'string'
        ? raw.entregaveis
        : undefined,
    prazo: typeof raw.prazo === 'string' ? raw.prazo : undefined,
    prioridade: typeof raw.prioridade === 'string' ? raw.prioridade : undefined,
    checklist: toStringArray(raw.checklist),
    informacoes_faltantes: toStringArray(raw.informacoes_faltantes),
    perguntas_de_alinhamento: toStringArray(raw.perguntas_de_alinhamento),
  };
}
