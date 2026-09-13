# InvestFlow React — PRD

## Objetivo

Reconstruir o InvestFlow (plataforma de gestão patrimonial para investidores individuais)
em React, mantendo **todos os requisitos funcionais do produto original** e trocando a
implementação: Next.js no lugar de HTML + Vite, NextAuth no lugar do Supabase Auth, Prisma
sobre o mesmo PostgreSQL, checagem de dono no servidor no lugar de RLS, route handlers no
lugar de Edge Functions.

## Requisitos

Os requisitos são os do backlog do InvestFlow (RF01–RF22, RNF01–RNF06, US01–US32,
CA01.1–CA11.13), documentados em
`src/content/docs/courses/npm/practice/investflow/backlog.mdx` no DevLab. Este projeto não
os reescreve; a tabela abaixo diz apenas **como** cada bloco é atendido aqui.

| Requisitos | Implementação | Fase |
| ---------- | ------------- | ---- |
| RF01 landing e simulador | `app/(public)/page.tsx`, `core/simulator.ts` | 1 ✓ |
| RF02 conta e sessão | NextAuth Credentials, `proxy.ts`, `server/session.ts` | 1 ✓ |
| RF03, RF08, RF08.1 carteira e detalhe | `Broker`, `Asset`, `Transaction`; `core/portfolio.ts`; `/api/assets`, `/api/transactions`; `/dashboard`, `/assets/[id]`; `server/seed.ts` | 2 ✓ |
| RF04.1, RF05, RF05.1, RF18 cotações | `Quote`, `QuoteRun`, `ExchangeRate`; `core/quotes.ts`, `core/market-calendar.ts`; `POST /api/quotes/update`, `POST /api/assets/[id]/quote`; busca automática ao salvar ativo cotável | 3 ✓ |
| RF04 comprovantes | Supabase Storage, URL assinada de 60 s | 4 |
| RF06, RF07 analytics e admin | `core/returns.ts`, `/analytics`, `/admin` | 5 |
| RF09, RF10 origem e evolução | treemap e gráfico de linhas | 6 |
| RF03.2–RF03.6 lançamentos e organização | edição, `update`, filtros na URL | 7 |
| RF11–RF14 proventos e movimentações | `Dividend`, `/dividends`, `/movements` | 8 |
| RF15–RF17 dólar e cripto | `ExchangeRate`, moeda por ativo | 9 |
| RF19–RF22 perfil e experiência | avatar, tema, ocultar valores, build | 10 |

| RNF | Leitura neste projeto |
| --- | --------------------- |
| RNF01 isolamento | toda query filtra por `userId`; teste de integração com duas contas |
| RNF02 chaves fora do navegador | service role e `AUTH_SECRET` só em `src/server/` |
| RNF03 precisão decimal | colunas `Decimal`; `core/` arredonda por helpers |
| RNF04 arquivos privados | bucket privado; download por rota autenticada |
| RNF05 admin agregado | `/api/admin/*` devolve só totais |
| RNF06 publicação | `next build`, cabeçalhos de segurança em `next.config.ts` |
| **RNF07 design responsivo** (novo nesta versão) | mobile-first: sem rolagem horizontal (CA12.1), barra com menu acessível em telas estreitas (CA12.2), tabelas com colunas essenciais e as demais por breakpoint (CA12.3), diálogos e formulários na largura da tela com alvos de toque de 44 px (CA12.4); provado pelo projeto Playwright `mobile` |
