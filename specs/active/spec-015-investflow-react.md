# Spec 015 — InvestFlow React: Rebuilding the BaaS Product with Next.js

Status: **In progress** (Phases 0 to 8 done)
Date: 2026-09-13
Related: `docs/TODO.md` → `[TASK-016.11]`

## Context & Rationale

The vanilla InvestFlow trail (`src/content/docs/courses/npm/practice/investflow/`, 16
pages) is backed by seven executable projects under `examples/courses/npm/projects/`
(`investflow-static` … `investflow-origins`) and by a backlog with **22 functional
requirements (RF01–RF22), 6 non-functional requirements (RNF01–RNF06), 32 user stories
(US01–US32) and 111 acceptance criteria (CA01.1–CA11.13)**, every criterion named in a
test (216 Vitest, 33 Playwright).

A first attempt at a React version was scaffolded in the wrong place and with the wrong
scope:

| Problem | Measure |
| ------- | ------- |
| Placed under the vanilla trail as "Sprint 12" | `index.mdx`, `experience.mdx`, `next-steps.mdx`, the sidebar and `src/lib/projects.ts` were edited; a `react.mdx` page (310 lines) was added to the **npm** course |
| Folder under the npm examples | `examples/courses/npm/projects/investflow-react/`, while React examples live in `examples/courses/react/` |
| Scope was a demo, not a rebuild | 1 Prisma model (`Asset`), 3 pages, `/api/portfolio` returning **hard-coded demo assets**, sign-in by e-mail without password, `browser` tests running in jsdom instead of a real browser |

The React guide (`src/content/docs/courses/react/`, 11 pages) has a "Na prática" section
with a single page (`practice/project.mdx`) that proposes a self-chosen project. It has no
executable, end-to-end product like the Express guide has with TaskAPI and the npm guide
has with InvestFlow.

The vanilla InvestFlow is implemented on Supabase (Auth, PostgreSQL + RLS, Storage, Edge
Functions). The React version must rebuild the **same functional requirements** on a
different stack, chosen for the React guide: Next.js App Router, NextAuth, Prisma, TanStack
and a three-layer test strategy. Postgres and Storage stay on the local Supabase stack
(decided with the author on 2026-09-13); identity moves to NextAuth, so RLS no longer
applies. Every RNF must be **re-stated** for it (RLS → ownership checks in server code;
Storage bucket read by policy → bucket read by the server with the service role; Edge
Function → route handler; `VITE_*` → `NEXT_PUBLIC_*`).

Phase 0 (untangling the placement) was executed before this spec was written and is
recorded here for traceability.

## Objectives

1. One executable project at `examples/courses/react/investflow-react/` that implements
   RF01–RF22 with the stack below, so that every US01–US32 story has a React counterpart
   and every CA is covered by a test in one of the layers (unit, browser, integration,
   e2e), named with the criterion id as the vanilla projects do.
2. Stack (fixed by the request; nothing else is added without asking):
   - **Next.js 16** App Router, **React 19**, **TypeScript** strict, **Tailwind CSS v4**.
   - **NextAuth v5** (Credentials provider, e-mail + password hashed with `node:crypto`
     `scrypt`, JWT session) with the Prisma adapter for `User`.
   - **Prisma 7** with `@prisma/adapter-pg` on the **PostgreSQL of the local Supabase
     stack** (`supabase start`, ports `5434x` so it can run next to the vanilla stack on
     `5432x`). Prisma owns the migrations; `supabase/` holds only `config.toml`. Tests use
     separate schemas (`?schema=integration`, `?schema=e2e`) in the same database.
   - **Supabase Storage** for receipts and avatars, accessed with the service role only
     in server modules; downloads go through authenticated route handlers.
   - **TanStack React Query** for server state, **TanStack Table** for the portfolio
     tables, **Zustand** only for client preferences (theme, hide values, palette open).
   - **CVA + tailwind-merge** for component variants, **Base UI** for accessible
     primitives (dialog, menu, select, tabs, tooltip), **Lucide React** icons, **Motion**
     for animations, **Sonner** for toasts, **cmdk** for the command palette.
   - **Vitest 4** in three projects: `unit` (`*.test.ts(x)`, node/jsdom), `browser`
     (`*.browser.test.tsx`, Vitest Browser Mode with Playwright/Chromium, colocated with
     `src/components/ui/`), `integration` (`*.integration.test.ts`, route handlers and
     services against a real SQLite file). **Playwright** for e2e in `tests/e2e/`.
   - **ESLint 9** flat config (`eslint-config-next`), Husky `pre-commit`/`pre-push`
     through `scripts/run-git-hook.mjs`.
