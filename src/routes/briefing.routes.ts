import { Router, Request, Response } from 'express';
import Groq from 'groq-sdk';
import 'dotenv/config';

const router = Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface BriefingResult {
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

const SYSTEM_PROMPT = `Você é um assistente especializado em operações de marketing e agências.

Receba um briefing bruto e transforme em uma estrutura clara e objetiva.

Retorne EXCLUSIVAMENTE um JSON válido com exatamente estas chaves:
{
  "titulo": "string com título curto e descritivo",
  "resumo": "string com resumo do briefing",
  "objetivo": "string com objetivo principal",
  "publico_alvo": "string descrevendo o público-alvo",
  "canal": "string com o canal de comunicação",
  "entregaveis": ["array", "de", "strings"] ou "string único se houver apenas um",
  "prazo": "string com prazo ou data",
  "prioridade": "Alta | Média | Baixa",
  "checklist": ["array de strings com itens de checklist"],
  "informacoes_faltantes": ["array de strings com informações ausentes no briefing"],
  "perguntas_de_alinhamento": ["array de strings com perguntas para alinhar com o cliente"]
}

Regras:
- Não invente dados.
- Quando faltar informação, use null para campos simples ou array vazio para campos de lista.
- checklist, informacoes_faltantes e perguntas_de_alinhamento devem ser sempre arrays de strings.
- Seja objetivo e profissional.
- Não inclua nenhum texto fora do JSON.`;

function formatBriefingResult(raw: Record<string, unknown>): BriefingResult {
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

router.post('/analyse-briefing', async (req: Request, res: Response) => {
  const { briefing } = req.body;

  if (!briefing || typeof briefing !== 'string') {
    res
      .status(400)
      .json({ error: "Campo 'briefing' é obrigatório e deve ser uma string." });
    return;
  }

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: briefing },
    ],
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0].message.content;
  const raw = JSON.parse(content!) as Record<string, unknown>;
  res.json(formatBriefingResult(raw));
});

export default router;
