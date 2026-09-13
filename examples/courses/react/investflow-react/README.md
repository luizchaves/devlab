# InvestFlow React

Versão React do InvestFlow, criada para aplicar os conceitos do Guia React em uma aplicação de carteira de investimentos com Next.js, Prisma, NextAuth, TanStack React Query, TanStack Table, Base UI, Zustand, Tailwind CSS v4 e testes em três camadas.

## Stack

- Next.js App Router com React 19 e componentes funcionais.
- Prisma para persistência relacional.
- NextAuth com Prisma Adapter para sessão e autorização.
- TanStack React Query para server state e cache de requisições.
- TanStack Table para tabela de ativos.
- Zustand para preferências mínimas de cliente, como privacidade de valores.
- CVA com `tailwind-merge` para variantes de UI.
- Base UI, Lucide React, Motion, Sonner e cmdk para experiência acessível.
- Vitest e Playwright em três camadas: unit, browser e integration, além de E2E.

## Comandos

```bash
pnpm install
pnpm prisma migrate dev
pnpm dev
```

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
```

## Variáveis

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="change-me-in-development"
NEXTAUTH_URL="http://localhost:3000"
MARKET_API_URL="https://brapi.dev/api"
MARKET_API_TOKEN=""
```

## Rotas

- `/`: dashboard com KPIs, command palette e tabela de ativos.
- `/assets`: tabela filtrável com TanStack Table.
- `/settings`: preferências locais com Zustand.
- `/api/portfolio`: exemplo de rota protegida por sessão.
- `/api/quotes/[symbol]`: integração externa com tratamento de erro e timeout.

## Testes

- `unit`: regras puras, hooks e utilitários em `*.test.ts(x)`.
- `browser`: componentes de UI em `*.browser.test.ts(x)` com ambiente de navegador.
- `integration`: fluxos de rota e API em `*.integration.test.ts(x)`.
- `e2e`: jornadas reais em Playwright.