3. A new section **Na prática › InvestFlow (React)** in the React guide, written only
   after the project exists, with pages that cut real code by `<SourceCode>` and show real
   test output. The project enters `src/lib/projects.ts` and the homepage at that point.
4. `pnpm validate` passes in the DevLab root; `pnpm lint`, `pnpm typecheck`, `pnpm test`
   and `pnpm test:e2e` pass in the project.

## Non-goals

- **Not** modifying the vanilla trail, its projects or its backlog page. The React
  version references the backlog; it does not fork it.
- **Not** Supabase Auth, RLS or Edge Functions in the React project. Supabase provides
  Postgres and Storage only; `@supabase/supabase-js` is used server-side for Storage.
  The equivalents are Prisma queries scoped by `userId`, and route handlers.
- **Not** a cloud database or a paid market-data provider. Quotes use the same adapter
  idea as the vanilla `update-quotes` (`fake` for tests, `yahoo` public endpoint as the
  free real provider); the adapter is selected by env.
- **Not** e-mail confirmation, password reset or OAuth providers.
- **Not** migrating the existing React examples (`examples/courses/react/*/invest-app`,
  Next 13) or touching the other guide pages.
- **Not** one folder per phase. Unlike the vanilla trail, the React project is a single
  folder that grows by phase; the guide pages cut from the final state.

## Design

### Requirement mapping

The table maps each vanilla requirement to its React implementation. `(same)` means the
functional behaviour and acceptance criteria are kept verbatim.

| RF | Vanilla | React |
| -- | ------- | ----- |
| RF01 | Landing with compound-interest simulator (static HTML + JS) | `app/page.tsx` server component + `Simulator` client component; `core/simulator.ts` pure |
| RF02 | Supabase Auth, `profiles` trigger, page guards | NextAuth Credentials, `User.passwordHash`, `User.role`; `proxy.ts` (Next 16 middleware) redirects private routes to `/signin` |
| RF03 | `brokers`, `assets`, `transactions` tables + RLS | Prisma models `Broker`, `Asset`, `Transaction`; every query in `src/server/` filters by `session.user.id` |
| RF04 | Storage bucket `receipts`, signed URL 60 s | Same bucket and path (`<userId>/<transactionId>/<uuid>.<ext>`); upload and `createSignedUrl(60)` done by the server with the service role after checking ownership |
| RF05 | Edge Function `update-quotes` + `quote_runs` | `POST /api/quotes/update` (all assets or `assetId`); `QuoteRun` model; provider adapters in `src/server/quotes/providers/` |
| RF06 | SQL views `monthly_returns`, `allocation_by_category` | `core/returns.ts`, `core/allocation.ts` computed in the server from transactions + quotes; same numbers as the vanilla spreadsheet test |
| RF07 | `admin_metrics()` security definer | `GET /api/admin/metrics` guarded by `requireAdmin` |
| RF08 | `asset.html?id=` | `app/(private)/assets/[id]/page.tsx` |
| RF08.1 | `supabase/seed.sql` | `prisma/seed.ts` with the same demo admin and `Tesouro Reserva 2036` at R$ 1 |
| RF09 | `allocation_by_origin` view + treemap | `core/origins.ts` + `Treemap` component (SVG, Motion) |
| RF10 | `portfolio_evolution` view + line chart | `core/evolution.ts` + `LineChart` component |
| RF11–RF14 | `dividends_history`, movements page | `Dividend` model, `core/dividends.ts`, `/dividends`, `/movements` |
| RF15–RF17 | `exchange_rates`, `get_usd_rate`, crypto | `ExchangeRate` model, `core/exchange.ts`, crypto via `TICKER-USD` + `BRL=X` in the same run |
| RF18 | Market calendar in the Edge Function | `core/market-calendar.ts` (same rules, same holidays) |
| RF19 | `profile.html`, `avatars` bucket | `/profile`, avatar in the public `avatars` bucket under `<userId>/`, uploaded by the server |
| RF20 | Shared navbar module | `AppShell` layout in `app/(private)/layout.tsx`, `UserMenu` with Base UI Menu |
| RF21 | `theme.js`, `privacy.js` | Zustand `preferences` store persisted in `localStorage`; `data-theme` and `data-hide-values` on `<html>` |
| RF22 | `vite build` + `vercel.json` | `next build`; security headers in `next.config.ts`; only `NEXT_PUBLIC_*` reach the client |

