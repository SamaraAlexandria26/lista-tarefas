# ✅ Lista de Tarefas

Aplicação web moderna de gerenciamento de tarefas, construída com **React** e **Supabase**.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase&logoColor=white)

## ✨ Funcionalidades

- 📋 CRUD completo de tarefas (criar, ler, editar, excluir)
- 🏷️ Categorias com cores (Trabalho, Pessoal, Estudos, Outros)
- 📅 Visualização em calendário
- 📊 Dashboard com analytics
- 🔐 Autenticação de usuários
- 🌙 Tema escuro premium
- 📱 Design responsivo

## 🚀 Tecnologias

- **Frontend:** React 19 + Vite 8
- **Backend:** Supabase (PostgreSQL + Auth)
- **Estilização:** CSS puro com design system customizado

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/SamaraAlexandria26/lista-tarefas.git
cd lista-tarefas

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase

# Inicie o servidor de desenvolvimento
npm run dev
```

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

| Variável | Descrição |
|---|---|
| `VITE_SUPABASE_URL` | URL do seu projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima (pública) do Supabase |

## 🏗️ Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | Verificação de código |

## 📄 Licença

Este projeto é de uso pessoal/educacional.
