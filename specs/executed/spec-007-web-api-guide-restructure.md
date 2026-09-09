# spec-007 — Web APIs Guide Restructure

**Status:** Done
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

All six phases were executed. Numbers after the change, measured on the tree:

| Axis | Before | After |
| --- | --- | --- |
| Topic pages with the two-part `## Objetivo` | 0 of 30 | **31 of 31** |
| Pages with `## Quando usar, e quando não usar?` | 0 | **27** |
| Pages with `## Perguntas de revisão` | 20 of 32 | **29 of 32** |
| `browser/modern-apis/` pages with concept before the example | 1 of 11 | **11 of 11** |
| WebAssembly mentions in the repository | 0 | a dedicated page plus a runnable module |
| `Dica de IA:` asides in the guide | 0 | **5** |
| `na Era da Inteligência Artificial` sections | 0 | **1**, on the catalogue page |
| Untitled code blocks (`check-code-blocks`) | 25 warnings | **0** |
| Numbered headings | 18 | **0** |
| Lone subsections outside `## Perguntas de revisão` | 5 | **0** |
| Em dashes and interrogative headings without `?` | 1 + 1 | **0** |
| Guide lines | 5 623 | **8 577** |

Two new runnable projects support the content:

- `examples/courses/web-api/webassembly/` — a 109-byte module exporting `add` and an iterative
  `fib`, its `.wat` source, and `build-wasm.mjs`, which encodes the binary by hand, validates it
  with `WebAssembly.validate()` and checks `fib` from 0 to 30 against a JavaScript reference. No
  compiler needs to be installed. Verified in the browser: 200 000 repetitions of `fib(30)` took
  14.0 ms in JavaScript and 8.8 ms in WebAssembly, with identical results.
- `examples/courses/web-api/ai-review/` — the same `node:test` suite passes against `load-items.js`
  and fails against `load-items.generated.js` (`IMPL=generated node --test`), producing the real
  `data.map is not a function` output quoted on the page.

Not done, and deliberately so:

- `browser/ssr.mdx` and `browser/objects.mdx` did not receive `## Quando usar, e quando não usar?`.
  Neither teaches an API the reader chooses: SSR is a constraint imposed by the environment, and the
  BOM is the object model itself.
- The five entry-paragraph violations under `practice/` were left in place. Those two pages are
  rewritten from scratch under `[TASK-030]`, which supersedes them.

**Validation run**: `pnpm validate` passes end to end (lint, `astro check` with 0 errors and 0
warnings, build, 28 807 internal links with none broken, `check:doc-lines` clean, step coverage
clean). `check-code-blocks.mjs` reports 110 blocks checked, 0 errors and 0 warnings.
