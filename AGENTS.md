# AGENTS.md

Instruções para agentes de IA que trabalham neste repositório.

O [`README.md`](README.md) é a documentação humana e continua sendo a **fonte da
verdade** sobre arquitetura, componentes e publicação. O [`docs/PRD.md`](docs/PRD.md)
descreve os requisitos do produto e objetivos. Este arquivo diz **como
trabalhar** aqui: o que nunca quebrar, qual fluxo seguir e o que validar antes de
entregar. Em caso de conflito, o README vence — e este arquivo deve ser corrigido.

## O que é o DevLab

Portal de disciplinas e guias de programação, construído com **Astro 7 + Starlight**
e publicado no GitHub Pages sob um `base` (`/devlab`). O conteúdo é escrito em
Markdown/MDX e o código dos tópicos e exemplos existe de verdade, em projetos executáveis.

| Dimensão                      | Estado atual                                  |
| ----------------------------- | --------------------------------------------- |
| Cursos e guias                | 14 (`src/lib/courses.ts`)                     |
| Páginas de tópicos            | 255 arquivos `.mdx`                           |
| Projetos executáveis          | 77 projetos em `examples/courses/`            |
| Slides / mapas mentais        | 66 / 66 em `materials/`                       |
| Devcontainers (Codespaces)    | 24 pastas em `.devcontainer/`                 |
| Idioma                        | Português do Brasil                           |

## Regras invioláveis

1. **Código de tópicos não é copiado para o Markdown.** Código que roda mora em
   `examples/` e entra na página por `<SourceCode path="…" />`. Blocos escritos à mão
   só para o que **não** existe em `examples/`: pseudocódigo, comparações
   "antes/depois", trechos ilustrativos e comandos de terminal.
2. **Links internos são relativos** — nunca escreva o `base` (`/devlab/…`) à mão. As
   URLs terminam em barra (`trailingSlash: 'always'`), então de um tópico o vizinho é
   `../outro-topico/` e uma pasta vizinha é `../../database/sql/`.
3. **Nunca edite artefatos gerados**: `dist/`, `.astro/`, `public/slides/`,
   `public/mindmaps/`, `public/examples/`. Eles saem do build — edite a origem
   (`materials/`, `examples/`, `src/`).
4. **Escreva em português do Brasil** para conteúdo didático, páginas de tópicos, comentários de código e nomes de seção. Nomes de arquivo e slugs ficam em **inglês kebab-case**. **Especificações (`specs/`) e mensagens de commit devem ser escritas em inglês.** No código (variáveis, funções, tipos e rotas), use o **inglês** ao máximo, a não ser que sejam textos de interface do usuário (front-end em PT-BR) ou termos específicos de domínio.
5. **`examples/` não faz parte do workspace.** Cada projeto tem `package.json` e
   `node_modules` próprios; o build da documentação e o CI não instalam Express,
   Prisma nem nada de lá. Não adicione esses projetos ao workspace raiz.
6. **Não instale dependência nova sem pedir.** A stack é fechada e o CI é
   `--frozen-lockfile`. Cada projeto de `examples/` deve documentar em seu próprio `README.md` ou `PRD.md` a motivação e utilidade das dependências utilizadas.
7. **Atualize a documentação `.md` sempre que necessário.** Sempre que alterar convenções, rotas, estrutura de diretórios, regras de projeto ou fluxos de trabalho, atualize imediatamente os arquivos de documentação correspondentes (`AGENTS.md`, `README.md`, `docs/PRD.md`, `docs/TODO.md` ou `specs/`). A documentação deve refletir fielmente o estado real do repositório a cada entrega.
8. **Valide alterações em skills com builds reais.** Sempre que alterar diretrizes, regras ou templates de uma skill em `.agents/skills/` (como `marp-slides-generator`, `markmap-mindmap-generator` ou `devlab-topic-docs-generator`), valide na prática aplicando os ajustes em um material/tópico de teste, execute o build correspondente (`pnpm build:slides`, `pnpm build:mindmaps` ou `pnpm build`) e inspecione o resultado gerado para garantir que a saída final reflete fielmente o comportamento esperado.

## Comandos

Requer **Node.js 22+** e **pnpm 10+**. Use `pnpm`, nunca `npm` ou `yarn`, na raiz.

