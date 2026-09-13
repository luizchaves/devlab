# Specification: TK03-13 Public Seed Data

## Context & Rationale

The project previously used seed files as a convenient way to load a realistic investment portfolio into local Supabase. That made `scripts/seed-investments.mjs` and `supabase/seed.sql` carry confidential portfolio data, which is not acceptable for a versioned teaching project.

The versioned seed surface must be safe to commit, review, copy into learning material and run in CI-like local environments. Real or private seed payloads must live outside the repository.

## Objectives

- Keep `supabase/seed.sql` functional for `pnpm db:reset`.
- Keep `scripts/seed-investments.mjs` functional for `pnpm seed`.
- Seed only one public demonstration account: `admin@example.com`.
- Mark that account as `role = 'admin'`.
- Seed one demonstration investment: `Tesouro Reserva 2036`, category `renda_fixa`, value `R$ 1`.
- Avoid real names, real balances, real transaction history and real portfolio positions in versioned seed files.

## Non-goals

- This spec does not define a private seed storage format.
- This spec does not migrate production data.
- This spec does not change RLS, authentication policies or the portfolio calculation model.

## Implementation

- Confidential seed files were copied outside the repository to `/Users/lucachaves/code/subjects/devlab-investflow-myseed`.
- `supabase/seed.sql` was replaced with a minimal SQL seed that creates the admin user, profile, broker, asset and one `update` transaction.
- `scripts/seed-investments.mjs` was replaced with a minimal service-role script that performs the same demonstration load through Supabase APIs.
- `docs/PRD.md` and `docs/SPRINTS.md` now document the no-confidential-seed rule and validation criteria.

## Expected Validation

- `pnpm lint`
- `pnpm test:unit`
- `pnpm build`
- `pnpm db:reset`
- SQL inspection after reset:
  - `admin@example.com` exists in `auth.users`.
  - `public.profiles.role = 'admin'` for that user.
  - `TESOURO-RESERVA-2036` exists in `public.assets`.
  - The seeded position has exactly one `update` transaction with `quantity = 1` and `price = 1`.

## Result

Completed. The repository now contains only public demonstration seed data, while the prior confidential seed files were preserved outside the repository for local/private use.
