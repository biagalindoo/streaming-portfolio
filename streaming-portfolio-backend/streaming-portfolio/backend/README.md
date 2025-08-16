# Streaming Portfolio - Backend

API simples em Node.js/Express para um projeto de streaming (portfólio).

## Requisitos
- Node.js >= 18
- npm

## Instalação
```bash
npm install
cp .env.example .env  # edite JWT_SECRET
npm run dev
```

API sobe por padrão em `http://localhost:4000`.

## Endpoints
- `POST /api/auth/register` — cria usuário `{name, email, password}`
- `POST /api/auth/login` — login `{email, password}` → `{token}`
- `GET /api/catalog` — lista séries/episódios (público)
- `POST /api/catalog` — cria série/episódio (autenticado)
- `PUT /api/catalog/:id` — edita item (autenticado)
- `DELETE /api/catalog/:id` — remove item (autenticado)

> Para facilitar no portfólio, os dados são salvos como JSON em `db/`.

## Próximos passos
- Migrar de JSON para um banco (PostgreSQL).
- Adicionar controle de permissões (admin).
- Converter vídeos com HLS e servir `.m3u8`.