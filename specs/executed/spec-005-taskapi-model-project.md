# Spec 005 — TaskAPI, the Model Project of the Express.js Guide

Status: **Completed**
Date: 2026-08-30
Related: `docs/TODO.md` → `[TASK-023]`

## Context & Rationale

The Express.js guide has 33 concept pages (everything under
`src/content/docs/courses/expressjs/` except `practice/`) plus a "Na Prática"
section holding two cumulative applications (InvestApp, MonitorApp) and seven
standalone projects.

An audit of where the concept pages get their code from produced this:

| Source of the code shown on concept pages | Blocks |
| ----------------------------------------- | ------ |
| `<SourceCode>` / `<CodeTabs>` pointing at a real project | ~38 |
| Hand-written fence carrying a `title="src/…"` file path | **172** |

So roughly **82% of the code the guide presents as a project file does not exist
in any runnable project**, and 20 of the 33 concept pages reference no executable
project at all: `deploy`, `email`, `realtime`, `system-call`, `upload-file`,
`construction`, `documentation`, `pagination`, `validation`, `config`, `logging`,
`observability`, `controllers`, `middleware`, `request-response`, `routes`,
`node-sqlite`, `relations`, `cors`, `hardening`.

This is a systematic breach of rule 1 in `AGENTS.md` ("lesson code is not copied
into Markdown"), and it has three measurable consequences.

### Consequence 1 — the hand-written blocks already drifted

`persistence/node-sqlite.mdx` and `auth/authorization.mdx` hand-write
`src/models/investment-model.ts`. In the InvestApp the file is actually named
`src/models/Investment.ts`, with different contents. A reader moving from the
concept page to the InvestApp step finds a different project. `pnpm
check:doc-lines` cannot catch this, because it only validates `<SourceCode>`.

### Consequence 2 — the guide borrows the two applications' domains

The concept pages mix `user`, `investment` (InvestApp), `host` (MonitorApp),
`product`, `post` and `category`. That variety is accidental, not pedagogical.

### Consequence 3 — the "standalone" projects are already a broken trail

| Project | Language | Structure | Continues the previous one? |
| ------- | -------- | --------- | --------------------------- |
| `hello` | JS | single file | — |
| `router` | JS | + `routes/` | yes |
| `mvc` | JS | + `controllers/`, `models/`, `middlewares/` | yes |
| `typescript` | TS | + `errors/`, `types/` | yes |
| `prisma` | **JS** | back to JS, **Prisma 6** | **no** — regresses |
| `auth` | TS | + JWT and authorization, but **in memory** | no — does not build on `prisma` |

All six already share the same `User` domain (`Ana`, `Bruno`). The trail exists;
it was simply never declared, which is why step 5 regresses from TypeScript to
JavaScript and step 6 does not inherit the database.

Three example directories are orphaned — referenced by no page at all:
`hello-simple`, `hello-lang`, `invest-app-prismajs-simple`.

## Objectives

1. Introduce **TaskAPI**, a single cumulative model project that backs the
   concept pages of the Express.js guide, in the same "cumulative by
   construction" style already used by InvestApp and MonitorApp.
2. Keep TaskAPI **API-only** — no front-end, no Docker, no E2E — so it stays
   distinct from the two applications instead of competing with them.
3. Absorb the six standalone projects (`hello`, `router`, `mvc`, `typescript`,
   `prisma`, `auth`) into the trail, preserving their URLs through redirects.
4. Replace the 172 hand-written `title="src/…"` fences with `<SourceCode>`
   cutouts of real files, keeping hand-written blocks only for pseudocode,
   before/after comparisons and terminal commands, as `AGENTS.md` allows.
5. **Do not modify InvestApp or MonitorApp.** Their example directories, pages,
   materials and mindmaps stay exactly as they are.

## Non-goals

- Rewriting the prose of the concept pages. The existing explanations are kept;
  only the code blocks change source, and the surrounding sentence is adjusted
  when it names a file or a variable that changes.
- Adding a front-end, Docker or Playwright to TaskAPI.
- Migrating the legacy Express 4 / Prisma 5-6 projects outside this trail.
- Touching `bmi-api`, which stays standalone on purpose (see Phase 7).

## Design — TaskAPI

**Domain**: `Task` is the primary resource from step 1; `User` arrives at step 9
with authentication; `Tag` arrives at step 8 for the many-to-many in
`relations.mdx`.

The ordering is the house pattern, not a new invention: InvestApp introduces
`Investment` first and `User` at step 8, MonitorApp introduces `Host` first and
`User` at step 9. It also matches the guide's own section order, where
`auth/` comes after `persistence/`. The alternative — keeping `User` as the CRUD
resource of steps 1-8, as the six standalone projects do today — would preserve
more of the existing prose verbatim, but it puts a password-less user CRUD at the
centre of an API named TaskAPI and then has that same resource suddenly grow
passwords at step 9. Coherence wins over diff size, especially since the affected
blocks are being rewritten as `<SourceCode>` cutouts anyway.

Cost of the choice: the ~30 hand-written blocks currently titled
`user-model.ts` / `user-router.ts` / `user-controller.ts` in `basics/`,
`architecture/` and `api/` become `task-*`, and the sentences naming those files
are adjusted. The nine blocks that borrow `investment-*` from the InvestApp
become `task-*` as well.

`Task` shape, growing across the trail:

| Step | Fields |
| ---- | ------ |
| 1-4 | `id`, `title`, `done` |
| 5 | `+ description`, `dueDate`, `priority` (Zod-validated) |
| 8 | `+ tags` (many-to-many with `Tag`) |
| 9 | `+ userId` (ownership, enforced by the authorization middleware) |

**Directory prefix**: `examples/courses/express/projects/task-api-<step>/`,
matching the `invest-app-*` / `monitor-app-*` family while signalling that this
one is an API, not an application.

**Conventions** (identical to the two existing trails, per `AGENTS.md`):
Express 5 without `express-async-errors`; TypeScript from step 4 onwards with
native `--env-file`; authentication with `node:crypto` only (no `bcrypt`, no
`jsonwebtoken`, no `dotenv`); Zod for strict validation; Prisma 7 with
`@prisma/adapter-better-sqlite3`; `#*` subpath imports; `// #region` markers on
every range a page cuts.

### Steps and page coverage

| # | Step | Stack | Concept pages it feeds | Origin |
| - | ---- | ----- | ---------------------- | ------ |
| 1 | `task-api-hello` | JS | `basics/introduction`, `basics/routes`, `basics/request-response` | from `hello` |
| 2 | `task-api-router` | JS | `basics/routes`, `basics/controllers` | from `router` |
| 3 | `task-api-mvc` | JS | `basics/middleware`, `basics/controllers`, `architecture/mvc` | from `mvc` |
| 4 | `task-api-typescript` | TS | `basics/typescript`, `api/rest`, `api/error-handling`, `architecture/mvc` | from `typescript` |
| 5 | `task-api-validation` | TS + Zod | `api/validation`, `api/pagination` | new |
| 6 | `task-api-openapi` | TS | `api/documentation` | new |
| 7 | `task-api-sqlite` | TS + `node:sqlite` | `persistence/node-sqlite` | new |
| 8 | `task-api-prisma` | TS + Prisma 7 | `persistence/prisma`, `persistence/crud`, `persistence/relations` | from `prisma` (JS→TS, Prisma 6→7) |
| 9 | `task-api-auth` | TS | `auth/passwords`, `auth/user-registration`, `auth/authentication`, `auth/authorization` | from `auth` (+ Prisma persistence) |
| 10 | `task-api-hardening` | TS | `architecture/config`, `architecture/logging`, `architecture/observability`, `security/cors`, `security/hardening` | new |
| 11 | `task-api-services` | TS | `advanced/upload-file`, `advanced/email`, `advanced/realtime`, `advanced/system-call` | new |
| 12 | `task-api-test` | TS | `advanced/testing`, `advanced/deploy` | new |

### Step 1 endpoint design

Step 1 opens with `GET /health` rather than the current `GET /` + `GET /hello/:name`
+ `POST /echo`. Three reasons:

1. It justifies itself with no domain knowledge — the reader does not need to know
   what a `Task` is to understand a route that answers `{ status: 'ok' }`.
2. It is the endpoint every real API has, so the first lesson is not a toy.
3. **It already exists in the guide as hand-written code.** `architecture/logging.mdx:216`
   and `advanced/deploy.mdx:202` both write `src/routes/health-router.ts` by hand. Born
   in step 1, it comes back with structured logging in `logging.mdx` (including the
   "do not query the database in a health check" warning) and as a readiness probe with
   `/ready` in `deploy.mdx`. A single endpoint spanning 25 pages is exactly what a trail
   buys and standalone projects cannot.

The rest of step 1 still has to teach `req.params` and `req.body`, so the routes are:

| Route | What it teaches | Replaces |
| ----- | --------------- | -------- |
| `GET /health` | `res.json()`, status 200, no domain required | — |
| `GET /tasks` | in-memory array in the same file, introduces the domain | `GET /` |
| `GET /tasks/:id` | `req.params` | `GET /hello/:name` |
| `POST /tasks` | `express.json()`, `req.body`, `201 Created` | `POST /echo` |

`POST /echo` is dropped rather than ported: echoing the request body back is an
antipattern the reader copies.

`api/construction.mdx` is a design page; it gets an overview of the whole trail
rather than a single step. `expressjs/index.mdx` gains a card for the trail.

Six of the twelve steps already exist in some form, so the genuinely new
directories are 5, 6, 7, 10, 11 and 12.

## Progress

| Phase | What landed |
| ----- | ----------- |
| 0 Foundations | `task-api-hello/-router/-mvc` from `git mv`, trail overview page, `task-api` card in `projects.ts`, sidebar subtree, redirects, orphans removed |
| 1 Fundamentos | `task-api-typescript`; `introduction`, `routes`, `request-response`, `middleware`, `controllers`, `typescript` |
| 2 Arquitetura | `architecture/mvc` against steps 3-4 |
| 3 APIs HTTP | `task-api-validation` (Zod) and `task-api-openapi`; `rest`, `error-handling`, `validation`, `pagination`, `documentation` |
| 4 Persistência | `task-api-sqlite` and `task-api-prisma`; `node-sqlite`, `prisma`, `crud`, `relations` |
| 5 Autenticação | `task-api-auth`; `passwords`, `user-registration`, `authentication`, `authorization` |
| 6 Segurança | `task-api-hardening`; `config`, `logging`, `observability`, `cors`, `hardening` |
| 7 Avançados | `task-api-services` and `task-api-test`; `upload-file`, `email`, `realtime`, `system-call`, `testing`, `deploy` |
| 8 Closing | devcontainers, `AGENTS.md`, `README.md`, `docs/PRD.md`, this spec moved to `executed/` |

## Result

| Metric | Before | After |
| ------ | ------ | ----- |
| Hand-written fences carrying a `title="src/…"` | 172 | 6, all `del`/`ins` before/after diffs |
| Real cutouts (`<SourceCode>` + `<CodeTabs>`) | ~38 | 114 |
| Concept pages with no executable project | 20 of 33 | 1 (`api/construction`, a design page, which links the trail) |
| Standalone Express projects | 9 | 1 (`bmi-api`, standalone on purpose) + the 12-step trail |
| Orphaned example directories | 3 | 0 |

Every phase ended green on `pnpm build`, `check:links`, `check:doc-lines`, `lint`
and `check`. Every published step was started and exercised over HTTP, and every
TypeScript step passes `pnpm typecheck`. Step 12's suite is 21 passing tests.

The step 12 image was later built and run. That pass found five defects that
reading the Dockerfile had not:

1. `postinstall: prisma generate` ran before `prisma/` was copied — the schema was
   not there yet.
2. Corepack installed a newer pnpm than the local one, which turns ignored build
   scripts into a hard error. Fixed by pinning `packageManager`.
3. The unprivileged `app` user could not create `uploads/`, so the process died at
   startup with `EACCES`. The same applied to the compose volume, which stays
   root-owned when mounted over a root-owned path.
4. `prisma.config.ts` was not copied into the runtime stage, so `migrate deploy`
   could not find the datasource.
5. `process.loadEnvFile()` throws when there is no `.env`, which is exactly the
   container's situation.

All five are fixed and verified: `docker compose up` reports *healthy*, applies
migrations on an empty volume, serves `/health`, `/ready`, `/metrics` and a `401`
on `/tasks`, runs as `app`, and the data survives a restart.

One documentation claim was wrong and is now corrected in `test.mdx`: `${VAR:?}`
does **not** guarantee the secret comes from the environment, because Compose
auto-loads a `.env` sitting next to `compose.yaml` — which means the development
secret would silently reach production.

Two refinements to the original plan, both recorded in place above:

1. `Task` is the resource from step 1 and `User` arrives at step 9, rather than
   `User` being primary throughout. See "Design — TaskAPI".
2. The audit criterion allows a hand-written fence to keep a `title="src/…"` when
   it is a `del`/`ins` before/after comparison — the markers make the transition
   explicit, and the title is what orients the reader. Everywhere else the title
   is dropped.

Three notes for whoever touches this next:

- Dotfiles are outside the `import.meta.glob` in `src/lib/source-files.ts`, which
  is what keeps `.env` unreachable from the docs. `.env.example` and
  `.dockerignore` are therefore hand-written fences kept in sync by hand.
- `AGENTS.md` and `README.md` claimed that `mark`/`ins`/`del` over `lines`/`region`
  used the snippet's numbering. They use the original file's; `offsetMarkers`
  shifts them. Both files were corrected.
- The rate limiter needs a distinct `name` per limiter, or two limiters on the same
  route share a counter. This was a real bug found by the smoke test.

## Phase Plan

Each phase is a self-contained commit set: the example directories it needs, the
concept pages it converts, the practice pages, the sidebar entry and the
redirects. `pnpm validate` must pass at the end of every phase.

### Phase 0 — Foundations

- Create `examples/courses/express/projects/task-api-hello`, `-router`, `-mvc`
  as `git mv` of `hello`, `router`, `mvc`, adding the `Task` resource alongside
  `User` and `// #region` markers for every range the pages will cut.
- Create `src/content/docs/courses/expressjs/practice/taskapi/index.mdx`
  (overview: goal, stack table, data model, list of the twelve steps), following
  the shape of `practice/investapp/index.mdx` but without the requirements
  analysis — this is a reference API, not a product.
- Register the trail in `src/lib/projects.ts`: one `task-api` card replacing the
  six `express-*` cards, keeping category `'express'`.
- Add the `Na Prática → TaskAPI` subtree to `astro.config.mjs`.
- Delete the three orphaned directories `hello-simple`, `hello-lang`,
  `invest-app-prismajs-simple`, or adopt them if a page is written for them.

### Phase 1 — Fundamentos

Convert `basics/introduction`, `basics/routes`, `basics/request-response`,
`basics/middleware`, `basics/controllers`, `basics/typescript` to `<SourceCode>`
against steps 1–4. Create `task-api-typescript` from `typescript`. Publish the
practice pages for steps 1–4 and redirect `practice/hello-express`,
`practice/express-router`, `practice/express-mvc`,
`practice/express-typescript`.

### Phase 2 — Arquitetura

Convert `architecture/mvc` (steps 3–4). `architecture/config`,
`architecture/logging` and `architecture/observability` are deferred to Phase 6,
which builds step 10.

### Phase 3 — APIs HTTP

Build steps 5 (`validation`) and 6 (`openapi`). Convert `api/rest`,
`api/error-handling`, `api/validation`, `api/pagination`, `api/documentation`.
`api/construction` gets the trail overview.

### Phase 4 — Persistência

Build step 7 (`sqlite`) and step 8 (`prisma`, converted from the JS/Prisma 6
project). Convert `persistence/node-sqlite`, `persistence/prisma`,
`persistence/crud`, `persistence/relations`. Redirect
`practice/express-prisma`.

### Phase 5 — Autenticação

Build step 9 from `auth`, moving its in-memory store onto the Prisma persistence
introduced in step 8. Convert `auth/passwords`, `auth/user-registration`,
`auth/authentication`, `auth/authorization`. Redirect `practice/express-auth`.

### Phase 6 — Segurança e Arquitetura operacional

Build step 10. Convert `security/cors`, `security/hardening`,
`architecture/config`, `architecture/logging`, `architecture/observability`.

### Phase 7 — Recursos Avançados

Build steps 11 and 12. Convert `advanced/upload-file`, `advanced/email`,
`advanced/realtime`, `advanced/system-call`, `advanced/testing`,
`advanced/deploy`. Confirm `practice/bmi-api` stays standalone — it exists to
compare route, query and body parameters over the same calculation, backed by
three sibling projects, and belongs to no trail.

### Phase 8 — Closing

- One `.devcontainer/` folder per published TaskAPI step, replacing
  `express-hello`, `express-router`, `express-mvc`, `express-typescript`,
  `express-prisma`, `express-auth`.
- Update `AGENTS.md` (repository map, the "InvestApp and MonitorApp trails"
  section becomes "TaskAPI, InvestApp and MonitorApp trails"), `README.md` and
  `docs/PRD.md` counts.
- Move this spec to `specs/executed/spec-005-taskapi-model-project.md`.

## Risks & Mitigations

| Risk | Mitigation |
| ---- | ---------- |
| Large diff across 32 concept pages | Phase per sidebar section; every phase ends green on `pnpm validate` |
| `check:doc-lines` becomes far stricter once ~170 blocks are real | Add `// #region` markers before writing the page, and prefer `region` over raw `lines` |
| URL churn on the six standalone project pages | Redirects in `astro.config.mjs`, following the precedent already set for `monitor-api` and `advanced/validation` |
| A concept page stops being self-contained for a search visitor | The domain (`user`, `task`) is trivially legible in an 8-line cutout; keep cutouts at 5–15 lines as `AGENTS.md` requires |
| A fourth trail to maintain | TaskAPI is API-only and *replaces* six projects that already needed maintenance |

## Expected Validation

- `pnpm validate` finishes with 0 errors at the end of every phase.
- `pnpm check:links` reports 0 broken links, including the six redirects.
- `pnpm check:doc-lines` passes with the new `<SourceCode>` ranges.
- Final audit: no concept page under `src/content/docs/courses/expressjs/`
  outside `practice/` carries a hand-written fence with a `title="src/…"`,
  `title="prisma/…"` or `title="tests/…"` path.
- `examples/courses/express/projects/` contains no directory referenced by zero
  pages.
