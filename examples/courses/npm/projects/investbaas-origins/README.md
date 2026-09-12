# InvestBaaS — Sprint 7: Origem e evolução

Sétima sprint do InvestBaaS: a carteira vista pela **origem** (treemap por corretora, categoria ou
emissor, em `origins.html`) e a linha de **aportes acumulados versus valor de mercado** (na
carteira, em `analytics.html`, e por ativo, em `asset.html`). Duas views `security_invoker`
(`allocation_by_origin`, `portfolio_evolution`) e dois módulos de desenho em SVG escrito à mão,
sem biblioteca de gráficos. Sprints 2 a 6 incluídas; é a versão final da trilha.

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
| `pnpm test:unit` | Vitest + jsdom | `layout()` do treemap (soma das áreas, proporção, limites, ordem), `groupBy()`, `scalePoints()`/`pathOf()` do gráfico (eixo comum, lacuna sem zero) (TK07-2, TK07-5) e as sprints anteriores |
| `pnpm test:integration` | Vitest + node, SDK real | `allocation_by_origin` com as três dimensões e o valor atual; `security_invoker`; `portfolio_evolution` reproduz aportado × valor da planilha e omite o mês sem cotação (TK07-1, TK07-4, CA07.3, CA07.6) |
| `pnpm test` | as duas anteriores | 92 testes |
| `pnpm test:e2e` | Playwright | treemap por corretora → emissor → categoria sem recarregar; as duas linhas na carteira e no ativo (CA07.1, CA07.2, CA07.4, CA07.5) |

## Dependências

| Pacote | Por quê |
| ------ | ------- |
| `@supabase/supabase-js` | o único caminho do navegador para Auth, banco e Storage |
| `vitest`, `jsdom` | testes de unidade com DOM simulado e de integração em node |
| `@playwright/test` | o fluxo completo no navegador (`pnpm exec playwright install chromium` na primeira vez) |
| `vite`, `@biomejs/biome` | herdados da Sprint 1 |

## Telas

| Página | Sprint 7 |
| ------ | -------- |
| `origins.html` | **nova**: treemap com seletor de recorte (corretora, categoria, emissor) e legenda |
| `analytics.html` | + gráfico de aportes versus valor da carteira |
| `asset.html?id=…` | + o mesmo gráfico para o ativo |
| `signup.html`, `signin.html`, `analytics.html`, `admin.html`, `index.html` | como na Sprint 2 |

## Modelo

`profiles` → `brokers` (corretora, por dono) → `assets` (`broker_id`, `issuer`, `category`, `current_price`) → `transactions` (fato imutável: `buy`/`sell`, quantidade, preço, data) e `quotes_history` (uma cotação por ativo e dia, escrita só pela Edge Function da Sprint 4). Toda tabela tem RLS ligado e policies por `auth.uid()`; os grants são explícitos por papel.

## Promover um administrador

O papel nunca é alterado por uma tela: uma conta comum recebe `42501` ao tentar. No SQL Editor
(ou com a chave de serviço nos testes):

```sql
update public.profiles set role = 'admin' where id = '<id da conta>';
```

## Deploy na Vercel

O front é estático: o `vite build` gera `dist/` com as sete páginas, e a Vercel só precisa das
duas variáveis públicas. O `vercel.json` já define framework, build, saída, `cleanUrls` e os
cabeçalhos de segurança; o `.vercelignore` deixa `supabase/`, testes e docs fora do upload.

1. **Projeto Supabase na nuvem**: crie em [supabase.com](https://supabase.com/), aplique as
   migrations (`supabase link` + `supabase db push`), publique a função (`supabase functions deploy
   update-quotes`) e grave `MARKET_PROVIDER=yahoo` em **Edge Functions › Secrets**.
2. **Projeto na Vercel** apontando para este repositório, com **Root Directory** =
   `examples/courses/npm/projects/investbaas-origins` (a Vercel precisa saber que o app vive
   numa subpasta do monorepo).
3. **Variáveis de ambiente** no painel da Vercel (Production e Preview): `VITE_SUPABASE_URL` e
   `VITE_SUPABASE_ANON_KEY`. **Nunca** `SUPABASE_SERVICE_ROLE_KEY`: ela é só dos testes.
4. **Redirect do Auth**: em **Authentication › URL Configuration** do Supabase, coloque a URL da
   Vercel em *Site URL* e em *Redirect URLs*, senão o login não devolve para a aplicação.
5. Pela CLI, na pasta do projeto: `vercel login`, `vercel link` e `vercel --prod`.

Com o [MCP da Vercel](https://vercel.com/docs/mcp) ligado ao assistente, os passos 2, 3 e 5
podem ser conduzidos por prompt: *"crie o projeto InvestBaaS na Vercel com root directory
`examples/courses/npm/projects/investbaas-origins`, defina `VITE_SUPABASE_URL` e
`VITE_SUPABASE_ANON_KEY` em Production e Preview, faça o deploy de produção e me devolva a URL e
o log do build"*.
