# Spec 013 — InvestBaaS: Executable Sprints with Automated Tests

Status: **Active**
Date: 2026-09-12
Related: `docs/TODO.md` → `[TASK-016]`

## Context & Rationale

The InvestBaaS trail (`src/content/docs/courses/npm/practice/investbaas/`, 9 pages) was
restructured in commits `7cbb55ba` and `1ddbbc07` to the MonitorApp format: requirements,
Gherkin criteria, a task-by-task description and a testing section per sprint. Only the
first sprint is backed by code:

| Sprint | Page | Code in `examples/` | Tests |
| ------ | ---- | ------------------- | ----- |
| 1 · Front estático | `front-static.mdx` | `investbaas-static` (6 HTML, CSS, docs) | none |
| 2 · Auth | `auth.mdx` | **none** | none |
| 3 · Banco e RLS | `database.mdx` | **none** | none |
| 4 · Edge Functions | `edge-quotes.mdx` | **none** | none |
| 5 · Storage | `storage.mdx` | **none** | none |
| 6 · Analytics/Admin | `analytics.mdx` | **none** | none |

For sprints 2–6 the pages show **target code** in hand-written fences (26 blocks) and a
manual verification roadmap that was written, not executed. That breaks two rules of
`AGENTS.md`: rule 1 (lesson code lives in `examples/` and enters by `<SourceCode>`) and the
"Antes de terminar" rule (do not declare validated what was not run). It also makes the
trail weaker than InvestApp and MonitorApp, whose step 12 shows a real `pnpm test` output.

The machine running the DevLab has Docker and the Supabase CLI (`supabase 2.106.0`), so the
local stack (`supabase start`) can back real integration and end-to-end tests without a
cloud project.

## Objectives

1. One executable project per sprint, cumulative by construction, under
   `examples/courses/npm/projects/`: `investbaas-static` (exists), `investbaas-auth`,
   `investbaas-database`, `investbaas-edge-quotes`, `investbaas-storage`,
   `investbaas-analytics`. Each has `package.json`, `README.md`, `supabase/` (config,
   migrations, functions) and a `.devcontainer/` folder.
2. Every task `TKXX-Y` is validated by at least one automated test, in the layer that fits:
   - **unit** (Vitest, jsdom, SDK mocked) for services, guards and pure functions;
   - **integration** (Vitest, node, real `@supabase/supabase-js` against the local stack)
     for migrations, triggers, RLS policies, Storage policies and Edge Functions;
   - **end-to-end** (Playwright against Vite + local stack) for the user flow of the sprint.
3. Every sprint page replaces the hand-written target code by `<SourceCode>` cuts of the real
   files, and its `## Testando` section shows the real `pnpm test` / `pnpm test:e2e` output.
4. `pnpm validate` passes; `pnpm test` and `pnpm test:e2e` pass in every sprint project with
   `supabase start` running.

## Non-goals

- **Not** connecting to a cloud Supabase project: everything runs on the local stack. The
  pages explain how to point the `.env` at a cloud project, but no test depends on it.
- **Not** a real market-data provider: the Edge Function ships the `fake` adapter as default
  and the real adapter behind `MARKET_PROVIDER=brapi` with the token in the function secrets.
- **Not** e-mail confirmation flows: the local stack runs with `enable_confirmations = false`;
  the page states the difference.
- **Not** touching the InvestApp/MonitorApp trails, nor changing the sprint scope in
  `docs/SPRINTS.md` (tasks stay `TK01-1` … `TK06-9`).
- **Not** a CI job for the example projects (that is a known limitation of every trail).

## Design

### One folder per sprint

The index page said the project evolves in place with tags. That is replaced by the DevLab
convention: `investbaas-<sprint>` copies the previous folder plus the sprint delta, so
`git diff --no-index` shows the delta and every page keeps a stable `<ProjectLinks>` and
`<SourceCode>` target. `docs/SPRINTS.md` and `AGENTS.md` are shared and copied forward.

### Local stack

`supabase init` in the sprint-2 project creates `supabase/config.toml`; `supabase start`
brings up Postgres, Auth, Storage, PostgREST and the edge runtime on `127.0.0.1:54321`.
The `.env.example` carries the local URL and the well-known local anon key; `.env` is
gitignored. Migrations live in `supabase/migrations/` and are applied by `supabase db reset`.

### Test layout (every sprint project)

```
src/**/*.test.js          unit, vitest + jsdom, SDK mocked with vi.mock
tests/integration/*.test.js  vitest, node env, real SDK against the local stack
tests/e2e/*.spec.js       playwright, baseURL from Vite, local stack
vitest.config.js          two projects: unit (jsdom) and integration (node)
playwright.config.js      webServer: vite
```

Scripts: `test` (unit + integration), `test:unit`, `test:integration`, `test:e2e`,
`db:reset` (`supabase db reset`). Integration and e2e tests read `VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` from `.env`; the service key is used
only by tests to read across users (to prove isolation) and never by `src/`.

