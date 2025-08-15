# API de Gerenciamento de Usuários - Back-end

API desenvolvida com **Node.js** e **NestJS** responsável por disponibilizar rotas para que o front-end possa **persistir** e **consultar** informações sobre usuários cadastrados.

---

## 🚀 Tecnologias

- [NestJS](https://nestjs.com/)
- Node.js **v20**
- MySQL (via Docker)
- Redis (via Docker)

---

## 📋 Pré-requisitos

- Node.js v20
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

> O uso do Docker é necessário para subir os containers de **MySQL** e **Redis**.

---

## ⚙️ Configuração e Execução

```bash
# 1. Clonar o repositório
git clone <url-do-repositorio>
cd <nome-da-pasta>

# 2. Copiar variáveis de ambiente
cp .env.sample .env

# 3. Subir containers do MySQL e Redis
docker compose up -d

# 4. Instalar dependências
npm install

# 5. Iniciar o projeto em modo desenvolvimento
npm run start:dev
```

## 🌐 Disponibilidade

A API estará disponível em:  
👉 **http://localhost:3001**

## 📌 Funcionalidades

- Cadastro de usuários
- Edição de usuários
- Remoção de usuários
- Consulta de usuários (por ID ou listagem geral)

## 🧪 Testes

```bash
# 1. Acessar a pasta do projeto
cd <nome-da-pasta>

# 2. Iniciar execução do teste
npm run test
```
