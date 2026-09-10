# spec-009 — Cloud Guide Extraction (BaaS out of the npm guide)

**Status:** Done
**Date:** 2026-09-10
**Related:** `[TASK-038]` in [`docs/TODO.md`](../../docs/TODO.md); absorbs `[TASK-037.2]`

## Context & Rationale

The npm guide is about **the package manager and what you install from the `npmjs.com`
registry**. Its own `index.mdx` states the scope in the opening paragraph: "o **gerenciador**
em si […] e os **pacotes de apoio** que ampliam uma aplicação web moderna". Seven of its
21 pages do not fit that scope.

**1. The BaaS track is not about npm.** `src/content/docs/courses/npm/baas/` holds 7 pages and
1 498 lines: `firebase.mdx`, `firebase-firestore.mdx`, `firebase-auth.mdx`, `supabase.mdx`,
`supabase-api.mdx`, `supabase-client.mdx`, `supabase-auth.mdx`. Their subject is hosted
infrastructure — a managed PostgreSQL, row-level security policies, JWT sessions issued by a
provider, a NoSQL document store synchronised over the network. The npm package
(`@supabase/supabase-js`, `firebase`) is the smallest part of each page; `supabase-api.mdx`
teaches PostgREST over HTTP and installs **no npm package at all** (11 of its `<SourceCode>`
blocks are `.http` and `.sh` files, not JavaScript).

**2. The npm index already admits the mismatch.** Its own decision table separates
"Serviço remoto — Plataforma hospedada, consumida por SDK ou HTTP. Supabase, Firebase" from
packages, and the guide's Mermaid diagram puts them in a separate node
(`E --> G["Serviços externos<br/>Supabase, Firebase"]`). The taxonomy the page teaches is
contradicted by the fact that the services live inside the packages guide.

**3. Cloud has no home, so nothing about it can be written.** The repository has 14 guides and
none covers cloud computing. There is no page about service models (IaaS/PaaS/SaaS/BaaS/FaaS),
static hosting (GitHub Pages, Netlify, Vercel, Cloudflare Pages), serverless functions, or how
to choose between providers — subjects every project in `examples/` eventually needs and that
today have nowhere to go. `[TASK-037.2]` ("Revisar e expandir a página de BaaS") is blocked by
the same mismatch: expanding BaaS inside the npm guide makes the npm guide worse.

**4. The 7 pages are below the guide standard set by spec-006/spec-007.** Measured on the
current tree: **0 of 7** carry the two-part `## Objetivo`, **0 of 7** have `## Desafio`,
**0 of 7** have `## Quando usar, e quando não usar?`, **0 of 7** carry a `Dica de IA:` aside.
They do have `## Perguntas de revisão` (7 of 7). Only 2 of 7 use `<SourceCode>` for JavaScript;
`supabase-client.mdx`, `supabase-auth.mdx` and `firebase-auth.mdx` have **0** despite
`examples/courses/npm/baas/supabase-client/invest-app/` existing on disk.

## Objectives

When this spec is done, the following are observably true:

1. A guide with id `cloud`, title **"Guia de Computação em Nuvem"**, route `/courses/cloud/`
   exists in `src/lib/courses.ts`, in the sidebar of `astro.config.mjs` and in the site
   homepage listing, and the npm guide no longer contains a `baas/` directory.
2. The 7 migrated pages answer at their new URLs, and every old URL redirects:
   `/courses/npm/baas/*` (7) and `/courses/packages/baas/*` (7, currently pointing at the npm
   route) resolve to the new `cloud` routes, as do the 5 `pw2-csbes-jp/package/*` redirects.
3. The 3 projects under `examples/courses/npm/baas/` live under `examples/courses/cloud/`, and
   every `<SourceCode path="…">` in the guide points at the new location
   (`pnpm check:doc-lines` proves it).
4. The 7 migrated pages carry the two-part `## Objetivo`, a `## Quando usar, e quando não
   usar?` decision table, `## Desafio`, and one `Dica de IA:` aside on each page where code is
   actually written (the 5 non-overview pages).