| Comando                | O que faz                                                    |
| ---------------------- | ------------------------------------------------------------ |
| `pnpm dev`             | Build de materiais + servidor em `http://localhost:4321/devlab/` |
| `pnpm build`           | Materiais + site estático em `dist/` + previews públicas      |
| `pnpm build:fast`      | Pula a regeneração de slides/mapas (iteração rápida)          |
| `pnpm check`           | `astro check` (tipos de componentes e frontmatter)            |
| `pnpm lint`            | Biome (lint + formatação)                                     |
| `pnpm lint:fix`        | Corrige o que for automático                                  |
| `pnpm check:links`     | Valida todos os links internos contra o `dist/`               |
| `pnpm check:doc-lines` | Confere `mark`/`collapse`/`lines` do `<SourceCode>`           |
| `pnpm validate`        | Tudo acima, na ordem do CI                                    |

Marp (slides) e markmap (mapas mentais) rodam via `pnpm build:materials`. Se o
`marp` não estiver disponível na máquina, use `pnpm build:fast` e diga isso ao
usuário em vez de mexer nos artefatos de `public/`.

## Mapa do repositório

| Caminho                     | Papel                                                        |
| --------------------------- | ------------------------------------------------------------ |
| `src/content/docs/courses/` | Conteúdo dos tópicos e guias, um diretório por curso/guia     |
| `src/components/`           | Componentes `.astro` do projeto (camadas finas sobre Starlight) |
| `src/lib/`                  | Leitura de `examples/`, catálogo de cursos e projetos, `withBase()` |
| `examples/courses/`         | Projetos executáveis, fonte única do código dos tópicos e guias |
| `materials/`                | `*.slide.md` (Marp) e `*.mindmap.md` (markmap)                 |
| `exercises/`                | `*.exercise.md` e `*.braincheck.md`                            |
| `.devcontainer/`            | Uma pasta por projeto, para o botão "Abrir no Codespaces"      |
| `docs/PRD.md`               | Especificação de Requisitos do Produto (visão geral DevLab)   |
| `docs/TODO.md`              | Lista de tarefas e roadmap com IDs (`TASK-XXX`)               |
| `specs/`                    | Especificações e planos de engenharia (`active/` e `executed/`) |
| `CLAUDE.md`                 | Ponteiro para este arquivo; o Claude Code o carrega automaticamente |
| `.agents/skills/`           | Skills do repositório (ver abaixo)                             |
| `scripts/`                  | Builds de materiais e validadores (`check-links`, `check-doc-lines`) |
| `astro.config.mjs`          | Sidebar explícita de todos os cursos (~1.200 linhas)           |
| `site.config.mjs`           | `SITE_URL`, `BASE_PATH`, `REPO_URL`, `REPO_BRANCH`             |

Aliases disponíveis: `@components/*`, `@lib/*`, `@assets/*`.

## Especificações e Planejamento (`specs/`)

Ao planejar refatorações de grande porte, migrações ou novas funcionalidades complexas:

1. **Criar a spec em inglês em `specs/active/spec-XXX-<name-in-kebab-case>.md`**: documente em inglês o diagnóstico, os objetivos, o planejamento por etapas e a validação esperada. Use um ID sequencial de 3 dígitos com o prefixo `spec-` (ex: `spec-001-guides-migration.md`) e nome em minúsculas kebab-case.
2. **Executar as tarefas**: realize as alterações de forma incremental com commits atômicos em inglês (referenciando as tarefas em `docs/TODO.md`).
3. **Mover ao concluir**: ao finalizar todas as etapas, atualize o status da spec para concluído e mova o arquivo para `specs/executed/spec-XXX-<name-in-kebab-case>.md` (`git mv specs/active/... specs/executed/...`).

### Quando escrever uma spec

Escreva quando **pelo menos um** destes sinais aparecer. Fora deles, a tarefa entra direto em `docs/TODO.md`:

- a mudança atravessa várias pastas ou vários cursos;
- o trabalho não termina em uma sessão e será retomado depois;
- existe ambiguidade real sobre o alvo, e decidir antes evita gerar na direção errada;
- a mudança é difícil de reverter (renomear slug, migrar conteúdo, trocar dependência).

