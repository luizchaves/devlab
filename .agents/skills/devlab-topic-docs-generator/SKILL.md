---
name: devlab-topic-docs-generator
description: >-
  Cria e mantém páginas de tópicos do DevLab em Astro Starlight (`.md` / `.mdx`) sob
  `src/content/docs/courses/`. Use sempre que o usuário pedir para criar, atualizar,
  expandir ou revisar um tópico de disciplina/guia (ECMAScript, Arrays, Strings,
  Funções, HTML, CSS, Express, Prisma, etc.).
---

# DevLab — Gerador de Páginas de Tópicos

Guia para escrever tópicos e guias do DevLab seguindo as convenções **reais** do repositório.

> **Fonte da verdade**: o `README.md` da raiz (seções "Como criar uma disciplina",
> "Como criar uma página `.md`", "Quando usar `.mdx`", "Componentes" e "Expressive Code").
> Em caso de conflito entre este guia e o README, o README vence — e este arquivo
> deve ser corrigido.

---

## 📁 Localização e nomes

```
src/content/docs/courses/<course-id>/<categoria>/<topico>.(md|mdx)
```

- `course-id` existentes: `dw-cstrc-jp` (Desenvolvimento Web), `lp2-ctii-jp`, `pw2-csbes-jp`.
- Categorias de `dw-cstrc-jp`: `html`, `css`, `javascript`, `browser`, `node`,
  `express`, `database`, `packages`, `projects`, `extra`.
- Nome do arquivo em **kebab-case, inglês**, igual ao slug da URL
  (`expressions-operators.mdx`, `error-handling.mdx`).
- A URL final tem **barra no fim** (`trailingSlash: 'always'`):
  `/courses/ecmascript/data/arrays/`.

### `.md` ou `.mdx`?

Use `.md` por padrão. Só troque para `.mdx` quando a página **precisar de componentes**:

| Precisa de…                                    | Extensão |
| ---------------------------------------------- | -------- |
| Texto, listas, tabelas, blocos de código        | `.md`    |
| Callouts `:::tip[Título]` … `:::`               | `.md`    |
| `<Aside>`, `<Steps>`, `<Tabs>`, `<Card>`        | `.mdx`   |
| `<SourceCode>`, `<CodeTabs>`, `<FileTree>`      | `.mdx`   |
| `<ApiRequest>`, `<ApiResponse>`, `<HtmlPreview>`| `.mdx`   |
| Expressões JS (`{projects.map(…)}`)             | `.mdx`   |

Tópicos longos de JavaScript normalmente acabam em `.mdx` (usam `<Aside>` e `<Steps>`);
tópicos curtos de conceito podem ficar em `.md` com `:::tip[…]`.

---

## 📄 Frontmatter

```mdx
---
title: "JavaScript: Arrays"
description: "Criação, geração de intervalos (range), manipulação, iteração, desestruturação, operador spread e principais métodos de Array em JavaScript."
course: dw-cstrc-jp
sidebar:
  label: Arrays
  order: 8
---
```

- `title`: prefixado pela trilha (`JavaScript: …`, `HTML: …`, `CSS: …`) e **idêntico**
  ao `title` dos slides e do mapa mental do mesmo tópico.
- `description`: uma frase densa listando o que a página cobre (vira `<meta>`).
- `course`: obrigatório nos tópicos (schema estendido em `src/content.config.ts`).
- `project`: opcional, aponta para um projeto de `examples/`.
- `sidebar.label`: rótulo curto para a navegação quando o `title` é longo
  (`label: "Map e Set"` para `title: "JavaScript: Map e Set"`). Usado em ~40% das páginas.
- `sidebar.order`: só tem efeito em disciplinas cuja sidebar usa `autogenerate`;
  `dw-cstrc-jp` tem sidebar **explícita** em `astro.config.mjs` (ver "Registro na sidebar").

Depois do frontmatter, em `.mdx`, importe **apenas** o que for usado:

```mdx
import { Aside, Card, CardGrid, Steps, Tabs, TabItem } from '@astrojs/starlight/components';
import SourceCode from '@components/SourceCode.astro';
import FileTree from '@components/FileTree.astro';
```

---

## 🔗 Linha de materiais

Logo após um parágrafo curto de abertura ("Este tópico apresenta…"), inclua a linha de
materiais quando existirem slides/mapa mental do tópico:

