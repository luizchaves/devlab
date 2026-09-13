# Spec 014 — InvestFlow: Backlog Traceability for Sprints 8–11

Status: **Active**
Date: 2026-09-13
Related: `docs/TODO.md` → `[TASK-016.10]`

## Context & Rationale

`examples/courses/npm/projects/investflow-origins` (v7.0.0) is the final project of the
InvestFlow trail. Since spec 013 closed, it grew far beyond Sprint 7 ("origem e evolução"),
and none of that growth is traceable in the backlog page
(`src/content/docs/courses/npm/practice/investflow/backlog.mdx`, section "Rastreabilidade"):

| Dimension | Tracked (US01–US16) | Present in `investflow-origins` and untracked |
| --------- | ------------------- | --------------------------------------------- |
| Pages | 8 HTML (`index`, `signin`, `signup`, `dashboard`, `asset`, `analytics`, `admin`, `origins`) | +3: `dividends.html`, `movements.html`, `profile.html` |
| Migrations | 12 (`…000001` to `…000012`) | +2: `…000013_dividends_history.sql`, `…000014_storage_avatars.sql`; `…000009_exchange_rates.sql` is applied but never cited |
| `src/lib` modules | 6 (`portfolio`, `returns`, `returns-matrix`, `treemap`, `line-chart`, `file-validation`, `form`, `supabase-client`) | +7: `dividends`, `bar-chart`, `navbar`, `theme`, `privacy`, `query-params`, `dialog` |
| `src/services` | 8 | +3: `dividends`, `exchange`, `profile` |
| Business rules | 57 tasks, 46 acceptance criteria | ~40 rules with no US/CA/TK: `update` transactions (balance-based fixed income), transaction edit/delete, total redemption, ETF/FI-Infra categories, BRL/USD currency with auto-detection, manual quote fallback, per-asset quote refresh, market calendar (B3/US/crypto holidays), crypto quoted via `BTC-USD` + `BRL=X`, dividend ledger with ex-date rule, yield on cost, total return, "with dividends" toggles, movements statement, dark/light/auto theme, value masking, avatar bucket, shared navbar, URL-persisted state, Vercel deploy |
| Tests | 190 unit+integration, 17 E2E, all green | no E2E for dividends, movements, profile, theme or privacy; no integration test for `dividends_history`, `exchange_rates` or the `avatars` bucket |

Two defects were found while reading the code and will be exposed by the new criteria:

1. `src/services/quotes.js` → `recordQuote()` upserts into `quotes_history` from the browser,
   but migration `…000005_rls_policies.sql` grants `authenticated` only `select` on that table
   and states "escrita sem policy: só a Edge Function grava". The manual quote dialog in
   `asset.js` discards the result, so the history line is silently lost.
2. `src/services/exchange.js` → `fetchAndSyncUsdRates()` is exported but never called by any
   page, and `authenticated` has only `select` on `exchange_rates`. The table stays empty and
   every USD conversion falls back to the hard-coded `5.4`.

The AGENTS.md rules being violated: "Atualize a documentação `.md` sempre que necessário"
(rule 7) and the "Antes de terminar" rule (criteria without tests are intentions, not
validation). Didactically, everything above is presented as a single Sprint 7, which hides
the evolution of the system from the reader.

## Objectives

1. Every feature and business rule of `investflow-origins` is traceable in the backlog page
   as **US → CA → TK**, with the criterion numbered by sprint and each criterion backed by at
   least one automated test (unit, integration or E2E), named with the CA id.
2. The trail is restructured from 7 to **11 sprints**. Sprints 1–7 keep their pages and
   projects; Sprints 8–11 are new pages whose `<SourceCode>` cuts point to
   `investflow-origins` (the project stays the executable of Sprints 7–11):

   | Sprint | Page (slug) | Sidebar label | Scope |
   | ------ | ----------- | ------------- | ----- |
   | 8 | `ledger.mdx` | 8. Lançamentos e cotação manual | edit/delete transactions, total redemption, `update` (balance) transactions, ETF/FI-Infra, auto ticker for fixed income, per-asset refresh, manual quote/balance dialog, portfolio filters/sorting/footer, duration, URL state, `asset.html?ticker=` |
   | 9 | `dividends.mdx` | 9. Proventos e movimentações | `dividends_history`, Yahoo crawler, ex-date rule, YoC, total return, `dividends.html`, asset tab, "with dividends" toggles, `bar-chart.js`, `movements.html` |
   | 10 | `international.mdx` | 10. Dólar e cripto | `assets.currency`, `exchange_rates` + `get_usd_rate`, `summarize`/`summarizeInBRL`/`monthlyFlows`, converted views, US$/R$ chart toggle, crypto via `BTC-USD` + `BRL=X`, market calendar and `shouldFetchFromProvider` |
   | 11 | `experience.mdx` | 11. Perfil e experiência | `profile.html` + `avatars` bucket, shared navbar, landing with session, theme, value masking, password toggle, dialogs, Vercel build/headers |

