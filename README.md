🌌 X-PRIVE | Premium Dashboard & Gateway
Bem-vindo ao X-PRIVE, uma plataforma de gerenciamento de atalhos e exploração web com interface de alta performance, focada em UX minimalista e segurança.

🚀 Tecnologias Core
Front-end: Next.js + Tailwind CSS

Animações: GSAP (GreenSock) para micro-interações e efeitos de transição.

Back-end: FastAPI (Python) + PostgreSQL

Mobile: Suporte completo a PWA (Progressive Web App) com Service Workers.

🛠️ Configuração do Ambiente
1. Front-end (Next.js)
Primeiro, instale as dependências:

Bash

npm install
# ou
yarn install
Inicie o servidor de desenvolvimento:

Bash

npm run dev
Abra http://localhost:3000 para ver o resultado.

2. Back-end (FastAPI)
Navegue até a pasta do servidor (se houver) e instale as dependências Python:

Bash

pip install fastapi uvicorn psycopg2-binary python-dotenv
Configure o seu banco de dados no arquivo .env:

Snippet de código

DATABASE_URL=sua_url_do_postgresql
Inicie a API:

Bash

uvicorn main:app --reload
🔒 Fluxo de Acesso
O projeto possui um Password Gate de alta segurança na raiz:

Entrada: Validação em tempo real com feedback tátil (shake effect) via GSAP.

Sessão: Integração com Service Workers para persistência e performance offline.

Dashboard: Carregamento dinâmico de cards com favicons automáticos via API.

📁 Estrutura de Pastas
/pages/index.js - Portal de entrada (Password Gate).

/pages/home.js - Dashboard principal X-PRIVE.

/public - Manifesto PWA e Service Worker (sw.js).

/styles - Configurações globais do Tailwind e fontes Inter/Outfit.

🌐 Deploy
A maneira mais fácil de implantar é usando a Vercel Platform:

Conecte seu repositório GitHub.

Configure as variáveis de ambiente (se houver).

O Next.js detectará automaticamente as configurações de build.

Desenvolvido com foco em performance e estética premium. 🛡️
