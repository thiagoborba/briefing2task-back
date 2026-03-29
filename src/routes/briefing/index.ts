import { Router, Request, Response } from 'express';
import Groq from 'groq-sdk';
import { MAX_BRIEFING_LENGTH, SYSTEM_PROMPT } from '../../constants';
import { formatBriefingResult } from '../../utils';

const router = Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post('/analyse-briefing', async (req: Request, res: Response) => {
  const { briefing } = req.body;

  if (!briefing || typeof briefing !== 'string') {
    res
      .status(400)
      .json({ error: "Campo 'briefing' é obrigatório e deve ser uma string." });
    return;
  }

  if (briefing.trim().length > MAX_BRIEFING_LENGTH) {
    res
      .status(400)
      .json({ error: `O briefing não pode ultrapassar ${MAX_BRIEFING_LENGTH} caracteres.` });
    return;
  }

  try {
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
  } catch (err) {
    console.error('[analyse-briefing] erro ao processar:', err);
    res.status(500).json({ error: 'Erro ao processar o briefing. Tente novamente.' });
  }
});

export default router;
