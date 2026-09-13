# InvestFlow — Sprints 7 a 11: da origem à experiência

Projeto final do InvestFlow. Ele nasce na Sprint 7 (a carteira vista pela **origem**, em
`origins.html`, e a linha de **aportes acumulados versus valor de mercado**) e recebe as quatro
sprints seguintes sem trocar de pasta:

| Sprint | O que acrescenta |
| ------ | ---------------- |
| 7 · Origem e evolução | `allocation_by_origin`, `portfolio_evolution`, treemap e linhas em SVG, modo contínuo/eventos e janela de tempo |
| 8 · Lançamentos e cotação manual | editar e excluir lançamentos, resgate total, renda fixa pelo saldo (`update`), cotação por ativo com fallback manual, filtro/ordenação/rodapé com estado na URL |
| 9 · Proventos e movimentações | `dividends_history` com RLS pelo dono do ativo, crawler, direito pela data ex, YoC, retorno total, `dividends.html`, toggles "Com proventos", `movements.html` |
| 10 · Dólar e cripto | `assets.currency`, `exchange_rates` gravada pela Edge Function, custo pelo câmbio de cada compra, cripto via `BTC-USD` × `BRL=X`, calendário de mercado |
| 11 · Perfil e experiência | `profile.html` e bucket público `avatars`, barra comum, landing com sessão, tema, ocultar valores, mostrar senha, build multipágina para a Vercel |

Cada critério de aceitação (`CA07.1` … `CA11.13`) aparece no nome de pelo menos um teste; a
rastreabilidade completa está no backlog da trilha no DevLab.

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

O seed versionado é propositalmente público e mínimo: cria `admin@example.com` com senha
`senha-de-teste`, perfil `admin` e o ativo demonstrativo `Tesouro Reserva 2036` com valor de R$ 1.
Seeds com carteiras reais, saldos privados ou histórico financeiro confidencial devem ficar fora do
repositório.

A stack local já serve a função em `http://127.0.0.1:54321/functions/v1/update-quotes`. Sem
configuração extra, a função usa `MARKET_PROVIDER=yahoo`, o provedor real gratuito. Há também uma
opção `brapi` por free tier com token. A opção `fake` fica restrita aos testes Vitest da lógica
pura, não ao uso local da aplicação.

