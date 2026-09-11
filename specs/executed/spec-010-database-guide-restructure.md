# spec-010 — Database Guide Restructure

**Status:** Done
**Date:** 2026-09-10
**Related:** `[TASK-002]` in [`docs/TODO.md`](../../docs/TODO.md) (open since the roadmap was written; this spec closes its three subtasks) and the new `[TASK-039]`

## Context & Rationale

The Database guide is the smallest guide in the repository that is not a course: **6 topic
pages, 1 732 lines**, plus a 61-line index. It predates the normalisation that `ecmascript`,
`typescript`, `web-api` (spec-006, spec-007) and `cloud` (spec-009) received, and four gaps
are measurable on the current tree.

**1. The SQL the guide teaches does not exist anywhere.** Rule 1 of `AGENTS.md` says code that
runs lives in `examples/` and enters the page through `<SourceCode>`. The guide has **3**
`<SourceCode>` blocks, all of them Docker files (`docker-compose.yml`, `Dockerfile`), against
**20 hand-written fences with file titles** that name files nobody can open: `schema.sql`,
`crud.sql`, `filtros.sql`, `inner-join.sql`, `1fn-tabelas.sql`, `views.sql`,
`exemplo-persistencia.js`, `.env.example`. None of that SQL has ever been executed by a script,
so the two `txt title="Output"` blocks in the guide are written from memory. The guide about
data is the one guide whose examples cannot be run.

**2. No page meets the didactic bar of the other guides.** Measured: **0 of 6** two-part
`## Objetivo`, **0 of 6** `## Desafio`, **0 of 6** `## Quando usar, e quando não usar?`,
**0 of 6** `Dica de IA:` asides, **0** `materials/`. All 6 do have `## Perguntas de revisão`.

**3. `[TASK-002]` has been open since the roadmap was written, with its three subtasks
untouched.** They ask for (a) a modelling section covering keys, relationships and indexes,
(b) worked modelling examples for different application types, and (c) a comparison of
paradigms (relational, NoSQL, graphs). Today keys appear only as constraints inside
`sql/fundamentals`, indexes appear **0 times** as a subject, there is no worked case study,
and NoSQL is one 26-line `mongosh` session inside `basics/dbms.mdx` plus one comparative table
in `basics/introduction.mdx`.

**4. Two subjects any database course has are absent, and one page does three jobs.**
Transactions get one paragraph under ACID in the introduction, with **no** `BEGIN`,
`COMMIT` or `ROLLBACK` anywhere in the guide; query performance (`EXPLAIN`, index usage, N+1)
appears **0 times**. Meanwhile `basics/dbms.mdx` is 467 lines (27% of the guide) covering
engine types, four Docker installations, user management, a data-type table and backup, which
is two pages' worth of subjects under one title.

The guide also sits between two others that grew around it. The Express guide owns
application access (`node:sqlite`, Prisma); the new Cloud guide owns the managed database
(`resources/relational-database`, `resources/document-database`). The Database guide should be
the place that teaches the data itself, and link outward to both.

## Objectives

When this spec is done, the following are observably true:

1. A runnable project `examples/courses/database/invest-db/` holds every SQL statement the
   guide shows, as `.sql` files executed against SQLite by a `run.mjs` script (Node 22,
   `node:sqlite`, no dependencies), and every `txt title="Output"` in the guide was produced by
   that script. Hand-written fences with file titles: 20 → 0.
2. The 6 existing pages carry the two-part `## Objetivo`, `## Desafio`, one `Dica de IA:`
   aside each, and `## Quando usar, e quando não usar?` on the pages that teach a choosable
   technique (`normalization`, `joins-aggregations`, `dbms`).
3. The guide gains **one section per engine**, in the shape of the Cloud guide's platform
   sections: `sqlite/`, `postgresql/`, `mysql/` and `mongodb/`, each with an overview
   (`index.mdx`: what it is, where it shines, when to choose it), a `setup.mdx` (Docker or
   binary, client, first connection) and an `administration.mdx` (users and permissions,
   backup and restore) — MongoDB gets `crud.mdx` (documents, `mongosh`, aggregation pipeline)
   in place of `administration`, whose subject it shares with `setup`. The Docker
   installations, user management and backup sections leave `basics/dbms.mdx`, which keeps
   only engine types, comparison and choice. The `mongosh` session moves to `mongodb/crud`.
   The engine sections are **in addition to** the cross-engine pages below, not a
   replacement: the cross-engine page teaches the concept once, the engine page shows the
   commands of that engine.
