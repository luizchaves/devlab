# InvestBaaS — Sprint 6: Analytics e painel admin

Sexta sprint do InvestBaaS: a matriz de rentabilidade e a distribuição por classe passam a vir
de views `security_invoker` (`monthly_returns`, `allocation_by_category`), e o painel
administrativo ganha `admin_metrics()` (uma linha agregada, só para `role = 'admin'`), a
guarda por papel e o status dos serviços. Sprints 2 a 5 incluídas.

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
| `pnpm test:unit` | Vitest + jsdom, SDK mockado | `monthlyPct`, `yearlyPct` (composição, não soma) e `matrixByYear` (TK06-2, TK06-3); `requireAdmin` (TK06-6); e as sprints anteriores |
| `pnpm test:integration` | Vitest + node, SDK real contra a stack local | `monthly_returns` reproduz a planilha de referência e omite o mês sem cotação (CA06.1, CA06.2); Bruno não vê a série da Ana (CA06.3); `allocation_by_category`; `admin_metrics()` vazio para investidor e uma linha para admin (CA06.5); `quote_runs` só para admin; ninguém se promove; `ping()` |
| `pnpm test` | as duas anteriores | 79 testes |
| `pnpm test:e2e` | Playwright + Vite + stack local | matriz com lacunas a partir de aportes e cotação real; investidor redirecionado do admin; admin vê totais e status e nenhuma resposta traz `ticker` ou `quantity` (CA06.1 a CA06.5, RNF05) |

## Dependências

| Pacote | Por quê |
| ------ | ------- |
| `@supabase/supabase-js` | o único caminho do navegador para Auth, banco e Storage |
| `vitest`, `jsdom` | testes de unidade com DOM simulado e de integração em node |
| `@playwright/test` | o fluxo completo no navegador (`pnpm exec playwright install chromium` na primeira vez) |
| `vite`, `@biomejs/biome` | herdados da Sprint 1 |

## Telas

| Página | Sprint 6 |
| ------ | -------- |
| `analytics.html` | matriz mês × ano e distribuição por classe vindas das views |
| `admin.html` | `requireAdmin()`, contas ativas, AUM, última execução de cotações e cinco luzes de status |
| `signup.html`, `signin.html`, `analytics.html`, `admin.html`, `index.html` | como na Sprint 2 |

## Modelo

`profiles` → `brokers` (corretora, por dono) → `assets` (`broker_id`, `issuer`, `category`, `current_price`) → `transactions` (fato imutável: `buy`/`sell`, quantidade, preço, data) e `quotes_history` (uma cotação por ativo e dia, escrita só pela Edge Function da Sprint 4). Toda tabela tem RLS ligado e policies por `auth.uid()`; os grants são explícitos por papel.

## Promover um administrador

O papel nunca é alterado por uma tela: uma conta comum recebe `42501` ao tentar. No SQL Editor
(ou com a chave de serviço nos testes):

```sql
update public.profiles set role = 'admin' where id = '<id da conta>';
```
