# - API Passagem Aérea

API para gerenciamento de voos, assentos, reservas e pagamentos.  
Backend em Node.js com PostgreSQL e autenticação JWT.

## Tecnologias
- Node.js + Express
- PostgreSQL + Knex
- JWT + Passport
- bcrypt
- Vue.js (frontend separado)

## Requisitos
- Node.js (>= 14)
- PostgreSQL
- npm ou yarn

## Configuração

### 1. Clone o repositório

git clone https://github.com/ZardsMK/ZardsMK-API-Passagem-Aerea.git

### 2. Configure o backend

cd backend

npm install

## Crie o arquivo .env na pasta backend:

DB_HOST=localhost

DB_USER=seu_usuario

DB_PASSWORD=sua_senha

DB_NAME=nome_do_banco

DB_PORT=5432

PORT=3000

AUTH_SECRET=sua_chave_secreta

## Rode as migrations:

npx knex migrate:latest

## Inicie o servidor:

npm start

## Configure o frontend

cd frontend

npm install

npm run serve
