# Mapeamento: `cstrc-jp-dw` → guias específicos

Levantamento de **todos os 72 arquivos** de `src/content/docs/courses/cstrc-jp-dw/`
para os guias por tecnologia (`html/`, `css/`, `ecmascript/`, e os novos a criar).

O objetivo é que os guias passem a ser a **fonte única** do conteúdo técnico —
texto, `<Aside>`, blocos de código, previews e os projetos de `examples/` — e a
disciplina fique só com ementa, avaliação e trilha.

**Status: executado.** Este documento foi o plano; o registro do que de fato
aconteceu está na seção [11](#11-registro-da-execução), no fim do arquivo.

| Bloco | Arquivos | Situação |
| --- | --- | --- |
| **A** — já espelhados no guia | 18 | Conferido linha a linha; conteúdo íntegro salvo 3 correções |
| **B** — divergentes | 6 | Guia tem versão parcial; exige merge seção a seção |
| **C** — sem guia | 35 | Precisa de 5 guias novos |
| **D** — permanece na DW | 13 | Ementa, projeto, avaliações |

---

## 1. Achados críticos (corrigir antes de qualquer migração)

Ao comparar as versões, apareceram perdas que **já existem hoje nos guias** —
não são risco futuro, são regressões em produção.

### 1.1 — 17 linhas `import` sumiram de dentro de blocos de código

Aparentemente um regex de migração removeu linhas iniciadas por `import`,
confundindo import de componente MDX com código de exemplo. Os exemplos de ESM do
guia estão **quebrados**: sobrou o `console.log` sem o `import` correspondente.

| Arquivo do guia | Linhas perdidas |
| --- | --- |
| `ecmascript/structure/modules.mdx` | 11 — `import { sum, subtract, multiply, divide } from './lib.js'`, `import { sum as add }`, `import add`, `import anyName`, `import MathLib, { sum as add }`, `import * as Lib`, `import { count, increment }`, `import { count as countRef }`, `import MathLib from './lib.js' // Correto`, `import MathLib, { sum as add } // Arquivo relativo local`, `import { sqrt } from 'mathjs' // Pacote instalado via npm` |
| `ecmascript/stdlib/date.mdx` | 3 — `import { format, addDays, differenceInDays } from "date-fns"`, `import { ptBR } from "date-fns/locale"`, `import dayjs from "dayjs"` |
| `ecmascript/async/promises.mdx` | 2 — `import { PrismaClient } from "@prisma/client"`, `import prisma from "../database.js"` |
| `ecmascript/evolution/tc39.mdx` | 1 — `import { add } from './math.js'` |

Origem correta em `cstrc-jp-dw/javascript/modules.mdx`, `date.mdx`,
`async-await.mdx` e `extra/ecmascript-versions.mdx`.

### 1.2 — `html/forms/elements-controls.mdx` perdeu o `<style>` dos previews

O guia usa `class="form-preview"` em **10 blocos**, mas o `<style>{`...`}</style>`
que define esse CSS ficou só em `cstrc-jp-dw/html/forms.mdx` (linhas 428-451).
Os formulários de exemplo renderizam sem borda, sem padding e sem cor.

### 1.3 — Headings de nível errado em "Perguntas de revisão"

Em `ecmascript/basics/variables.mdx` e `ecmascript/basics/types.mdx`, os blocos
`## Variáveis e Escopo` e `## Tipos e Coerção` deveriam ser `###` dentro de
`## Perguntas de revisão` (que hoje fica com 2 linhas e um irmão solto ao lado).
Mesmo padrão em `ecmascript/reference/cheat-sheet.mdx`.

---

## 2. Arquitetura-alvo

### Guias existentes

| Guia | `course` | Diretório |
| --- | --- | --- |
| Guia de HTML | `html` | `courses/html/` |
| Guia de CSS | `css` | `courses/css/` |
| Guia de ECMAScript | `ecmascript` | `courses/ecmascript/` |
| Guia de TypeScript | `typescript` | `courses/typescript/` |
| Guia de Python | `python` | `courses/python/` |

### Guias a criar

| Guia | `course` | Diretório | Origem |
| --- | --- | --- | --- |
| Guia de Web APIs | `web-api` | `courses/web-api/` | `cstrc-jp-dw/browser/` + `javascript/fetch-api` + `packages/axios` |
| Guia de Node.js | `nodejs` | `courses/nodejs/` | `cstrc-jp-dw/node/` |
| Guia de Express.js | `express` | `courses/express/` | `cstrc-jp-dw/express/` + `projects/` |
| Guia de Banco de Dados | `database` | `courses/database/` | `cstrc-jp-dw/database/` |
| Guia de Pacotes e Build | `packages` | `courses/packages/` | `cstrc-jp-dw/packages/` (menos Bootstrap/Tailwind) |

Cada guia novo exige, além dos `.mdx`:

1. Entrada em `src/lib/courses.ts` (`title`, `shortTitle`, `href`) — é o que
   `Sidebar.astro` usa para escolher o grupo da barra lateral pelo `course:` do
   frontmatter.
2. Grupo de sidebar em `astro.config.mjs`.
3. `index.mdx` com a seção `## Trilhas de Aprendizado`, no padrão de
   `html/index.mdx`, `css/index.mdx` e `ecmascript/index.mdx`.

**Bootstrap e Tailwind vão para o guia de CSS**, não para o de pacotes: são
frameworks CSS e o conteúdo (grid, utilitários, responsividade, tokens) só faz
sentido depois de `css/layout/` e `css/styling/`.

---

## 3. Bloco A — 18 aulas já espelhadas

Comparação linha a linha do corpo (sem frontmatter). Onde a coluna "delta" diz
`—`, o guia contém 100% do conteúdo da DW: texto, asides, tabelas e código.
As únicas diferenças são slugs de link relativo e o texto de "Próxima aula", que
é específico da sequência de cada trilha.

| DW | Guia | Sim. | Delta a levar |
| --- | --- | --- | --- |
| `html/web-importance.mdx` | `html/basics/web-importance.mdx` | 98,2% | — |
| `html/markup-languages.mdx` | `html/basics/markup-languages.mdx` | 99,0% | — |
| `html/forms.mdx` | `html/forms/elements-controls.mdx` | 97,9% | **bloco `<style>` §1.2** + `## Próxima Aula` |
| `javascript/ecmascript.mdx` | `ecmascript/basics/introduction.mdx` | 98,1% | — (guia ganhou diagrama Mermaid do V8) |
| `javascript/expressions-operators.mdx` | `ecmascript/basics/operators.mdx` | 99,6% | — (`Associatividade` virou `##`) |
| `javascript/control-flow.mdx` | `ecmascript/basics/control-flow.mdx` | 99,4% | — (`Visão geral` virou `##`) |
| `javascript/functions.mdx` | `ecmascript/structure/functions.mdx` | 99,2% | — |
| `javascript/modules.mdx` | `ecmascript/structure/modules.mdx` | 97,7% | **11 `import` §1.1** |
| `javascript/arrays.mdx` | `ecmascript/data/arrays.mdx` | 99,4% | — (guia ganhou `Gerando Intervalos`) |
| `javascript/strings.mdx` | `ecmascript/data/strings.mdx` | 99,4% | — |
| `javascript/number-math.mdx` | `ecmascript/data/numbers.mdx` | 98,8% | — |
| `javascript/date.mdx` | `ecmascript/stdlib/date.mdx` | 98,3% | **3 `import` §1.1** |
| `javascript/regexp.mdx` | `ecmascript/stdlib/regex.mdx` | 98,5% | — (guia ganhou `Validação Nativa em Formulários HTML`) |
| `javascript/map-set.mdx` | `ecmascript/data/collections.mdx` | 95,7% | — (guia ganhou `Dados Privados e Metadados`) |
| `javascript/objects.mdx` | `ecmascript/data/objects.mdx` | 97,5% | — (guia ganhou `Property Shorthand`, `Object.freeze`, `JSON`) |
| `javascript/error-handling.mdx` | `ecmascript/structure/errors.mdx` | 97,5% | — |
| `extra/ecmascript-versions.mdx` | `ecmascript/evolution/tc39.mdx` | 94,3% | **1 `import` §1.1** |
| `extra/cheat-sheet.mdx` | `ecmascript/reference/cheat-sheet.mdx` | 100,0% | — |

**Ação**: aplicar os deltas, depois apagar os 18 arquivos da DW e registrar
`redirects` no `astro.config.mjs` para as URLs antigas.

---

## 4. Bloco B — 6 arquivos divergentes (merge seção a seção)

### 4.1 `html/index.mdx` (903 linhas) → 4 páginas do guia de HTML

A DW é um monolito; o guia dividiu em 4 páginas mais enxutas. O guia perdeu
conteúdo em quase todas as seções.

| Seção DW | Linhas | Destino | Tamanho no guia | Situação |
| --- | --- | --- | --- | --- |
| `## Sintaxe do HTML` → `### Elementos e tags` | L30, 80 | `html/basics/syntax-structure.mdx` → `### Elementos e tags` | 14 | **migrar 66 linhas** |
| `### Atributos` | L110, 165 | idem → `### Atributos` | 16 | **migrar 149 linhas** (é a maior perda do bloco) |
| `### Entidades` | L275, 16 | idem → `### Entidades HTML` | 12 | migrar 4 |
| `### Comentários` | L291, 14 | idem → `### Comentários` | 8 | migrar 6 |
| `## Estrutura de um documento` | L305, 38 | idem → `## Estrutura de um Documento HTML` | 38 | ✅ idêntico |
| `## Elementos semânticos` | L343, 21 | `html/elements/semantic-structure.mdx` | 77 | ✅ guia é mais completo |
| `### Conteúdo de texto` | L369, 54 | `html/elements/text-formatting.mdx` → `## Conteúdo de Texto` | 35 | migrar 19 |
| `### Listas` | L423, 47 | idem → `## Listas em HTML` | 41 | migrar 6 |
| `### Links` | L470, 106 | idem → `## Hiperlinks (<a>)` | 15 | **migrar 91 linhas** |
| `### Imagens` | L576, 104 | `html/elements/media-tables.mdx` → `## Imagens em HTML` | 29 | **migrar 75 linhas** |
| `### Tabelas` | L680, 61 | idem → `## Tabelas Estruturadas` | 52 | migrar 9 |
| `## Executando` | L741, 64 | dividir entre as 4 páginas | 26+27+37+31 | conferir cobertura de `examples/html/basics` |
| `## Exercício` / `## Desafio` | L805, 22 | dividir entre as 4 | 28+35+51+49 | ✅ guia cobre |
| `## Perguntas de revisão` | L827, 60 | dividir entre as 4 | 26+18+18+18 | conferir 60 → 80 |
| `## Referências` | L887, 12 | dividir | 5×4 | conferir |

Componentes a preservar: **9 `<Aside>`**, **7 `<HtmlPreview>`**, **7 `<SourceCode>`**,
1 `<FileTree>`, 1 `<Steps>`.

### 4.2 `css/index.mdx` (923 linhas) → 4 páginas do guia de CSS

| Seção DW | Linhas | Destino | Tamanho no guia | Situação |
| --- | --- | --- | --- | --- |
| `## Por que CSS existe` | L24, 33 | `css/basics/syntax-cascade.mdx` → `## Por Que o CSS Importa?` | 13 | migrar 20 |
| `## Sintaxe do CSS` | L57, 43 | idem → `## Anatomia de uma Regra CSS` | 23 | migrar 20 |
| `## Como o CSS entra na página` + `### inline` + `### interno` + `### externo` | L100, 207 | idem → `## Formas de Inclusão do CSS` | 47 | **migrar 160 linhas** (inclui 3 `<HtmlPreview>` e os `<SourceCode>` de `examples/css/basics`) |
| `## Cascata, especificidade e herança` | L307, 91 | idem → `## Cascata, Especificidade e Herança` | 33 | **migrar 58 linhas** |
| `## Propriedades e valores` | L398, 54 | `css/styling/typography-colors.mdx` | — | **seção inteira ausente do guia** |
| `### Unidades, cores e funções` | L452, 46 | idem → `## Unidades de Medida` + `## Sistemas de Cores` | 25+26 | conferir |
| `### Variáveis CSS` | L498, 31 | idem → `## Variáveis CSS` | 44 | ✅ guia é mais completo |
| `## Tipos de seletores` | L529, 87 | `css/basics/selectors.mdx` | 168 (arquivo todo) | ✅ guia é mais completo |
| `## At-rules` | L616, 49 | **sem destino** — criar `css/basics/at-rules.mdx` | — | **seção inteira ausente** |
| `## Media queries` | L665, 104 | `css/styling/responsive-mediaqueries.mdx` | 147 (arquivo todo) | conferir sobreposição |
| `## Executando` | L769, 58 | dividir entre as páginas de CSS | ausente | **nenhuma página do guia de CSS tem `## Executando`** |
| `## Exercício` / `## Desafio` | L827, 19 | idem | ausente | **ausente em todo o guia de CSS** |
| `## Perguntas de revisão` | L846, 59 | idem | ausente | **ausente em todo o guia de CSS** |
| `## Referências` | L905, 13 | idem | ausente | **ausente em todo o guia de CSS** |

O guia de CSS é o mais incompleto: nenhuma das 7 páginas tem Executando,
Exercício, Desafio, Perguntas de revisão ou Referências — só `## Resumo e Boas
Práticas`. São **~150 linhas de material didático** da DW sem destino atual.

Componentes a preservar: **18 `<Aside>`**, **6 `<HtmlPreview>`**, **9 `<SourceCode>`**,
1 `<FileTree>`, 1 `<Steps>`.

### 4.3 `css/box-model.mdx` (36 linhas) → `css/layout/box-model.mdx`

O guia (116 linhas) é mais completo. Único item exclusivo da DW: o **diagrama
ASCII** do modelo de caixa em bloco ```plaintext``` (L14-21) e o `<Aside>` sobre
`box-sizing: border-box`. Migrar os dois e apagar.

### 4.4 `javascript/variables.mdx` (1121 linhas) → `ecmascript/basics/variables.mdx` + `types.mdx`

O guia dividiu em duas páginas de ~265 linhas cada. Total: 1121 → 533. **588
linhas sem destino.**

| Seção DW | Linhas | Destino | No guia | Situação |
| --- | --- | --- | --- | --- |
| `## Valores e tipos` | L23, 52 | `types.mdx` → `## Categorias de Tipos de Dados` | 15 | migrar 37 |
| `### typeof` | L75, 25 | `types.mdx` → `## O Operador typeof` | 24 | ✅ |
| `### undefined e null` | L100, 31 | `types.mdx` → `## undefined vs null` | 18 | migrar 13 |
| `### Booleanos e valores falsy` | L131, 37 | `types.mdx` → `## Booleanos, Falsy e Truthy` | 23 | migrar 14 |
| `### Números` | L168, 131 | **sem destino** — vai para `ecmascript/data/numbers.mdx` | — | **migrar 131 linhas** |
| `### Symbol` | L299, 14 | `types.mdx` → `## Categorias de Tipos` | — | **migrar 14 linhas** |
| `### Por que variáveis existem` | L318, 30 | `variables.mdx` → `## Variáveis e Declaração` | 36 | conferir |
| `### Declaração de variáveis` | L348, 50 | `variables.mdx` → `## Palavras-Chave de Declaração` | 34 | migrar 16 |
| `### Identificadores` | L398, 60 | `variables.mdx` → `## Variáveis e Declaração` | — | **migrar 60 linhas** |
| `### Inicialização` | L458, 26 | `variables.mdx` | — | **migrar 26 linhas** |
| `### Reassociação e mutação` | L484, 51 | `variables.mdx` | — | **migrar 51 linhas** |
| `### Redeclaração` | L535, 25 | `variables.mdx` | — | **migrar 25 linhas** |
| `### Escopo` | L560, 60 | `variables.mdx` → `## Escopo Lexical e de Bloco` | 33 | migrar 27 |
| `### Hoisting e zona morta temporal` | L620, 32 | `variables.mdx` → `## Hoisting e a TDZ` | 36 | ✅ |
| `### Globais implícitas` | L652, 25 | `variables.mdx` | — | **migrar 25 linhas** |
| `### Escopo em laços` | L677, 21 | `variables.mdx` | — | **migrar 21 linhas** |
| `### Tipagem dinâmica` | L698, 31 | `types.mdx` | — | **migrar 31 linhas** |
| `### Conversão explícita` | L729, 15 | `types.mdx` → `### Coerção Explícita` | 11 | migrar 4 |
| `### Coerção: conversão implícita` | L744, 51 | `types.mdx` → `### Coerção Implícita` | 29 | migrar 22 |
| `### Case sensitive` | L795, 15 | `variables.mdx` | — | **migrar 15 linhas** |
| `### Boas práticas` | L810, 27 | ambos | — | **migrar 27 linhas** |
| `## Executando` | L837, 49 | dividir | 30+33 | ✅ |
| `## Exercício` | L886, 59 | dividir | 27+33 | ✅ |
| `## Desafio` | L945, 56 | dividir | — | **ausente nas duas páginas** |
| `## Perguntas de revisão` | L1001, 100 | dividir | 36+36 | migrar 28 |
| `## Referências` | L1101, 14 | dividir | 7+6 | ✅ |

15 `<Aside>` e 4 `<Card>` a preservar.

### 4.5 `javascript/promises.mdx` (573) + `async-await.mdx` (514) → `ecmascript/async/promises.mdx` (1080)

O guia **já fundiu as duas aulas** e ficou mais completo — ganhou
`## Coerção de Retorno e Exceções`. Verificado: nenhuma seção da DW ficou de fora.

Delta a levar: **2 linhas `import` (§1.1)**.

Ponto de atenção: a página fundida tem `## Objetivo`, `## Executando`,
`## Exercício`, `## Desafio`, `## Perguntas de revisão` e `## Referências`
**duplicados** (um par para Promises, outro para Async/Await), o que quebra o
sumário lateral. Considerar rebaixar o segundo bloco para `###` ou separar em
`ecmascript/async/promises.mdx` e `ecmascript/async/async-await.mdx`.

---

## 5. Bloco C — 35 arquivos sem guia (criar 5 guias)

### 5.1 Guia de Web APIs (`courses/web-api/`) — 8 páginas

| DW | Linhas | Destino | Conteúdo |
| --- | --- | --- | --- |
| `browser/index.mdx` | 13 | `web-api/index.mdx` | Reescrever no padrão `## Trilhas de Aprendizado` |
| `browser/browser-objects.mdx` | 263 | `web-api/browser/objects.mdx` | Integrando JS e HTML · Web APIs · Window · Location · History · Console · Document · 2 `<SourceCode>` |
| `browser/dom-api.mdx` | 142 | `web-api/dom/manipulation.mdx` | Árvore DOM · Element · HTMLElement · HTMLInputElement |
| `browser/events.mdx` | 100 | `web-api/dom/events.mdx` | GlobalEventHandlers · EventTarget |
| `browser/dynamic-elements.mdx` | 84 | `web-api/dom/dynamic-elements.mdx` | Element · Document · MonitorApp · 4 `<SourceCode>` · 1 `<FileTree>` |
| `browser/local-storage.mdx` | 227 | `web-api/storage/local-storage.mdx` | localStorage · Monitor-app CRUD · Front-end · 9 `<SourceCode>` · 1 `<FileTree>` |
| `javascript/fetch-api.md` | 90 | `web-api/http/fetch.mdx` | GET · POST JSON · PUT/DELETE · query string · teste por terminal · 2 `:::` |
| `packages/axios.mdx` | 154 | `web-api/http/axios.mdx` | Objeto Axios · 1 `<Aside>` |

Ao criar `web-api/http/fetch.mdx`, comparar com `csbes-jp-pw2/w3c/fetch-api.mdx`
(a versão da PW2 é independente e pode ter material extra) — o guia deve absorver
o melhor dos dois. Mesmo cuidado para `browser-objects`, `dom-api`,
`dynamic-elements`, `local-storage`, que têm par em `csbes-jp-pw2/w3c/`.

Sobreposição a resolver: `ecmascript/async/promises.mdx` já tem
`## Consumo Prático da Fetch API e Validação de response.ok`. Manter lá o
conceito de Promise e mover a API HTTP para `web-api/http/fetch.mdx`, com link
cruzado.

### 5.2 Guia de Node.js (`courses/nodejs/`) — 4 páginas

| DW | Linhas | Destino | Conteúdo |
| --- | --- | --- | --- |
| `node/index.md` | 97 | `nodejs/basics/introduction.mdx` | Instalação · executar arquivo · modo watch · módulos internos · servidor HTTP sem framework · variáveis de ambiente |
| `node/modules.md` | 93 | `nodejs/basics/modules.mdx` | CommonJS legado · ESM · 3 diferenças que causam erro · top-level await · organização |
| `node/npm.mdx` | 104 | `nodejs/tools/npm.mdx` | criar projeto · package.json · deps vs devDeps · scripts · npx · lockfile · semver · 1 `<Steps>` |
| `node/http.mdx` | 44 | `nodejs/http/server.mdx` | 2 `<SourceCode>` de `nodejs/http/hello-simple` |

Sobreposição: `ecmascript/structure/modules.mdx` já tem
`## Resolução de módulos e regras no Node.js` (119 linhas). Decidir a fronteira —
sugestão: ESM como linguagem fica no guia de ECMAScript; `require`,
`package.json#type`, resolução de `node_modules` e interop ficam no de Node.js.

### 5.3 Guia de Express.js (`courses/express/`) — 10 páginas + 4 projetos

| DW | Linhas | Destino | Conteúdo |
| --- | --- | --- | --- |
| `express/index.mdx` | 124 | `express/basics/introduction.mdx` | instalação · servidor completo · anatomia de rota · executando · testando · 4 `<ApiRequest/Response>` |
| `express/routes.mdx` | 132 | `express/basics/routes.mdx` | conceitos · estrutura de dirs · arquivo único → router · params · 4 `<ApiRequest>` · `<FileTree>` |
| `express/controllers.md` | 103 | `express/basics/controllers.mdx` | o problema · separação · nomes convencionais · o que deve/não deve fazer |
| `express/middleware.md` | 125 | `express/basics/middleware.mdx` | assinatura · ordem · middleware de rota · de erro · 404 · embutidos e de terceiros |
| `express/rest-api.mdx` | 170 | `express/api/rest.mdx` | recursos não ações · 5 verbos · status codes · ciclo completo · erros padronizados · idempotência · 7 `<ApiRequest>` |
| `express/api-construction.mdx` | 323 | `express/api/construction.mdx` | Back-end Web · Front-end Web · 12 `<SourceCode>` · 2 `<FileTree>` |
| `express/mvc.mdx` | 330 | `express/architecture/mvc.mdx` | conceitos · arquitetura · estrutura · código · destaques · testes · 9 `<SourceCode>` · 8 `<ApiRequest>` · 5 `<Card>` |
| `express/system-call.mdx` | 91 | `express/advanced/system-call.mdx` | Ping com Regex · Ping Package · 5 `<SourceCode>` |
| `express/user-registration.mdx` | 144 | `express/auth/user-registration.mdx` | banco · migration · model · router · teste · view · 10 `<SourceCode>` |
| `express/authentication.mdx` | 127 | `express/auth/authentication.mdx` | router · teste · view · 11 `<SourceCode>` |
| `projects/hello-express.mdx` | 74 | `express/practice/hello-express.mdx` | walkthrough de `examples/express/projects/hello` |
| `projects/express-router.mdx` | 77 | `express/practice/express-router.mdx` | walkthrough de `examples/express/projects/router` |
| `projects/express-mvc.mdx` | 110 | `express/practice/express-mvc.mdx` | walkthrough de `examples/express/projects/mvc` |
| `projects/express-prisma.mdx` | 100 | `express/practice/express-prisma.mdx` | walkthrough de `examples/express/projects/prisma` |

**Absorver também `ctii-jp-lp2/expressjs/`**, que tem 4 aulas que a DW não tem:
`validation.mdx`, `email.mdx`, `upload-file.mdx`, `test.mdx` → `express/advanced/`.
E os pares `db-simple`, `prismajs-simple`, `prismajs-relation`, `prismajs-user`,
`auth`, `api`, `mvc`, `introduction` são duplicatas das páginas da DW.

Mover os 4 walkthroughs exige atualizar `docs:` em `src/lib/projects.ts`.

### 5.4 Guia de Banco de Dados (`courses/database/`) — 6 páginas

| DW | Linhas | Destino | Conteúdo |
| --- | --- | --- | --- |
| `database/dbms.mdx` | 1347 | `database/basics/dbms.mdx` | SGBD (1010 linhas) · Databases (305) · Tipos de Dados · 3 `<SourceCode>` (docker-compose MySQL/Postgres, Dockerfile SQLite). **É a maior página do repositório — considerar dividir em `dbms.mdx` + `engines.mdx` + `data-types.mdx`** |
| `database/sql.md` | 122 | `database/sql/fundamentals.mdx` | tabelas/colunas/linhas · relacionamentos · CRUD · filtrar/ordenar/paginar · JOIN · agregações |
| `database/sql-node.mdx` | 106 | `database/sql/node-sqlite.mdx` | migration · model · router · teste · view · 9 `<SourceCode>` |
| `database/prisma.mdx` | 190 | `database/prisma/introduction.mdx` | instalação · estrutura · schema · conexão · criar banco · client · consultas · filtros · seed · 2 `<Steps>` |
| `database/crud.mdx` | 221 | `database/prisma/crud.mdx` | o que muda · controller completo · 4 operações · testando ciclo · 9 `<ApiRequest>` |
| `database/prisma-relations.mdx` | 179 | `database/prisma/relations.mdx` | banco · migration · seed · model · router · teste · view · 10 `<SourceCode>` |

### 5.5 Guia de Pacotes (`courses/packages/`) — 4 páginas

| DW | Linhas | Destino | Conteúdo |
| --- | --- | --- | --- |
| `packages/index.mdx` | 14 | `packages/index.mdx` | Reescrever como trilha |
| `packages/vite.mdx` | 157 | `packages/build/vite.mdx` | Vite · Bootstrap · 5 `<SourceCode>` · 2 `<FileTree>` |
| `packages/json-server.mdx` | 163 | `packages/mock/json-server.mdx` | CLI · Module · 3 `<SourceCode>` |
| `packages/chartjs.mdx` | 50 | `packages/ui/chartjs.mdx` | 4 `<SourceCode>` · 1 `<FileTree>` |

### 5.6 Para o guia de CSS (frameworks) — 3 páginas

| DW | Linhas | Destino | Conteúdo |
| --- | --- | --- | --- |
| `packages/bootstrap.mdx` | 620 | `css/frameworks/bootstrap.mdx` | versão · o que resolve · como usar · modelo mental · base visual · utilitárias · componentes · grid · quando usar · templates · cuidados · exercício · perguntas · 8 `<Aside>` · 7 `<HtmlPreview>` · 7 `<SourceCode>` · 5 `<Card>` |
| `packages/tailwind-css.mdx` | 620 | `css/frameworks/tailwind.mdx` | ideia central · primeiro exemplo · anatomia · cores e tamanhos · composição · variantes · responsividade · tema e tokens · build · quando extrair · preflight · Tailwind vs Bootstrap · IA como apoio · 12 `<Aside>` · 3 `<HtmlPreview>` |
| `css/forms.mdx` | 83 | `css/forms/styling.mdx` | CSS puro · Bootstrap · Tailwind · comparação · 3 `<HtmlPreview>` · 3 `<SourceCode>` |

`css/forms/styling.mdx` fecha o par com `html/forms/elements-controls.mdx`, que
hoje aponta para `../../css/forms/` — link que passa a resolver.

---

## 6. Bloco D — 13 arquivos que ficam na DW

| Arquivo | Linhas | Motivo |
| --- | --- | --- |
| `index.mdx` | 289 | Ementa: o que vai aprender · organização · horário · avaliações · comunicação · bibliografia · ferramentas |
| `project.mdx` | 652 | Especificação do projeto da disciplina, critérios de avaliação, autoavaliação com IA |
| `extra/index.mdx` | 12 | Índice de material extra |
| `extra/exercises.mdx` | 57 | Exercícios 1.1/1.2/1.3 com pontuação |
| `extra/quizzes.mdx` | 53 | Lista de quizzes |
| `extra/next-steps.mdx` | 21 | Próximos passos da disciplina |
| `projects/index.mdx` | 56 | Progressão dos projetos + como rodar |
| `projects/invest-app-bootstrap.mdx` | 33 | Projeto da disciplina (3 `<SourceCode>` de Bootstrap CDN) |
| `javascript/index.md` | 94 | **Descartável**: resumo de sintaxe 100% coberto por `ecmascript/basics/*`. Virar redirect |

Após a migração, a sidebar da DW passa a ser uma **trilha**: itens de ementa
locais + links para as páginas dos guias, na ordem da disciplina.

⚠️ `Sidebar.astro` escolhe o grupo pelo `course:` do frontmatter — ao abrir uma
página de guia a partir da trilha da DW, a sidebar troca para o grupo do guia.
Decidir se isso é aceitável ou se `Sidebar.astro` precisa de ajuste.

---

## 7. Mapeamento de `examples/` (source of truth nos guias)

Hoje o código vive em dois lugares: `examples/dw/codes/**` (por disciplina) e
`examples/<projeto>` (por projeto). A proposta é reorganizar **por tecnologia**,
espelhando os guias.

| Origem | Destino | Consumidor no guia |
| --- | --- | --- |
| `examples/html/basics/` | `examples/html/basics/` | `html/basics/syntax-structure` + `html/elements/*` (`## Executando`) |
| `examples/html/markup-languages/` | `examples/html/markup-languages/` | `html/basics/markup-languages` (já usa) |
| `examples/html/forms-simple/` | `examples/html/forms/simple-form/` | `html/forms/elements-controls` (já usa) |
| `examples/css/basics/` | `examples/css/basics/` | `css/basics/syntax-cascade` + `css/basics/selectors` |
| `examples/css/forms/calc/` | `examples/css/forms/calc/` | `css/forms/styling` |
| `examples/css/forms/bootstrap/` | `examples/css/forms/bootstrap/` | `css/forms/styling` |
| `examples/css/forms/tailwind/` | `examples/css/forms/tailwind/` | `css/forms/styling` |
| `examples/css/frameworks/bootstrap/` (9 projetos) | `examples/css/frameworks/bootstrap/` | `css/frameworks/bootstrap` |
| `examples/css/frameworks/tailwind/` (5 projetos) | `examples/css/frameworks/tailwind/` | `css/frameworks/tailwind` |
| `examples/ecmascript/modules/no-module/` | `examples/ecmascript/modules/no-module/` | `ecmascript/structure/modules` (já usa) |
| `examples/web-api/browser-objects/` | `examples/web-api/browser-objects/` | `web-api/browser/objects` |
| `examples/web-api/dynamic-elements/` | `examples/web-api/dynamic-elements/` | `web-api/dom/dynamic-elements` |
| `examples/web-api/local-storage/` | `examples/web-api/local-storage/` | `web-api/storage/local-storage` |
| `examples/web-api/fetch-api/` | `examples/web-api/fetch-api/` | `web-api/http/fetch` — **hoje órfão** |
| `examples/nodejs/http/` | `examples/nodejs/http/` | `nodejs/http/server` |
| `examples/express/codes/` (14 projetos) | `examples/express/` | páginas de `express/` |
| `examples/express/projects/hello/` | `examples/express/projects/hello/` | `express/practice/hello-express` |
| `examples/express/projects/router/` | `examples/express/projects/router/` | `express/practice/express-router` |
| `examples/express/projects/mvc/` | `examples/express/projects/mvc/` | `express/practice/express-mvc` |
| `examples/express/projects/prisma/` | `examples/express/projects/prisma/` | `express/practice/express-prisma` |
| `examples/database/servers/` (4 servidores) | `examples/database/` | `database/basics/dbms` |
| `examples/packages/vite/` | `examples/packages/vite/` | `packages/build/vite` |
| `examples/packages/json-server/` | `examples/packages/json-server/` | `packages/mock/json-server` |
| `examples/packages/chartjs/` | `examples/packages/chartjs/` | `packages/ui/chartjs` |
| `examples/express/api-rest/` | `examples/express/api-rest/` | `express/api/rest` — **hoje órfão** |
| `examples/lp2/`, `examples/pw2/` | manter | disciplinas LP2 e PW2 |

Quem mexe nisso precisa atualizar em conjunto:

- `src/lib/projects.ts` — campo `source` de cada projeto (e `docs`, se os
  walkthroughs mudarem de URL).
- `src/lib/source-files.ts` — o `import.meta.glob` já cobre `examples/**`, não
  muda.
- `scripts/build-public-previews.mjs` e `clean-public-previews.mjs` — conferir se
  assumem caminhos fixos.
- `examples/html/basics/README.md` — cita `courses/cstrc-jp-dw/html`.

### 7.1 — 14 projetos de exemplo órfãos

Não são referenciados por nenhum `.mdx`. Decidir: virar exemplo de alguma página
do guia, ou remover.

```
examples/express/api-rest
examples/css/introduction
examples/css/table
examples/database/servers/mongo-server
examples/express/codes/bmi-api
examples/express/codes/bmi-body-param
examples/express/codes/bmi-query-param
examples/express/codes/bmi-route-param
examples/express/codes/hello-lang
examples/express/codes/hello-simple
examples/express/codes/monitor-app-mvc
examples/express/codes/monitor-app-prismajs-simple
examples/html/introduction
examples/web-api/fetch-api
```

Os quatro `bmi-*` e `hello-*` são bons candidatos a exemplo de
`express/basics/routes.mdx` (route param, query param, body param).

---

## 8. Mapeamento de `materials/` (slides e mapas mentais)

`materials/courses/**` alimenta `scripts/build-slides.mjs` e
`build-mindmaps.mjs`, que publicam em `public/slides/courses/**` e
`public/mindmaps/courses/**`. Hoje só existem quatro trilhas: `cstrc-jp-dw`,
`ecmascript`, `python`, `typescript` — **não há material para `html` nem `css`**.

| `materials/courses/cstrc-jp-dw/` | Destino | Situação |
| --- | --- | --- |
| `javascript/ecmascript.{slide,mindmap}.md` | `ecmascript/basics/introduction.*` | ✅ já existe |
| `javascript/variables.*` | `ecmascript/basics/variables.*` | ✅ já existe (+ `basics/types.*` novo) |
| `javascript/expressions-operators.*` | `ecmascript/basics/operators.*` | ✅ já existe |
| `javascript/control-flow.*` | `ecmascript/basics/control-flow.*` | ✅ já existe |
| `javascript/functions.*` | `ecmascript/structure/functions.*` | ✅ já existe |
| `javascript/modules.*` | `ecmascript/structure/modules.*` | ✅ já existe |
| `javascript/arrays.*` | `ecmascript/data/arrays.*` | ✅ já existe |
| `javascript/strings.*` | `ecmascript/data/strings.*` | ✅ já existe |
| `javascript/numbers.*` | `ecmascript/data/numbers.*` | ✅ já existe |
| `javascript/objects.*` | `ecmascript/data/objects.*` | ✅ já existe |
| `javascript/ecmascript.excalidraw` | `ecmascript/basics/introduction.excalidraw` | **mover** |
| `html/web-importance.*` | `html/basics/web-importance.*` | **criar trilha `html`** |
| `html/markup-languages.*` | `html/basics/markup-languages.*` | **criar trilha `html`** |
| `html/html.*` (monolito) | `html/basics/syntax-structure.*` + `html/elements/*` | **dividir** |
| `css/css.*` (monolito) | `css/basics/*` + `css/layout/*` + `css/styling/*` | **dividir e criar trilha `css`** |
| `project.*` | permanece em `cstrc-jp-dw/project.*` | ✅ é da disciplina |

Dentro da trilha `ecmascript` já existente, faltam materiais para
`stdlib/date` e `reference/cheat-sheet` — e para todas as páginas dos 5 guias
novos.

Cada página de guia migrada precisa ganhar a linha de materiais no topo, no
formato usado pela DW:

```
Materiais: [slides da aula](../../../../slides/courses/<guia>/<caminho>/) e
[mapa mental](../../../../mindmaps/courses/<guia>/<caminho>/)
```

Hoje **nenhuma página de guia tem essa linha** — os 14 arquivos com materiais
estão todos em `cstrc-jp-dw/`.

---

## 9. Outros consumidores a atualizar

| Local | O que cita |
| --- | --- |
| `astro.config.mjs` | 22 links `/courses/cstrc-jp-dw/{html,css,javascript}/...` na sidebar |
| `src/content/docs/index.mdx:102` | `[Começar →](courses/cstrc-jp-dw/html/)` |
| `src/lib/projects.ts` | `docs` e `source` dos 4 projetos (`express-basic`, `express-router`, `express-mvc`, `express-prisma`) |
| `.agents/skills/devlab-topic-docs-generator/SKILL.md` | usa `cstrc-jp-dw/javascript/arrays` como exemplo canônico |
| `.agents/skills/marp-slides-generator/SKILL.md` | tabela de caminhos `cstrc-jp-dw/javascript/arrays` |
| `.agents/skills/markmap-mindmap-generator/SKILL.md` | idem |
| `.agents/skills/excalidraw-generator/SKILL.md` | `excalidraw/courses/cstrc-jp-dw/javascript/ecmascript.excalidraw` |
| `exercises/courses/html/basics/syntax-structure.exercise.md` | "Página base" apontando para o `.mdx` da DW |
| `exercises/courses/html/basics/syntax-structure.braincheck.md` | idem (antes em `braincheck/`) |
| `examples/html/basics/README.md:22` | `courses/cstrc-jp-dw/html` |
| `scripts/check-links.mjs` | roda em `pnpm validate` — usar para validar a migração |

---

## 10. Ordem de execução sugerida

1. **Corrigir as regressões do §1** nos guias (17 `import`, `<style>` do
   `form-preview`, níveis de heading). Independe de tudo o mais.
2. **Bloco B**: merge das 6 páginas divergentes. É o trabalho mais delicado —
   ~900 linhas de conteúdo didático a reintegrar, com destaque para
   `css/index.mdx` (o guia de CSS não tem Executando/Exercício/Perguntas em
   nenhuma página) e `javascript/variables.mdx` (588 linhas).
3. **Bloco A**: apagar as 18 duplicatas e registrar redirects.
4. **Bloco C**: criar os 5 guias, um por vez, na ordem
   `web-api` → `nodejs` → `express` → `database` → `packages`, mais as 3 páginas
   de frameworks no guia de CSS.
5. **`examples/`**: reorganizar por tecnologia e atualizar `projects.ts`.
6. **`materials/`**: criar trilhas `html` e `css`, dividir os monolitos, mover o
   excalidraw e adicionar a linha "Materiais:" em cada página de guia.
7. **Sidebar da DW**: reescrever como trilha apontando para os guias; decidir o
   comportamento de `Sidebar.astro` ao sair para um guia.
8. `pnpm validate` (lint + astro check + build + check:links) a cada etapa.

---

## 11. Registro da execução

Aplicado na branch `migracao-guias`. Resultado final: `astro check` sem erros,
build com **560 páginas**, `check-links` com **zero links quebrados**.

### O que foi feito

| Etapa | Resultado |
| --- | --- |
| §1 Regressões | 17 `import` restaurados · `<style>` do `form-preview` recuperado · 4 headings renivelados · **13 links "Materiais:" quebrados** corrigidos (achado durante a execução) |
| §4 Bloco B | 6 merges concluídos; `promises.mdx` foi **dividido** em `promises` + `async-await`, e nasceu `css/basics/at-rules.mdx` |
| §3 Bloco A | 25 arquivos removidos da DW, com 64 `redirects` no `astro.config.mjs` |
| §5 Bloco C | 5 guias novos: `web-api` (8), `nodejs` (5), `express` (15), `database` (7), `packages` (4); mais 3 páginas de framework no guia de CSS |
| §7 `examples/` | Reorganizado por tecnologia; `projects.ts` e 43 arquivos repontados |
| §8 `materials/` | Trilhas `html` e `css` criadas; excalidraw movido; 7 páginas ganharam a linha "Materiais:"; 52 slides e 52 mapas regerados |
| §9 Consumidores | `astro.config.mjs`, `index.mdx`, `projects.ts`, 4 skills, `exercises/`, `braincheck/` e 5 READMEs atualizados |
| §12 `exercises/` | `braincheck/` fundido em `exercises/`, no padrão de `materials/` |
| §13 Índices | Listas dos `<Card>` viraram badges nos 8 guias que ainda usavam bullets |
| §14 Índice da DW | 76 badges cobrindo todas as páginas dos guias; títulos e rótulos das páginas movidas corrigidos |
| §15 Páginas de tópico | 6 páginas de tópico na DW; sidebar reduzida de 76 links para 12 |

### Desvios em relação ao plano

1. **`ecmascript/async/promises.mdx` virou duas páginas.** O plano deixava a
   escolha em aberto entre rebaixar headings ou dividir; dividir preservou a
   estrutura original de duas aulas da DW e resolveu o sumário duplicado.
2. **A reorganização de `examples/` foi antecipada** para antes dos merges de
   conteúdo, para que as páginas migradas já nascessem com os caminhos finais.
3. **`Sidebar.astro` não foi alterado.** O problema de contexto foi resolvido por
   arquitetura de conteúdo, não por código — veja a seção [15](#15-páginas-de-tópico-na-disciplina).

### Achado adicional durante a execução

Além das regressões do §1, **13 páginas dos guias de HTML e ECMAScript tinham o
link "Materiais:" apontando para `../<slug>/`** em vez do caminho de slides — o
mesmo tipo de reescrita malfeita que apagou os `import`. Todas corrigidas.

### Pendências conhecidas

- `pnpm validate` continua falhando no passo de lint, por causa dos docs
  vendorizados do Bootstrap em `examples/css/frameworks/bootstrap/docs/` — o
  mesmo comportamento já existia em `main`, sob o caminho antigo.
- Faltam slides e mapas mentais para as páginas dos 5 guias novos e para
  `ecmascript/stdlib/date` e `ecmascript/reference/cheat-sheet`.
- Os 14 projetos órfãos de `examples/` seguem órfãos.

---

## 12. Fusão de `braincheck/` em `exercises/`

`braincheck/` e `exercises/` mantinham índices para a **mesma aula**, em árvores
separadas, cada uma com um `index.md` por página. Os dois viraram um só diretório
seguindo exatamente a convenção de `materials/`: caminho espelhando a página do
guia, e o tipo de material no sufixo do arquivo.

| Antes | Depois |
| --- | --- |
| `exercises/courses/cstrc-jp-dw/html/index.md` | `exercises/courses/html/basics/syntax-structure.exercise.md` |
| `braincheck/courses/cstrc-jp-dw/html/index.md` | `exercises/courses/html/basics/syntax-structure.braincheck.md` |

O diretório `braincheck/` deixou de existir. A convenção fica assim:

```
materials/courses/<guia>/<seção>/<página>.slide.md
materials/courses/<guia>/<seção>/<página>.mindmap.md
exercises/courses/<guia>/<seção>/<página>.exercise.md
exercises/courses/<guia>/<seção>/<página>.braincheck.md
```

Nenhum script de build ou skill lia esses diretórios, então a fusão não exigiu
mudança de código. O título e o link "Página base" dos dois arquivos foram
atualizados de "HTML: Introdução" para o nome atual da página do guia.

---

## 13. Badges nos índices dos guias

`typescript/index.mdx` e `python/index.mdx` já listavam suas páginas como badges
(`<div class="page-badges">` + `<a class="page-badge">`), enquanto os outros oito
guias usavam listas com marcadores dentro do `<Card>`. Os oito foram alinhados ao
padrão: **71 badges** em `html`, `css`, `ecmascript`, `web-api`, `nodejs`,
`express`, `database` e `packages`.

Duas correções vieram junto:

1. **`.page-badge` era `inline-flex` com `line-height: 1`.** Rótulos longos —
   "Strings e Template Literals", "Arrays e Métodos Funcionais" — quebravam em
   duas linhas e o texto vazava para fora da borda do badge. Passou a
   `inline-block` com `line-height: 1.35`. O bug já existia no índice da DW, onde
   há badges de duas e três linhas; os 52 badges de lá também foram corrigidos.
2. **Os 48 badges do índice da DW apontavam para as URLs antigas**, resolvendo por
   redirect. Agora apontam direto para as páginas dos guias, como a sidebar.

Verificado no navegador: 19 badges no índice de ECMAScript, 52 no da DW e 15 na
página de introdução — nenhum com texto vazando.

---

## 14. Índice da disciplina reconstruído

A página `/courses/cstrc-jp-dw/` listava só as 48 páginas que existiam antes da
migração. Foi reconstruída com **76 badges**, cobrindo todas as páginas dos guias
que fazem parte do roteiro da disciplina.

| Card | Badges |
| --- | --- |
| Web e HTML | 7 |
| CSS | 11 |
| JavaScript | 19 |
| Web APIs e Pacotes | 10 |
| Node.js e Express.js | 14 |
| Banco de Dados | 6 |
| Projetos Práticos | 5 |
| Avaliações e Projeto | 4 |

As 26 páginas que estavam de fora eram, em boa parte, conteúdo que **só existe
depois da migração**: as três páginas de elementos do guia de HTML, sete páginas do
guia de CSS (incluindo Flexbox, Grid e a nova `at-rules`), `basics/types` do split
de variáveis, os fundamentos de Node.js e Express que a DW nunca listou, e os
quatro projetos práticos.

### Títulos e rótulos das páginas movidas

Os arquivos migrados carregavam prefixos herdados que ficaram errados no destino:
`"Pacotes: Axios"` dentro do Guia de Web APIs, `"Pacotes: Bootstrap"` dentro do de
CSS, `"Browser: ..."` para páginas de um guia que se chama Web APIs. **38 páginas**
tiveram `title` e `sidebar.label` acertados, seguindo a convenção que os guias de
HTML e ECMAScript já usavam: título com o prefixo do guia, rótulo curto sem ele.
As páginas do guia de CSS seguem o estilo do próprio guia, sem prefixo.

---

## 15. Páginas de tópico na disciplina

Resolve a pendência que restava do §11: a sidebar da DW listava as 76 aulas
diretamente nos guias, então **qualquer clique tirava o aluno do contexto da
disciplina** — `Sidebar.astro` escolhe o grupo pelo `course:` do frontmatter, e a
barra passava a mostrar "Guia de ECMAScript".

A solução foi de arquitetura de conteúdo, sem tocar em `Sidebar.astro`: seis páginas
de tópico dentro da própria disciplina, em `cstrc-jp-dw/topics/`. Cada uma traz uma
introdução que situa o tópico **nesta** disciplina — por que ele está ali, o que
esperar dele, como se conecta ao projeto — seguida do índice de badges com as aulas.

| Tópico | Aulas |
| --- | --- |
| `topics/web-html` | 7 |
| `topics/css` | 11 |
| `topics/javascript` | 19 |
| `topics/web-apis` | 10 |
| `topics/node-express` | 14 |
| `topics/database` | 6 |

O aluno agora percorre a disciplina sem sair dela e só troca de contexto ao abrir uma
aula específica — momento em que a sidebar do guia é, de fato, a navegação certa.

### Efeitos

- **Sidebar da DW: de 148 para 32 linhas de configuração**, e de ~76 links
  navegáveis para 12 — os seis tópicos, mais Projetos e Avaliações.
- **O índice da disciplina deixou de repetir os 76 badges.** Virou uma grade de oito
  `<LinkCard>` apontando para os tópicos, cada um com a contagem de aulas. Os badges
  vivem só nas páginas de tópico, sem duplicação.
- O roteiro em `<Steps>` da página inicial, que ainda apontava para as URLs antigas
  via redirect, passou a apontar para os tópicos.
