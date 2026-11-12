# Streambox frontend

Frontend React + Vite para [conradomotta/netflix-backend](https://github.com/conradomotta/netflix-backend). Identidade visual original, inspirada na experiência de navegação de serviços de streaming.

## Requisitos

- Node.js 20+
- Backend clonado e rodando em `http://localhost:3000`
- Token válido do TMDB definido em `TMDB_TOKEN` no `.env` do backend

## Executar

**Terminal 1 (backend):**

```bash
git clone https://github.com/conradomotta/netflix-backend.git
cd netflix-backend
npm install
# Crie o arquivo .env com TMDB_TOKEN=seu_token_aqui
node server.js
```

**Terminal 2 (frontend):**

```bash
cd streambox-frontend
npm install
npm run dev
```

Abra `http://localhost:5173`.

## Integração

Em desenvolvimento, o Vite redireciona `/tmdb` e `/filmes` ao backend na porta 3000, evitando problemas com CORS. Se o backend estiver em outra porta, configure `VITE_API_PROXY_TARGET` no `.env` do frontend. Para produção em domínios distintos, configure `VITE_API_URL` com a URL do backend e habilite CORS no Express (ou use reverse proxy de mesma origem).

## Recursos

- Página inicial com destaque e carrosséis usando `GET /tmdb/em-alta`.
- Busca com debounce usando `GET /tmdb/pesquisar?query=...`.
- Modal com detalhes e elenco usando os endpoints do TMDB do servidor.
- Minha lista no `localStorage` (por navegador). Apenas filmes visíveis na sessão são exibidos na lista; para persistência plena entre sessões, o backend precisaria armazenar perfis ou oferecer consulta de múltiplos IDs.
- Gerenciamento de catálogo SQLite (listar, criar, editar e excluir filmes).
- Estados vazios, carregamento, falhas de API e layout responsivo.

## Limitações do backend atual

O servidor não possui endpoints para login, perfis, trailers ou streaming. Botões de detalhes e favoritos não simulam reprodução de vídeo. O catálogo local armazena apenas título, categoria e ano, então seus registros são gerenciados em uma tabela, sem cartazes fictícios.

## Créditos

Imagens e metadados de filmes: TMDB. Não afiliado a Netflix, Amazon Prime Video nem TMDB.
