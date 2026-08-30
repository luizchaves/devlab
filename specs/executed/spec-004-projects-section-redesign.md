# Spec 004: Redesign and Expansion of the Projects Section

Status: **Completed**
Date: 2026-08-30

## Context and Goal

The homepage (`src/content/docs/index.mdx`) currently features a flat `## Projetos` section displaying only 6 Express.js beginner/intermediate projects. However, the repository contains many rich, multi-step executable projects across multiple learning tracks—such as **InvestApp** (Personal Finance App), **MonitorApp** (Server Monitoring App), and various **Front-end & Web APIs** projects.

The goal of this task is to:
1. Expand `src/lib/projects.ts` to catalog missing projects from the InvestApp, MonitorApp, Express.js, and Front-end/Web APIs tracks.
2. Add categorization (`category` field and helper functions) to `src/lib/projects.ts`.
3. Redesign the `## Projetos` section in `src/content/docs/index.mdx` using Starlight `<Tabs>` and `<TabItem>` components, mirroring the user experience of the `## Guias e Trilhas` section.
4. Ensure all project links, source code paths, levels, and tags are accurate and pass all validation tools (`pnpm validate`).

## Plan

1. **Category Definition & Catalog Expansion (`src/lib/projects.ts`)**:
   - Add `ProjectCategory` type (`'featured' | 'express' | 'invest-app' | 'monitor-app' | 'frontend-webapi'`).
   - Include `category` and optional `featured` flag in `Project` interface.
   - Catalog all major InvestApp, MonitorApp, Express, and Front-end projects.
   - Export helper functions: `getProjectsByCategory()`, `getFeaturedProjects()`.

2. **Homepage Section Redesign (`src/content/docs/index.mdx`)**:
   - Update import statements to bring in helper functions or filtered project lists.
   - Structure `## Projetos` with `<Tabs>`:
     - `Destaques` (Featured Projects across all categories)
     - `Trilha InvestApp` (InvestApp static, API, TS, Validation, Prisma, Auth, Upload, React)
     - `Trilha MonitorApp` (MonitorApp static, API, Ping, Prisma, Auth, Realtime)
     - `Trilha Express.js` (Hello Express, Router, MVC, TypeScript, Prisma, Auth)
     - `Front-end & Web APIs` (PingWatch Landing, InvestApp DOM/LocalStorage, Mock API)

3. **Validation & Cleanup**:
   - Run `pnpm lint`, `pnpm check`, `pnpm build`, `pnpm check:links`, `pnpm check:doc-lines`, and `pnpm validate`.
   - Move this spec to `specs/executed/spec-004-projects-section-redesign.md`.

## Expected Validation

- `pnpm validate` finishes with 0 errors.
- Internal links check (`pnpm check:links`) passes cleanly.
- Code snippet line references (`pnpm check:doc-lines`) pass cleanly.
