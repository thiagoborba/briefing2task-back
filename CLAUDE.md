# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # development server via ts-node (no build step needed)
npm run build    # compile TypeScript → dist/
npm start        # run compiled dist/index.js
```

No test runner is configured (`npm test` exits with error).

## Environment

Requires a `.env` file at the project root:

```env
GROQ_API_KEY=your_key_here
PORT=3000
ALLOWED_ORIGINS=http://localhost:5173
```

`GROQ_API_KEY` is validated at startup — the process exits immediately if missing.

## Architecture

Single-purpose Express 5 API. The full request lifecycle for `POST /analyse-briefing`:

1. **Route** (`src/routes/briefing/index.ts`) — validates the `briefing` field (required string, max `MAX_BRIEFING_LENGTH` chars)
2. **Groq call** — sends `SYSTEM_PROMPT` + user briefing to `llama-3.3-70b-versatile` with `response_format: json_object`
3. **Normalisation** (`src/utils/index.ts` → `formatBriefingResult`) — casts the raw LLM JSON to `BriefingResult`, coercing list fields via `toStringArray` and leaving unexpected types as `undefined`
4. **Response** — returns the typed `BriefingResult` object

Key decisions to keep in mind:
- `entregaveis` is intentionally typed as `string | string[]` because the LLM may return either form; `formatBriefingResult` preserves both shapes.
- `SYSTEM_PROMPT` and `MAX_BRIEFING_LENGTH` live in `src/constants/index.ts` — edit there to change AI behaviour or input limits.
- CORS origins are split from `ALLOWED_ORIGINS` env var at startup; the default allows only `http://localhost:5173`.

## Deployment

Deployed to Vercel via `vercel.json` — all routes proxy to `src/index.ts` directly (no build step on Vercel; `@vercel/node` handles TypeScript). Local `dist/` is only used when running `npm start`.