| RNF | React reading |
| --- | ------------- |
| RNF01 | Every Prisma query in `src/server/` receives `userId` from the session; integration tests prove that a second user gets `404`, never `403`, for foreign rows |
| RNF02 | Provider tokens and `AUTH_SECRET` are read only in server modules; `next build` output is grepped for them in a build test |
| RNF03 | Money in `Decimal` columns; `core/` works with `number` rounded by `money()` helpers, with the same tolerance the vanilla tests use |
| RNF04 | Private `receipts` bucket; the server checks ownership before creating a 60-second signed URL; `avatars` is public by choice |
| RNF05 | `/api/admin/*` returns aggregates only; the integration test asserts no ticker or user id in the payload |
| RNF06 | `next build` succeeds with `.env.example` values; headers `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` set in `next.config.ts` |
| **RNF07** (new) | **Responsive design.** The vanilla product was built desktop-first and its wide tables and fixed navbar break on phones. The React version is mobile-first, with criteria of its own (numbered `CA12.x` so they do not collide with the backlog): **CA12.1** no page scrolls horizontally at 360–412 px; **CA12.2** the private navbar exposes the same links behind an accessible menu button (`aria-expanded`, `aria-controls`) and the user menu stays reachable; **CA12.3** tables show the essential columns (asset, value, return, actions) at any width and the others from a Tailwind breakpoint (`hideBelow` column meta), the asset page keeps the full content; **CA12.4** dialogs and forms take the available width, fields stack, and touch targets are at least 44 px. Verified by the Playwright `mobile` project (Pixel 7) in `tests/e2e/*.mobile.spec.ts`. |

### Folder layout

```txt
examples/courses/react/investflow-react/
├── app/                      # routes only: pages, layouts, route handlers
│   ├── (public)/             # landing, signin, signup
│   ├── (private)/            # dashboard, assets/[id], analytics, origins, dividends, movements, profile, admin
│   └── api/                  # auth, portfolio, assets, transactions, quotes, receipts, admin
├── prisma/                   # schema.prisma, migrations/, seed.ts
├── supabase/                 # config.toml of the local stack (ports 5434x); no migrations here
├── src/
│   ├── core/                 # pure domain rules (positions, returns, dividends, exchange, calendar)
│   ├── server/               # Prisma access scoped by user, quote providers, Storage client, auth helpers
│   ├── features/<name>/      # client components + hooks (React Query) of one screen
│   ├── components/ui/        # CVA + Base UI primitives, each with a *.browser.test.tsx
│   ├── store/                # Zustand preferences
│   └── lib/                  # cn, format, http, query client
└── tests/
    ├── integration/          # *.integration.test.ts against the `integration` Postgres schema
    └── e2e/                  # Playwright specs against `next dev --port 3100`, schema `e2e`
```

### Test naming

As in the vanilla projects, the test title carries the criterion id, e.g.
`it('CA03.4 — each account reads only its own assets', …)`, so `grep -r "CA03.4"` finds
the proof of a criterion.

## Plan

Phases mirror the vanilla sprints so that the backlog page stays the single source of
truth for **what** is built. Each phase ends with lint, typecheck and the three test
layers green.

### Phase 0 · Untangle placement — done