### Anatomia de uma spec

Use as specs de `specs/executed/` como referência, principalmente a `spec-005-taskapi-model-project.md`. A estrutura mínima, com a pergunta que cada seção responde:

| Seção | Pergunta que responde | Regra |
| ----- | --------------------- | ----- |
| Cabeçalho | Em que pé está? | `Status`, `Date` e `Related` apontando a tarefa em `docs/TODO.md`. |
| `Context & Rationale` | Por que mexer nisso agora? | **Com números**: quantos arquivos, quantas ocorrências, qual regra deste arquivo está sendo violada. |
| `Objectives` | Como fica quando terminar? | Resultados observáveis, verificáveis por comando ou inspeção. |
| `Non-goals` | O que esta spec **não** vai fazer? | Obrigatória. É o que impede o escopo de crescer a cada sessão. |
| `Plan` | Em que ordem, com qual entrega por fase? | Fases numeradas; cada fase termina em um estado consistente e validável. |
| `Expected Validation` | O que prova que funcionou? | Comandos (`pnpm build`, `pnpm check:links`, `pnpm validate`) e o que inspecionar à mão. |
| `Result` | O que de fato foi entregue? | Preenchido no fim, com os números depois da mudança. |

Três regras que fazem a diferença na prática:

1. **Diagnóstico com medida, não com impressão.** "Muitas páginas duplicam código" não sustenta uma spec; "172 blocos escritos à mão em 33 páginas, contra 38 com `<SourceCode>`" sustenta.
2. **`Non-goals` é obrigatória.** Sem ela o trabalho cresce indefinidamente, e agentes de IA ampliam o pedido por padrão.
3. **Cada fase precisa deixar o repositório funcionando.** Se uma fase só faz sentido junto da seguinte, são a mesma fase.

Ao executar com um agente, aponte o arquivo e a fase (*"execute a fase 2 de `specs/active/spec-00N-...`, sem tocar no que está em Non-goals"*) em vez de redescrever o problema. Peça antes que ele aponte ambiguidades e contradições na spec: corrigir uma frase é mais barato do que corrigir o código gerado a partir dela.

## Fluxo para criar ou alterar um tópico

1. Localize o arquivo em `src/content/docs/courses/<curso>/<categoria>/<topico>.mdx`.
   Curso novo? Crie o diretório, o `index.mdx` e registre em `src/lib/courses.ts`.
2. Escreva o frontmatter: `title`, `description` (uma frase densa, vira `<meta>`),
   `course` (id do curso) e, quando útil, `sidebar.label` / `sidebar.order` e
   `project`.
3. Se o tópico mostra código que roda, **crie ou reaproveite o projeto em
   `examples/`** antes de escrever a página, e importe com `<SourceCode>`.
4. Registre a página na sidebar em `astro.config.mjs` — as sidebars são explícitas,
   não autogeradas; uma página fora dela existe mas não aparece na navegação.
5. **Sincronize os materiais (`materials/`)**: tanto ao criar quanto ao **editar** um tópico (inclusão, remoção ou ajuste de seções, conceitos ou código), verifique e atualize os slides (`materials/**/*.slide.md`) e o mapa mental (`materials/**/*.mindmap.md`) do tópico correspondente para manter paridade com o `.mdx`.
6. Rode `pnpm build && pnpm check:links && pnpm check:doc-lines`.

Página nova de projeto (não de conceito) abre com `<ProjectLinks>` e, se for entrar
na homepage, entra também em `src/lib/projects.ts` — os cartões apenas percorrem essa
lista.

## Convenções de escrita

A estrutura completa dos tópicos está em
[`.agents/skills/devlab-topic-docs-generator/SKILL.md`](.agents/skills/devlab-topic-docs-generator/SKILL.md).
O essencial:

- **Terminologia padrão**: Use **"tópico"** (unidade de conhecimento/conceitual) ou **"página"** (documento/interface) em vez de "aula" no conteúdo didático e nos cabeçalhos.
- **Ordem do tópico**: parágrafo de abertura → linha `Materiais:` (só se os arquivos
  existirem) → `## Objetivo` → seções de conteúdo → `## Executando` →
  `## Exercício` → `## Desafio` → `## Perguntas de revisão` → `## Referências` →
  `## Próximo tópico`. `Objetivo`, `Exercício` e `Próximo tópico` são obrigatórios.