```mdx
Materiais: [slides do tópico](../../../../slides/courses/ecmascript/data/arrays/) e [mapa mental](../../../../mindmaps/courses/ecmascript/data/arrays/).
```

**Profundidade do `../`** — conte os segmentos da URL da página, não as pastas do disco:

| URL da página                                   | Prefixo          |
| ----------------------------------------------- | ---------------- |
| `/courses/<curso>/<categoria>/<topico>/`         | `../../../../`   |
| `/courses/<curso>/<topico>/` (ex.: `project`)    | `../../../`      |
| `/courses/<curso>/<categoria>/` (`index`)        | `../../../`      |

Só cite materiais que **existem** em `slides/` e `mindmaps/`. Não linke arquivos
`.excalidraw`: eles não são copiados para `public/` e o `pnpm check:links` quebra.

---

## 📐 Estrutura do tópico

Ordem observada nos tópicos de `ecmascript`. Nem toda seção é obrigatória,
mas **`Objetivo`, `Exercício` e `Próximo tópico` são**, e a ordem relativa deve ser mantida.

1. **Parágrafo de abertura** — o que o tópico apresenta, em 1–3 linhas.
2. **`Materiais: …`** — slides e mapa mental.
3. **`## Objetivo`** — 1 parágrafo denso ou lista curta com o que o leitor vai dominar.
4. **Seções de conteúdo** (`## …`, subdivididas com `### …`) — conceito a conceito,
   cada uma com: explicação → tabela comparativa quando houver taxonomia → bloco de
   código comentado → `<Aside>` de armadilha ou dica.
5. **`## Executando`** — passo a passo em `<Steps>` para rodar o exemplo
   (arquivo `.js` → `node arquivo.js` → bloco `txt title="Output"` → alternativa no
   navegador com `<kbd>F12</kbd>`).
6. **`## Exercício`** — enunciado numerado (5–10 itens), seguido de
   `<details><summary>Possível resposta</summary>` com a solução comentada.
7. **`## Desafio`** — variação mais difícil, mesmo formato de `<details>`.
8. **`## Perguntas de revisão`** — 8–12 perguntas em negrito e numeradas, agrupadas por
   `### <Subtema>`, cada uma com `<details><summary>Possível resposta</summary>`.
9. **`## Referências`** — links MDN/spec agrupados por assunto, formato
   `[Array | MDN](https://developer.mozilla.org/…)`.
10. **`## Próximo tópico`** — 1 frase de ligação + link relativo para o próximo tópico:
    `[Strings](../strings/): Criação, template literals e métodos do objeto String.`

Padrão do bloco de resposta:

```mdx
<details>
  <summary>Possível resposta</summary>

  `splice()` é mutador e altera o array original. `slice()` é acessor e devolve uma cópia.
</details>
```

---

## 🧪 Seções de Teste e Didática de Testes

Ao escrever ou atualizar seções de testes em aulas de conceito ou de projetos práticos:

1. **Parágrafos explicativos obrigatórios por teste**: Sempre inclua um parágrafo (`<p>` ou texto Markdown) antes de cada bloco de código ou caso de teste individual. Explique explicitamente a intenção do teste, o cenário avaliado, o código HTTP esperado e a razão de cada asserção.
2. **Requisições `.http` recolhíveis (`<details>`)**: Em testes de endpoints de API, forneça o trecho correspondente do arquivo `requests.http` em um bloco recolhível `<details><summary>Requisição .http correspondente</summary>...</details>`.

Exemplo:

```mdx
O teste a seguir valida a rota de cadastro. Ele garante que um payload válido retorna status `201 Created` e que dados sensíveis como a senha não são retornados no corpo da resposta.

<details>
  <summary>Requisição .http correspondente</summary>

  ```http
  POST http://localhost:3000/api/users
  Content-Type: application/json

  {
    "name": "Ana Maria",
    "email": "ana@example.com"
  }
  ```
</details>
```

---

## 🔀 Página de conceito × página de projeto

**Um tópico rende duas páginas, nunca uma só.** Conceito e projeto têm leitores e ritmos
diferentes: quem estuda *o que é um JWT* não quer rolar por dez arquivos de um app real,
e quem vai rodar o app não quer reler a teoria. Misturar os dois produz a página-despejo
— um título seguido de dez `<SourceCode>` sem texto entre eles.

