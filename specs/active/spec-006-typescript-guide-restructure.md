# spec-006 — TypeScript Guide Restructure

**Status:** Draft — not started
**Date:** 2026-09-05
**Related:** `[TASK-026]` in [`docs/TODO.md`](../../docs/TODO.md)

## Context & Rationale

The ECMAScript guide is the most mature guide in the repository and sets the shape every
other language guide should converge to. The TypeScript guide already follows the per-topic
conventions (`Objetivo` → content → `Executando` → `Exercício` → `Desafio` → `Perguntas de
revisão` → `Referências` → `Próximo tópico`), but it diverges from ECMAScript at the **guide
architecture** level.

Measured on the current tree:

| Axis | `ecmascript` | `typescript` |
| --- | --- | --- |
| Content pages (`.mdx`, excluding `index`) | 23 | 16 |
| Total content lines | 24 581 | 10 280 |
| Categories | 7 (`basics`, `structure`, `data`, `stdlib`, `async`, `evolution`, `reference`) | 5 (`basics`, `types`, `advanced`, `tooling`, `practice`) |
| `evolution/` track (version history) | 1 page (`tc39.mdx`, 15 `##` sections, ES2015 → ES2025) | absent |
| `reference/` track | 4 pages (`cheat-sheet`, `python-vs-javascript`, `weird-cases`, `ai-assisted-development`) | absent |
| Language comparison page | `reference/python-vs-javascript.mdx` | `basics/typescript-vs-javascript.mdx` (wrong track) |
| Pages with an "na Era da Inteligência Artificial" section | 10 of 23 | 0 of 16 |
| Guide-level materials (`index.slide.md` / `index.mindmap.md`) | both present | both absent |
| `index.mdx` sections | 5 (`Trilhas de Aprendizado`, `Como o guia está organizado?`, `ECMAScript e Ambientes de Execução`, `Ferramentas de Prática`, `Referências`) | 4 (`O que você vai aprender?`, `Como o guia está organizado?`, `Ferramentas`, `Referências`) |

Three consequences follow from the table:

1. A reader who finishes the ECMAScript guide and moves to TypeScript loses the quick-consult
   layer entirely: there is no signature cheat sheet, no catalogue of surprising behaviours, no
   version timeline, and no guidance on generating TypeScript with an AI assistant.
2. `basics/typescript-vs-javascript` is a reference page filed under a learning track. Its
   ECMAScript counterpart (`reference/python-vs-javascript`) sits where it belongs, and the
   `index.mdx` of TypeScript has to advertise it as a "fundamento" it is not.
3. The AI-assisted-development material — the section AGENTS.md treats as part of the modern
   didactic baseline, present in 10 ECMAScript pages — has zero coverage in a guide whose whole
   selling point (static contracts checked before execution) is what makes generated code
   auditable.

## Objectives

When this spec is done, the following are observably true:

1. `src/content/docs/courses/typescript/` has 7 categories, including `evolution/` and
   `reference/`, and no reference-shaped page lives under a learning track.
2. `reference/` contains 4 pages: `typescript-vs-javascript` (moved), `cheat-sheet`,
   `weird-cases` and `ai-assisted-development`.
3. `evolution/releases.mdx` documents the TypeScript version timeline the way `evolution/tc39.mdx`
   documents the ECMAScript one.
4. Every page created or moved has its `materials/courses/typescript/**` slide and mind map, and
   the guide itself has `index.slide.md` and `index.mindmap.md`.
5. The pre-existing content pages that carry a code-generation risk have an
   "… na Era da Inteligência Artificial" section, matching the anatomy used in ECMAScript
   (contract specification → mandatory verification → frequent pitfalls → review checklist).
6. `index.mdx` follows the ECMAScript section order, including a
   "TypeScript e Ambientes de Execução" comparison table.
7. The old URL `/courses/typescript/basics/typescript-vs-javascript/` redirects to the new one;
   no internal link is broken.
8. `pnpm validate` passes.

## Non-goals

This spec explicitly does **not**:

- Create executable projects in `examples/courses/typescript/` or convert hand-written blocks to
  `<SourceCode>`. TypeScript currently has 0 `<SourceCode>` uses against 20 in ECMAScript; closing
  that gap is real work but is a separate spec, and it does not block anything here.
- Rewrite the technical content of the 16 existing pages beyond appending the AI section and
  fixing links affected by the move.
- Touch any other guide (`python`, `html`, `css`, `nodejs`, `expressjs`, …), even where the same
  divergence exists.
- Add `exercises/*.exercise.md` or `*.braincheck.md` files (owned by `[TASK-024]`).
- Migrate the guide to `.md`; every page stays `.mdx`.
- Change the five existing category slugs (`basics`, `types`, `advanced`, `tooling`, `practice`) —
  their names differ from ECMAScript's by design, because the subject matter differs.

## Plan

Each phase ends with the repository building and `pnpm check:links` clean.