5. Five new pages exist, each registered in the sidebar and in the guide index:
   - `foundations/cloud-computing.mdx` — what the cloud is, IaaS/PaaS/SaaS/BaaS/FaaS, shared
     responsibility, regions, pricing models, vendor lock-in;
   - `foundations/baas.mdx` — Backend as a Service as a concept, its boundary with a
     self-hosted back end (the TaskAPI of the Express guide), and when it is the wrong choice;
   - `hosting/static-hosting.mdx` — publishing a Vite build to GitHub Pages, Netlify, Vercel
     and Cloudflare Pages, with a runnable project in `examples/courses/cloud/static-hosting/`;
   - `hosting/serverless-functions.mdx` — one HTTP function deployed as a serverless endpoint,
     cold start, statelessness, limits, with a runnable project;
   - `reference/platform-map.mdx` — decision table across Firebase, Supabase, Appwrite,
     PocketBase, Vercel, Netlify, Cloudflare and AWS Amplify, in the format of
     `npm/reference/package-map.mdx`.
6. The npm guide's `index.mdx`, `reference/package-map.mdx` and `ui/leaflet.mdx`, and
   `pw2-csbes-jp/topics/packages.mdx`, link to the new guide instead of holding the BaaS cards
   and badges; the npm description and Mermaid diagram no longer promise BaaS content.
7. `pnpm validate` passes, and `devlab-content-reviewer` has been applied to every page the
   spec creates or edits.

## Non-goals

- **Not** teaching a cloud provider console end to end. No AWS/GCP/Azure track, no IAM, no
  Terraform, no Kubernetes. The guide stops at what a web application developer deploys and
  consumes.
- **Not** creating `materials/courses/cloud/**`. The npm guide has no slides or mind maps
  today; building decks for a new guide is separate work.
- **Not** rewriting the body of the 7 migrated pages. They receive the four normalisation
  items of Objective 4 and the path/link fixes. Their existing sections stay as written.
- **Not** adding a devcontainer for the migrated projects — they have none today, and the two
  new `examples/` projects follow whatever the closest existing folder does.
- **Not** touching the other `npm` tracks (`basics`, `build`, `dev`, `mock`, `http`,
  `validation`, `ui`) beyond the link and index edits of Objective 6.
- **Not** migrating the legacy `pw2-csbes-jp` / `dw-cstrc-jp` course pages themselves. Only
  their redirect targets and links change.

## Plan

### Phase 1 — Move, with every URL still answering

- Create the guide id `cloud` in `src/lib/courses.ts` and the directory
  `src/content/docs/courses/cloud/`.
- `git mv` the 7 pages into their final layout:

  | From (`courses/npm/baas/`) | To (`courses/cloud/`)   |
  | -------------------------- | ----------------------- |
  | `supabase.mdx`             | `supabase/index.mdx`    |
  | `supabase-api.mdx`         | `supabase/api.mdx`      |
  | `supabase-client.mdx`      | `supabase/client.mdx`   |
  | `supabase-auth.mdx`        | `supabase/auth.mdx`     |
  | `firebase.mdx`             | `firebase/index.mdx`    |
  | `firebase-firestore.mdx`   | `firebase/firestore.mdx`|
  | `firebase-auth.mdx`        | `firebase/auth.mdx`     |

- `git mv examples/courses/npm/baas` → `examples/courses/cloud/`, keeping the per-topic folder
  names (`firebase-firestore/`, `supabase-api/`, `supabase-client/`), and update every
  `<SourceCode path>` (11 files in `supabase/api.mdx`, 1 in `firebase/firestore.mdx`).
- Fix `course: npm` → `course: cloud` in the frontmatter, retitle (`npm: Supabase Auth` →
  `Supabase Auth`), and rewrite the intra-track relative links to the new depth.
- Write `cloud/index.mdx` with the guide overview and the learning tracks, and register the
  guide in the sidebar of `astro.config.mjs`.
- Add the 19 redirects (7 from `/courses/npm/baas/*`, 7 repointed from
  `/courses/packages/baas/*`, 5 repointed from `/courses/pw2-csbes-jp/package/*`).

*Ends in:* every old and new URL resolves; `pnpm build && pnpm check:links` clean.

### Phase 2 — Close the npm guide's side of the move

- Remove the BaaS `<Card>` and the badges from `npm/index.mdx`, rewrite its `description`,
  its opening paragraph, the "Serviço remoto" row and the Mermaid node so they point at the
  cloud guide instead of describing content the guide no longer has.
- Update `npm/reference/package-map.mdx`, `npm/ui/leaflet.mdx` and
  `pw2-csbes-jp/topics/packages.mdx` to the new links.

*Ends in:* zero occurrences of `npm/baas` in `src/`; the npm guide reads as a package guide.

