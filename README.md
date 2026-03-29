# Briefing to Tasks — Backend

API REST que recebe um briefing bruto de projeto e retorna uma estrutura de tarefas gerada por inteligência artificial. Utiliza o modelo Llama 3.3 70B via Groq API.

> Serve de backend para o [briefing2task-front](../briefing2task-front).

## Tecnologias

|           |                                             |
| --------- | ------------------------------------------- |
| Runtime   | Node.js                                     |
| Framework | Express 5                                   |
| Linguagem | TypeScript                                  |
| IA        | Groq SDK — modelo `llama-3.3-70b-versatile` |

## Pré-requisitos

- Node.js >= 18
- Conta na [Groq](https://console.groq.com) com uma chave de API (gratuita)

## Como rodar localmente

```bash
npm install
```

Crie o arquivo `.env`:

```env
GROQ_API_KEY=sua_chave_aqui
PORT=3000
ALLOWED_ORIGINS=http://localhost:5173
```

Inicie:

```bash
npm run dev
```

O servidor ficará disponível em `http://localhost:3000`.

## Como fazer build

```bash
npm run build  # compila TypeScript para dist/
npm start      # executa dist/index.js
```

## Variáveis de ambiente

| Variável          | Obrigatória | Descrição                                                                             |
| ----------------- | ----------- | ------------------------------------------------------------------------------------- |
| `GROQ_API_KEY`    | Sim         | Chave de API da Groq                                                                  |
| `PORT`            | Não         | Porta do servidor (padrão: `3000`)                                                    |
| `ALLOWED_ORIGINS` | Não         | Origens permitidas pelo CORS, separadas por vírgula (padrão: `http://localhost:5173`) |

## Endpoints

### `POST /analyse-briefing`

Analisa um briefing e retorna a estrutura extraída.

**Body:**

```json
{ "briefing": "texto do briefing aqui" }
```

**Limites:** máximo de 5000 caracteres.

**Resposta (200):**

```json
{
  "titulo": "string",
  "resumo": "string",
  "objetivo": "string",
  "publico_alvo": "string",
  "canal": "string",
  "entregaveis": ["string"] | "string",
  "prazo": "string",
  "prioridade": "Alta | Média | Baixa",
  "checklist": ["string"],
  "informacoes_faltantes": ["string"],
  "perguntas_de_alinhamento": ["string"]
}
```

**Erros:**
| Status | Motivo |
|---|---|
| `400` | Campo `briefing` ausente, não é string ou ultrapassa 5000 caracteres |
| `500` | Falha ao processar com a Groq API |

### `GET /health`

Verificação de saúde do servidor. Retorna `{ "status": "ok" }`.

## Estrutura do projeto

```
src/
├── constants/
│   └── index.ts       # MAX_BRIEFING_LENGTH, SYSTEM_PROMPT
├── routes/
│   ├── briefing/
│   │   └── index.ts   # POST /analyse-briefing
│   └── health/
│       └── index.ts   # GET /health
├── types/
│   └── index.ts       # interface BriefingResult
├── utils/
│   └── index.ts       # funções úteis (formatBriefingResult)
└── index.ts           # configuração do servidor (CORS, middlewares)
```

## Segurança em produção

- Configure `ALLOWED_ORIGINS` com o domínio real do frontend (ex: `https://meuapp.vercel.app`)
- Use HTTPS — configure no proxy/load balancer (Vercel, Railway, Render, etc.)
- Considere adicionar `express-rate-limit` para proteger a Groq API de abuso
- Nunca commite o arquivo `.env`
