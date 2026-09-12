# InvestBaaS — Sprint 5: Armazenamento de comprovantes

Quinta sprint do InvestBaaS: cada aporte ou resgate pode receber um comprovante (PDF, PNG ou
JPG até 5 MB) em um bucket **privado** do Supabase Storage. O *path* é `<user>/<transação>/<uuid>`,
as policies em `storage.objects` só deixam o dono enviar e ler a própria pasta, a transação guarda
só o *path*, e a leitura acontece por URL assinada de 60 segundos. Sprints 2 a 4 incluídas.

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
| `pnpm test:unit` | Vitest + jsdom, SDK mockado | `validateReceipt()` e `receiptPath()` (TK05-3, TK05-4), `uploadReceipt()` e `receiptUrl()` (TK05-4, TK05-5) e as sprints anteriores |
| `pnpm test:integration` | Vitest + node, SDK real contra o Storage local | bucket privado com limite e tipos (TK05-1), upload do dono, tipo recusado pelo bucket, pasta alheia barrada pela policy (TK05-2), URL assinada que abre, path alheio "not found", URL pública recusada (CA05.3, CA05.4, RNF04), contagem agregada só para admin (TK05-7) |
| `pnpm test` | as duas anteriores | 63 testes |
| `pnpm test:e2e` | Playwright + Vite + stack local | anexar um PDF ao aporte, ver o path guardado e a URL assinada entregando o arquivo; `.exe` recusado antes do upload (CA05.1 a CA05.5) |

## Dependências

| Pacote | Por quê |
| ------ | ------- |
| `@supabase/supabase-js` | o único caminho do navegador para Auth, banco e Storage |
| `vitest`, `jsdom` | testes de unidade com DOM simulado e de integração em node |
| `@playwright/test` | o fluxo completo no navegador (`pnpm exec playwright install chromium` na primeira vez) |
| `vite`, `@biomejs/biome` | herdados da Sprint 1 |

## Telas

| Página | Sprint 5 |
| ------ | -------- |
| `asset.html?id=…` | campo de comprovante no lançamento e botão **Ver comprovante** por linha; o resto como nas sprints 3 e 4 |
| `signup.html`, `signin.html`, `analytics.html`, `admin.html`, `index.html` | como na Sprint 2 |

## Modelo

`profiles` → `brokers` (corretora, por dono) → `assets` (`broker_id`, `issuer`, `category`, `current_price`) → `transactions` (fato imutável: `buy`/`sell`, quantidade, preço, data) e `quotes_history` (uma cotação por ativo e dia, escrita só pela Edge Function da Sprint 4). Toda tabela tem RLS ligado e policies por `auth.uid()`; os grants são explícitos por papel.
