# InvestFlow React

Reconstrução do [InvestFlow](../../npm/projects/investflow-origins/) em React: os mesmos
requisitos do backlog (RF01–RF22), em Next.js App Router, com NextAuth na identidade,
Prisma sobre o PostgreSQL da stack local do Supabase, Supabase Storage para arquivos,
TanStack para dados e tabelas, e testes em três camadas mais E2E.

A spec com o mapeamento requisito → fase está em
[`specs/active/spec-015-investflow-react.md`](../../../../specs/active/spec-015-investflow-react.md)
(na raiz do DevLab).

## Stack

| Camada | Escolha | Por quê |
| ------ | ------- | ------- |
| Framework | Next.js 16 (App Router), React 19, TypeScript | Server Components para ler sessão e banco; Server Actions nos formulários |
| Identidade | NextAuth v5, provedor Credentials, JWT | Senha com `scrypt` do `node:crypto`; sem `bcrypt` nem tabelas de sessão |
| Banco | Prisma 7 + `@prisma/adapter-pg` no PostgreSQL do Supabase local | Mesmo Postgres do vanilla, sem RLS: a autorização é por `userId` nas queries |
| Arquivos | Supabase Storage (service role só no servidor) | Comprovantes e avatares, como no vanilla |
| Dados no cliente | TanStack React Query; TanStack Table | Server state com cache; tabelas com ordenação e filtro |
| Estado global | Zustand (tema, ocultar valores, paleta) | Só preferências; dados remotos nunca entram no store |
| UI | Tailwind CSS v4, CVA + tailwind-merge, Base UI, Lucide, Motion, Sonner, cmdk | Primitivas acessíveis sem estilo próprio, variantes declarativas |
| Testes | Vitest 4 (`unit`, `browser`, `integration`) e Playwright | Ver "Testes" |
| Qualidade | ESLint 9 (`eslint-config-next`), Husky | `pre-commit`: lint + typecheck; `pre-push`: test + build |

## Executando

Requer Node 22+, pnpm 10+, Docker e a CLI do Supabase.

```bash
pnpm install
cp .env.example .env          # cole a service_role de `supabase status`
supabase start                # Postgres em 54342, API/Storage em 54341, Studio em 54343
pnpm db:migrate               # aplica prisma/migrations
pnpm db:seed                  # admin@example.com / admin12345
pnpm dev                      # http://localhost:3000
```

As portas ficam em `5434x` para não colidir com a stack do InvestFlow vanilla (`5432x`); as
duas podem subir ao mesmo tempo.

## Rotas

| Rota | Tipo | Fase |
| ---- | ---- | ---- |
| `/` | landing com simulador de juros compostos | 1 |
| `/signin`, `/signup` | conta e sessão (Server Actions + NextAuth) | 1 |
| `/dashboard` | carteira (protegida pelo `proxy.ts`) | 1 (esqueleto), 2 |
| `/api/auth/*` | NextAuth | 1 |
| `/api/me` | perfil da sessão | 1 |

## Estrutura

```txt
app/                 rotas: (public) landing e conta, (private) telas com barra comum, api/
prisma/              schema, migrations, seed
src/core/            regras puras (simulador, validação) — sem React, sem banco
src/server/          Prisma, NextAuth, senha, guards de sessão — só roda no servidor
src/features/        componentes e ações de cada tela
src/components/ui/   primitivas (Button, Input, Field, Dialog) com CVA e Base UI
src/components/      Providers, AppShell, Money, CommandPalette
src/store/           Zustand: preferências
tests/integration/   rotas e serviços contra o schema `integration` do Postgres
tests/e2e/           Playwright contra `next dev` na porta 3100, schema `e2e`
```

## Testes

| Camada | Arquivos | O que prova |
| ------ | -------- | ----------- |
| `unit` | `src/**/*.test.ts(x)` (jsdom) | `core`, hooks, stores e utilitários |
| `browser` | `src/components/ui/*.browser.test.tsx` (Vitest Browser Mode, Chromium real) | primitivas de UI: papéis, rótulos, foco, teclado |
| `integration` | `tests/integration/*.integration.test.ts` | rotas e serviços com Prisma real, sessão simulada |
| `e2e` | `tests/e2e/*.spec.ts` | jornadas completas no navegador |

```bash
pnpm test              # unit + browser + integration
pnpm test:e2e          # Playwright (precisa da stack do Supabase no ar)
pnpm lint && pnpm typecheck && pnpm build
```

Cada teste leva no título o critério de aceite que prova (`CA02.2 — …`), com a numeração
do backlog do InvestFlow.

## Variáveis de ambiente

Veja `.env.example`. `DATABASE_URL` aceita `?schema=`: os testes usam `integration` e `e2e`
no mesmo Postgres, recriados a cada execução. Só variáveis `NEXT_PUBLIC_*` chegam ao
navegador; a service role do Supabase e o `AUTH_SECRET` ficam no servidor.
