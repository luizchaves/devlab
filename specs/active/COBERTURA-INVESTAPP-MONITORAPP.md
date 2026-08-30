# Cobertura do passo a passo — InvestApp e MonitorApp

Status: **diagnóstico concluído, correções pendentes**
Tarefas de origem: `TASK-015.1` e `TASK-015.2` de [`docs/TODO.md`](../../docs/TODO.md)
Data da auditoria: 2026-08-30

## Escopo

Esta spec responde a duas perguntas do `docs/TODO.md` sobre as trilhas InvestApp e MonitorApp,
e registra o plano de correção derivado delas.

| Tarefa | Pergunta | Veredito |
| ------ | -------- | -------- |
| `TASK-015.1` | É possível construir o projeto final seguindo apenas o passo a passo, sem conhecimento prévio? | **Não.** Viável até a etapa 6; a partir da 7 há bloqueadores que impedem chegar ao estado final. |
| `TASK-015.2` | As tasks (TK) atuais cobrem todas as linhas de código? | **Não.** InvestApp exibe 30% das linhas que cada etapa introduz ou altera; MonitorApp, 52%. |

A auditoria cobriu as 13 etapas de cada trilha: 26 páginas `.mdx` em
`src/content/docs/courses/express/practice/` e 26 pastas em
`examples/courses/express/projects/`.

## Método

Os números não são impressão de leitura: para cada etapa `n`, o delta de código foi calculado
comparando a pasta da etapa `n` com a da etapa `n-1` (arquivo a arquivo, por conteúdo), e
confrontado com o que a página daquela etapa efetivamente exibe em `<SourceCode>` e
`<CodeTabs>` — resolvendo `lines` e `region` para o conjunto real de linhas mostradas.

Ficaram fora da contagem os binários (`.png`, fontes), o `package-lock.json`, os bancos `.db` e
os diretórios gerados (`node_modules`, `dist`, `coverage`). As migrations do Prisma foram
contadas à parte, por serem geradas por comando. As etapas 12 e 13 compartilham a mesma pasta
(`*-test`), então a cobertura daquele delta considera as duas páginas juntas.

A auditoria é reprodutível por script; ele não foi promovido a `scripts/` para não entrar no
contrato do `pnpm validate` sem decisão explícita.

## Resultado da TASK-015.2 — cobertura de linhas

A tabela abaixo mostra, por etapa, quantas tasks a página descreve, quantos arquivos a etapa
realmente introduz ou altera, quantos desses arquivos não aparecem em nenhum bloco de código, e
a fração de linhas do delta que chega à página.

### InvestApp

| Etapa | Pasta | TKs | Arquivos no delta | Sem bloco | Linhas exibidas |
| ----- | ----- | --- | ----------------- | --------- | --------------- |
| 1. front-static | `invest-app-static` | 5 | 7 | 2 | 410/453 (91%) |
| 2. api | `invest-app-api` | 5 | 12 | 5 | 442/651 (68%) |
| 3. typescript | `invest-app-typescript` | 7 | 12 | 4 | 201/307 (65%) |
| 4. validation | `invest-app-validation` | 2 | 6 | 3 | 81/149 (54%) |
| 5. swagger | `invest-app-swagger` | 2 | 4 | 1 | 189/216 (88%) |
| 6. sqlite | `invest-app-db-simple` | 3 | 8 | 2 | 236/246 (96%) |
| 7. prisma | `invest-app-prismajs-relation` | 4 | 29 | 24 | 188/1323 (14%) |
| 8. user | `invest-app-prismajs-user` | 4 | 24 | 17 | 249/1590 (16%) |
| 9. auth | `invest-app-auth` | 4 | 26 | 15 | 480/1744 (28%) |
| 10. email | `invest-app-email` | 3 | 13 | 10 | 107/954 (11%) |
| 11. upload | `invest-app-upload` | 4 | 21 | 13 | 207/1770 (12%) |
| 12. testing + 13. docker | `invest-app-test` | 9 | 22 | 12 | 571/1872 (31%) |
| **Total** | | **52** | **184** | **108** | **3361/11275 (30%)** |

### MonitorApp