- **Sempre um parágrafo antes de qualquer elemento que difere de `<p>` (tabelas, listas, imagens, diagramas ou blocos de código).** Nada de elemento colado em título ou em outro elemento sem texto introdutório: o texto apresenta o contexto, diz o que observar e conecta a explicação ao elemento.
- **Evite travessões (`—`) para orações intercaladas e apostos.** Esse formato é considerado um antipadrão e vício de escrita de IA. Utilize a pontuação gramatical padrão da língua portuguesa: vírgulas (`,`), parênteses (`(...)`), dois-pontos (`:`) ou períodos diretos.
- **Nunca uma subseção isolada.** Se `### A` existe, `### B` também precisa existir;
  caso contrário, o conteúdo vira texto corrido da seção-mãe.
- **Diagramas em Mermaid** (`<Mermaid>` ou fence ```mermaid```), não em imagem.
- **Página de conceito ≠ página de projeto.** Conceito mostra 5–15 linhas
  autocontidas; o arquivo inteiro, a árvore de diretórios, o `package.json` e o passo
  a passo de execução ficam na página de projeto. Cada uma linka a outra.
- **Todo bloco que se apresenta como arquivo tem que ser um arquivo.** Se o fence traz
  `title="src/…"`, ele precisa ser um `<SourceCode>`. Blocos escritos à mão são para
  pseudocódigo, esqueletos e comandos — e, nesses casos, ficam **sem** `title` de
  arquivo. A única exceção é a comparação antes/depois (`del`/`ins`), onde o título
  orienta e os marcadores deixam claro que aquilo é uma transição.
- **`.md` por padrão, `.mdx` quando precisar de componente.** Na prática hoje todas
  as 255 páginas são `.mdx`, porque quase todo tópico usa `<Aside>` ou `<SourceCode>`.
- Em `.mdx`, importe **apenas** o que for usado.

## Componentes

Antes de criar um componente, verifique se o Starlight já resolve (`Aside`, `Badge`,
`Card`, `CardGrid`, `LinkCard`, `Steps`, `Tabs`, `TabItem`, `Icon`, `Code`). Os
componentes do projeto são camadas finas sobre eles:

| Componente             | Para quê                                                   |
| ---------------------- | ---------------------------------------------------------- |
| `<SourceCode>`         | Código a partir de um arquivo real (`path`, `lines`, `region`) |
| `<CodeTabs>`           | Vários arquivos reais em abas                               |
| `<HtmlPreview>`        | Como o navegador renderiza um HTML real (iframe `sandbox=""`) |
| `<FileTree>`           | Árvore de arquivos escrita como texto                       |
| `<PackageManagerTabs>` | npm / pnpm / yarn sincronizados no site inteiro             |
| `<ApiRequest>` / `<ApiResponse>` | Requisição e resposta HTTP                        |
| `<ProjectLinks>`       | Botões GitHub + Codespaces de uma página de projeto         |
| `<ProjectCard>`        | Cartão de projeto vindo de `src/lib/projects.ts`            |
| `<Mermaid>`            | Diagramas                                                   |

Detalhes de props, regiões `#region`, `mark`/`ins`/`del`/`collapse` e as ressalvas do
Expressive Code estão no README, seção "Componentes".

Ao usar `lines` ou `region`, escreva os intervalos de `mark`/`ins`/`del` com a
**numeração original do arquivo** — a mesma que a régua mostra. O `<SourceCode>` os
reposiciona sozinho e descarta o que cai fora do trecho.

## Projetos em `examples/`

Ao criar um projeto novo:

1. `package.json` próprio, `"private": true`, `"type": "module"`, scripts `dev` e
   `start`.
2. `README.md` curto com rotas e como executar.
3. Uma pasta em `.devcontainer/` (copie a mais próxima e ajuste `name`,
   `workspaceFolder`, `postCreateCommand`, `postAttachCommand`).
4. Registro em `src/lib/projects.ts` se for aparecer na homepage.
5. `// #region <nome>` / `// #endregion` para marcar os trechos que a aula recorta —
   essas linhas nunca aparecem na documentação.