| Página              | Onde vive                        | O que contém                                                                 |
| ------------------- | -------------------------------- | ---------------------------------------------------------------------------- |
| **Conceito**        | `<curso>/<categoria>/<topico>/`  | definição, diagrama, tabela comparativa, trechos **mínimos** e autocontidos, armadilhas, exercício, perguntas de revisão |
| **Projeto**         | `<curso>/practice/<projeto>/`    | árvore de arquivos, código real completo via `<SourceCode>`, passo a passo de execução, rotas, capturas de tela |

Regras de divisão:

1. A página de conceito só mostra o trecho **que ilustra a ideia** — cinco a quinze linhas,
   escritas à mão ou recortadas com `lines=` / `region=`. Nunca o arquivo inteiro.
2. Todo código completo, `package.json`, `.env.example`, `requests.http`, árvore de
   diretórios e captura de tela pertence à página de projeto.
3. Cada uma linka a outra: a de conceito termina apontando "veja aplicado em
   [Projeto X](../../practice/x/)"; a de projeto abre dizendo quais tópicos ela aplica.
4. Se um projeto aparece em dois tópicos de conceito, ele continua tendo **uma** página de
   projeto — os dois tópicos apontam para ela.
5. Materiais de turmas diferentes sobre a mesma aplicação (LP2, DW) viram **uma página de
   projeto por aplicação**, não seções "Exemplo completo (LP2)" penduradas no fim da página
   de conceito.

## 🔗 Botões de acesso ao código (GitHub e Codespaces)

**Toda página de projeto abre com `<ProjectLinks>`.** O aluno precisa de dois caminhos:
ler o código no GitHub e abrir um ambiente já configurado no GitHub Codespaces, sem
instalar nada na máquina.

```mdx
import ProjectLinks from '@components/ProjectLinks.astro';

<ProjectLinks path="examples/courses/expressjs/projects/mvc" devcontainer="express-mvc" />
```

| Prop           | Uso |
| -------------- | --- |
| `path`         | caminho do projeto no repositório, sem barra inicial (obrigatório) |
| `repo`         | repositório externo em `owner/name`; omita para o próprio DevLab |
| `branch`       | branch a abrir — usada nos projetos que evoluem por branch |
| `devcontainer` | pasta em `.devcontainer/`; omitida, é deduzida do último segmento de `path` (só no DevLab); `{false}` esconde o botão |
| `preview`      | URL de uma demonstração publicada, quando existir |

O botão do Codespaces só funciona se existir `.devcontainer/<pasta>/devcontainer.json` no
repositório. Ao criar um projeto novo em `examples/`, crie também a pasta correspondente
(copie a mais parecida e ajuste `name`, `workspaceFolder`, `postCreateCommand` e
`postAttachCommand`) — o `.devcontainer/README.md` descreve cada campo. Sem a pasta,
passe `devcontainer={false}` em vez de deixar um botão que leva a erro.

Projetos que moram em outro repositório — o material de uma disciplina, por exemplo — usam
as props `repo` e `branch`. É assim que uma aplicação que evolui por branch ganha uma página
por etapa, cada uma abrindo o Codespaces já na branch certa:

```mdx
<ProjectLinks repo="luizchaves/lp2-2026" branch="sqlite" path="classroom/back-end/investment-api" />
```

Em repositório externo a pasta de `.devcontainer/` **não** é deduzida: sem a prop, o
Codespaces sobe com a imagem padrão na branch indicada — suficiente para um projeto Node que
só precisa de `npm install`.

## 📝 Regra do parágrafo de entrada e didática do texto

**Apresentação e explicação obrigatórias de qualquer elemento que difere de `<p>`:**
Toda tabela, lista, imagem, diagrama (`<Mermaid>`), bloco de código (fence ou `<SourceCode>`),
preview interativo (`<HtmlPreview>`), grade de cartões (`<CardGrid>`) ou callout (`<Aside>`)
deve ser obrigatoriamente apresentado, contextualizado e explicado por um parágrafo (`<p>`)
anterior.

**Nenhum elemento não-`<p>` colado em título ou em outro elemento:**
1. **Nunca cole um elemento logo abaixo de um título**: sempre escreva ao menos um parágrafo
   explicativo entre o `##`/`###` e a tabela, lista, imagem, diagrama ou código.