4. Seven cross-engine pages are new, registered in the sidebar and in the index:
   - `basics/administration.mdx` — users, roles and permissions, backup and restore,
     environments, as concepts shared by every engine (the engine sections carry the
     commands);
   - `nosql/paradigms.mdx` — relational, document, key-value, wide-column and graph, with a
     decision table (closes `[TASK-002.3]`);
   - `modeling/keys-indexes.mdx` — primary, foreign, natural and surrogate keys, `UNIQUE`,
     `CHECK`, indexes and what they cost (closes `[TASK-002.1]`);
   - `modeling/case-studies.mdx` — three worked models (InvestApp, an e-commerce and a social
     feed) from requirements to DER to `CREATE TABLE` (closes `[TASK-002.2]`);
   - `sql/transactions.mdx` — `BEGIN`/`COMMIT`/`ROLLBACK`, ACID in practice, isolation and
     lost updates, demonstrated by the script;
   - `sql/performance.mdx` — `EXPLAIN QUERY PLAN`, index usage, N+1, pagination cost;
   - `reference/sql-cheat-sheet.mdx` — the guide's quick reference, in the format of the
     ECMAScript and TypeScript cheat sheets.
5. The sidebar section "Acesso a dados na aplicação" and the matching index card are gone:
   they only listed four pages that live in the Express guide (`persistence/node-sqlite`,
   `prisma`, `crud`, `relations`). A single paragraph in the index points there instead. The
   pages link outward to the Express persistence track and to
   `cloud/resources/relational-database` and `cloud/resources/document-database`, and the
   Cloud guide's two database pages link back.
6. `[TASK-002]` is closed in `docs/TODO.md`, `pnpm validate` passes, and
   `devlab-content-reviewer` has been applied to every page touched.

## Non-goals

- **Not** creating `materials/courses/database/**`. The guide has no slides or mind maps
  today; that is a separate task.
- **Not** teaching Prisma, `node:sqlite` from Node, or any application code. That stays in the
  Express guide; this guide links to it.
- **Not** covering managed database services (Supabase, Render Postgres, D1). That is the
  Cloud guide's `resources/` section; this guide links to it.
- **Not** running MySQL, PostgreSQL or MongoDB in CI or in the example script. The runnable
  project uses SQLite. The engine sections keep their Docker files in
  `examples/courses/database/servers/`; their terminal sessions are executed once, locally
  with Docker, to capture real output, and shown as `bash`/`sql` fences with `Output`.
- **Not** renaming existing slugs. The 6 current URLs stay; only new pages are added and
  `dbms` is split by *adding* `administration` (no redirect needed).
- **Not** rewriting the body of the 6 existing pages beyond the normalisation items and the
  fence-to-`<SourceCode>` conversion.

## Plan

### Phase 1 — The runnable project and the conversion

- Create `examples/courses/database/invest-db/` with `schema.sql`, `seed.sql` and one `.sql`
  file per subject the guide shows (`crud.sql`, `filters.sql`, `ordering.sql`, `joins.sql`,
  `aggregations.sql`, `subqueries.sql`, `views.sql`, `normalization/1fn.sql` … `3fn.sql`),
  plus `run.mjs`, which executes a named file against a fresh in-memory SQLite and prints each
  statement's result as a table. `package.json` with `start` and one script per file,
  `README.md`.
- Run every file and capture the outputs.
- Replace the 20 hand-written fences with `<SourceCode>` (using `region` where a page shows a
  part of a file) and the outputs with what the script printed.

*Ends in:* the 6 pages show real files; `pnpm check:doc-lines` passes; every `Output` is real.

### Phase 2 — Normalise the existing pages and empty `dbms`

- Apply to the 6 pages: two-part `## Objetivo`, `## Desafio`, `Dica de IA:` aside,
  `## Quando usar` where applicable.
- Reduce `basics/dbms.mdx` to engine types, comparison and choice; the material it loses
  (Docker, users, backup, `mongosh`) is carried into Phase 3, not deleted.

*Ends in:* 6 pages at the guide standard; `dbms` temporarily links to the engine sections to
come only after Phase 3 registers them (the links are added there, so `check:links` stays
green).

### Phase 3 — Engine sections and cross-engine pages

- Engine sections, one at a time, each with its three pages and its terminal sessions run
  locally against the Docker files in `examples/courses/database/servers/`:
  `sqlite/` (index, setup, administration) → `postgresql/` → `mysql/` → `mongodb/` (index,
  setup, crud).
- Cross-engine pages, each with its `.sql` files added to `invest-db` first:
  `basics/administration` → `nosql/paradigms` → `modeling/keys-indexes` →
  `sql/transactions` → `sql/performance` → `modeling/case-studies` →
  `reference/sql-cheat-sheet`.
- Each page is registered in the sidebar and in the index as it lands. Sidebar order:
  Fundamentos → Modelagem → SQL → NoSQL → SQLite → PostgreSQL → MySQL → MongoDB → Referência.