| Etapa | Pasta | TKs | Arquivos no delta | Sem bloco | Linhas exibidas |
| ----- | ----- | --- | ----------------- | --------- | --------------- |
| 1. front-static | `monitor-app-static` | 5 | 8 | 1 | 550/554 (99%) |
| 2. api | `monitor-app-api` | 6 | 16 | 8 | 409/714 (57%) |
| 3. typescript | `monitor-app-typescript` | 7 | 11 | 2 | 241/278 (87%) |
| 4. validation | `monitor-app-validation` | 3 | 6 | 1 | 117/141 (83%) |
| 5. swagger | `monitor-app-swagger` | 2 | 4 | 1 | 187/213 (88%) |
| 6. sqlite | `monitor-app-db-simple` | 3 | 8 | 3 | 205/245 (84%) |
| 7. prisma | `monitor-app-prisma` | 5 | 30 | 20 | 463/1268 (37%) |
| 8. ping | `monitor-app-ping` | 4 | 13 | 6 | 236/814 (29%) |
| 9. user | `monitor-app-user` | 4 | 12 | 5 | 258/786 (33%) |
| 10. auth | `monitor-app-auth` | 5 | 30 | 18 | 651/1681 (39%) |
| 11. realtime | `monitor-app-realtime` | 4 | 8 | 2 | 329/804 (41%) |
| 12. testing + 13. docker | `monitor-app-test` | 9 | 18 | 5 | 614/708 (87%) |
| **Total** | | **57** | **164** | **72** | **4260/8206 (52%)** |

O corte é nítido e acontece no mesmo lugar nas duas trilhas: **da etapa 1 à 6 a cobertura fica
entre 54% e 99%; da etapa 7 em diante ela cai para a faixa de 11% a 41%**. A causa é
estrutural, não de redação: a etapa 7 é onde o Prisma entra e o número de arquivos por etapa
triplica (de 8 para 29 no InvestApp, de 8 para 30 no MonitorApp) sem que o número de tasks
acompanhe — a etapa 7 do InvestApp descreve 4 TKs para 29 arquivos alterados.

### Arquivos que mudam sem nunca reaparecer

Quatro arquivos concentram a maior parte das linhas órfãs porque mudam em quase toda etapa e só
foram exibidos uma vez, na etapa em que nasceram:

| Arquivo | Etapa em que é exibido | Etapas em que muda sem ser reexibido | Tamanho final |
| ------- | ---------------------- | ------------------------------------ | ------------- |
| `src/docs/openapi.ts` | 5 (swagger) | 7, 8, 9, 10, 11 | 276 → 430 linhas |
| `requests.http` | 2 (api) | 7, 8, 10, 11 (parcial na 9) | 62 → 162 linhas |
| `src/index.ts` | 3 (typescript) | 7, 8, 9, 11, 12 | 30 → 46 linhas |
| `prisma/seeders.json` | — | 7, 8, 9 | 28 → 35 linhas |

No MonitorApp o padrão se repete com `back/src/docs/openapi.ts` (225 → 314 linhas, invisível
das etapas 7 à 11) e `back/requests.http` (118 → 162 linhas).

## Resultado da TASK-015.1 — bloqueadores para construir do zero

O leitor que seguir apenas as páginas chega ao fim da etapa 6 com um projeto equivalente ao do
repositório. A partir da etapa 7 há seis bloqueadores confirmados, listados por gravidade.

### B1 · A etapa 2 do InvestApp descarta o front inteiro da etapa 1

A etapa 1 pede quatro telas (`TK01.1` a `TK01.5`: `index.html`, `signin.html`, `signup.html`,
`profile.html` e a folha de estilos), estilizadas com Tailwind pelo CDN do navegador. A etapa 2
apaga três delas e reescreve a quarta **em Bootstrap 5**, dentro de `public/`:

| Etapa | Telas presentes | Framework CSS |
| ----- | --------------- | ------------- |
| 1 `invest-app-static` | `index`, `signin`, `signup`, `profile` | Tailwind (`@tailwindcss/browser@4` via CDN) |
| 2 a 7 | apenas `index` (em `public/`) | Bootstrap 5.3 via CDN |
| 8 `invest-app-prismajs-user` | `home`, `signin`, `signup` | Bootstrap 5.3 via CDN |
| 11 `invest-app-upload` | `home`, `signin`, `signup`, `profile` | Bootstrap 5.3 via CDN |
| 12 `invest-app-test` | `home`, `signin`, `signup`, `profile` | Tailwind compilado (`public/css/tailwind.css`) |

