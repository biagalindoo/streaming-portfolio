import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { readJson, writeJson } from '../lib/fileDb.js';

const router = express.Router();

const USERS_PATH = 'db/users.json';

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email e password são obrigatórios' });
  }

  const users = await readJson(USERS_PATH);
  const exists = users.find(u => u.email.toLowerCase() == email.toLowerCase());
  if (exists) return res.status(409).json({ error: 'Email já cadastrado' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: uuid(), name, email, passwordHash, createdAt: new Date().toISOString() };
  users.push(user);
  await writeJson(USERS_PATH, users);

  return res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email e password são obrigatórios' });
  }
  const users = await readJson(USERS_PATH);
  const user = users.find(u => u.email.toLowerCase() == email.toLowerCase());
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });

  const token = jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  return res.json({ token });
});

export default router;