| `MARKET_PROVIDER` | Fonte | Custo | Observação |
| ----------------- | ----- | ----- | ---------- |
| `yahoo` | endpoint público de gráfico do Yahoo Finance (`…/v8/finance/chart/PETR4.SA`) | gratuito, sem token | um ticker por requisição; sufixo `.SA` para a B3 |
| `brapi` | [brapi.dev](https://brapi.dev/) | free tier com token | vários tickers por chamada |

```bash
# local: use quando quiser fixar explicitamente o provedor
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
| `pnpm test:unit` | Vitest + jsdom | funções puras e serviços com o SDK simulado: treemap e linhas (Sprint 7), `summarize()` com `update`, duração e query params (8), data ex, YoC, retorno total, crawler com `fetch` simulado e barras (9), câmbio, cripto e calendário de mercado (10), perfil, navbar, tema, privacidade e senha (11) |
| `pnpm test:integration` | Vitest + node, SDK real | views, policies e a Edge Function contra a stack local: origem e evolução (7), categorias, `update` e a policy da cotação manual (8), `dividends_history` (9), `exchange_rates`, `get_usd_rate`, views convertidas e a taxa gravada pela rodada (10), bucket `avatars` e o `update` restrito de `profiles` (11) |
| `pnpm test:build` | Vitest + node | `vite build` gera as onze páginas sem a chave de serviço; `vercel.json` e `.vercelignore` (CA11.12, CA11.13) |
| `pnpm test` | as três anteriores | 216 testes |
| `pnpm test:e2e` | Playwright | uma suíte por sprint (`auth`, `portfolio`, `quotes`, `receipts`, `analytics`, `origins`, `ledger`, `dividends`, `international`, `experience`): 33 testes |

## Dependências

| Pacote | Por quê |
| ------ | ------- |
| `@supabase/supabase-js` | o único caminho do navegador para Auth, banco e Storage |
| `vitest`, `jsdom` | testes de unidade com DOM simulado e de integração em node |
| `@playwright/test` | o fluxo completo no navegador (`pnpm exec playwright install chromium` na primeira vez) |
| `vite`, `@biomejs/biome` | herdados da Sprint 1 |

## Telas

| Página | Sprint | O que tem |
| ------ | ------ | --------- |
| `origins.html` | 7 | treemap com seletor de recorte (corretora, categoria, emissor) e legenda |
| `analytics.html` | 7, 9 | matriz de rentabilidade, gráfico de aportes versus valor (modo, janela, "Com proventos") |
| `asset.html?ticker=…` | 7, 8, 9, 10 | lançamentos editáveis, cotação/saldo manual, aba Proventos, retorno total, gráfico em US$/R$ |
| `dashboard.html` | 8, 9, 10 | filtro ativas × todas, ordenação, rodapé ponderado, toggle "Com proventos", moeda no cadastro |
| `dividends.html` | 9 | proventos recebidos: KPIs, barras por mês, matriz ano × mês, maiores pagadores e extrato |
| `movements.html` | 9 | aportes e resgates: KPIs de fluxo, barras por mês, extrato com comprovantes e registro |
| `profile.html` | 11 | nome, e-mail, papel, data de cadastro e avatar |
| `index.html`, `signin.html`, `signup.html`, `admin.html` | 11 | landing com sessão, mostrar senha, barra comum com contexto admin |

## Modelo

`profiles` (`full_name`, `avatar_url`, `role`) → `brokers` (corretora, por dono) → `assets` (`broker_id`, `issuer`, `category`, `currency`, `current_price`) → `transactions` (fato: `buy`/`sell`/`update`, quantidade, preço, data), `quotes_history` (uma cotação por ativo e dia, escrita pela Edge Function e, desde a Sprint 8, pelo dono na cotação manual) e `dividends_history` (um evento por ativo e data ex). `exchange_rates` (USD → BRL por dia) é lida por todos e escrita só pela Edge Function. Toda tabela tem RLS ligado e policies por `auth.uid()` ou pelo dono do ativo; os grants são explícitos por papel e, em `profiles`, por coluna.

## Promover um administrador

O papel nunca é alterado por uma tela: uma conta comum recebe `42501` ao tentar. No SQL Editor
(ou com a chave de serviço nos testes):

```sql
update public.profiles set role = 'admin' where id = '<id da conta>';
```

## Deploy na Vercel

O front é estático: o `vite build` gera `dist/` com as onze páginas, e a Vercel só precisa das
duas variáveis públicas. O `vercel.json` já define framework, build, saída, `cleanUrls` e os
cabeçalhos de segurança; o `.vercelignore` deixa `supabase/`, testes e docs fora do upload.

1. **Projeto Supabase na nuvem**: crie em [supabase.com](https://supabase.com/), aplique as
   migrations (`supabase link` + `supabase db push`), publique a função (`supabase functions deploy
   update-quotes`) e grave `MARKET_PROVIDER=yahoo` em **Edge Functions › Secrets**.
2. **Projeto na Vercel** apontando para este repositório, com **Root Directory** configurado para
   esta pasta do projeto (a Vercel precisa saber que o app vive numa subpasta do monorepo).
3. **Variáveis de ambiente** no painel da Vercel (Production e Preview): `VITE_SUPABASE_URL` e
   `VITE_SUPABASE_ANON_KEY`. **Nunca** `SUPABASE_SERVICE_ROLE_KEY`: ela é só dos testes.
4. **Redirect do Auth**: em **Authentication › URL Configuration** do Supabase, coloque a URL da
   Vercel em *Site URL* e em *Redirect URLs*, senão o login não devolve para a aplicação.
5. Pela CLI, na pasta do projeto: `vercel login`, `vercel link` e `vercel --prod`.

Com o [MCP da Vercel](https://vercel.com/docs/mcp) ligado ao assistente, os passos 2, 3 e 5
podem ser conduzidos por prompt: *"crie o projeto InvestFlow na Vercel usando esta pasta como root
directory, defina `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` em Production e Preview, faça o
deploy de produção e me devolva a URL e o log do build"*.