São duas trocas de framework, nenhuma delas mencionada em página alguma. O `index.mdx` afirma
que a stack de front é "HTML5 semântico, Tailwind CSS (Play CDN no protótipo da etapa 1)" e o
protótipo visual da visão geral renderiza `invest-app-static` — ou seja, mostra ao leitor telas
Tailwind que ele não vai construir nas etapas 2 a 11. Isso contradiz diretamente o aviso "o
trilho é cumulativo por construção" do próprio `index.mdx`.

O MonitorApp não tem esse problema: é Tailwind da etapa 1 à 13, trocando apenas o CDN do
navegador pelo build compilado na etapa 2, o que a página documenta.

### B2 · A etapa 7 do InvestApp entrega Broker e Category sem o código

Dez arquivos novos da etapa 7 não são exibidos **nem citados** na página `prisma.mdx`:

- `src/controllers/brokers.controller.ts` e `src/controllers/categories.controller.ts`
- `src/models/Broker.ts` e `src/models/Category.ts`
- `src/routes/brokers.routes.ts` e `src/routes/categories.routes.ts`
- `src/schemas/broker.schema.ts` e `src/schemas/category.schema.ts`
- `src/types/Broker.d.ts` e `src/types/Category.d.ts`

A página fala de `Broker` nove vezes ao explicar o `schema.prisma` e o `connectOrCreate`, mas as
rotas `/api/brokers` e `/api/categories` que a etapa passa a servir não têm nenhuma task
associada. O leitor sabe que elas existem e não tem como escrevê-las.

### B3 · O histórico de migrations não é cumulativo entre as etapas 7, 8 e 9

Cada etapa traz um conjunto de migrations incompatível com o da anterior:

| Etapa | Migrations em `prisma/migrations/` |
| ----- | ---------------------------------- |
| 7 `prismajs-relation` | `20230826214323_init`, `20241011213516_create_category_broker` |
| 8 `prismajs-user` | `20230826214323_init`, `20241012023407_create_category_broker`, `20241012023426_create_user` |
| 9 `auth` | `20230826214323_init`, `20230902014613_create_category`, `20230902065351_create_user`, `20230902111235_create_investment_broker_interest_created_at`, `20230902131930_create_investment_user_cascade` |

A etapa 8 substitui a migration de categorias da etapa 7 por outra com timestamp diferente, e a
etapa 9 descarta as duas e adota cinco migrations de datas anteriores. Quem rodou
`prisma migrate` na etapa 7 e seguir o passo a passo não chega ao banco da etapa 9 — vai
precisar apagar o histórico. Nenhuma página avisa isso.

### B4 · `public/js/signin.js` da etapa 8 é um arquivo vazio

O arquivo `examples/courses/express/projects/invest-app-prismajs-user/public/js/signin.js` tem
0 bytes, e a tela `signin.html` da mesma etapa o carrega. O conteúdo real só aparece na etapa 9,
com 434 bytes. É um defeito no projeto, não na documentação.

### B5 · Três `<FileTree>` do InvestApp descrevem um projeto JavaScript

As páginas das etapas 7, 8 e 11 mostram árvores herdadas de uma versão anterior da trilha, em
JavaScript, num projeto que é TypeScript desde a etapa 3:

| Página | Entradas inexistentes na pasta real |
| ------ | ----------------------------------- |
| `prisma.mdx` | `seed.js`, `routes.js`, `database.js`, `Category.js`, `Investment.js` |
| `user.mdx` | `routes.js`, `Category.js`, `Investment.js`, `User.js` |
| `upload.mdx` | `routes.js`, `multer.js`, `Image.js`, `User.js` |

Além da extensão errada, as três árvores omitem `src/controllers/`, `src/schemas/`,
`src/types/`, `src/middlewares/` e `src/docs/` — que existem desde a etapa 3. As 13 árvores do
MonitorApp estão corretas.

### B6 · Front-end e API evoluem fora das tasks

Na etapa 10 (e-mail), 11 dos 13 arquivos do delta são front-end e não têm relação com o assunto
da etapa: `signup.js` ganha validação de formulário no cliente, `signin.html` ganha um toast do
Bootstrap, e `api.js` corrige o tratamento de 401 (`if (auth && res.status === 401)`). Nada
disso é mencionado — as três TKs da etapa tratam só do Nodemailer. O mesmo acontece nas etapas 9
e 11 do InvestApp e nas etapas 8 a 11 do MonitorApp.

### O que está saudável

Nem tudo falhou, e os dois eixos abaixo não precisam de trabalho:

