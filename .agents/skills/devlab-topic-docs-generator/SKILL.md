---
name: devlab-topic-docs-generator
description: >-
  Cria e mantém páginas de aula do DevLab em Astro Starlight (`.md` / `.mdx`) sob
  `src/content/docs/courses/`. Use sempre que o usuário pedir para criar, atualizar,
  expandir ou revisar uma aula/tópico de disciplina (ECMAScript, Arrays, Strings,
  Funções, HTML, CSS, Express, Prisma, etc.).
---

# DevLab — Gerador de Páginas de Aula

Guia para escrever aulas do DevLab seguindo as convenções **reais** do repositório.

> **Fonte da verdade**: o `README.md` da raiz (seções "Como criar uma disciplina",
> "Como criar uma aula `.md`", "Quando usar `.mdx`", "Componentes" e "Expressive Code").
> Em caso de conflito entre este guia e o README, o README vence — e este arquivo
> deve ser corrigido.

---

## 📁 Localização e nomes

```
src/content/docs/courses/<course-id>/<categoria>/<topico>.(md|mdx)
```

- `course-id` existentes: `cstrc-jp-dw` (Desenvolvimento Web), `ctii-jp-lp2`, `csbes-jp-pw2`.
- Categorias de `cstrc-jp-dw`: `html`, `css`, `javascript`, `browser`, `node`,
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

Aulas longas de JavaScript normalmente acabam em `.mdx` (usam `<Aside>` e `<Steps>`);
aulas curtas de conceito podem ficar em `.md` com `:::tip[…]`.

---

## 📄 Frontmatter

```mdx
---
title: "JavaScript: Arrays"
description: "Criação, geração de intervalos (range), manipulação, iteração, desestruturação, operador spread e principais métodos de Array em JavaScript."
course: cstrc-jp-dw
sidebar:
  label: Arrays
  order: 8
---
```

- `title`: prefixado pela trilha (`JavaScript: …`, `HTML: …`, `CSS: …`) e **idêntico**
  ao `title` dos slides e do mapa mental do mesmo tópico.
- `description`: uma frase densa listando o que a página cobre (vira `<meta>`).
- `course`: obrigatório nas aulas (schema estendido em `src/content.config.ts`).
- `project`: opcional, aponta para um projeto de `examples/`.
- `sidebar.label`: rótulo curto para a navegação quando o `title` é longo
  (`label: "Map e Set"` para `title: "JavaScript: Map e Set"`). Usado em ~40% das páginas.
- `sidebar.order`: só tem efeito em disciplinas cuja sidebar usa `autogenerate`;
  `cstrc-jp-dw` tem sidebar **explícita** em `astro.config.mjs` (ver "Registro na sidebar").

Depois do frontmatter, em `.mdx`, importe **apenas** o que for usado:

```mdx
import { Aside, Card, CardGrid, Steps, Tabs, TabItem } from '@astrojs/starlight/components';
import SourceCode from '@components/SourceCode.astro';
import FileTree from '@components/FileTree.astro';
```

---

## 🔗 Linha de materiais

Logo após um parágrafo curto de abertura ("Esta aula apresenta…"), inclua a linha de
materiais quando existirem slides/mapa mental do tópico:

```mdx
Materiais: [slides da aula](../../../../slides/courses/ecmascript/data/arrays/) e [mapa mental](../../../../mindmaps/courses/ecmascript/data/arrays/).
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

## 📐 Estrutura da aula

Ordem observada nas 16 aulas de `ecmascript`. Nem toda seção é obrigatória,
mas **`Objetivo`, `Exercício` e `Próxima aula` são**, e a ordem relativa deve ser mantida.

1. **Parágrafo de abertura** — o que a aula apresenta, em 1–3 linhas.
2. **`Materiais: …`** — slides e mapa mental.
3. **`## Objetivo`** — 1 parágrafo denso ou lista curta com o que o aluno vai dominar.
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
10. **`## Próxima aula`** — 1 frase de ligação + link relativo para o próximo tópico:
    `[Strings](../strings/): Criação, template literals e métodos do objeto String.`

