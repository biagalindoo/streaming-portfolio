import express from 'express';
import { v4 as uuid } from 'uuid';
import { readJson, writeJson } from '../lib/fileDb.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

const CATALOG_PATH = 'db/shows.json';

/**
 * GET /api/catalog
 * Público: lista o catálogo (series/episódios)
 */
router.get('/', async (_req, res) => {
  const items = await readJson(CATALOG_PATH);
  res.json(items);
});

/**
 * POST /api/catalog
 * Autenticado: cria um item de catálogo.
 * Body esperado:
 * {
 *   "type": "show" | "episode",
 *   "title": "Nome",
 *   "description": "Sinopse",
 *   "coverUrl": "https://...",
 *   "videoUrl": "https://.../playlist.m3u8" (opcional por enquanto),
 *   "showId": "id da série" (quando for episódio),
 *   "season": 1,
 *   "episodeNumber": 1
 * }
 */
router.post('/', authRequired, async (req, res) => {
  const body = req.body || {};
  if (!body.title || !body.type) {
    return res.status(400).json({ error: 'title e type são obrigatórios' });
  }
  const items = await readJson(CATALOG_PATH);
  const item = {
    id: uuid(),
    type: body.type,
    title: body.title,
    description: body.description || '',
    coverUrl: body.coverUrl || '',
    videoUrl: body.videoUrl || '',
    showId: body.showId || null,
    season: body.season || null,
    episodeNumber: body.episodeNumber || null,
    createdAt: new Date().toISOString()
  };
  items.push(item);
  await writeJson(CATALOG_PATH, items);
  res.status(201).json(item);
});

router.put('/:id', authRequired, async (req, res) => {
  const { id } = req.params;
  const items = await readJson(CATALOG_PATH);
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Item não encontrado' });
  items[idx] = { ...items[idx], ...req.body, id };
  await writeJson(CATALOG_PATH, items);
  res.json(items[idx]);
});

router.delete('/:id', authRequired, async (req, res) => {
  const { id } = req.params;
  const items = await readJson(CATALOG_PATH);
  const next = items.filter(i => i.id !== id);
  if (next.length === items.length) return res.status(404).json({ error: 'Item não encontrado' });
  await writeJson(CATALOG_PATH, next);
  res.status(204).send();
});

export default router;