### Phase 1 — `reference/` track and the comparison page move

- `git mv` `basics/typescript-vs-javascript.mdx` → `reference/typescript-vs-javascript.mdx`, and
  the matching `.slide.md` / `.mindmap.md` under `materials/courses/typescript/`.
- Add the redirect from the old path in `astro.config.mjs`, next to the existing redirect block.
- Update the sidebar entry, the `index.mdx` badge, and every relative link that pointed at the old
  location (including `## Próximo tópico` chains on both sides of the move).
- Fix the `Materiais:` line of the moved page to the new slide/mind map URLs.

### Phase 2 — `evolution/releases.mdx`

- New page covering the TypeScript timeline, mirroring the structure of `evolution/tc39.mdx`:
  release cadence and the design goals, a timeline overview, then one section per significant
  release line (1.x foundations, 2.x `strictNullChecks`, 3.x tuples and `unknown`, 4.x template
  literal types and variadic tuples, 5.0 decorators/`const` type parameters/`satisfies`,
  5.2 `using`, and the current 5.x line), closing with runtime and tooling adoption.
- Slide deck and mind map for it.
- Sidebar entry under a new "Evolução" group, plus the `index.mdx` badge.

### Phase 3 — `reference/cheat-sheet.mdx` and `reference/weird-cases.mdx`

- `cheat-sheet.mdx`: quick-consult signatures grouped like the ECMAScript one — annotation syntax,
  primitives and special types, object/interface modifiers, unions and narrowing operators,
  generics and constraints, the full utility-type catalogue, `keyof`/`typeof`/indexed access,
  mapped and conditional types with `infer`, template literal types, declaration files, and the
  `tsconfig.json` options that change type-checking behaviour. No `Objetivo`/`Exercício` sections,
  same as its ECMAScript counterpart.
- `weird-cases.mdx`: the surprising behaviours of the type system — structural typing letting
  unrelated types match, excess property checks firing only on fresh literals, `any` disabling
  checks silently while `unknown` does not, bivariant method parameters, `readonly` being erased at
  the boundary, enum numeric reverse mapping, declaration merging, `never` absorbing unions,
  distributive conditional types, `as const` versus widening, and the compile-time/run-time gap
  where the type says one thing and the JSON payload says another.
- Slides and mind maps for both; sidebar entries; `index.mdx` badges.

### Phase 4 — `reference/ai-assisted-development.mdx`

- Same skeleton as `ecmascript/reference/ai-assisted-development.mdx`, re-argued for TypeScript:
  what the type checker adds to the verification loop of generated code, project context an
  assistant cannot guess (`tsconfig.json` strictness, module resolution, path aliases), writing the
  spec before generating, a prompt catalogue by task, what to run before believing the output
  (`tsc --noEmit`, lint, tests), the pitfalls per topic (`any` smuggled in as an escape hatch,
  assertions instead of narrowing, hallucinated utility types, `@ts-ignore` used as a fix,
  types that lie about runtime data), model limits, and the pre-merge review checklist.
- Slide deck and mind map; sidebar entry; `index.mdx` badge.

### Phase 5 — AI sections in the existing pages

- Append "… na Era da Inteligência Artificial" to the existing content pages, before
  `## Executando`, using the ECMAScript anatomy: contract specification, mandatory verification,
  frequent pitfalls of generated code for that specific topic, and the review checklist.
- Each section is topic-specific; nothing is copied between pages.
- Update the corresponding `.slide.md` and `.mindmap.md` of every page touched, per AGENTS.md
  rule 5.

### Phase 6 — Guide index and guide-level materials

- Rewrite `index.mdx` to the ECMAScript section order, renaming "O que você vai aprender?" to
  "Trilhas de Aprendizado", extending the card grid with the new `evolution/` and `reference/`
  entries, extending the `<Steps>` progression accordingly, and adding a "TypeScript e Ambientes
  de Execução" table (what the compiler standardises versus what `tsc`, `tsx`, Node.js type
  stripping, Deno, Bun and bundlers each provide).
- Create `materials/courses/typescript/index.slide.md` and `index.mindmap.md`.

### Phase 7 — Validation and review

- `pnpm validate`.
- Apply the `devlab-content-reviewer` skill to every page created or modified and report the
  outcome with the delivery.

## Expected Validation

```bash
pnpm validate           # lint → check → build → check:links → check:doc-lines
```

Manual inspection required:

- `/courses/typescript/` renders 7 cards and the new comparison table.
- `/courses/typescript/basics/typescript-vs-javascript/` redirects to `/courses/typescript/reference/typescript-vs-javascript/`.
- Each new page's `Materiais:` links resolve to a rendered deck and mind map under
  `/slides/courses/typescript/…` and `/mindmaps/courses/typescript/…`.
- The `## Próximo tópico` chain walks the whole guide without a dead end.

## Result

*(to be filled at the end, with the post-change numbers.)*