- `git mv` the scaffold to `examples/courses/react/investflow-react/`.
- Revert the sprint-12 edits in the vanilla trail (`index.mdx`, `experience.mdx`,
  `next-steps.mdx`, sidebar, `src/lib/projects.ts`); delete `react.mdx`.
- Point `.devcontainer/investflow-react/` at the new folder.

### Phase 1 · Foundation and identity (RF01, RF02) — done

- Prisma 7 with the `pg` adapter on the local Supabase Postgres; model `User` (with
  `passwordHash`, `role`); first migration; `prisma/seed.ts` with the demo admin.
- NextAuth Credentials with `scrypt`; `signup` server action; `/signin`, `/signup`,
  sign-out; `proxy.ts` guard; `requireSession` / `requireAdmin` for route handlers.
- Landing with the simulator (`core/simulator.ts`); `AppShell` for private pages.
- UI primitives `Button`, `Input`, `Field`, `Dialog` (Base UI) with CVA; `Providers`
  (React Query, Sonner, command palette).
- Vitest projects: `unit`, `browser` (Browser Mode + Playwright provider), `integration`
  (schema `integration`, `prisma migrate deploy`); Playwright e2e with `webServer`.
- CA01.1–CA01.2, CA02.1–CA02.5 covered.

### Phase 2 · Portfolio (RF03, RF08, RF08.1) — done

- Models `Broker`, `Asset`, `Transaction`; `core/portfolio.ts` (`positionAt`, average
  price, realised result, invested, current value) ported from `investflow-origins`.
- `/api/assets`, `/api/assets/[id]`, `/api/transactions`; dashboard table with TanStack
  Table; asset form and transaction form in Base UI dialogs; asset detail page.
- CA03.1–CA03.15 covered; RNF01 ownership tests.

### Phase 3 · Quotes (RF04.1, RF05, RF05.1, RF18) — done

### Phase 3b · Responsive design (RNF07) — done, and a rule for every later phase

- Mobile navbar (menu button + disclosure list), responsive column meta in the assets
  table, price column hidden below `md` in the ledger, 44 px touch targets, dialogs
  sized by `max-w`, KPI grids with two columns from the narrowest phones.
- Every later phase adds its screens to `tests/e2e/responsive.mobile.spec.ts` (at least
  CA12.1 for each new page).

- `Quote` and `QuoteRun` models; `POST /api/quotes/update`; providers `fake`, `yahoo`;
  auto-fetch on create/edit of quotable assets; manual quote dialog; market calendar.
- CA04.1–CA04.5, CA08.9–CA08.12, CA10.14–CA10.16.

### Phase 4 · Receipts (RF04) — done

- Upload to the `receipts` bucket by the server; validation before upload
  (`core/file-validation.ts`); 60-second signed URLs; CA05.1–CA05.5.

### Phase 5 · Analytics and admin (RF06, RF07) — done

- `core/returns.ts`, `core/returns-matrix.ts`, `core/allocation.ts`; `/analytics`,
  `/admin`; CA06.1–CA06.5.

### Phase 6 · Origins and evolution (RF09, RF10) — done

- `core/origins.ts`, `core/evolution.ts`; treemap and line chart; URL state with
  `useSearchParams`; CA07.1–CA07.8.

### Phase 7 · Ledger, balance and organisation (RF03.2–RF03.6) — done

- Edit/delete transactions, `update` type for fixed income and funds, auto ticker
  `RF-<NAME>-<suffix>`, filters/sort/tab in the URL; CA08.1–CA08.8, CA08.13–CA08.18.

### Phase 8 · Dividends and movements (RF11–RF14) — done

- `Dividend` model, `core/dividends.ts`, `/dividends`, `/movements`; CA09.1–CA09.15.

### Phase 9 · Dollar and crypto (RF15–RF17)

- `ExchangeRate` model, `core/exchange.ts`, currency per asset, crypto quoting;
  CA10.1–CA10.13.

### Phase 10 · Profile and experience (RF19–RF22)

- `/profile` with avatar, user menu, theme, hide values, password visibility, build with
  security headers; CA11.1–CA11.13.

### Phase 11 · Guide section

