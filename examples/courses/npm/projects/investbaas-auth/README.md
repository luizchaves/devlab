# InvestBaaS — Sprint 2: Autenticação BaaS

Segunda sprint do InvestBaaS: as telas da Sprint 1 ganham conta, sessão e guarda de páginas
privadas com o **Supabase Auth**. Não há servidor próprio: o navegador fala com o Supabase pela
chave anônima, e o perfil público (`profiles`) nasce por trigger no cadastro.

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
| `pnpm test:unit` | Vitest + jsdom, SDK mockado | o que os serviços e a guarda fazem com o SDK (TK02-1 a TK02-5) |
| `pnpm test:integration` | Vitest + node, SDK real contra a stack local | cadastro, trigger de `profiles`, mensagem única de login e RLS (TK02-2, TK02-3, TK02-6) |
| `pnpm test` | as duas anteriores | |
| `pnpm test:e2e` | Playwright + Vite + stack local | o fluxo pela tela: guarda, cadastro, login, recarga e logout (CA02.1 a CA02.5) |

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

| Página | Sprint 2 |
| ------ | -------- |
| `signup.html` | `signUp()` com nome nos metadados; leva ao login com aviso |
| `signin.html` | `signInWithPassword()`; a mesma mensagem para as duas falhas |
| `dashboard.html`, `analytics.html`, `admin.html` | `requireSession()` antes de tudo, e-mail no cabeçalho e botão **Sair** |
| `index.html` | inalterada |