3. Sprint 7 gains the timeline modes (`continuous`/`events`) and window (`all`/`2y`/`ytd`) as
   `CA07.7`/`CA07.8` and `TK07-7`, since they belong to the evolution chart.
4. The seed criteria `CA08.1`–`CA08.3` (US16, delivered by TK03-13 in Sprint 3) are renumbered
   `CA03.13`–`CA03.15`, restoring the "numbered by sprint" rule and freeing `CA08.*`.
5. Every InvestFlow page reflects the 11-sprint trail: `index.mdx` (RF list, sprint matrix,
   navigation), pages 1–7 ("Etapa N de 11", "Próxima etapa" of Sprint 7), `next-steps.mdx`
   (what moved from "future" to "delivered", what remains), sidebar in `astro.config.mjs`.
6. Every project's `docs/SPRINTS.md` and `docs/PRD.md` (the 7 `investflow-*` projects) carry
   the 11-sprint plan: status "Planejado" in projects 1–6, "Concluído" in `investflow-origins`.
   `investflow-origins/README.md` and its `.devcontainer` describe Sprints 7–11.
7. The two defects above are fixed inside the sprint that owns them (Sprint 8 → manual quote
   policy; Sprint 10 → FX persistence by the Edge Function), and the fix is what the new
   tests prove.
8. `pnpm validate` passes in the DevLab; `pnpm test` and `pnpm test:e2e` pass in
   `investflow-origins` with the local stack running.

## Non-goals

- **Not** splitting `investflow-origins` into one project per new sprint. The user chose to keep
  one executable for Sprints 7–11; the pages say so explicitly.
- **Not** back-porting any Sprint 8–11 feature into `investflow-static` … `investflow-analytics`.
  Those projects only receive documentation updates (`docs/SPRINTS.md`, `docs/PRD.md`).
- **Not** changing the scope or ids of Sprints 1–6 (`TK01-1` … `TK06-9`, `CA01.1` … `CA06.5`),
  except the `CA08.*` → `CA03.13–15` renumbering.
- **Not** moving the dividend crawler out of the browser (its dependence on Yahoo's CORS policy
  is recorded in `next-steps.mdx` as a known limit), nor adding a paid market provider.
- **Not** creating slides or mind maps: the InvestFlow trail has none in `materials/`.
- **Not** adding dependencies to any project.

## Plan

### Phase 1 — Spec and task entry

- Write this spec; add `[TASK-016.10]` to `docs/TODO.md`.

### Phase 2 — Backlog restructure (`backlog.mdx`)

- Epics: add EP09 (Proventos & Movimentações), EP10 (Internacional & Cripto), EP11 (Perfil &
  Experiência); EP03/EP04 are extended by Sprint 8. Update the Mermaid sequence and the table.
- Features: add FE09–FE15 (see mapping below).
- Rastreabilidade: add rows for US17–US32; extend US13 with CA07.7/CA07.8 and TK07-7; renumber
  US16 to CA03.13–15; keep the CA/TK counts per row.
- Histórias: add US17–US32 with criteria and tasks; sprint tables for Sprints 8–11; "Cobertura
  por etapa" with the four new pages; description frontmatter with the new counts.

Mapping of the new stories:

