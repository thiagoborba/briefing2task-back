import express from 'express';
import cors from 'cors';
import briefingRoutes from './routes/briefing.routes';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(briefingRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