Padrão do bloco de resposta:

```mdx
<details>
  <summary>Possível resposta</summary>

  `splice()` é mutador e altera o array original. `slice()` é acessor e devolve uma cópia.
</details>
```

---

## 📝 Regra do parágrafo de entrada

**Nenhuma tabela ou bloco de código aparece logo abaixo de um título.** Sempre escreva ao
menos um parágrafo entre o `##`/`###` e a tabela ou o bloco — o texto diz o que vem a
seguir e por que importa; a tabela/código mostra. Vale também para blocos em sequência:
dois blocos de código colados precisam de uma frase entre eles.

Errado:

```mdx
### Métodos mutadores

| Método | Efeito |
| ------ | ------ |
```

Certo:

```mdx
### Métodos mutadores

Estes métodos alteram o array original e devolvem o resultado da operação, não uma cópia:

| Método | Efeito |
| ------ | ------ |
```

O parágrafo de entrada de um bloco de código costuma terminar em dois-pontos e nomear o que
o exemplo demonstra ("O exemplo a seguir demonstra as principais formas de declarar arrays:").
A exceção são os blocos encadeados dentro de `<Steps>`, onde o item numerado já cumpre esse
papel, e o bloco `txt title="Output"` que segue imediatamente o comando que o produziu.

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

### Diagramas

Diagramas de fluxo, sequência, estado e entidade-relacionamento são escritos como texto com
**Mermaid**, pelo componente `<Mermaid>` (`@components/Mermaid.astro`), que renderiza no
navegador seguindo o tema claro/escuro:

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

O diagrama vai entre crases dentro de `{...}` (como em `<FileTree>`), porque o MDX
interpretaria chaves e setas soltas no texto. Prefira Mermaid a desenho ASCII quando o
diagrama tiver caixas e ligações; mantenha ` ```txt ` apenas para saídas de terminal,
estruturas de arquivo e esquemas de layout que dependem de alinhamento monoespaçado.

Diagramas Mermaid não funcionam nos slides Marp nem nos mapas mentais Markmap — lá continue
com ASCII.

---

## 💻 Blocos de código (Expressive Code)

Configuração em `ec.config.mjs`. Convenções em uso:

- Linguagem sempre declarada; use ` ```js ` (não `javascript`), ` ```html `, ` ```css `,
  ` ```json `, ` ```bash `, ` ```txt `.
- **Sempre** dê um `title` descritivo: ` ```js title="Formas de criação de Arrays" `.
- Terminal: ` ```bash title="Terminal" ` (o frame de terminal é automático para
  `bash,sh,shell,zsh,console,powershell`).
- Saída de execução: ` ```txt title="Output" `.
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
| `<ProjectCard {...project}>` | listagens em `projects/index.mdx` |

Antes de criar componente novo, confira se o Starlight já resolve.

---

## 🗂️ Registro na sidebar

Página nova **não aparece sozinha** em `cstrc-jp-dw`: a sidebar é explícita em
`astro.config.mjs`. Adicione a entrada no grupo correto, com link absoluto e barra final:

```js
{ label: 'Arrays', link: '/courses/ecmascript/data/arrays/' },
```

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
5. **Esquecer a sidebar**: a página existe, mas fica inalcançável pela navegação.
6. **Duplicar código de `examples/`**: use `<SourceCode>`.
7. **Fechar tags**: `<Aside>`, `<Tabs>`, `<TabItem>`, `<Steps>`, `<details>` sempre com
   fechamento; dentro de `<details>` deixe uma linha em branco antes do conteúdo Markdown.
8. **Título divergente**: `title` da aula, dos slides e do mapa mental devem coincidir.
9. **Tabela ou código colado no título**: viola a regra do parágrafo de entrada — sempre uma
   frase de contexto entre o `##`/`###` e a tabela ou o bloco de código.
10. **Subseção solitária**: um único `###` dentro de um `##` — dissolva no texto ou crie a
    segunda subseção.
11. **Diagrama Mermaid sem `<Mermaid>`**: uma cerca ` ```mermaid ` não é renderizada pelo
    site; o componente é obrigatório.
