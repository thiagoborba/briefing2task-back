import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import briefingRoutes from './routes/briefing';
import healthRoutes from './routes/health';

if (!process.env.GROQ_API_KEY) {
  console.error('Erro: variável de ambiente GROQ_API_KEY não definida.');
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

const isDev = process.env.NODE_ENV === 'development';

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];

app.use(cors({ origin: isDev ? true : allowedOrigins }));
app.use(express.json());

app.use(healthRoutes);
app.use(briefingRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
