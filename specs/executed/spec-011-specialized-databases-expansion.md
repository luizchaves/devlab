# Spec 011: Specialized Database Engines Expansion

- **Status**: Executed
- **Date**: 2026-09-11
- **Related**: `[TASK-040]` in `docs/TODO.md`

## Context & Rationale

The DevLab Database Guide (`courses/database/`) currently covers 3 relational database engines (SQLite, PostgreSQL, MySQL) and 1 document database engine (MongoDB). While the `basics/paradigms.mdx` page discusses Key-Value, Graph, Time-Series, Search, and Wide-Column models theoretically, learners lack dedicated engine sections with hands-on Docker Compose setups, native CLIs, query languages, and practical trade-off guides.

Adding 5 dedicated engine tracks representing these core paradigms:
1. **Redis** (Key-Value & In-Memory Data Structures)
2. **Neo4j** (Graph Database & Cypher)
3. **InfluxDB** (Time-Series Database & Line Protocol / Windowing)
4. **Elasticsearch** (Search Engine & Query DSL / Inverted Index)
5. **Apache Cassandra** (Wide-Column Distributed Store & CQL)

will complete the multi-paradigm database curriculum, matching the high educational and operational standards of DevLab.

## Objectives

1. Create 5 executable server directories in `examples/courses/database/servers/` (`redis-server`, `neo4j-server`, `influxdb-server`, `elasticsearch-server`, `cassandra-server`), each containing `docker-compose.yml`, `.env.example`, and an executable domain script based on the `invest-db` dataset.
2. Author 15 `.mdx` pages (3 per engine: `index.mdx`, `setup.mdx`, and a specialized operations/querying page) adhering strictly to DevLab quality conventions (bipartite `## Objetivo`, Mermaid diagrams, `## Executando`, `## Exercício`, `## Desafio`, `## Perguntas de revisão`, `## Referências`, `## Próximo tópico`).
3. Update `astro.config.mjs` to register all 5 sections in the explicit sidebar navigation.
4. Update `src/content/docs/courses/database/index.mdx` and `basics/paradigms.mdx` with cross-links, badges, and learning tracks.
5. Validate with `pnpm lint`, `pnpm check`, `pnpm build:fast`, `pnpm check:links`, and `pnpm check:doc-lines`.

## Non-goals

- Implementing full multi-node production clusters (single-node development compose environments are used).
- Adding complex application-tier SDK bindings (Node.js SDK access is covered in the Express persistence track and Cloud guide).
- Replacing or modifying existing relational (SQLite/Postgres/MySQL) or MongoDB sections.

## Plan

### Phase 1: Server Environments & Executable Scripts
Create the 5 server directories in `examples/courses/database/servers/` with Docker Compose configurations and domain scripts.

### Phase 2: Authoring Topic Content Pages
Write the 15 `.mdx` files across `src/content/docs/courses/database/{redis,neo4j,influxdb,elasticsearch,cassandra}/`.

### Phase 3: Sidebar, Course Index & Cross-References
Update `astro.config.mjs`, `src/content/docs/courses/database/index.mdx`, and `basics/paradigms.mdx`.

### Phase 4: Validation & Git Delivery
Run full validation pipeline (`pnpm validate`), finalize spec to `specs/executed/`, commit in English with Conventional Commits, and push to `origin/main`.

## Expected Validation

- `pnpm lint` passing with 0 errors.
- `pnpm check` passing with 0 errors.
- `pnpm build:fast` compiling all ~913 static HTML pages.
- `pnpm check:links` verifying ~40,000 internal links with 0 broken links.
- `pnpm check:doc-lines` validating all `<SourceCode>` line references.

## Result

- Created 5 server environments with Compose configs and domain scripts in `examples/courses/database/servers/`.
- Authored 15 `.mdx` pages across `redis/`, `neo4j/`, `influxdb/`, `elasticsearch/`, and `cassandra/`.
- Updated sidebar in `astro.config.mjs` and course index in `database/index.mdx`.
- Verified 40,799 internal links across 913 pages with 0 broken links and 0 lint/type errors.
