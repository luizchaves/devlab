# Spec 012 — Validating `Authorization` and Cookies with Zod

Status: **Active**
Date: 2026-09-11
Related: `docs/TODO.md` → `[TASK-033.5]`, `[TASK-034.1]`

## Context & Rationale

The three Express.js trails (TaskAPI, InvestApp, MonitorApp) teach validation with
Zod as "the schema is the contract": every byte that enters through HTTP is checked
before a handler runs. That promise is kept for three of the five sources an HTTP
request has, and silently broken for the other two.

| Source | Validated by `validate(schema)` today | Where the trails read it |
| ------ | ------------------------------------- | ------------------------ |
| `body` | yes | every `POST`/`PUT` route |
| `query` | yes | listings, `?token=` on `/auth/verify` |
| `params` | yes | `/:id` routes |
| `headers` | **no** | `authorization` in 11 `authenticate.ts` / `isAuthenticated.ts` files, read with a bare `split(' ')` |
| `cookies` | **no** | nowhere: no project parses cookies, and `req.cookies` is `undefined` |

The numbers behind this:

- **26 copies** of `validate.ts` (8 in TaskAPI, 9 in InvestApp, 9 in MonitorApp),
  all building the same `{ body, query, params }` object.
- **11 copies** of the authentication middleware (4 `authenticate.ts` in TaskAPI,
  4 `isAuthenticated.ts` in InvestApp, 3 in MonitorApp) reading
  `req.headers.authorization?.split(' ')` by hand, with no schema and no shared
  definition of what a valid `Bearer` header looks like.
- **0 projects** use cookies, although the concept page
  `auth/authentication.mdx` presents cookie sessions as the alternative to
  `localStorage` (lines 55–79 and 337–358) and `[TASK-001.4]` plans a security
  topic on `SameSite` cookies. There is no place in any trail where that
  alternative could be plugged in.
- In TaskAPI, `src/docs/openapi.ts` already declares
  `securitySchemes.bearerAuth` (step 6 onward), but that declaration is
  hand-written: it is the only part of the OpenAPI document that does not come
  from a Zod schema, which contradicts the step-6 lesson "one source, three
  consumers".

Two design rules of the trails constrain the solution, and both are already
written in the pages:

1. **`422` is a data-validation error; `401` means "identify yourself".**
   (`RNF01` and `RF05` in `practice/taskapi/index.mdx`, `CA12.3` in
   `practice/taskapi/auth.mdx`.) A missing or malformed `Authorization` header
   must keep answering `401`. Whatever validates the header cannot reuse the
   `422` path of `validate(schema)` blindly.
2. **No dependency for what Node already solves** (`RNF10`, `AGENTS.md`). Parsing
   the `Cookie` header is a `split` on `;` and `=` plus `decodeURIComponent`;
   `cookie-parser` is not justified for that.

## Objectives

1. `validate(schema)` in the three trails accepts five sources —
   `body`, `query`, `params`, `headers`, `cookies` — from the validation step
   onward, with the cookie source fed by a hand-written `parseCookies()`.
2. A shared `bearerSchema` (Zod) defines the shape of `Authorization: Bearer
   <jwt>`, and the authentication middleware of each trail uses it — still
   answering `401`, never `422`.
3. In TaskAPI, `securitySchemes.bearerAuth` in `openapi.ts` is derived from the
   same schema, so `/docs` documents the header the middleware enforces.
4. A `cookieSessionSchema` exists as the documented hook for a future cookie
   session step, with no route using it yet.
5. Every page of the affected steps, the three backlogs and the step-12 test
   suites reflect the change (new criteria in `US06`/`US12` of TaskAPI and the
   equivalent stories of InvestApp and MonitorApp).

Observable checks: `grep -rn "headers.authorization" examples/courses/expressjs/projects --include=*.ts` returns **0** lines outside `schemas/auth.ts`; `pnpm test` passes in the three `*-test` projects; `pnpm validate` passes.

## Non-goals

- **Not** migrating any trail from Bearer/`localStorage` to cookie sessions. The
  cookie source and `cookieSessionSchema` are hooks; no route reads a cookie.
- **Not** installing `cookie-parser`, `express-session` or any new dependency.
- **Not** moving signature or expiry verification into Zod. `verifyJwt` with
  `node:crypto` stays the only place that decides whether a token is trusted;
  Zod checks shape only (`Bearer` scheme and `a.b.c` structure).
- **Not** changing status codes: `401` for absent/malformed/invalid token,
  `422` (TaskAPI) / `400` (InvestApp, MonitorApp) for data validation, as today.
- **Not** touching the JavaScript steps before validation (TaskAPI 1–4,
  InvestApp 1–3, MonitorApp 1–3) nor legacy projects outside the three trails.
- **Not** adding CSRF protection, `SameSite` policy or the security topic of
  `[TASK-001.4]`; those become possible after this spec, not part of it.

## Design

### `validate` with five sources

```ts
export function validate(schema: ZodType) {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers,
      cookies: parseCookies(req.headers.cookie),
    });
    // unchanged: 422/400 with issues, req.valid = result.data
  };
}
```

`parseCookies` lives next to it (`src/utils/cookies.ts`), ~10 lines, pure and
unit-tested in step 12: `"a=1; b=x%20y"` → `{ a: '1', b: 'x y' }`, empty and
`undefined` input → `{}`.

Header names are lower-cased by Node, so schemas declare `authorization`, not
`Authorization`. Because `req.headers` carries many keys, header schemas use
`z.object` (not `strictObject`): unknown headers are never an error.

### `bearerSchema` and the authentication middleware

