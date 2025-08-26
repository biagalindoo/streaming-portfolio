/* Simple mock API for development */
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const catalog = [
  { id: '1', title: 'Interestelar', year: 2014, posterUrl: 'https://image.tmdb.org/t/p/w300/nBNZadXqJSdt05SHLqgT0HuC5Gm.jpg', genres: ['Ficção Científica', 'Aventura'], description: 'Um grupo de exploradores viaja através de um buraco de minhoca no espaço em uma tentativa de garantir a sobrevivência da humanidade.' },
  { id: '2', title: 'A Origem', year: 2010, posterUrl: 'https://image.tmdb.org/t/p/w300/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', genres: ['Ficção Científica', 'Ação'], description: 'Um ladrão que invade os sonhos das pessoas deve realizar a missão impossível de plantar uma ideia na mente de um alvo.' },
  { id: '3', title: 'O Cavaleiro das Trevas', year: 2008, posterUrl: 'https://image.tmdb.org/t/p/w300/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg', genres: ['Ação', 'Crime'], description: 'Batman enfrenta o Coringa, um gênio do crime que mergulha Gotham no caos.' }
];

app.get('/api/catalog', (req, res) => {
  res.json(catalog);
});

app.get('/api/movies/:id', (req, res) => {
  const item = catalog.find(m => m.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Credenciais inválidas' });
  res.json({ token: 'mock-token-123', user: { email } });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Dados inválidos' });
  res.status(201).json({ message: 'Cadastro ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Mock API listening on http://localhost:${PORT}`));


