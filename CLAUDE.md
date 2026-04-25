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
npm run db:reset     # wipe + re-migrate + re-seed (dev only)
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
- **Controllers** (`src/controllers/`) — business logic, validation, and auth guards. This is where `requireAuth` and `requireOwnership` live.
- **Resolvers** (`src/graphql/resolvers/`) — thin GraphQL entry points, pass args + context to controllers
- **Schema** (`src/graphql/schema/`) — each entity uses `extend type Query / extend type Mutation` against a base `type Query` / `type Mutation` defined in `src/graphql/index.ts`

Adding a new entity: create `schema/<entity>/`, `resolvers/<entity>/`, `models/<entity>Model.ts`, `controllers/<entity>Controller.ts`, then spread into `src/graphql/index.ts`.

### Auth — httpOnly Cookie + JWT

Auth is REST for login/logout/me, GraphQL context for protected mutations.

**REST endpoints:**
- `POST /login` → verifies credentials, sets httpOnly cookie with JWT, returns `{ email }`
- `POST /logout` → clears the cookie
- `GET /me` → verifies cookie, returns `{ email }` or 401

**JWT payload:** `{ sub: userId, email, companyId }` — `companyId` is embedded at login so protected mutations never need an extra DB lookup for ownership checks.

**GraphQL context** (`src/graphql/index.ts` + `src/app.ts`):
```ts
export type GraphQLContext = { userId: string | null; companyId: string | null };
```
The `context` function in `expressMiddleware` reads `req.cookies.token`, verifies the JWT, and returns `{ userId, companyId }`. Resolvers pass these to controllers.

**Controller guards** (`src/controllers/jobController.ts`):
```ts
requireAuth(userId);              // throws UNAUTHENTICATED if null
requireOwnership(job.companyId, userCompanyId!); // throws FORBIDDEN if mismatch
```
Ownership is company-level: a user can only manage jobs belonging to their own company.

**Protected mutations:** `createJob`, `deleteJob`, `updateJob` — all call both guards.
**Public queries:** `jobs`, `job`, `companies`, `company` — no auth required.

### Error conventions — GraphQLError with extension codes

Always throw `GraphQLError` from `'graphql'` in controllers, never plain `Error`:

```ts
throw new GraphQLError('Job not found', { extensions: { code: 'NOT_FOUND' } });
throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
throw new GraphQLError('Forbidden', { extensions: { code: 'FORBIDDEN' } });
```

Errors surface in `response.errors[0].extensions.code` — never in HTTP status codes (GraphQL always returns 200).

### Client — Feature-based

```
src/
├── app/            # App.tsx, providers.tsx (Apollo + Router), routes.tsx
├── features/       # auth/, jobs/, companies/ — each has pages/, components/, hooks/, api/, types.ts
├── shared/         # components used across features (NavBar)
└── lib/            # apolloClient.ts, graphql.ts (useGQLQuery/useGQLMutation)
```

### Auth state — AuthContext

`features/auth/context/AuthContext.tsx` — on mount, calls `GET /me` to restore session from the cookie. No token ever stored in JS or localStorage.

```ts
const { user, isInitializing, login, logout } = useAuth();
```

- `isInitializing` — true while `/me` is in-flight on page load; use to suppress UI flicker in NavBar
- `login(email)` — stores email in state after successful login
- `logout(redirectTo?)` — calls `POST /logout`, then `window.location.href = redirectTo` (defaults to `'/'`). Hard redirect resets the Apollo cache.

**Auth API files** (`features/auth/api/`):
- `login.ts` — `fetch POST /login` with `credentials: 'include'`
- `logout.ts` — `fetch POST /logout` with `credentials: 'include'`
- `me.ts` — `fetch GET /me` with `credentials: 'include'`

Apollo Client (`lib/apolloClient.ts`) uses `credentials: 'include'` so cookies are sent with every GraphQL request automatically.

### `lib/graphql.ts` — Apollo wrapper

All Apollo calls go through `useGQLQuery` / `useGQLMutation` from `lib/graphql.ts`. Never import `useQuery` / `useMutation` from `@apollo/client` directly in feature code.

### `features/<entity>/api/` layout

Each feature's `api/` folder owns both the gql documents and the data-fetching hooks:

```
features/jobs/api/
├── jobQueries.ts      # gql documents (GET_JOBS, GET_JOB)
├── jobMutations.ts    # gql documents (CREATE_JOB, UPDATE_JOB, DELETE_JOB)
├── useJobs.ts         # useGQLQuery(GET_JOBS)
├── useJob.ts          # useGQLQuery(GET_JOB)
├── useCreateJob.ts    # useGQLMutation(CREATE_JOB)
├── useUpdateJob.ts    # useGQLMutation(UPDATE_JOB)
└── useDeleteJob.ts    # useGQLMutation(DELETE_JOB)
```

`features/<entity>/hooks/` is reserved for pure custom hooks with no network calls.

### Hook return naming convention

Follow the `is` + verb + entity pattern for all boolean loading states:

```ts
// query hooks
const { jobs, isLoadingJobs, error } = useJobs();
const { job, isLoadingJob, error } = useJob(id);
const { companies, isLoadingCompanies, error } = useCompanies();
const { company, isLoadingCompany, error } = useCompany(id);

// mutation hooks
const { createJob, isCreatingJob, error } = useCreateJob();
const { updateJob, isUpdatingJob, error } = useUpdateJob(jobId);
const { deleteJob, isDeletingJob, error } = useDeleteJob();
```

Names are unique per hook — no aliasing needed on destructure. `error` is the error object, not a boolean.

`features/<entity>/components/` holds JSX components scoped to that feature (`TrashIcon`, `PencilIcon`). Promote to `shared/components/` only when used across multiple features.

### React page conventions

**Query errors** (loading data) — early return pattern:
```tsx
if (isLoadingJob) return <Skeleton />;
if (error) return <ErrorState />;   // full-screen, blocks page
return <Content />;
```

**Mutation errors** (actions: delete, update) — inline pattern, never block the page:
```tsx
// wrap the mutation call in try/catch
const handleDelete = async () => {
  try {
    await deleteJob(id);
  } catch (err) {
    setInlineError(getGraphQLMessage(err));  // show on the specific card/footer
  }
};

// helper to extract the server message
function getGraphQLMessage(err: unknown): string {
  const apolloErr = err as ApolloError;
  return apolloErr?.graphQLErrors?.[0]?.message ?? 'Something went wrong';
}
```

Mutation errors appear inline on the element that triggered them (card pill, footer banner) — not as a full-screen early return.

**Auth-gated UI** — wrap action buttons in `{user && (...)}`. The server enforces the real guard; the UI is UX only.

## Key Constraints

- **GraphQL always returns HTTP 200** — errors appear in `response.errors[]`, not HTTP status codes. Only `400` (malformed query) and `500` (crash) are exceptions.
- **PostgreSQL local** — Homebrew install, database `jobboard`, no password. Connection: `postgresql://edgar.hernandez@localhost:5432/jobboard`. Start with `brew services start postgresql@16` if not running.
- **Prisma migrate, not push** — always use `migrate dev` (not `db push`) to keep migration history.
- **Cookies, not localStorage** — the JWT lives in an httpOnly cookie. Never store the token in JS. The client only knows the user's `email` (from `/me` or the login response).
- **Two auth layers** — UI hides buttons for unauthenticated users; server enforces `UNAUTHENTICATED` / `FORBIDDEN` on every protected mutation regardless.
