# InvestFlow React

Reconstrução do [InvestFlow](../../npm/projects/investflow-origins/) em React: os mesmos
requisitos do backlog (RF01–RF22), em Next.js App Router, com NextAuth na identidade,
Prisma sobre o PostgreSQL da stack local do Supabase, Supabase Storage para arquivos,
TanStack para dados e tabelas, e testes em três camadas mais E2E.

A spec com o mapeamento requisito → fase está em
[`specs/executed/spec-015-investflow-react.md`](../../../../specs/executed/spec-015-investflow-react.md)
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
pnpm db:buckets               # cria os buckets `receipts` (privado) e `avatars` (público) de supabase/config.toml
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
| `/dashboard` | carteira: KPIs, tabela (TanStack Table) com filtro, ordenação e rodapé, estado em `?filter=&sort=&dir=`; cadastro, edição e exclusão de ativos | 2, 7 |
| `/assets/[id]` | tela do ativo por id ou ticker: posição, duração, gráfico, extrato com edição, exclusão e resgate total | 2, 6, 7 |
| `/analytics` | KPIs, gráfico aportes × valor (modo e janela na URL), matriz ano × mês e distribuição por classe | 5, 6 |
| `/dividends` | proventos recebidos: KPIs, extrato ou matriz (`?view=`), maiores pagadores, filtro `?asset=` | 8 |
| `/movements` | aportes e resgates: KPIs de fluxo, barras por mês (`?range=`), extrato com anexos e registro pela página | 8 |
| `/profile` | nome editável, e-mail, papel e data só leitura, avatar no bucket público `avatars` | 10 |
| `/origins` | treemap da carteira por corretora, categoria ou emissor, com legenda | 6 |
| `/admin` | painel do administrador: contas, AUM, última rodada e status dos serviços; investidor é redirecionado | 5 |
| `/api/auth/*` | NextAuth | 1 |
| `/api/me` | perfil da sessão | 1 |
| `/api/assets`, `/api/assets/[id]` | carteira do dono da sessão (`GET`, `POST`, `PATCH`, `DELETE`) | 2 |
| `/api/transactions`, `/api/transactions/[id]` | lançamentos de compra, venda e saldo | 2 |
| `POST /api/quotes/update` | rodada de cotações (carteira ou `assetId`), com calendário de mercado e resumo em `QuoteRun` | 3 |
| `POST /api/assets/[id]/quote` | cotação manual (`price`) ou saldo manual (`balance`, vira lançamento `update`) | 3 |
| `POST`/`GET /api/transactions/[id]/receipt` | anexa o comprovante (multipart) e devolve a URL assinada de 60 s, só para o dono | 4 |
| `GET /api/analytics` | série mensal, distribuição e totais do dono (`core/returns.ts`) | 5 |
| `GET /api/admin/metrics` | agregados e checks; `403` para quem não é administrador | 5 |
| `GET /api/origins`, `GET /api/assets/[id]/evolution` | linhas de origem e a evolução mensal de um ativo | 6 |
| `GET`/`PATCH /api/profile`, `POST`/`DELETE /api/profile/avatar` | perfil do dono (só o nome muda; `role` nunca pelo cliente) e avatar | 10 |
| `GET /api/exchange` | taxas USD/BRL gravadas pela rodada de cotações; `core/exchange.ts` resolve a taxa do dia e do mês | 9 |
| `POST /api/assets/[id]/dividends/sync`, `GET /api/dividends` | sincroniza o histórico de proventos (idempotente) e lista o que foi recebido | 8 |

## Estrutura

```txt
app/                 rotas: (public) landing e conta, (private) telas com barra comum, api/
prisma/              schema, migrations, seed
src/core/            regras puras (simulador, posição, retornos, cotações, calendário, validação): sem React, sem banco
src/server/          Prisma, NextAuth, senha, guards, ativos, lançamentos, seed: só roda no servidor
src/server/quotes/   provedores (yahoo, fake), a rodada de cotações e a cotação manual
src/server/storage.ts, receipts.ts   cliente do Supabase Storage (service role) e os comprovantes
src/features/        componentes, hooks (React Query) e ações de cada tela
src/components/ui/   primitivas (Button, Input, Select, Field, Badge, Dialog, AlertDialog) com CVA e Base UI
src/components/      Providers, AppShell, Money, CommandPalette, ExchangeProvider; charts/ (Treemap, LineChart, BarChart em SVG puro)
src/store/           Zustand: preferências
tests/integration/   rotas e serviços contra o schema `integration` do Postgres
tests/e2e/           Playwright contra `next dev` na porta 3100, schema `e2e`
```

## Testes

| Camada | Arquivos | O que prova |
| ------ | -------- | ----------- |
| `unit` | `src/**/*.test.ts(x)` (jsdom) | `core`, hooks, stores e utilitários |
| `build` | `tests/deploy/*.test.ts` | o `next build` não leva segredo ao navegador e envia os cabeçalhos de segurança |
| `browser` | `src/components/ui/*.browser.test.tsx` (Vitest Browser Mode, Chromium real) | primitivas de UI: papéis, rótulos, foco, teclado |
| `integration` | `tests/integration/*.integration.test.ts` | rotas e serviços com Prisma real, sessão simulada |
| `e2e` | `tests/e2e/*.spec.ts` | jornadas completas no navegador; `*.mobile.spec.ts` roda em um Pixel 7 e prova o design responsivo (RNF07) |

```bash
pnpm test              # unit + browser + integration
pnpm test:e2e          # Playwright (precisa da stack do Supabase no ar)
pnpm test:build        # next build + inspeção do bundle (RF22: só variáveis públicas, cabeçalhos)
pnpm lint && pnpm typecheck && pnpm build
```

Cada teste leva no título o critério de aceite que prova (`CA02.2 — …`), com a numeração
do backlog do InvestFlow.

## Variáveis de ambiente

Veja `.env.example`. `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` alimentam o cliente do
Storage, que só existe em `src/server/`: o navegador nunca vê a chave, e cada URL de
comprovante é assinada por 60 segundos depois de o servidor conferir o dono. `QUOTES_PROVIDER` escolhe o provedor de cotações: `fake` (tabela fixa,
usada nos testes) ou `yahoo` (endpoint público do Yahoo Finance, sem token; tickers da B3
recebem `.SA`). A rodada só consulta o provedor quando o calendário de mercado diz que pode
haver preço novo (`src/core/market-calendar.ts`). `DATABASE_URL` aceita `?schema=`: os testes usam `integration` e `e2e`
no mesmo Postgres, recriados a cada execução. Só variáveis `NEXT_PUBLIC_*` chegam ao
navegador; a service role do Supabase e o `AUTH_SECRET` ficam no servidor.
