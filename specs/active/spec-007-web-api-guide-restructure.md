# spec-007 — Web APIs Guide Restructure

**Status:** In progress
**Date:** 2026-09-09
**Related:** `[TASK-029]` in [`docs/TODO.md`](../../docs/TODO.md)

## Context & Rationale

The Web APIs guide is the third largest guide in the repository (30 topic pages, 2 project
pages, 5 623 lines). It was assembled from three earlier courses (`dw-cstrc-jp`,
`pw2-csbes-jp`, `lp2-ctii-jp`) and never went through the didactic normalisation that
`ecmascript` and `typescript` received in spec-006. Four divergences are measurable on the
current tree.

**1. No page uses the two-part `## Objetivo`.** The generator skill requires a general
objective closing with the canonical sentence `Ao final do tópico, o leitor deve ser capaz
de:` followed by 4–6 infinitive bullets. Nineteen pages across `ecmascript`, `typescript` and
`npm` already follow it; `web-api` has **0 of 30**. Today the section is a single dense
paragraph, so the reader cannot tell what the page will make them able to do.

**2. Ten pages are examples with no concept in front of them.** Every page under
`browser/modern-apis/` except `vibration` follows the same 84–90 line skeleton:

```
## Objetivo (1 paragraph)
## Modelo da API      → 1 paragraph + a feature table
## Exemplo com preview e código → <HtmlPreview> + <SourceCode> of the whole file
## Cuidados práticos  → a table
## Executando / ## Exercício / ## Referências / ## Próximo tópico
```

There is no mental model, no diagram, no minimal self-contained snippet before the full file,
and no `## Perguntas de revisão` or `## Desafio`. The reader meets a 60-line HTML file before
meeting the idea it implements, which inverts the "Conceito Base → Exemplo Mínimo →
Aprofundamento" cycle the skill mandates. Concretely: 10 of 30 pages have no
`## Perguntas de revisão`, and 17 of 30 have no `## Desafio`.

**3. No page says when *not* to use the API it teaches.** A guide whose subject is a catalogue
of interfaces has to answer "which one, and when?", and the answer is scattered inside
`<Aside>` blocks (`Privacidade`, `Quando usar`, `Controle do usuário`) rather than being a
readable section. `browser/modern-apis.mdx` has a `## Catálogo de Web APIs`, but the catalogue
lists what each API does, not the decision that leads to it. There is no criterion for choosing
`localStorage` over cookies, `WebSocket` over polling, `Canvas` over SVG, or `Notification`
over an in-page banner.

**4. Two whole subjects are absent.** WebAssembly is mentioned **0 times** in the entire
repository, even though `browser/workers.mdx` already teaches moving work off the main thread
and stops exactly where WebAssembly begins. And the guide has **0** `Dica de IA:` asides and
**0** `na Era da Inteligência Artificial` sections, against 23 asides in `ecmascript` and 10
full sections there — despite Web APIs being the area where assistants most confidently
generate code against permission models and browser quirks they cannot verify.

## Objectives

When this spec is done, the following are observably true:

1. All 30 topic pages carry the two-part `## Objetivo` (general paragraph ending in
   `Ao final do tópico, o leitor deve ser capaz de:` + 4–6 infinitive bullets).
2. The 10 thin pages under `browser/modern-apis/` open with conceptual material — mental model,
   diagram or minimal hand-written snippet — **before** the `<HtmlPreview>` and the full
   `<SourceCode>`, and each closes with `## Perguntas de revisão`.
3. Every page that teaches a browser API carries a `## Quando usar, e quando não usar?` section
   with a decision table naming the alternative that wins in each case.
4. `browser/webassembly.mdx` exists, backed by a runnable project in
   `examples/courses/web-api/webassembly/`, registered in the sidebar and in `index.mdx`, and
   cross-linked with `browser/workers.mdx`.
5. `browser/modern-apis.mdx` carries a `## Web APIs na Era da Inteligência Artificial` section,
   and the pages where assistants demonstrably fail (`http/fetch`, `http/cors`,
   `dom/manipulation`, `storage/local-storage`, `browser/workers`) carry one `Dica de IA:`
   aside each, ending in a `**Prompt:**` line.
6. `pnpm validate` passes, and `devlab-content-reviewer` has been applied to the changed pages.

## Non-goals

- **Not** rewriting the 20 dense pages section by section. They get the `Objetivo`, the
  `Quando usar` section where it applies, and the AI aside where it applies. Their content
  sections stay as they are.
- **Not** creating `materials/courses/web-api/**`. The guide has no slides or mind maps today,
  and building 30 decks is a separate task.
- **Not** touching `examples/` projects other than adding the WebAssembly one. The
  InvestApp/MonitorApp tracks under `examples/courses/web-api/` stay untouched.
- **Not** reorganising the guide's categories (`browser/`, `dom/`, `http/`, `storage/`,
  `practice/`) or renaming any slug.
- **Not** adding AI sections to more than the one catalogue page. Repeating the section across
  neighbouring pages produces generic advice, which the skill forbids.
- **Not** migrating the `practice/` pages to the topic structure — they are project pages and
  follow the project shape.

## Plan

**Phase 1 — Two-part `## Objetivo` on all 30 topic pages.**
Rewrite each `## Objetivo` into general paragraph + bullets, drawing the bullets from the
page's own `##` sections so the objective and the body cannot drift. Leaves the repository
consistent on its own.

**Phase 2 — `## Quando usar, e quando não usar?` across the API pages.**
Add the decision section to the pages that teach a concrete API, each with a table naming the
losing alternative. Extend `browser/modern-apis.mdx` with a guide-wide decision table so the
catalogue answers "which one?" and not only "what is it?".

**Phase 3 — Concept before example in the 10 thin pages.**
For each of `canvas`, `clipboard`, `dialog`, `drag-and-drop`, `fetch`, `fullscreen`,
`geolocation`, `notification`, `web-speech`, `web-storage`: add the conceptual sections and a
minimal snippet before the preview, and close with `## Perguntas de revisão`.

**Phase 4 — WebAssembly.**
Create `examples/courses/web-api/webassembly/` (a `.wat` module compiled to `.wasm` plus the
HTML/JS that instantiates it), write `browser/webassembly.mdx`, register it in the sidebar and
in `index.mdx`, and link it from `browser/workers.mdx` and the catalogue.

**Phase 5 — AI section and asides.**
Write `## Web APIs na Era da Inteligência Artificial` in `browser/modern-apis.mdx`, then one
`Dica de IA:` aside in each of the five pages listed in Objective 5.

**Phase 6 — Validation and review.**
`pnpm validate`, then `devlab-content-reviewer` over the changed pages, then fix everything
classified as blocking.

## Expected Validation

- `pnpm validate` (lint → check → build → check:links → check:doc-lines → check:step-coverage).
- `grep -c "Ao final do tópico" ` over the guide returns 30.
- Every page under `browser/modern-apis/` has `## Perguntas de revisão`.
- `/courses/web-api/browser/webassembly/` renders, its example runs in the browser preview, and
  the sidebar entry reaches it.
- Manual reading of one page per phase in `pnpm dev`.

## Result

_To be filled in when the spec is closed._