| Sprint | Story | Criteria (ids) | Tasks |
| ------ | ----- | -------------- | ----- |
| 7 | US13 (extended) | CA07.7 modo contínuo × eventos, CA07.8 janela de tempo | TK07-7 |
| 8 | US17 Corrigir e desfazer lançamentos | CA08.1–CA08.4 | TK08-1 |
| 8 | US18 Acompanhar renda fixa e fundos pelo saldo | CA08.5–CA08.8 | TK08-2, TK08-3 |
| 8 | US19 Informar a cotação à mão quando o provedor não responde | CA08.9–CA08.12 | TK08-4, TK08-5 |
| 8 | US20 Organizar a carteira | CA08.13–CA08.18 | TK08-6, TK08-7, TK08-8 |
| 8 | — | — | TK08-9 testes |
| 9 | US21 Registrar os proventos de cada ativo | CA09.1–CA09.4 | TK09-1, TK09-2 |
| 9 | US22 Ver o que recebi de proventos | CA09.5–CA09.8 | TK09-3, TK09-4, TK09-5 |
| 9 | US23 Incluir os proventos na rentabilidade | CA09.9–CA09.11 | TK09-6 |
| 9 | US24 Acompanhar aportes e resgates | CA09.12–CA09.15 | TK09-7, TK09-8 |
| 9 | — | — | TK09-9 testes |
| 10 | US25 Ter ativos em dólar na carteira | CA10.1–CA10.5 | TK10-1, TK10-2, TK10-3 |
| 10 | US26 Separar a valorização do ativo do efeito do dólar | CA10.6–CA10.10 | TK10-4, TK10-5 |
| 10 | US27 Cotar cripto | CA10.11–CA10.13 | TK10-6, TK10-7 |
| 10 | US28 Respeitar o calendário do mercado | CA10.14–CA10.16 | TK10-8 |
| 10 | — | — | TK10-9 testes |
| 11 | US29 Manter meu perfil | CA11.1–CA11.4 | TK11-1, TK11-2 |
| 11 | US30 Navegar com contexto | CA11.5–CA11.8 | TK11-3, TK11-4, TK11-7 |
| 11 | US31 Escolher o tema e ocultar valores | CA11.9–CA11.11 | TK11-5, TK11-6 |
| 11 | US32 Publicar o front | CA11.12–CA11.13 | TK11-8 |
| 11 | — | — | TK11-9 testes |

### Phase 3 — Code fixes and tests in `investflow-origins`

- Sprint 8 fix: migration `20260912000015_manual_quotes.sql` with insert/update policies on
  `quotes_history` for the owner of the asset; `asset.js` stops discarding the `recordQuote()`
  result. The existing `TK03-5` integration test changes from "the client never writes" to "the
  client only writes on its own asset".
- Sprint 10 fix: the Edge Function persists the USD/BRL rate of the day in `exchange_rates` with
  the service role on every run that fetched it; `fetchAndSyncUsdRates()` is removed from the
  browser service (dead and unauthorized).
- New tests, one file per sprint, each `it`/`test` named with its CA:
  - integration: `tests/integration/ledger.test.js`, `dividends.test.js`, `exchange.test.js`,
    `avatars.test.js`; `quotes.test.js` gains the `asset_id` and FX-persistence cases.
  - unit: dividend crawler with mocked `fetch`, `summarize()` with `update`, exchange fallback,
    `vercel.json`/build checks.
  - E2E: `tests/e2e/ledger.spec.js`, `dividends.spec.js`, `international.spec.js`,
    `experience.spec.js`.

### Phase 4 — New pages (Sprints 8–11)

- `ledger.mdx`, `dividends.mdx`, `international.mdx`, `experience.mdx` in the format of
  `origins.mdx`: opening, `## Objetivo`, requisitos/histórias/critérios em Gherkin, tasks em
  `<Steps>`, diagrama, `## Estrutura da aplicação`, "O que muda", `## Descrição das tarefas` com
  `<SourceCode>` real, `## Testando` com saída real, `## Executando`, exercício, desafio,
  perguntas, referências, próxima etapa.
- Sidebar entries in `astro.config.mjs`.

### Phase 5 — Existing pages and project docs

- `index.mdx`: RF11–RF22 and RNF adjustments, 11-sprint matrix and navigation.
- Pages 1–7: "Etapa N de 11"; `origins.mdx` gains TK07-7/CA07.7/CA07.8 and points to
  `../ledger/`; `next-steps.mdx` re-baselined.
- `docs/SPRINTS.md` and `docs/PRD.md` in the 7 projects; `investflow-origins/README.md` and
  `.devcontainer/investflow-origins/devcontainer.json`.
- `docs/TODO.md`, `README.md` (course table counts if they change).

### Phase 6 — Validation and review

- `pnpm validate` in the DevLab; `pnpm test` + `pnpm test:e2e` in `investflow-origins`.
- `devlab-content-reviewer` on every page created or changed; report with the delivery.

## Expected Validation

- `pnpm validate` green (lint → check → build → check:links → check:doc-lines).
- In `investflow-origins` with `supabase start`: `pnpm test` and `pnpm test:e2e` green, with
  the new files listed and every `CA07.7`–`CA11.13` id appearing in at least one test name
  (`grep -rho "CA[0-9]\{2\}\.[0-9]\{1,2\}" tests src | sort -u`).
- Manual inspection: `/devlab/courses/npm/practice/investflow/backlog/#rastreabilidade` lists
  US01–US32 with CA and TK per row; the sidebar shows 11 numbered sprints.

## Result

_To be filled at the end._