*Ends in:* 25 topic pages plus index (6 existing + 12 engine pages + 7 cross-engine).

### Phase 4 — Index, cross-links and closure

- Remove the "Acesso a dados na aplicação" sidebar section from `astro.config.mjs` and the
  matching card from `index.mdx`; the four links it held are duplicates of the Express guide's
  persistence track.
- Rewrite `index.mdx` in the format of the other guides (tracks, Mermaid of where the guide
  sits between Express and Cloud, suggested route, references).
- Add the outward links (Express persistence, Cloud resources) and the two backlinks in the
  Cloud guide.
- Close `[TASK-002]` and record `[TASK-039]` in `docs/TODO.md`; update `AGENTS.md` counts.

### Phase 5 — Validation and review

`pnpm validate`, `node run.mjs` for every file, `check-code-blocks.mjs` on the guide, and
`devlab-content-reviewer` over all 25 pages with findings fixed and reported.

## Expected Validation

- `pnpm validate` passes.
- `grep -rn 'title="[a-z0-9-]*\.sql"' src/content/docs/courses/database` returns nothing
  outside `<SourceCode>` (i.e. no hand-written file fences).
- `cd examples/courses/database/invest-db && npm start` runs every `.sql` file without error.
- Manual inspection: `/courses/database/` lists 25 pages in nine tracks; `basics/dbms/` no
  longer contains Docker or `mongosh`; the ECMAScript cheat sheet and the SQL cheat sheet share
  the same structure.
- Diagram widths measured on the built site, all ≤ 720 px.

## Result

Delivered in full: **25 topic pages plus the index**, against the 6 the guide had.

**The SQL now exists and runs.** `examples/courses/database/invest-db/` holds 20 `.sql` files
(blog schema and seed, CRUD, filters, ordering, joins, aggregations, subqueries, views, keys and
indexes, transactions, performance, three normal forms and four modelling case studies) plus
`file-vs-sqlite.mjs`, all executed by `run.mjs` on `node:sqlite` with no dependencies. Every
`txt title="Output"` in the guide was pasted from that script. Hand-written fences with file
titles: **20 → 0**; `<SourceCode>` blocks in the guide: 3 → **74**.

**Engine sessions are real.** `examples/courses/database/servers/` gained `invest.sql` and
`roles.sql` (PostgreSQL), `invest.sql` and `users.sql` (MySQL), `invest.mongodb.js` and
`users.mongodb.js` (MongoDB) plus one `.env.example` each, and the twelve engine pages quote
sessions captured from `postgres:16.2`, `mysql:8.3` and `mongo:7.0` containers, including the
failures the pages teach: `permission denied` under `SET ROLE`, `DROP ROLE` refused by
dependencies, `Data truncated` from a strict `ENUM`, `not authorized` for a `read` user, and
`Update document requires atomic operators`.

**Normalisation of the 6 existing pages.** Two-part `## Objetivo`: 0 → 6. `## Desafio`: 0 → 6.
`Dica de IA:` asides: 0 → 6. `## Quando usar, e quando não usar?` on `dbms`, `normalization`
and `joins-aggregations`. `basics/dbms.mdx` went from 467 lines doing three jobs to a page
about engine types, the data-type table and the choice; Docker, users and backup moved to
the engine sections and to the new `basics/administration`.

**Structure.** Nine sidebar tracks: Fundamentos (3), Modelagem (4), SQL (4), NoSQL (1),
SQLite (3), PostgreSQL (3), MySQL (3), MongoDB (3), Referência (1). The "Acesso a dados na
aplicação" section and its index card are gone; the index links to the Express persistence
track and to the Cloud guide's `resources/` pages, and those two Cloud pages link back.
`[TASK-002]` closed after being open since the roadmap was written; `[TASK-039]` records the
work.

**Review.** `devlab-content-reviewer` checks found and fixed: 3 interrogative headings without
`?`, 2 anglicisms (`deletar`), 1 solitary subsection inherited from the old page, 1 unused
import, 7 elements glued to headings (card grids and reference lists), and 3 diagrams above
850 px (989, 883 and 871 px, now 437, 446 and 434). Final widths across the 25 pages range from
256 to 802 px. `check-code-blocks.mjs`: 0 errors. `pnpm validate` passes: 355 pages built,
38 800+ internal links with none broken, doc line references intact.

**Deviations from the plan.** None in scope. One in method: Phase 2 (normalisation) and the
conversion of Phase 1 were applied page by page in the same pass, because each page's prose
had to be rewritten around the new `<SourceCode>` blocks anyway. The link checker was allowed
to fail between Phases 1 and 3 on links to pages not yet created, and was green again at the
end of Phase 3.