2. **Nunca encadeie elementos sem texto explicativo intermediário**:
   - Uma lista seguida diretamente de uma tabela precisa de um parágrafo de ligação e introdução.
   - Uma tabela seguida de um bloco de código precisa de uma frase explicativa entre eles.
   - Dois blocos de código consecutivos precisam de uma frase contextualizando o que o segundo bloco demonstra.
   - Um callout (`<Aside>`) seguido de uma tabela ou diagrama precisa de texto introdutório antes do elemento visual.
3. **Exceções**: blocos de código encadeados diretamente dentro de `<Steps>` (onde os itens
   numerados já exercem a função condutora) e blocos de saída (`txt title="Output"`) que sucedem
   imediatamente o comando de execução.

**Uso de parágrafos curtos e didáticos:** Prefira fragmentar as explicações em múltiplos
parágrafos curtos em vez de criar blocos de texto longos e monolíticos. O uso frequente de
parágrafos espaçados torna a leitura mais fluida, melhora a escaneabilidade do conteúdo e
ajuda o estudante a absorver cada conceito passo a passo.

Exemplos de correção de encadeamento:

Errado (tabela colada no título ou lista sem introdução da tabela):

```mdx
### A Evolução dos Nomes

1. **Mocha** (1995): protótipo.
2. **LiveScript** (1995): lançamento comercial.

| Nome | Ano | Contexto |
| :--- | :--- | :--- |
| **Mocha** | 1995 | Protótipo. |
```

Certo (com parágrafo introdutório apresentando a tabela):

```mdx
### A Evolução dos Nomes

A linguagem passou por transições rápidas nos seus primeiros meses de vida:

1. **Mocha** (1995): protótipo.
2. **LiveScript** (1995): lançamento comercial.

A tabela a seguir resume essa cronologia e o contexto histórico de cada mudança de nome:

| Nome | Ano | Contexto |
| :--- | :--- | :--- |
| **Mocha** | 1995 | Protótipo. |
```

O parágrafo de entrada de um elemento visual ou bloco de código costuma terminar em dois-pontos
e nomear explicitamente o que o leitor observará ("O exemplo a seguir demonstra as principais formas de declarar arrays:", "A tabela abaixo compara as principais diferenças de ambiente:").

### 🚫 Proibição de travessões (`—`) para orações intercaladas e apostos

**Não utilize travessões (`— ... —` ou `—`) para isolar orações intercaladas, apostos explicativos, exemplos ou comentários.** O uso de travessões no meio de períodos é considerado um antipadrão e vício de escrita gerada por IA.

Em vez de travessões, utilize a pontuação padrão da língua portuguesa:
1. **Vírgulas (`,`)**: para apostos e orações explicativas fluidas.
   - *Errado:* `Com o surgimento de implementações concorrentes — como o JScript da Microsoft —, a Netscape...`
   - *Certo:* `Com o surgimento de implementações concorrentes, como o JScript da Microsoft, a Netscape...`
2. **Parênteses (`(...)`)**: para esclarecimentos adicionais, siglas, formatos ou listagens pontuais.
   - *Errado:* `As interfaces do navegador — DOM, eventos, armazenamento e rede — e as ferramentas...`
   - *Certo:* `As interfaces do navegador (DOM, eventos, armazenamento e rede) e as ferramentas...`
3. **Dois-pontos (`:`) ou períodos separados**: para explicações que concluem um raciocínio.
   - *Errado:* `O comando acima imprime cada passo da busca — a ferramenta certa quando um import falha.`
   - *Certo:* `O comando acima imprime cada passo da busca: é a ferramenta certa quando um import falha.`

---

## 🧱 Subseções e diagramas

**Subseção isolada não se justifica.** Só abra `###` dentro de um `##` quando houver **duas
ou mais** — uma única subseção é apenas o corpo da seção com um título a mais. Se sobrar uma
sozinha, dissolva o título no texto ou promova a subseção a `##`.

Errado:

```mdx
## Operadores lógicos

### Curto-circuito

...texto único...
```

Certo:

```mdx
## Operadores lógicos

...texto...

### Curto-circuito

...

### Precedência entre and e or

...
```

