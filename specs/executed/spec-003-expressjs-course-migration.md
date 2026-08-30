# Spec 003 — Migration of Express Course Slug to `expressjs`

## Context & Rationale

The Express.js course directory and course ID are currently named `express` (`src/content/docs/courses/express/`). To align with user preference and explicitly identify the technology as `expressjs` across course routes and materials, this spec details the migration of course ID `'express'` to `'expressjs'`.

## Objectives

1. Rename the course content directory from `src/content/docs/courses/express/` to `src/content/docs/courses/expressjs/`.
2. Rename the materials directory from `materials/courses/express/` to `materials/courses/expressjs/`.
3. Update course ID from `'express'` to `'expressjs'` in `src/lib/courses.ts` and frontmatter `course: expressjs` of all 42 Express MDX pages.
4. Update all route references and sidebar configuration in `astro.config.mjs` from `/courses/express/` to `/courses/expressjs/`.
5. Add backward-compatibility redirects in `astro.config.mjs` from `/courses/express/*` to `/courses/expressjs/*`.
6. Update helper scripts (`scripts/check-step-coverage.mjs`, `scripts/build-slides.mjs`, `scripts/build-mindmaps.mjs`) and internal relative link references.
7. Validate that `pnpm validate` passes with 0 broken links and 0 errors.

## Phase Plan

### Phase 1: Directory Renaming
- Rename `src/content/docs/courses/express/` ➔ `src/content/docs/courses/expressjs/` via `git mv`.
- Rename `materials/courses/express/` ➔ `materials/courses/expressjs/` via `git mv`.

### Phase 2: Configuration & Metadata Updates
- Update `src/lib/courses.ts`: key `expressjs: { title: 'Guia de Express.js', shortTitle: 'Express.js', href: '/courses/expressjs/' }`.
- Update `course: expressjs` in all frontmatter files under `src/content/docs/courses/expressjs/`.
- Update `astro.config.mjs`:
  - Replace all `/courses/express/` sidebar links and redirect destinations with `/courses/expressjs/`.
  - Add wildcard/specific redirects from `/courses/express/` to `/courses/expressjs/`.

### Phase 3: Relative Links & Helpers
- Replace all internal link references `mindmaps/courses/express/` ➔ `mindmaps/courses/expressjs/` and `slides/courses/express/` ➔ `slides/courses/expressjs/`.
- Update `scripts/check-step-coverage.mjs` and any other script referencing `express/practice/`.

### Phase 4: Validation & Release
- Run `pnpm validate` (`lint` + `check` + `build` + `check:links` + `check:doc-lines`).
- Move spec to `specs/executed/spec-003-expressjs-course-migration.md`.
