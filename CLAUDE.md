# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projects

Two separate projects under this root — always `cd` into the right one before running commands.

| Project | Dir | Port |
|---|---|---|
| Backend (Node/GraphQL) | `server/` | 4000 |
| Frontend (React/Vite) | `client/` | 5173 |

## Server Commands

```bash
cd server
npm run dev          # start with tsx watch (hot reload)
npm run db:migrate   # create/apply Prisma migrations → creates tables
npm run db:generate  # regenerate Prisma client after schema changes
npm run db:studio    # open Prisma Studio (visual DB browser)
npm run db:seed      # seed DB with sample companies/jobs/users
npx tsc --noEmit     # type-check without building
```

## Client Commands

```bash
cd client
npm run dev          # Vite dev server
npm run build        # tsc + vite build
npx tsc --noEmit     # type-check without building
```

## Architecture

### Server — MVC over GraphQL

```
Resolver → Controller → Model → Prisma → PostgreSQL
```

- **Models** (`src/models/`) — pure Prisma DB operations only, no logic
- **Controllers** (`src/controllers/`) — business logic and validation (e.g. verify company exists before inserting a job). This is where guards/checks live — GraphQL has no HTTP middleware per operation.
- **Resolvers** (`src/graphql/resolvers/`) — thin GraphQL entry points, pass args to controllers
- **Schema** (`src/graphql/schema/`) — each entity uses `extend type Query / extend type Mutation` against a base `type Query` / `type Mutation` defined in `src/graphql/index.ts`

Adding a new entity: create `schema/<entity>/`, `resolvers/<entity>/`, `models/<entity>Model.ts`, `controllers/<entity>Controller.ts`, then spread into `src/graphql/index.ts`.

Auth is REST-only for now: `POST /login` → `authController` → returns JWT. GraphQL context is not wired (no `buildContext`).

### Client — Feature-based

```
src/
├── app/            # App.tsx, providers.tsx (Apollo + Router), routes.tsx
├── features/       # auth/, jobs/, companies/ — each has pages/, components/, hooks/, api/, types.ts
├── shared/         # components used across features (NavBar)
├── lib/            # apolloClient.ts
└── store/          # (removed — using AuthContext instead)
```

Auth state lives in `features/auth/context/AuthContext.tsx` (React Context + useState). `useAuth()` hook consumed by NavBar and `useLogin` hook.

Apollo Client (`lib/apolloClient.ts`) points to `http://localhost:4000/graphql`. Token auth link is not yet wired — will be added when GraphQL auth is implemented.

#### `lib/graphql.ts` — Apollo wrapper

All Apollo calls go through `useGQLQuery` / `useGQLMutation` from `lib/graphql.ts`. Never import `useQuery` / `useMutation` from `@apollo/client` directly in feature code — this keeps the Apollo dependency in one place so swapping data-fetching libraries only requires changing `lib/graphql.ts`.

#### `features/<entity>/api/` layout

Each feature's `api/` folder owns both the gql documents and the data-fetching hooks that use them:

```
features/jobs/api/
├── jobQueries.ts      # gql documents (GET_JOBS, GET_JOB)
├── jobMutations.ts    # gql documents (CREATE_JOB)
├── useJobs.ts         # useGQLQuery(GET_JOBS)
├── useJob.ts          # useGQLQuery(GET_JOB)
└── useCreateJob.ts    # useGQLMutation(CREATE_JOB)
```

`features/<entity>/hooks/` is reserved for pure custom hooks that contain no network calls (form state, filters, derived UI state, etc.).

#### Hook return naming convention

Follow the `is` + verb + entity pattern for all boolean loading states:

```ts
// query hooks
const { jobs, isLoadingJobs, error } = useJobs();
const { job, isLoadingJob, error } = useJob(id);
const { companies, isLoadingCompanies, error } = useCompanies();
const { company, isLoadingCompany, error } = useCompany(id);

// mutation hooks
const { createJob, isCreatingJob, error } = useCreateJob();
const { deleteJob, isDeletingJob, error } = useDeleteJob();
```

Names are unique per hook so no aliasing is ever needed on destructure. Keep `error` as-is — it's the error object, not a boolean.

`features/<entity>/components/` holds JSX components scoped to that feature (e.g. `TrashIcon`, job-specific cards). Never define reusable JSX as a plain function inside a page file — if it renders JSX it belongs in `components/`. Promote to `shared/components/` only when used across multiple features.

### React page conventions

Pages that fetch async data follow the **early-return pattern** — handle `loading` and `error` first, then return the happy path unconditionally:

```tsx
if (loading) return <Skeleton />;
if (error)   return <ErrorState />;
return <Content />;   // data is guaranteed here
```

For pages where the header always renders (e.g. `HomePage`), loading/error return early before the header, and the empty-vs-list state uses a ternary inside the happy-path return.

## Key Constraints

- **GraphQL always returns HTTP 200** — errors appear in `response.errors[]`, not HTTP status codes. Only `400` (malformed query) and `500` (crash) are exceptions.
- **PostgreSQL local** — Homebrew install, database `jobboard`, no password. Connection: `postgresql://edgar.hernandez@localhost:5432/jobboard`. Start with `brew services start postgresql@16` if not running.
- **Prisma migrate, not push** — always use `migrate dev` (not `db push`) to keep migration history.
