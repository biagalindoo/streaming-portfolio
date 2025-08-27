# 🎬 Streaming Portfolio

Uma plataforma de streaming moderna e responsiva com funcionalidades avançadas de personalização e acessibilidade.

## ✨ Funcionalidades

### 🎨 Interface Moderna
- **Modo Escuro/Claro**: Toggle automático com persistência
- **Paleta de Cores Personalizável**: Personalize as cores primárias e secundárias
- **Design Responsivo**: Interface adaptável para todos os dispositivos
- **Animações Suaves**: Transições e efeitos visuais elegantes

### 🔐 Sistema de Autenticação
- Login e cadastro de usuários
- Autenticação JWT
- Proteção de rotas
- Perfil de usuário

### 📺 Catálogo de Conteúdo
- Filmes e séries com informações detalhadas
- Sistema de busca e filtros
- Visualização de episódios para séries
- Cards interativos com hover effects

### ❤️ Sistema de Favoritos
- Adicionar/remover itens da lista
- Visualização da lista pessoal
- Sincronização em tempo real

### ⭐ Sistema de Avaliações
- Avaliar filmes e séries
- Visualizar médias de avaliação
- Histórico de avaliações

### ♿ Acessibilidade
- Navegação por teclado
- Contraste adequado
- Focus indicators
- Screen reader friendly

## 🚀 Tecnologias

### Frontend
- **React 18** - Framework principal
- **React Router** - Navegação
- **Context API** - Gerenciamento de estado
- **CSS-in-JS** - Estilização dinâmica

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework web
- **JWT** - Autenticação
- **JSON** - Armazenamento de dados

## 🛠️ Instalação

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd streaming-portfolio-frontend
npm install
npm start
```

## 🎯 Melhorias Implementadas

### 1. Modo Escuro/Claro 🌙☀️
- Toggle automático no header
- Persistência no localStorage
- Transições suaves entre temas
- Cores otimizadas para cada modo

### 2. Paleta de Cores Personalizável 🎨
- Seletor de cores primárias e secundárias
- Preview em tempo real
- Botão de reset para cores padrão
- Persistência das preferências

### 3. Acessibilidade Melhorada ♿
- Focus indicators visíveis
- Contraste adequado em ambos os temas
- Navegação por teclado
- Transições suaves para usuários sensíveis

### 4. Interface Aprimorada ✨
- Cards com hover effects
- Loading states elegantes
- Estados vazios informativos
- Feedback visual para ações

### 5. Sistema de Favoritos Corrigido ❤️
- Sincronização em tempo real
- Feedback visual imediato
- Tratamento de erros
- Estados de loading

## 📱 Como Usar

### Navegação
- Use o menu lateral para navegar entre seções
- Filtre por tipo (filmes/séries) e gênero
- Use a busca para encontrar conteúdo específico

### Personalização
- Clique no botão de tema para alternar entre escuro/claro
- Use o botão "🎨 Cores" para personalizar a paleta
- As preferências são salvas automaticamente

### Favoritos
- Faça login para acessar a funcionalidade
- Clique em "+ Minha Lista" para adicionar
- Acesse "Minha Lista" para ver seus favoritos

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` no backend:
```env
PORT=4000
JWT_SECRET=sua_chave_secreta_aqui
```

### Proxy
O frontend está configurado para usar o backend na porta 4000. Se necessário, ajuste o proxy no `package.json` do frontend.

## 🎨 Personalização

### Cores Padrão
- **Primária**: #00d4ff (azul ciano)
- **Secundária**: #6c5ce7 (roxo)

### Temas
- **Escuro**: Fundo escuro com texto claro
- **Claro**: Fundo claro com texto escuro

## 📊 Estrutura do Projeto

```
streaming-portfolio/
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── routes/         # Rotas da API
│   │   ├── middleware/     # Middlewares
│   │   └── lib/           # Utilitários
│   └── db/                # Dados JSON
└── streaming-portfolio-frontend/
    ├── src/
    │   ├── components/    # Componentes React
    │   ├── context/       # Contextos (Auth, Theme)
    │   └── styles/        # Estilos globais
    └── public/           # Arquivos estáticos
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🙏 Agradecimentos

- Imagens dos filmes: The Movie Database (TMDB)
- Ícones: Emoji Unicode
- Inspiração: Netflix, Disney+, Amazon Prime

---

**Desenvolvido com ❤️ para demonstrar habilidades em React e Node.js**