### Phase 3 — Normalise the 7 migrated pages

Apply, page by page: the two-part `## Objetivo`, `## Quando usar, e quando não usar?` with a
decision table naming the alternative that wins, `## Desafio`, and a `Dica de IA:` aside ending
in a `**Prompt:**` line on the 5 pages that write code. Where a page teaches code that already
exists under `examples/courses/cloud/`, replace hand-written blocks with `<SourceCode>`.

*Ends in:* the 7 pages meet the same bar as the `web-api` guide after spec-007.

### Phase 4 — The five new pages

In this order, each with its project first when it needs one:
`foundations/cloud-computing.mdx` → `foundations/baas.mdx` → `hosting/static-hosting.mdx`
(+ `examples/courses/cloud/static-hosting/`) → `hosting/serverless-functions.mdx`
(+ `examples/courses/cloud/serverless-functions/`) → `reference/platform-map.mdx`.
Each page is registered in the sidebar and in `cloud/index.mdx` as it lands.

*Ends in:* the guide has 13 pages plus its index and reads as a course, not as a folder.

### Phase 5 — Validation and review

`pnpm validate`, then `devlab-content-reviewer` over the new guide, with the findings fixed
and reported.

## Expected Validation

- `pnpm validate` (lint → check → build → check:links → check:doc-lines) passes.
- `grep -rn "npm/baas" src/ astro.config.mjs` returns nothing.
- Every redirect answers: spot-check `/devlab/courses/npm/baas/supabase/`,
  `/devlab/courses/packages/baas/firebase-auth/` and
  `/devlab/courses/pw2-csbes-jp/package/supabase-client/` in the built site.
- Manual inspection: `/courses/cloud/` lists 13 pages; the npm guide index no longer mentions
  Firebase or Supabase as its own content.
- The two new `examples/` projects run from their own `README.md` instructions.

## Result

Delivered in full, with one deviation from the plan (recorded below).

**Numbers after the change.** The `cloud` guide has **13 topic pages plus its index**, against the
7 pages it inherited. The npm guide dropped from 21 to 14 pages and no longer contains a `baas/`
directory: `grep -rn "npm/baas" src/ astro.config.mjs` returns nothing. `examples/courses/cloud/`
holds **5 projects**: the 3 migrated (`firebase-firestore`, `supabase-api`, `supabase-client`) and
the 2 written for this spec (`static-hosting/invest-site`, `serverless-functions/quote-api`).

**Normalisation of the 7 migrated pages.** Two-part `## Objetivo`: 0 → 7. `## Quando usar, e quando
não usar?`: 0 → 7. `## Desafio`: 0 → 7. `Dica de IA:` asides: 0 → 5 (the pages that write code).
`<SourceCode>` blocks across the guide went from 13 to 20: the `storage.js` of both the Supabase
and the Firestore tracks stopped being hand-written and now cut from the real files, and
`firebase/auth.mdx` lost the `title="js/services/api.js"` on a block that had no file behind it.

**Redirects.** 19 in `astro.config.mjs`, all verified in the built site: 7 new from
`/courses/npm/baas/*`, 7 repointed from `/courses/packages/baas/*` and 5 repointed from
`/courses/pw2-csbes-jp/package/*`.

**The two new projects run.** `invest-site` was built with `BASE_PATH=/invest-site/ npm run build`
and the generated HTML carries the prefixed paths quoted on the page; `_headers` and `_redirects`
reach `dist/`. `quote-api` was executed with `node server.js` and answered `200`, `400` and `405`
on the three documented requests, with the API key never leaving the server response.

**Review.** `devlab-content-reviewer` found and fixed: 4 interrogative headings without `?`,
11 missing lead-in paragraphs (code blocks and tables glued to headings, `<Steps>` after
`## Executando`), 2 solitary subsections and 1 anglicism (`deletar`). `check-code-blocks.mjs`
reports 21 blocks, 0 errors, 0 warnings. `pnpm validate` passes: lint 0 errors, `astro check`
0 errors, 288 pages built, 30 800+ internal links with none broken, doc line references intact.

**Deviation.** The guide index (`cloud/index.mdx`) was written in Phase 1 with only the two
platform tracks and extended in Phase 4 as the new pages landed, rather than being written once
at the end. Writing it complete in Phase 1 would have broken `pnpm check:links`, which the plan
required each phase to keep green.