Isso também mantém o índice lateral limpo: o `tableOfContents` do site vai até o nível 3.

### Diagramas e Recursos Visuais

**Obrigatoriedade de Recursos Visuais**: Sempre que a aula abordar conceitos abstratos, arquiteturas, fluxos de execução, hierarquias, eixos de layout (como Box Model, Flexbox, Grid, escopos, ciclo de vida) ou comparações de modelos, **é obrigatório incluir diagramas visuais ou recursos gráficos** para reforçar a didática.

**Obrigatoriedade de Legenda / Caption**: **Todo diagrama, figura ou imagem deve obrigatoriamente possuir uma legenda ou título descritivo (`caption`)**.
- Em diagramas `<Mermaid>`, o atributo `title="..."` é **obrigatório** (ex: `<Mermaid title="Fluxo de execução da Fetch API">`).
- Em imagens ou figuras estáticas (`![...]`), inclua a legenda/descrição explicativa de forma clara no atributo `alt` e/ou em um texto de legenda associado.
- Em blocos de código e saídas, forneça o atributo `title="..."` (ex: ````js title="Exemplo de manipulação do DOM"````).

**Orientação Vertical de Diagramas (Responsividade)**: **Se um diagrama ou figura for muito extenso na horizontal, ele deve ser obrigatoriamente reestruturado na vertical**.
- Em diagramas `<Mermaid>`, prefira `flowchart TD` (Top-Down) ou organize os nós em subgrafos empilhados para evitar vazamentos laterais e barra de rolagem em dispositivos móveis.

1. **Diagramas Mermaid (`<Mermaid>`)**:
   Diagramas de fluxo, sequência, hierarquia, estado e entidade-relacionamento são escritos como texto usando o componente `<Mermaid>` (`@components/Mermaid.astro`), que se ajusta automaticamente ao tema claro/escuro da página:

   ```mdx
   import Mermaid from '@components/Mermaid.astro';

   <Mermaid title="Do arquivo à execução">
   {`
   flowchart LR
     A[main.py] --> B[Bytecode]
     B --> C[Máquina Virtual]
   `}
   </Mermaid>
   ```

   - O diagrama vai entre crases dentro de `{...}` (como em `<FileTree>`), para evitar que o MDX interprete chaves e setas no texto.
   - Utilize estilos e cores (`style NoID fill:#...`) quando a diferenciação de áreas for didaticamente relevante (ex: camadas do Box Model, eixos do Flexbox).
   - Prefira Mermaid a desenho ASCII quando o diagrama tiver caixas e ligações; mantenha ` ```txt ` apenas para saídas de terminal, estruturas de arquivo e esquemas monoespaçados.
   - **Diagramas de Classe (`classDiagram`)**: **Obrigatório para tópicos de Classes/POO**. Toda aula ou tópico que abordar Classes e Programação Orientada a Objetos (POO) deve obrigatoriamente incluir um diagrama de classe Mermaid (`classDiagram`) ilustrando a estrutura das classes, atributos, métodos e relacionamentos de herança (`extends`):

     ```mdx
     <Mermaid title="Diagrama de Classes (UML / POO): Herança entre User e Admin">
     {`
     classDiagram
         class User {
             +String name
             +String email
             +getProfile() String
         }
         class Admin {
             +Array permissions
             +getProfile() String
         }
         User <|-- Admin : extends
     `}
     </Mermaid>
     ```

2. **Previews Interativos (`<HtmlPreview>`)**:
   Para tópicos de HTML/CSS que envolvem componentes visuais, utilize `<HtmlPreview path="examples/..." />` para exibir uma prévia viva renderizada.

3. **Imagens e Ilustrações**:
   Para capturas de tela ou esquemas gráficos estáticos, inclua imagens otimizadas sempre com legenda/caption clara e o atributo `alt` totalmente descritivo.

Diagramas Mermaid não funcionam nos slides Marp nem nos mapas mentais Markmap — lá continue com ASCII.

---

## 💻 Blocos de código (Expressive Code)

Configuração em `ec.config.mjs`. Convenções em uso:

- Linguagem sempre declarada; use ` ```js ` (não `javascript`), ` ```html `, ` ```css `,
  ` ```json `, ` ```bash `, ` ```txt `.
- **Sempre** dê um `title` descritivo: ` ```js title="Formas de criação de Arrays" `.
- Terminal: ` ```bash title="Terminal" ` (o frame de terminal é automático para
  `bash,sh,shell,zsh,console,powershell`).
- **Demonstração do Resultado / Saída**: Exemplos de código CSS e HTML não devem ficar isolados apenas com a sintaxe. Sempre acompanhe o código de sua demonstração visual ou saída esperada:
  1. **Via `<HtmlPreview path="examples/..." />`**: para mostrar o resultado vivo renderizado pelo navegador a partir de arquivos reais em `examples/`.
  2. **Via ` ```txt title="Resultado na tela" ` ou comentários explicativos**: para demonstrar/descrever exatamente como o elemento é desenhado no navegador (dimensões finais, alinhamento ou efeito visual).