Nada mais é necessário: `examples/**` já é diretório autorizado para leitura em build
time (`import.meta.glob`, sem acesso a filesystem no navegador e sem traversal).

**Arquivos que começam com ponto não são alcançáveis pelo `<SourceCode>`** — o glob não
casa dotfiles, e é isso que mantém `.env` fora da documentação. Para exibir um
`.env.example` ou um `.dockerignore`, escreva o bloco à mão e mantenha-o igual ao
arquivo.

### Trilhas TaskAPI, InvestApp e MonitorApp

As três são **cumulativas por construção**: cada etapa parte da anterior e acrescenta
uma camada. Ao mexer em uma etapa, verifique se a mudança precisa propagar para as
seguintes.

| Trilha | Papel | Etapas |
| ------ | ----- | ------ |
| **TaskAPI** (`task-api-*`) | Projeto modelo do guia — **só API**, sem front-end, Docker à parte na etapa 12. É de onde as páginas de conceito recortam código. | `hello` → `router` → `mvc` → `typescript` → `validation` → `openapi` → `sqlite` → `prisma` → `auth` → `hardening` → `services` → `test` |
| **InvestApp** (`invest-app-*`) | Aplicação completa, com front-end, backlog e infraestrutura | `static` → `api` → `typescript` → … |
| **MonitorApp** (`monitor-app-*`) | Idem, no domínio de monitoramento | `static` → `api` → `typescript` → … |

A distinção importa: **página de conceito recorta da TaskAPI**; InvestApp e MonitorApp
são as aplicações que o aluno constrói. Não acrescente front-end nem Docker às etapas 1
a 11 da TaskAPI — é isso que a mantém distinta das outras duas.

Convenções dessas trilhas, já estabelecidas no código:

- **Express 5**, sem `express-async-errors` (o Express 5 já encaminha rejeições).
- **TypeScript da terceira etapa em diante** (quarta, na TaskAPI). InvestApp e
  MonitorApp usam `tsx`; a TaskAPI executa `.ts` nativamente, sem `tsx` e sem build.
- **Autenticação sem dependência externa**: `node:crypto` para hash de senha e para
  assinar o JWT. Não instale `bcrypt`, `jsonwebtoken` nem `dotenv`.
- **Zod** para validação estrita de `body`, `query` e `params`.
- **Prisma 7** com driver adapter (`@prisma/adapter-better-sqlite3`) nas etapas
  atuais; projetos antigos ainda em Prisma 5/6 e Express 4 são legado — não os
  migre de passagem.

Conteúdo de Python usa **`uv`** para ambiente e execução, nunca `venv` + `pip`.

## Materiais: slides e mapas mentais

`materials/courses/<curso>/<categoria>/<topico>.slide.md` vira
`/slides/courses/<curso>/<categoria>/<topico>/`, e `.mindmap.md` vira
`/mindmaps/…` — o caminho espelha o da aula. Só cite na linha `Materiais:` o que
existe; um link para material inexistente quebra o `pnpm check:links`. Não linke
arquivos `.excalidraw`: eles não são copiados para `public/`.

No `pnpm dev` não é preciso parar o servidor para revisar um material: salvar o
`.slide.md` ou o `.mindmap.md` regenera apenas aquele arquivo e recarrega a aba
aberta, e as URLs de diretório (`/slides/…/`) resolvem o `index.html` sozinhas. O
comportamento vem de `scripts/vite-plugin-materials-dev.mjs`, que só atua em
desenvolvimento e não altera o build de produção.

## Estilo de código

- **Biome** com aspas simples, ponto e vírgula, vírgula final `es5`, indentação de 2
  espaços e largura de 100 colunas. Rode `pnpm lint:fix` antes de entregar.
- **TypeScript strict** (`astro/tsconfigs/strict` + `verbatimModuleSyntax`).
- Nos componentes, use os tokens do tema (`sl-accent`, `sl-gray-*`, `text-sl-h5`…)
  em vez de cores fixas, para que dark/light funcione sozinho.
- `examples/` fica fora do Biome e do `tsconfig` da raiz — cada projeto tem as
  próprias regras.
