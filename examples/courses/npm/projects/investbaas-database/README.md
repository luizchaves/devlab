# InvestBaaS — Sprint 3: Banco de dados e RLS

Terceira sprint do InvestBaaS: a carteira deixa de ser HTML escrito à mão e passa a viver em
PostgreSQL, com `brokers`, `assets`, `transactions` e `quotes_history` protegidas por Row Level
Security. Entra também a tela de cada investimento (`asset.html`), com todos os aportes e
resgates. Sprint 2 (Auth) incluída.

## Pré-requisitos

- Node.js 22+ e pnpm 10+ (ou npm)
- Docker e a [CLI do Supabase](https://supabase.com/docs/guides/local-development/cli/getting-started)
  para a stack local

## Executando

```bash
pnpm install
pnpm db:start            # sobe Postgres, Auth, Storage e PostgREST em 127.0.0.1:54321
supabase status -o env   # copie API_URL, ANON_KEY e SERVICE_ROLE_KEY para o .env (veja .env.example)
pnpm db:reset            # aplica supabase/migrations/
pnpm dev                 # http://localhost:5173
```

Para um projeto na nuvem, troque `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` pelos valores do
painel e aplique as migrations com `supabase db push`. Lá a confirmação de e-mail costuma estar
ligada; localmente (`enable_confirmations = false` no `config.toml`) o cadastro já deixa a conta
pronta para o login.

## Testes

| Comando | Camada | O que prova |
| ------- | ------ | ----------- |
| `pnpm test:unit` | Vitest + jsdom, SDK mockado | `summarize()`/`totals()` (TK03-8), o serviço de ativos (TK03-6, TK03-7, TK03-10) e a Sprint 2 |
| `pnpm test:integration` | Vitest + node, SDK real contra a stack local | migrations e `CHECK`s (TK03-1 a TK03-3), corretora única por dono (TK03-10), cada policy em `using` e `with check` com duas contas (TK03-4, TK03-5) |
| `pnpm test` | as duas anteriores | 36 testes |
| `pnpm test:e2e` | Playwright + Vite + stack local | cadastro de ativo com corretora e emissor, ticker repetido, tela do ativo com dois aportes e a posição recalculada, ativo alheio (CA03.1, CA03.3, CA03.7 a CA03.10) |

Os testes de integração e E2E exigem `pnpm db:start` e o `.env` preenchido; sem eles, a suíte de
integração é pulada com aviso. `SUPABASE_SERVICE_ROLE_KEY` é usada **só pelos testes**, para ler
entre contas e provar o isolamento; nenhum arquivo de `src/` a importa, e sem o prefixo `VITE_`
o Vite não a coloca no bundle (`grep -r service_role dist/` fica vazio depois de `pnpm build`).

## Dependências

| Pacote | Por quê |
| ------ | ------- |
| `@supabase/supabase-js` | o único caminho do navegador para Auth, banco e Storage |
| `vitest`, `jsdom` | testes de unidade com DOM simulado e de integração em node |
| `@playwright/test` | o fluxo completo no navegador (`pnpm exec playwright install chromium` na primeira vez) |
| `vite`, `@biomejs/biome` | herdados da Sprint 1 |

## Telas

| Página | Sprint 3 |
| ------ | -------- |
| `dashboard.html` | KPIs e posições vindos de `assets` + `transactions`; diálogo **+ Novo Ativo** com corretora (criada sozinha) e emissor |
| `asset.html?id=…` | **nova**: um investimento, seus indicadores e todos os aportes e resgates, com o diálogo de novo lançamento |
| `signup.html`, `signin.html`, `analytics.html`, `admin.html`, `index.html` | como na Sprint 2 |

## Modelo

`profiles` → `brokers` (corretora, por dono) → `assets` (`broker_id`, `issuer`, `category`, `current_price`) → `transactions` (fato imutável: `buy`/`sell`, quantidade, preço, data) e `quotes_history` (uma cotação por ativo e dia, escrita só pela Edge Function da Sprint 4). Toda tabela tem RLS ligado e policies por `auth.uid()`; os grants são explícitos por papel.