- Saída de execução de terminal ou navegador: ` ```txt title="Output" ` ou ` ```txt title="Resultado na tela" `.
- Recursos disponíveis quando ajudarem: `{3}` / `{1-5}` (destaque de linhas),
  `showLineNumbers`, `mark="…"`, `ins` / `del`, `collapse={2-8}`, `wrap`.
- Comentários dentro do código explicam entrada → transformação → saída, e o
  `console.log` mostra o resultado esperado em comentário (`// [ 10, 20 ]`).

**Prefira `<SourceCode>` a colar código de `examples/`**: ele lê o arquivo real e nunca
sai de sincronia.

```mdx
<SourceCode path="examples/dw/codes/express/hello/src/app.js" mark="8-12" />
```

---

## 🧩 Componentes disponíveis

Starlight (`@astrojs/starlight/components`):

- `<Aside type="tip|caution|note|danger" title="…">` — uso real: `tip` (dica/ES moderno),
  `caution` (armadilha, coerção, mutação), `note` (contexto), `danger` (raro).
- `<Steps>` — tutoriais e a seção `## Executando`.
- `<Tabs>` / `<TabItem label="…">` — alternativas equivalentes (ESM vs CJS, npm vs pnpm).
- `<Card>` / `<CardGrid>` — grades de destaque em páginas `index`.

Do projeto (alias `@components`):

| Componente             | Uso |
| ---------------------- | --- |
| `<SourceCode path…>`   | código real de `examples/` (props extras: `region`, `mark`, `lang`) |
| `<CodeTabs files={…}>` | mesmo trecho em vários arquivos |
| `<FileTree>`           | árvore de diretórios do projeto da aula |
| `<HtmlPreview path… height="24rem" serveFromPublic>` | preview vivo de HTML de `examples/` |
| `<PackageManagerTabs package="…" dev run="…" exec="…" create="…">` | comandos npm/pnpm/yarn |
| `<ApiRequest method="POST" path="/users" baseUrl="…">` / `<ApiResponse status={201}>` | aulas de API |
| `<ProjectLinks path… devcontainer… preview…>` | botões "Ver no GitHub" e "Abrir no Codespaces" (obrigatório em páginas de projeto) |
| `<ProjectCard {...project}>` | listagens em `projects/index.mdx` |

Antes de criar componente novo, confira se o Starlight já resolve.

---

## 🗂️ Registro na sidebar e páginas de visão geral (index.mdx)

Sempre que uma página for **criada, renomeada ou reestruturada**, essas alterações **devem obrigatoriamente afetar**:

1. **A Sidebar (`astro.config.mjs`)**: páginas novas não aparecem sozinhas; a sidebar é explícita. Adicione/atualize a entrada no grupo correto com link absoluto e barra final (não utilize `collapsed: true` nos grupos para mantê-los expandidos por padrão):
   ```js
   { label: 'Arrays', link: '/courses/ecmascript/data/arrays/' },
   ```

2. **As Páginas Index / Visão Geral (`index.mdx`)**: mantenha atualizadas as listas de tópicos e cartões nas páginas de visão geral do curso e de suas respectivas categorias (`/courses/<curso>/index.mdx` ou `/courses/<curso>/topics/<categoria>.mdx`), garantindo que a estrutura geral do curso reflita todas as páginas disponíveis.

---

## 🔍 Links internos

- Sempre **relativos** (sobrevivem ao `base` do GitHub Pages).
- URLs terminam em `/`: aula irmã é `../strings/`, categoria vizinha é `../../database/sql/`.
- Em páginas `index`, a forma direta vale: `javascript/`.