- **Idioma dos identificadores de código**: Use inglês ao máximo para nomes de variáveis, funções, classes, métodos, tipos e rotas, reservando o português do Brasil para textos de interface de usuário (front-end) ou termos de domínio específicos.

## Commits e Mensagens

- **Commits granulares e atômicos**: Faça commits pequenos, focados e frequentes à medida que conclui etapas lógicas ou tarefas, sem acumular grandes volumes de edições em um único commit.
- **Prefixos padronizados (Conventional Commits) em inglês**:
  - `feat:` nova funcionalidade, página de aula ou componente.
  - `fix:` correção de erro, bug ou link quebrado.
  - `docs:` atualizações em documentação, textos de aula, `TODO.md` ou `AGENTS.md`.
  - `style:` ajustes de formatação, layout, CSS ou lint.
  - `refactor:` reestruturação de código sem alteração de comportamento.
  - `test:` criação ou ajuste de testes.
  - `chore:` manutenção de scripts, dependências ou configurações do projeto.
- **Mensagens e referências a Tasks em inglês**: Sempre escreva a mensagem do commit em inglês. Quando o commit estiver associado a uma tarefa de [`docs/TODO.md`](docs/TODO.md), inclua a tag do ID no commit (ex: `docs: [TASK-001.1] add express guide`).

## Antes de terminar

Rode o que o CI roda:

```bash
pnpm validate
```

Isso encadeia `lint` → `check` → `build` → `check:links` → `check:doc-lines`. Se
alterou `<SourceCode>` ou o arquivo apontado por ele, `check:doc-lines` é o que pega
citação de linha desatualizada. Relate falhas com a saída real; não declare validado
o que não rodou.

**Toda entrega de conteúdo passa pela revisão.** Depois de criar ou alterar uma página,
um deck de slides, um mapa mental ou um diagrama, aplique a skill `devlab-content-reviewer`
ao que foi produzido e relate o resultado junto da entrega. A geração termina no relatório de
revisão, não no arquivo salvo: o gerador escreve, o revisor confere, e os dois papéis não são
exercidos com a mesma atenção quando ficam na mesma passagem.

## Skills do repositório

Em `.agents/skills/`, use quando a tarefa for a delas:

| Skill                        | Quando                                            |
| ---------------------------- | ------------------------------------------------- |
| `devlab-topic-docs-generator`| Criar, expandir ou ampliar uma página de aula     |
| `devlab-content-reviewer`    | Revisar/auditar página, diff ou curso já escrito  |
| `devlab-quiz-coverage`       | Varrer as questões do BrainCheck e achar assunto cobrado sem conteúdo |
| `devlab-release-generator`   | Gerar versão (SemVer), CHANGELOG.md e tag Git     |
| `marp-slides-generator`      | Deck `.slide.md` de um tópico                     |
| `markmap-mindmap-generator`  | Mapa mental `.mindmap.md`                         |
| `excalidraw-generator`       | Diagrama/slides no estilo lousa (`.excalidraw`)   |

As skills de slides e mapas mentais utilizam o diretório `materials/`, com os sufixos `.slide.md` e `.mindmap.md`.

### Validação ao alterar Skills

Sempre que modificar instruções, regras ou templates de uma skill em `.agents/skills/`:
1. **Valide no arquivo em foco**: aplique e confira os ajustes no arquivo de material/tópico trabalhado, sem modificar outras páginas existentes desnecessariamente.
2. **Execute o build correspondente** (`pnpm build:slides`, `pnpm build:mindmaps` ou `pnpm build`).
3. **Inspecione o artefato gerado** (ex: o HTML em `public/slides/...` ou o resultado renderizado) para assegurar que a saída final segue fielmente o comportamento esperado.
4. **Rode a validação geral** (`pnpm validate`) antes de concluir a entrega.

## O que evitar

- Duplicar código de `examples/` dentro da página.
- Escrever `/devlab/` em links de conteúdo.
- Criar componente novo para algo que o Starlight já faz.
- Editar `dist/`, `.astro/` ou `public/slides|mindmaps|examples`.
- Renomear rotas de curso sem atualizar `src/lib/courses.ts`, a sidebar em
  `astro.config.mjs` e os links relativos que apontam para elas.
- Migrar projetos legados de `examples/` "de passagem", sem pedido explícito.
