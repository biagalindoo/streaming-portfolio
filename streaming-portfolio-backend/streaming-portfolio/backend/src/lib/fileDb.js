import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

export async function readJson(relPath) {
  const file = path.join(rootDir, relPath);
  try {
    const data = await fs.readFile(file, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, '[]');
      return [];
    }
    throw err;
  }
}

export async function writeJson(relPath, content) {
  const file = path.join(rootDir, relPath);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(content, null, 2));
}