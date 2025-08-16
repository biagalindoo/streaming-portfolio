import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import catalogRoutes from './routes/catalog.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API ouvindo em http://localhost:${PORT}`);
});