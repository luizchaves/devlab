# InvestBaaS — Sprint 4: Cotações com Edge Functions

Quarta sprint do InvestBaaS: a Edge Function `update-quotes` (Deno) atualiza `current_price` e
`quotes_history` dos ativos de bolsa com a chave de serviço, que nunca chega ao navegador. O
provedor é um adaptador (`fake` por padrão, `yahoo` sem token ou `brapi` com token nos segredos), a falha é por ticker,
cada execução grava um resumo em `quote_runs` e o `pg_cron` agenda a rodada diária. Sprints 2 e 3
incluídas.

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

A stack local já serve a função em `http://127.0.0.1:54321/functions/v1/update-quotes`, com
`MARKET_PROVIDER=fake` (tabela fixa: `PETR4`, `VALE3`, `HGLG11`), que é o que os testes usam.
Há dois provedores reais, escolhidos por variável **da função** (nunca no `.env` do front):

| `MARKET_PROVIDER` | Fonte | Custo | Observação |
| ----------------- | ----- | ----- | ---------- |
| `yahoo` | endpoint público de gráfico do Yahoo Finance (`…/v8/finance/chart/PETR4.SA`) | gratuito, sem token | um ticker por requisição; sufixo `.SA` para a B3 |
| `brapi` | [brapi.dev](https://brapi.dev/) | free tier com token | vários tickers por chamada |

```bash
# local: a stack padrao nao le variaveis da funcao; sirva-a com o arquivo de env
echo 'MARKET_PROVIDER=yahoo' > supabase/functions/.env   # ignorado pelo git
supabase functions serve --env-file supabase/functions/.env
# nuvem:
supabase secrets set MARKET_PROVIDER=yahoo
supabase secrets set MARKET_PROVIDER=brapi MARKET_API_TOKEN=<token>   # alternativa
```

Para agendar a rodada diária no projeto na nuvem, guarde a chave de serviço no cofre e chame a
função de agendamento uma vez, no SQL Editor:

```sql
select vault.create_secret('<service_role key>', 'service_role_key');
select public.schedule_update_quotes('https://<projeto>.supabase.co/functions/v1/update-quotes', 'service_role_key');
```

Para um projeto na nuvem, troque `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` pelos valores do
painel e aplique as migrations com `supabase db push`. Lá a confirmação de e-mail costuma estar
ligada; localmente (`enable_confirmations = false` no `config.toml`) o cadastro já deixa a conta
pronta para o login.

## Testes

| Comando | Camada | O que prova |
| ------- | ------ | ----------- |
| `pnpm test:unit` | Vitest + jsdom, SDK mockado | a lógica pura da função (`collectQuotes`, provedor simulado: TK04-3, TK04-5), o serviço do botão (TK04-6) e as sprints 2 e 3 |
| `pnpm test:integration` | Vitest + node, `fetch` real ao edge runtime local | 401 sem sessão (TK04-2), atualização com falha parcial e renda fixa ignorada (CA04.1, CA04.2), idempotência por dia, `quote_runs` ilegível pelo cliente (TK04-7), chamada agendada pela chave de serviço, `schedule_update_quotes` só para a operação (TK04-8) |
| `pnpm test` | as duas anteriores | 48 testes |
| `pnpm test:e2e` | Playwright + Vite + stack local | o botão **Atualizar Cotações** preenche a cotação e mostra o resumo (TK04-6), mais as sprints anteriores |

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
| `dashboard.html` | botão **Atualizar Cotações** ligado à função, com o resumo em um aviso; o resto como na Sprint 3 |
| `asset.html?id=…` | **nova**: um investimento, seus indicadores e todos os aportes e resgates, com o diálogo de novo lançamento |
| `signup.html`, `signin.html`, `analytics.html`, `admin.html`, `index.html` | como na Sprint 2 |

## Modelo

`profiles` → `brokers` (corretora, por dono) → `assets` (`broker_id`, `issuer`, `category`, `current_price`) → `transactions` (fato imutável: `buy`/`sell`, quantidade, preço, data) e `quotes_history` (uma cotação por ativo e dia, escrita só pela Edge Function da Sprint 4). Toda tabela tem RLS ligado e policies por `auth.uid()`; os grants são explícitos por papel.