- **Dependências**: as dependências novas das duas trilhas são citadas na página da etapa que as
  introduz, quase todas acompanhadas do comando de instalação. A única exceção é o `vite` na
  etapa 1 do InvestApp, que aparece apenas no `npm install` genérico da seção "Executando".
- **Estrutura das páginas**: as 24 páginas de etapa têm `## Executando` e
  `## Descrição das tarefas`; 22 têm `## Próxima etapa` (as duas exceções são as páginas finais
  de Docker). A numeração TK das páginas bate com a do `backlog.mdx` nas duas trilhas.

### Achado colateral

As pastas `examples/courses/express/projects/invest-app-mvc` e
`examples/courses/express/projects/invest-app-prismajs-simple` não são referenciadas por nenhuma
página, por `src/lib/projects.ts`, pelo `astro.config.mjs` nem por `.devcontainer/`. São etapas
órfãs de uma versão anterior da trilha.

## Plano de correção

O trabalho está ordenado por retorno didático: os bloqueadores primeiro, a cobertura depois.

### Etapa A · Defeitos no código dos projetos

1. Escrever o conteúdo de `invest-app-prismajs-user/public/js/signin.js` (B4), alinhado ao da
   etapa 9 e sem as partes que dependem de JWT.
2. Regerar as migrations das etapas 7, 8 e 9 do InvestApp como uma cadeia única e crescente, em
   que cada etapa acrescenta migrations às da anterior sem renomear as existentes (B3).
3. Decidir o destino de `invest-app-mvc` e `invest-app-prismajs-simple`: remover, ou registrar
   em uma página.

### Etapa B · Coerência do front-end do InvestApp

4. Escolher um único framework CSS para a trilha inteira. Padronizar em Tailwind alinha o
   InvestApp ao MonitorApp, ao protótipo visual da visão geral e ao texto do `index.mdx` (B1).
5. Fazer as etapas 2 a 11 herdarem as quatro telas da etapa 1 em vez de reescrevê-las, ou — se a
   redução for intencional — documentar na etapa 2 quais telas ficam de fora e por quê.
6. Corrigir as três `<FileTree>` das etapas 7, 8 e 11 para o conteúdo real das pastas (B5).

### Etapa C · Tasks que faltam

7. Criar as tasks de `Broker` e `Category` na etapa 7 do InvestApp, cobrindo os dez arquivos de
   B2.
8. Acrescentar, nas etapas 7 a 12 de cada trilha, uma task por arquivo do delta hoje sem bloco —
   priorizando `src/index.ts`, `src/docs/openapi.ts`, `requests.http` e `prisma/seeders.json`,
   que são os quatro recorrentes.
9. Onde o arquivo é grande e só muda em parte, usar `<SourceCode>` com `region` ou `lines` em vez
   de omitir: o objetivo é que nenhuma linha do delta fique sem explicação, não que a página
   reexiba arquivos inteiros.
10. Reconciliar o delta com o assunto da etapa (B6): mudanças de front que não pertencem à etapa
    devem ser movidas para a etapa correta ou ganhar a sua própria task.

### Etapa D · Sincronizar os documentos de especificação

11. Atualizar o `backlog.mdx` das duas trilhas com as tasks criadas nas etapas B e C, mantendo a
    matriz de rastreabilidade US → CA → TK consistente.
12. Corrigir a stack de front-end descrita no `index.mdx` do InvestApp conforme a decisão de B4.

## Validação esperada

Ao final, cada etapa deve satisfazer as condições abaixo, verificáveis sem leitura subjetiva:

- Todo arquivo do delta de uma etapa aparece em um bloco de código da página daquela etapa ou é
  explicitamente citado no texto com a justificativa de não ser exibido.
- A cobertura de linhas do delta fica acima de 80% em todas as etapas das duas trilhas.
- As entradas de toda `<FileTree>` existem na pasta correspondente.
- `pnpm build && pnpm check:links && pnpm check:doc-lines` continuam passando.
- Copiar a pasta da etapa `n` e aplicar as TKs da etapa `n+1` produz a pasta da etapa `n+1`.

## Rastreabilidade

Este documento fecha `TASK-015.1` e `TASK-015.2`. As correções que ele planeja são trabalho novo
e ficam registradas aqui até serem executadas — quando isso acontecer, a spec vai para
`specs/executed/`. A `TASK-015.3` (avaliação do conteúdo dos projetos e do acesso/execução dos
códigos) continua em aberto e deve considerar os achados B1, B3 e o colateral das pastas órfãs.
