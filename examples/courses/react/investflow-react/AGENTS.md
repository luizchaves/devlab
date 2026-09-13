# AGENTS.md

Instruções para agentes de IA que trabalham no projeto **InvestFlow React**.

O `README.md` é a documentação humana; este arquivo registra as decisões de arquitetura
que devem ser preservadas. A spec de execução, com o mapeamento de cada requisito do
InvestFlow vanilla para este projeto, é `specs/active/spec-015-investflow-react.md` na
raiz do DevLab.

## Arquitetura

1. **React funcional por padrão**: componentes funcionais, hooks e composição. Sem classes.
2. **Next.js App Router**: páginas em `app/(public)` e `app/(private)`; rotas HTTP em
   `app/api/`. Server Components leem sessão e banco; formulários usam Server Actions.
3. **`src/core/` é puro**: sem React, sem Prisma, sem `fetch`. É o que os testes `unit`
   cobrem e o que as páginas do guia recortam.
4. **`src/server/` só roda no servidor**: Prisma, NextAuth, senha, guards. Nunca importe
   daqui em um componente `'use client'`.
5. **Autorização por `userId`**: não há RLS. Toda query em `src/server/` recebe o id da
   sessão e filtra por ele; linha de outra conta responde `404`, nunca `403`.
6. **Identidade com NextAuth Credentials**: senha em `scrypt` (`node:crypto`), JWT com
   `role`. Não instale `bcrypt`, `jsonwebtoken` nem `dotenv`.
7. **Server state no React Query, preferências no Zustand**: dados remotos nunca entram no
   store; o store guarda tema, ocultar valores e estado efêmero de UI.
8. **UI acessível**: Base UI para diálogo, menu, select e afins; Lucide para ícones;
   `aria-label` em botão sem texto; CVA + `tailwind-merge` para variantes.
9. **Validação com Zod em `src/core/`**: o mesmo schema vale no cliente e na Server Action.
10. **Banco e arquivos na stack local do Supabase**: Prisma cuida das migrações
    (`prisma/migrations`); a pasta `supabase/` só tem o `config.toml`. Storage é acessado
    com a service role, só no servidor.

## Testes

| Camada | Arquivos | Ambiente |
| ------ | -------- | -------- |
| `unit` | `src/**/*.test.ts(x)` | jsdom |
| `browser` | `src/components/ui/*.browser.test.tsx` | Chromium via `@vitest/browser-playwright`, com `app/globals.css` carregado |
| `integration` | `tests/integration/*.integration.test.ts` | Prisma real no schema `integration`; `@/server/auth` simulado por `vi.mock` |
| `e2e` | `tests/e2e/*.spec.ts` | Playwright contra `next dev --port 3100`, schema `e2e`, modo serial |

Regras: o título do teste leva o critério (`CA03.4 — …`); um critério novo nasce com seu
teste; `pnpm test` e `pnpm test:e2e` precisam da stack (`supabase start`). O Next não
aceita dois `next dev` do mesmo projeto: pare o `pnpm dev` antes de `pnpm test:e2e`.

Antes de finalizar: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, `pnpm build`.
