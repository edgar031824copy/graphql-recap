# Job Board

A full-stack job board application built with GraphQL, React, and PostgreSQL. Companies can post jobs and users authenticate via JWT to manage listings.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Apollo Client, React Router v6, Tailwind CSS, Vite |
| Backend | Node.js, Express, Apollo Server 4, GraphQL |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT (REST endpoint) |

## Project Structure

```
graphql/
├── client/   # React/Vite frontend (port 5173)
└── server/   # Node/GraphQL backend (port 4000)
```

## Prerequisites

- Node.js 18+
- PostgreSQL 16 (Homebrew: `brew install postgresql@16`)
- A local database named `jobboard`

## Getting Started

### 1. Database

```bash
brew services start postgresql@16
createdb jobboard
```

### 2. Server

```bash
cd server
cp .env.example .env   # set DATABASE_URL and JWT_SECRET
npm install
npm run db:migrate     # create tables
npm run db:seed        # optional: load sample data
npm run dev            # starts on http://localhost:4000
```

### 3. Client

```bash
cd client
npm install
npm run dev            # starts on http://localhost:5173
```

## Server Commands

```bash
npm run dev          # start with hot reload (tsx watch)
npm run db:migrate   # create/apply Prisma migrations
npm run db:generate  # regenerate Prisma client after schema changes
npm run db:studio    # open Prisma Studio (visual DB browser)
npm run db:seed      # seed DB with sample companies/jobs/users
npx tsc --noEmit     # type-check without building
```

## Client Commands

```bash
npm run dev          # Vite dev server
npm run build        # tsc + Vite production build
npx tsc --noEmit     # type-check without building
```

## API

- **GraphQL** — `POST http://localhost:4000/graphql`
- **Login** — `POST http://localhost:4000/login` → returns JWT

GraphQL always responds with HTTP 200; errors are in `response.errors[]`.

## Data Model

```
Company
  id, name, description
  ├── Job[]   (title, description, date)
  └── User[]  (email, password)
```

## Architecture

The server follows MVC over GraphQL:

```
Resolver → Controller → Model → Prisma → PostgreSQL
```

- **Models** (`src/models/`) — Prisma DB operations only
- **Controllers** (`src/controllers/`) — business logic and validation
- **Resolvers** (`src/graphql/resolvers/`) — thin GraphQL entry points
- **Schema** (`src/graphql/schema/`) — per-entity SDL files

The client uses a feature-based layout under `src/features/` (auth, jobs, companies). All Apollo calls go through `useGQLQuery` / `useGQLMutation` from `src/lib/graphql.ts`.