```ts
// src/schemas/auth.ts
export const jwtSchema = z.string().regex(/^[\w-]+\.[\w-]+\.[\w-]+$/);

export const bearerSchema = z.object({
  headers: z.object({
    authorization: z
      .string({ error: 'Cabecalho Authorization ausente' })
      .regex(/^Bearer [\w-]+\.[\w-]+\.[\w-]+$/, 'Esperado: Authorization: Bearer <jwt>'),
  }),
});

export const cookieSessionSchema = z.object({
  cookies: z.object({ token: jwtSchema }),
});
```

```ts
// src/middlewares/authenticate.ts
export function authenticate(req, _res, next) {
  const parsed = bearerSchema.safeParse({ headers: req.headers });

  if (!parsed.success) {
    throw new HttpError(401, parsed.error.issues[0].message);
  }

  const token = parsed.data.headers.authorization.slice('Bearer '.length);

  try {
    req.auth = verifyJwt(token);
  } catch {
    throw new HttpError(401, 'Token de acesso invalido ou expirado');
  }

  next();
}
```

The middleware calls the schema itself instead of being composed with
`validate(bearerSchema)` on each route, for two reasons the pages must state:
the status must be `401`, and a route must not be able to forget the check
(step 9's rule "the middleware is applied to the whole router").

### OpenAPI (TaskAPI only)

`openapi.ts` keeps `securitySchemes.bearerAuth`, but `bearerFormat` and the
`description` of the scheme are produced from `bearerSchema` (the regex message)
so that changing the schema changes `/docs`. InvestApp and MonitorApp already
generate their documents from schemas in step 5; the same treatment applies
there in the same phase as their authentication step.

## Plan

Each phase leaves every affected project running (`pnpm dev`, `pnpm test` where
it exists) and its pages building. Trails are independent: phases 1–3 may be
executed in any order, phase 4 last.

### Phase 0 — Backlog and pages (design, no code)

- Add the criteria to the three backlogs and step pages:
  - TaskAPI: `CA06.7` ("headers e cookies são fontes do `validate`"),
    `CA12.7` ("`Authorization` malformado responde 401 com a mensagem do
    schema"), `CA20.7` (teste de `parseCookies`); tasks `TK05.6`, `TK09.8`,
    `TK12.7`.
  - InvestApp (`US04`, `US09`, `US13`) and MonitorApp (equivalent stories):
    same three criteria, numbered by their own stories.
- Update the coverage tables of the three backlogs.

### Phase 1 — TaskAPI (steps 5 → 12, 8 projects)

1. Step 5 (`task-api-validation`): `parseCookies`, five-source `validate`, page
   paragraph "cabeçalho e cookie também são entrada".
2. Propagate `validate.ts` and `utils/cookies.ts` to steps 6–12 (`diff --no-index`
   between consecutive steps must show only this delta).
3. Step 9 (`task-api-auth`): `bearerSchema`, `cookieSessionSchema`, new
   `authenticate`; propagate to 10–12.
4. Step 6+ `openapi.ts`: `bearerAuth` derived from the schema (from step 9 on,
   where the schema exists; step 6–8 keep the hand-written declaration and the
   page says why).
5. Step 12: `cookies.test.ts`, one `authenticate` case for a malformed header
   (`Authorization: Token abc` → `401` with the schema message).
6. Pages `validation.mdx`, `auth.mdx`, `openapi.mdx`, `test.mdx`, `api-spec.mdx`
   (`401` message list) and `next-steps.mdx` (remove "OpenAPI parcial" for the
   security scheme only).

### Phase 2 — InvestApp (steps 4 → 12, 9 projects)

Same delta with the trail's names: `validate.ts` in step 4, `isAuthenticated.ts`
and `schemas/auth.ts` in step 9, propagation to `email`, `upload`, `test`;
`HttpError('…', 401)` signature kept; Vitest unit test for `parseCookies` in step
12; pages `validation.mdx`, `auth.mdx`, `testing.mdx`, `api-spec.mdx`.

### Phase 3 — MonitorApp (steps 4 → 12, 9 projects, `back/`)

Same delta under `back/src`; propagation to `realtime` and `test`; the SSE route
of step 11 keeps `isAuthenticated`, which now goes through the schema.

### Phase 4 — Closing

- `docs/TODO.md`: mark `[TASK-033.5]` and `[TASK-034.1]` done.
- `AGENTS.md` "Trilhas" table: add "Headers e cookies validados pelo `validate`;
  Bearer definido em `schemas/auth.ts`" to the established conventions list.
- Move this spec to `specs/executed/`, fill `Result`.

## Risks & Mitigations

| Risk | Mitigation |
| ---- | ---------- |
| `pnpm check:doc-lines` breaks: `authenticate.ts` and `validate.ts` are cut by `<SourceCode region>` in ~10 concept pages | Keep the `#region` names; run `check:doc-lines` after each project, not at the end |
| Propagating by hand across 26 projects drifts | Copy the two files with `cp` from step *n* to *n+1* and verify with `git diff --no-index` |
| `z.object` on `req.headers` is slow on every request | Only `authenticate` parses headers, and only the `authorization` key is declared; measured with `/metrics` p95 before/after in step 10 |
| Message wording in `401` changes the `api-spec` contract | Update `api-spec.mdx` error tables in the same commit as the middleware |

## Expected Validation

```bash
pnpm validate
```

Per trail, inside each `*-test` project: `pnpm test` (TaskAPI: 21 → 24 tests),
`pnpm test` and `pnpm front:test` (InvestApp, MonitorApp). Manual: `Authorization:
Token abc` and `Authorization: Bearer not-a-jwt` on `GET /tasks` answer `401` with
the schema message; `GET /docs` shows `bearerAuth` with the description coming
from `bearerSchema`; `grep -rn "headers.authorization"` over the projects finds
only `schemas/auth.ts`.

## Result

_To be filled when the spec is executed._