- `src/content/docs/courses/react/practice/investflow/` with an index and one page per
  phase, `<ProjectLinks>` and `<SourceCode>` cuts; sidebar in `astro.config.mjs`; entry
  in `src/lib/projects.ts` (`category: 'react'` added to `ProjectCategory`); slides and
  mind maps in `materials/`; review with `devlab-content-reviewer`.
- Move this spec to `specs/executed/`.

## Expected Validation

In the project:

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e
```

In the DevLab root (from Phase 11 on, since only then the guide references the project):

```bash
pnpm validate
```

Manual inspection per phase: the criteria of the phase, one by one, in the running app,
and `grep -r "CA0N\." src tests` listing every criterion of the phase in a test title.

## Result

_To be filled when the spec is executed._

Phase 0: scaffold moved to `examples/courses/react/investflow-react/` (48 files), vanilla
trail restored to its state before the sprint-12 edits (5 files reverted, 1 deleted).

Phase 1: 21 Vitest tests (9 unit, 7 browser, 5 integration) and 5 Playwright tests
green; `pnpm lint`, `pnpm typecheck` and `pnpm build` pass. Dependencies added beyond the
requested list: `@prisma/adapter-pg` + `pg` (Prisma 7 requires a driver adapter), `zod`
(the DevLab standard for validation), `@vitest/browser-playwright` + `vitest-browser-react`
(Vitest Browser Mode), `jsdom` (unit tests of hooks and stores).

Phase 2: 48 Vitest tests (13 unit, 10 browser, 15 integration) and 10 Playwright tests
green. CA03.14 (no real data in the seed) stays a review rule, as in the vanilla project.

Phase 3: 71 Vitest tests (27 unit, 10 browser, 24 integration) and 14 Playwright tests
green. Phase 3b (RNF07, requested by the author on 2026-09-13): 17 Playwright tests, 3 of
them in the `mobile` project.

Phase 4: 78 Vitest tests (39 unit, 10 browser, 29 integration; the receipts ones upload
to and download from the real local Storage) and 19 Playwright tests green. The bucket is
declared in `supabase/config.toml` and created by `pnpm db:buckets`; `ensureReceiptsBucket`
also creates it on first use so tests do not depend on that step.

Phase 5: 89 Vitest tests (47 unit, 10 browser, 32 integration) and
22 Playwright tests green. The SQL views `monthly_returns`, `allocation_by_category` and
`admin_metrics()` became pure functions in `core/returns.ts` plus `server/admin.ts`; the
reference spreadsheet of CA06.2 is asserted both in a unit test and through the route.
One deliberate difference from the vanilla view: a balance asset (fixed income, funds)
enters the monthly value by its accumulated cost, so a fixed-income purchase no longer
shows up as a negative return in a month without quotes.

Phase 6: 100 Vitest tests (56 unit, 10 browser, 34 integration) and 25 Playwright tests
green. Treemap (squarified) and line chart are pure SVG drawn from `core/` layouts, with
`<title>` tooltips; mode and range live in the URL and are read from `window.location`
at click time so consecutive clicks never use stale params.

Phase 7: 103 Vitest tests (58 unit, 10 browser, 35 integration) and 27 Playwright tests
green. `lib/url-state.ts` generalises the URL state used by the timeline and the
portfolio (`filter`, `sort`, `dir`); TanStack Table sorting is controlled from the URL
with `enableSortingRemoval: false`, `sortDescFirst` on numeric columns and
`sortUndefined: 'last'` for assets without a quote. A closed position is now worth zero
even without a quote, so it sorts first ascending, as in the vanilla.

Phase 8: 113 Vitest tests (65 unit, 10 browser, 38 integration) and 31 Playwright tests
green. The dividend history rides on the asset payload (`dividends` array), so the
dashboard, analytics and the asset page compute received dividends with the same
`core/dividends.ts` function; the `fake` provider ships three events for `HGLG11` so the
e2e flow syncs from the UI instead of inserting rows. Money in dividends is rounded to
cents to keep `100 × 1,1 = 110`. The `ExchangeRate` model arrived here because the quote run writes the USD/BRL
rate of the day (CA10.13); the portfolio only reads it in Phase 9.