### Task → test matrix (Sprint 2)

| Task | Test |
| ---- | ---- |
| TK02-1 cliente | unit: `supabase-client.test.js` throws without env, exposes a client |
| TK02-2 signUp | unit: passes `full_name` in `options.data`; integration: creates `auth.users` row |
| TK02-3 signIn | unit: same error message for both failures; integration: wrong password and unknown e-mail return the same `AuthApiError` message |
| TK02-4 guard | unit (jsdom): redirects to `signin.html` without session, resolves with session |
| TK02-5 logout/session | unit: `signOut` called, `onSessionEnd` fires on `SIGNED_OUT`; e2e: reload keeps session, logout redirects |
| TK02-6 profiles | integration: trigger creates `profiles` row with the same id and `full_name`; RLS: user A cannot read user B's profile |

Sprints 3–6 follow the same matrix on their pages.

## Plan

### Phase 1 — Sprint 2 (`investbaas-auth`)

1. Copy `investbaas-static` → `investbaas-auth`; add `@supabase/supabase-js`, Vitest, jsdom,
   Playwright; `vite.config.js` with the six pages as inputs.
2. `supabase init`, migration `profiles` (table, RLS, trigger), `.env.example`.
3. `src/lib`, `src/services`, `src/guards`, `src/pages`; wire `signup.html`, `signin.html`
   and the three private pages.
4. Unit, integration and e2e tests per the matrix; run them against `supabase start`.
5. `.devcontainer/investbaas-auth` (Docker-in-Docker feature for the local stack).
6. `auth.mdx`: `<SourceCode>` cuts replace the target fences; real test output in
   `## Testando`; `index.mdx` matrix/evolution sections updated for folder-per-sprint.

### Phase 2 — Sprint 3 (`investbaas-database`)

Migrations `assets`, `transactions`, `quotes_history`, RLS + policies + indexes; services,
`portfolio.js`, dashboard wiring. Integration tests for every policy (`using` and
`with check`) with two users; unit tests for `summarize()`; e2e for create asset + buy.

### Phase 3 — Sprint 4 (`investbaas-edge-quotes`)

`update-quotes` function with `fake` provider, `quote_runs`, `pg_cron` migration. Integration
tests invoke the function through the local edge runtime (`supabase functions serve`) and
check idempotency and partial failure; e2e clicks the button.

### Phase 4 — Sprint 5 (`investbaas-storage`)

Bucket migration, `storage.objects` policies, `receipts.js`, `file-validation.js`. Unit tests
for validation; integration tests upload as A and fail to sign as B; e2e attaches a file.

### Phase 5 — Sprint 6 (`investbaas-analytics`)

Views, `returns.js`, `admin_metrics()`, `require-admin.js`. Unit tests for `yearlyPct()`;
integration tests reproduce the reference spreadsheet and prove `admin_metrics()` returns no
rows for an investor; e2e for the matrix and the admin redirect.

### Phase 6 — Closing

`docs/TODO.md`, `AGENTS.md` counts (projects, devcontainers), `README.md` tree, move this spec
to `specs/executed/`, fill `Result`.

## Progress

- [x] Phase 1 — Sprint 2 (`investbaas-auth`): 15 Vitest (9 unit + 6 integration) and 4 Playwright tests green against `supabase start`; `auth.mdx` rewritten with `<SourceCode>` cuts and real outputs. Found and fixed during the work: the local stack grants no `select`/`update` on new tables by default, and a whole-row `update` policy would have let any account promote itself to `admin`; the migration now grants `select, update (full_name)` to `authenticated`.
- [ ] Phase 2 — Sprint 3
- [ ] Phase 3 — Sprint 4
- [ ] Phase 4 — Sprint 5
- [ ] Phase 5 — Sprint 6
- [ ] Phase 6 — Closing

## Risks & Mitigations

| Risk | Mitigation |
| ---- | ---------- |
| Local stack image pull is slow on first run | Documented in each README; tests skip with a clear message when `VITE_SUPABASE_URL` is absent |
| Playwright browsers not installed | `pnpm exec playwright install chromium` in README and devcontainer `postCreateCommand` |
| New dependencies in `examples/` (rule 6 of `AGENTS.md`) | Requested explicitly by the user for this spec; each README justifies them |
| Supabase CLI version drift changes `config.toml` | Only the keys the trail relies on are set explicitly; the rest keep CLI defaults |

## Expected Validation

Per sprint project, with `supabase start` running: `pnpm test` and `pnpm test:e2e` green,
output pasted into the page. Repository: `pnpm validate`. Manual: `<SourceCode>` cuts on each
sprint page point at files in the sprint's folder; no `title="... (alvo de ...)"` fence remains
in the trail.

## Result

_To be filled when the spec is executed._