---

## ✅ Verificação

```bash
pnpm check
```

```bash
pnpm validate
```

`validate` roda `lint` (Biome) + `check` (astro check) + `build` (inclui slides e
mapas mentais) + `check:links` (valida cada link interno contra o `dist/`). Rode ao menos
`pnpm check` sempre; rode `pnpm validate` quando tiver mexido em links ou materiais.

---

## ⚠️ Armadilhas

1. **Componente sem import**: em `.mdx`, todo componente usado precisa estar importado —
   `astro check` acusa, mas o build pode falhar antes.
2. **`<Aside>` em `.md`**: não funciona. Em `.md` use `:::tip[Título]` … `:::`.
3. **Profundidade de link errada**: conte segmentos da **URL**, não pastas; a falta da
   barra final também quebra o `check:links`.
4. **Linkar `.excalidraw`**: o diretório `excalidraw/` não é publicado — não referencie.
5. **Esquecer a sidebar ou a página index**: a página passa a existir, mas fica inalcançável na navegação lateral ou na visão geral do curso.
6. **Duplicar código de `examples/`**: use `<SourceCode>`.
7. **Fechar tags**: `<Aside>`, `<Tabs>`, `<TabItem>`, `<Steps>`, `<details>` sempre com
   fechamento; dentro de `<details>` deixe uma linha em branco antes do conteúdo Markdown.
8. **Título divergente**: `title` do tópico, dos slides e do mapa mental devem coincidir.
9. **Elemento não-`<p>` (tabela, lista, código, diagrama, imagem) sem introdução ou colado**:
   viola a regra do parágrafo de entrada — todo elemento que difere de `<p>` deve ser
   precedido de um parágrafo explicativo que o apresenta e contextualiza.
10. **Subseção solitária**: um único `###` dentro de um `##` — dissolva no texto ou crie a
    segunda subseção.
11. **Diagrama Mermaid sem `<Mermaid>`**: uma cerca ` ```mermaid ` não é renderizada pelo
    site; o componente é obrigatório.
12. **Parágrafo monolítico**: blocos de texto muito longos e densos dificultam a leitura — divida em mais parágrafos curtos para deixar o tópico mais didático.
13. **Ausência de recurso visual em conceito abstrato**: publicar tópicos sobre eixos, layouts, arquiteturas, escopos ou ciclo de vida sem incluir diagramas `<Mermaid>`, previews ou figuras ilustrativas.
14. **Tópico de Classes sem Diagrama de Classes**: abordar Classes ou Programação Orientada a Objetos (POO) sem incluir um diagrama de classe Mermaid (`classDiagram`) demonstrando a estrutura de atributos, métodos e herança (`extends`).
15. **Diagrama ou figura sem legenda (caption)**: omitir o atributo `title="..."` em `<Mermaid>` ou a legenda/caption explicativa em imagens, figuras e blocos de código.
16. **Página-despejo**: tópico de conceito com "Exemplo completo (LP2)" no fim, despejando a
    árvore de arquivos e dez `<SourceCode>` seguidos — isso é uma página de projeto
    disfarçada; mova para `practice/` e deixe o link.
17. **Página de projeto sem `<ProjectLinks>`**: o leitor fica sem o botão do GitHub e sem o
    do Codespaces, e precisa caçar o caminho do projeto no repositório.
18. **`<ProjectLinks>` apontando para `.devcontainer/` inexistente**: o botão leva a um erro
    do Codespaces — crie a pasta ou passe `devcontainer={false}`.
19. **Diagrama ou figura excessivamente horizontal**: criar fluxogramas muito largos que vazam do viewport ou exigem rolagem lateral em dispositivos móveis — reestruture sempre na vertical (`flowchart TD`).
20. **Alterar página `.mdx` sem sincronizar materiais**: editar conceitos, remover/adicionar seções ou alterar código em um tópico e esquecer de atualizar os slides (`materials/**/*.slide.md`) e o mapa mental (`materials/**/*.mindmap.md`) correspondentes para manter paridade.
21. **Uso de travessões (`—`) para orações intercaladas**: antipadrão e vício estilístico de IA — substitua por vírgulas, parênteses ou períodos diretos.
