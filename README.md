# 🌌 X-PRIVE | Premium Dashboard & Gateway

Bem-vindo ao **X-PRIVE**, uma plataforma de gerenciamento de atalhos e exploração web com interface de alta performance, focada em UX minimalista e segurança.

---

## 🚀 Tecnologias Core

* **Front-end:** Next.js + Tailwind CSS
* **Animações:** GSAP (GreenSock) para micro-interações e efeitos de transição
* **Back-end:** FastAPI (Python) + PostgreSQL
* **Mobile:** Suporte completo a PWA (Progressive Web App) com Service Workers

---

## 🛠️ Configuração do Ambiente

### 1️⃣ Front-end (Next.js)

Instale as dependências:

```bash
npm install
# ou
yarn install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

Acesse a aplicação em: [http://localhost:3000](http://localhost:3000)

### 2️⃣ Back-end (FastAPI)

Crie um ambiente virtual Python:

```bash
python -m venv venv
# Ativar (Linux/Mac)
source venv/bin/activate
# Ativar (Windows)
venv\Scripts\activate
```

Instale as dependências:

```bash
pip install fastapi uvicorn psycopg2-binary python-dotenv pydantic
```

Configure o banco de dados PostgreSQL criando um arquivo `.env` na raiz do back-end:

```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco
```

> Substitua `usuario`, `senha` e `nome_do_banco` pelos dados do seu PostgreSQL.

Inicie o servidor FastAPI:

```bash
uvicorn main:app --reload
```

Acesse a documentação automática:

* Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* Redoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 🔗 Estrutura do Projeto

```
├── frontend/         # Código Next.js + Tailwind CSS
├── backend/          # Código FastAPI + PostgreSQL
├── README.md         # Documentação do projeto
└── .env              # Variáveis de ambiente (não versionar)
```

---

## 🛣️ Funcionalidades

* Dashboard premium com atalhos personalizáveis
* Micro-interações e animações suaves com GSAP
* Integração completa entre front-end e back-end
* Suporte PWA e offline via Service Workers
* API FastAPI para gerenciar dados de usuários e atalhos

---

## 📝 Notas

* Mantenha o arquivo `.env` fora do controle de versão para proteger credenciais
* Certifique-se que o PostgreSQL está ativo antes de iniciar o back-end
* Next.js + Tailwind CSS permitem um front-end responsivo e moderno
