# DevLab

Portal de publicação das páginas de disciplinas de programação, construído com
**Astro + Starlight**, com foco em conteúdo escrito em Markdown e código que existe
de verdade.

O princípio central: **o código das aulas não é copiado para dentro do Markdown**.
Ele vive em projetos executáveis dentro de `examples/` e é importado pela
documentação em tempo de build.

```text
examples/express-mvc/src/app.js     ← código executável (single source of truth)
              ↓
         <SourceCode path="…" />
              ↓
        Expressive Code
              ↓
       página da aula (.mdx)
```

## Sumário

- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Estrutura de diretórios](#estrutura-de-diretórios)
- [Como executar](#como-executar)
- [Como criar uma disciplina](#como-criar-uma-disciplina)
- [Como criar uma aula `.md`](#como-criar-uma-aula-md)
- [Quando usar `.mdx`](#quando-usar-mdx)
- [Componentes](#componentes)
- [Como adicionar um projeto em `examples/`](#como-adicionar-um-projeto-em-examples)
- [Como importar código real em uma aula](#como-importar-código-real-em-uma-aula)
- [Expressive Code](#expressive-code)
- [Tailwind CSS](#tailwind-css)
- [Qualidade](#qualidade)
- [Publicação no GitHub Pages](#publicação-no-github-pages)

## Stack

| Ferramenta          | Papel                                                        |
| ------------------- | ------------------------------------------------------------ |
| **Astro 7**         | Framework e build estático                                    |
| **Starlight**       | Tema de documentação: sidebar, busca, TOC, dark/light mode    |
| **Markdown / MDX**  | Conteúdo das aulas                                            |
| **Expressive Code** | Renderização dos blocos de código                             |
| **Tailwind CSS 4**  | Utilidades de estilo, integradas ao tema do Starlight         |
| **TypeScript**      | Tipagem dos componentes e das bibliotecas internas            |
| **Biome**           | Lint e formatação                                             |
| **pnpm**            | Gerenciador de pacotes                                        |

Vem do Starlight, sem configuração extra: sidebar, navegação anterior/próxima,
breadcrumbs, busca (Pagefind), dark/light mode, sumário da página, link "Editar esta
página", layout responsivo e sitemap.

## Arquitetura

```text
     conteúdo (.md / .mdx)         componentes (.astro)        código real
   src/content/docs/**             src/components/**           examples/**
            │                              │                        │
            └──────────────┬───────────────┘                        │
                           │                                        │
                    <SourceCode path> ─────────────────────────────┘
                           │
                    Expressive Code
                           │
                        Starlight
                           │
                    site estático (dist/)
```

Três decisões sustentam a estrutura:

1. **Markdown first.** Use `.md` sempre que Markdown bastar; `.mdx` só quando a
   página precisar de componentes.
2. **Single source of truth para código.** Código que roda mora em `examples/` e é
   importado, nunca duplicado.
3. **Conteúdo independente da apresentação.** Uma disciplina nova é um diretório
   novo em `src/content/docs/courses/` mais uma entrada na sidebar — a arquitetura
   do site não muda.

## Estrutura de diretórios

```text
.
├── astro.config.mjs            configuração do Astro e do Starlight (sidebar)
├── ec.config.mjs               configuração do Expressive Code
├── site.config.mjs             site, base e repositório (usado pelo build e pelos componentes)
├── biome.json                  lint e formatação
├── .github/workflows/          CI e deploy no GitHub Pages
│
├── examples/                   projetos reais e executáveis
│   ├── html-basics/
│   ├── express-basic/
│   ├── express-router/
│   ├── express-mvc/
│   └── express-prisma/
│
└── src/
    ├── content.config.ts       coleção `docs` do Starlight
    ├── content/docs/
    │   ├── index.mdx           homepage
    │   ├── 404.mdx
    │   └── courses/
    │       └── cstrc-jp-dw/    disciplina Desenvolvimento Web
    │           ├── index.mdx
    │           ├── html/
    │           ├── javascript/
    │           ├── node/
    │           ├── express/
    │           ├── database/
    │           └── projects/
    │
    ├── components/
    │   ├── SourceCode.astro         código a partir de um arquivo real
    │   ├── HtmlPreview.astro        renderização de um arquivo HTML real
    │   ├── CodeTabs.astro           vários arquivos em abas
    │   ├── FileTree.astro           árvore de arquivos escrita como texto
    │   ├── PackageManagerTabs.astro npm / pnpm / yarn
    │   ├── ApiRequest.astro         requisição HTTP
    │   ├── ApiResponse.astro        resposta HTTP
    │   └── ProjectCard.astro        cartão de projeto
    │
    ├── lib/
    │   ├── source-files.ts     leitura dos arquivos de `examples/` em build time
    │   ├── source-code.ts      tipos herdados do Expressive Code
    │   ├── file-tree.ts        parser da árvore em texto
    │   ├── projects.ts         catálogo dos projetos
    │   ├── site.ts             `withBase()` e links para o repositório
    │   └── slot-text.ts        conversão do slot MDX em texto
    │
    ├── examples/               trechos avulsos usados só na documentação
    └── styles/global.css       Tailwind + tokens do Starlight
```

## Como executar

Requer **Node.js 22+** e **pnpm 10+**.

```bash
pnpm install
pnpm dev
```

O site sobe em `http://localhost:4321/devlab/` (o caminho inclui o `base`).

| Comando            | O que faz                                        |
| ------------------ | ------------------------------------------------ |
| `pnpm dev`         | Servidor de desenvolvimento com HMR              |
| `pnpm build`       | Gera o site estático em `dist/`                  |
| `pnpm preview`     | Serve o `dist/` localmente                       |
| `pnpm check`       | Validação de tipos (`astro check`)               |
| `pnpm check:links` | Valida os links internos do `dist/`              |
| `pnpm lint`        | Lint e checagem de formatação (Biome)            |
| `pnpm lint:fix`    | Corrige o que for automaticamente corrigível     |
| `pnpm format`      | Formata os arquivos                              |
| `pnpm validate`    | `lint` + `check` + `build` + `check:links`       |

Os projetos de `examples/` **não** fazem parte deste workspace: cada um tem as
próprias dependências e é instalado separadamente. Assim o build da documentação (e o
CI) não precisa instalar Express, Prisma e afins.

```bash
cd examples/express-mvc
pnpm install
pnpm dev
```

O `html-basics` não tem dependências — é só abrir os arquivos no navegador:

```bash
cd examples/html-basics
open index.html
```

Já o `express-prisma` tem dois passos a mais:

```bash
cd examples/express-prisma
pnpm install
cp .env.example .env
pnpm db:push
pnpm db:seed
pnpm dev
```

> **Versão do Prisma.** Os exemplos usam **Prisma 6**. O Prisma 7 mudou o modelo de
> configuração — a `url` sai do `schema.prisma` para um `prisma.config.ts`, o
> `PrismaClient` passa a exigir um *driver adapter* (módulo nativo) e o gerador
> `prisma-client` emite TypeScript. Para um exemplo introdutório em JavaScript puro,
> o setup do Prisma 6 é bem mais direto; a modelagem e as consultas ensinadas são as
> mesmas nas duas versões.

## Como criar uma disciplina

1. Crie o diretório do conteúdo:

   ```bash
   mkdir -p src/content/docs/courses/poo
   ```

2. Crie a página de abertura `src/content/docs/courses/poo/index.mdx`:

   ```mdx
   ---
   title: Programação Orientada a Objetos
   description: Trilha de POO.
   course: poo
   sidebar:
     label: Introdução
     order: 1
   ---
   ```

3. Adicione a disciplina à sidebar em `astro.config.mjs`:

   ```js
   sidebar: [
     { label: 'Desenvolvimento Web', items: [/* … */] },
     {
       label: 'Programação Orientada a Objetos',
       items: [{ label: 'Introdução', link: '/courses/poo/' }],
     },
   ]
   ```

   Para gerar a sidebar a partir dos arquivos, use
   `{ autogenerate: { directory: 'courses/poo' } }` e controle a ordem pelo
   `sidebar.order` do frontmatter de cada página.

Nenhum outro arquivo precisa mudar.

## Como criar uma aula `.md`

Crie o arquivo dentro do diretório da disciplina:

```markdown
---
title: Express.js — Middleware
description: A cadeia de middlewares do Express.
course: cstrc-jp-dw
sidebar:
  label: Middleware
  order: 4
---

Texto da aula.

```js title="src/app.js" {3} showLineNumbers
app.use(express.json());
```

## Exercício

…

## Próxima aula

[MVC](mvc/) — juntando as camadas.
```

Convenções adotadas:

- **Links internos são relativos**, para continuarem corretos sob o `base` do GitHub
  Pages sem precisar escrevê-lo. Atenção: as URLs terminam em barra
  (`/courses/cstrc-jp-dw/express/mvc/`), então a partir de uma aula uma *irmã* é `../rest-api/`
  e uma pasta vizinha é `../../database/sql/`. Em páginas `index`, que já são o
  diretório, vale a forma direta (`javascript/`).
- Toda aula termina com **Exercício** e **Próxima aula**.
- Os campos extras `course` e `project` no frontmatter são opcionais e existem para
  listagens futuras (definidos em `src/content.config.ts`).

> **Verificando os links.** `pnpm check:links` percorre o `dist/`, resolve cada link
> interno contra a URL real da página e falha se o destino — página, arquivo ou
> âncora — não existir. Roda no `pnpm validate` e nos dois workflows do CI.
>
> Nos workflows, `scripts/github-pages-env.mjs` deriva `SITE_URL`, `BASE_PATH`,
> `REPO_URL` e `REPO_BRANCH` a partir do repositório atual e exporta esses valores
> para todos os steps. Assim o build e a validação usam o mesmo caminho base mesmo
> se o repositório for renomeado.
>
> O plugin `starlight-links-validator` não serve aqui: ele **ignora** links relativos
> (`errorOnRelativeLinks: false`) ou os rejeita por serem relativos (`true`), e este
> projeto usa links relativos justamente para sobreviver ao `base`. Só validaria algo
> se o `base` fosse escrito à mão em cada link do conteúdo.

## Quando usar `.mdx`

Use `.md` por padrão. Troque para `.mdx` **apenas** quando a página precisar de
componentes:

| Precisa de…                                | Extensão |
| ------------------------------------------ | -------- |
| Texto, listas, tabelas, blocos de código    | `.md`    |
| `:::tip` / `:::caution` (asides)            | `.md`    |
| `<SourceCode>`, `<CodeTabs>`, `<FileTree>`  | `.mdx`   |
| `<Tabs>`, `<Steps>`, `<Card>` do Starlight  | `.mdx`   |
| `<ApiRequest>`, `<ApiResponse>`             | `.mdx`   |
| Expressões JavaScript (`{projects.map(…)}`) | `.mdx`   |

Em `.mdx`, importe o que usar (os aliases `@components` e `@lib` evitam caminhos
longos):

```mdx
import { Aside, Steps, Tabs, TabItem } from '@astrojs/starlight/components';
import SourceCode from '@components/SourceCode.astro';
```

## Componentes

Antes de criar um componente, verifique se o Starlight já resolve: ele fornece
`Aside`, `Badge`, `Card`, `CardGrid`, `LinkCard`, `LinkButton`, `Steps`, `Tabs`,
`TabItem`, `Icon`, `FileTree` e `Code`. Os componentes deste projeto são camadas
finas sobre eles.

### `<SourceCode>`

Bloco de código alimentado por um arquivo real. É a forma **preferencial** de mostrar
qualquer código que já exista em `examples/`.

```mdx
<SourceCode path="examples/express-mvc/src/app.js" />
```

Herda todas as props do `<Code>` do Expressive Code e acrescenta:

| Prop                  | Descrição                                                              |
| --------------------- | ---------------------------------------------------------------------- |
| `path`                | **Obrigatória.** Caminho relativo à raiz do projeto                     |
| `region`              | Carrega só a região `#region <nome>` / `#endregion`                     |
| `lines`               | Intervalo de linhas: `"5-18"`, `"5-"` ou `"12"`                         |
| `startLine` / `endLine` | Alternativa numérica a `lines`                                        |
| `dedent`              | Remove a indentação comum de trechos parciais (padrão `true`)           |
| `preserveLineNumbers` | Mantém a numeração original em trechos parciais (padrão `true`)         |

`title` e `lang` são **inferidos** de `path` e podem ser sobrescritos:

```mdx
{/* título "app.js", linguagem js */}
<SourceCode path="examples/express-mvc/src/app.js" />

{/* explícitos vencem a inferência */}
<SourceCode path="examples/express-mvc/src/app.js" title="src/app.js" lang="javascript" />
```

Seleção de trecho:

```mdx
<SourceCode path="examples/express-mvc/src/app.js" lines="7-12" showLineNumbers />
<SourceCode path="examples/express-mvc/src/app.js" startLine={7} endLine={12} />
<SourceCode path="examples/express-mvc/src/app.js" region="middleware" showLineNumbers />
```

`lines` é a API canônica; `startLine`/`endLine` existem para uso programático.

Regiões nomeadas são marcadas no próprio arquivo executável:

```js
// #region middleware
app.use(express.json());
// #endregion
```

As linhas de marcação **nunca** aparecem na documentação, e a numeração exibida é
sempre a do arquivo já sem elas — a mesma nos dois casos, arquivo inteiro ou região.

Dentro de abas do Starlight:

```mdx
<Tabs syncKey="express-mvc">
  <TabItem label="app.js">
    <SourceCode path="examples/express-mvc/src/app.js" title="src/app.js" />
  </TabItem>
  <TabItem label="user-router.js">
    <SourceCode path="examples/express-mvc/src/routes/user-router.js" title="src/routes/user-router.js" />
  </TabItem>
</Tabs>
```

**Segurança e build.** A leitura acontece em build time, por `import.meta.glob` do
Vite: o conjunto de arquivos legíveis é fixado na compilação, restrito a `examples/`
e `src/examples/`, com `node_modules/`, `dist/`, `.env` e binários excluídos. Não há
acesso ao filesystem no navegador nem possibilidade de traversal (`../../`) — um
caminho fora dos diretórios autorizados falha o build com mensagem explícita. Funciona
igual em `pnpm dev` e `pnpm build`, inclusive na publicação estática.

### `<HtmlPreview>`

Mostra como o navegador renderiza um arquivo HTML real — o par indispensável do
`<SourceCode>` nas aulas de HTML e CSS.

```mdx
<HtmlPreview path="examples/html-basics/listas.html" height="18rem" />
```

| Prop     | Descrição                                            |
| -------- | ---------------------------------------------------- |
| `path`   | **Obrigatória.** Mesmo contrato do `<SourceCode>`     |
| `height` | Altura do quadro (padrão `20rem`)                     |
| `label`  | Rótulo do quadro (padrão: nome do arquivo)            |

O arquivo é lido em build time e injetado em um iframe com `sandbox=""`: sem scripts,
sem formulários, sem navegação. Como `srcdoc` não tem base para caminhos relativos,
as imagens locais em formato de texto (`.svg`) são embutidas como `data:` URI.

Combina bem com abas, para alternar entre marcação e resultado:

```mdx
<Tabs syncKey="html-basics">
  <TabItem label="Código">
    <SourceCode path="examples/html-basics/listas.html" title="listas.html" showLineNumbers />
  </TabItem>
  <TabItem label="Resultado">
    <HtmlPreview path="examples/html-basics/listas.html" />
  </TabItem>
</Tabs>
```

### `<CodeTabs>`

Vários arquivos relacionados em abas, cada um renderizado pelo `<SourceCode>`.

```mdx
<CodeTabs
  syncKey="express-mvc"
  files={[
    'examples/express-mvc/src/app.js',
    { path: 'examples/express-mvc/src/routes/user-router.js', title: 'src/routes/user-router.js', showLineNumbers: true },
  ]}
/>
```

Cada item é uma string (o caminho) ou um objeto com todas as props do `<SourceCode>`
mais `label`. Sem `label`, usa o nome do arquivo.

### `<FileTree>`

Árvore de arquivos escrita como texto, renderizada pelo `<FileTree>` nativo do
Starlight (ícones por extensão, dark/light mode e acessibilidade vêm dele).

```mdx
<FileTree>
{`
src/
├── app.js              monta a aplicação
├── routes/
│   └── user-router.js
└── controllers/
    └── user-controller.js
`}
</FileTree>
```

Aceita box-drawing (`├──`, `└──`, `│`) ou indentação simples. Diretórios são
detectados pela `/` final ou por terem filhos; `**arquivo.js**` destaca uma entrada; o
texto após o nome vira comentário.

### `<PackageManagerTabs>`

```mdx
<PackageManagerTabs package="express" />      {/* npm install / pnpm add / yarn add */}
<PackageManagerTabs package="prisma" dev />   {/* com -D */}
<PackageManagerTabs />                        {/* instalar dependências do projeto */}
<PackageManagerTabs run="dev" />              {/* npm run dev / pnpm dev / yarn dev */}
<PackageManagerTabs exec="prisma init" />     {/* npx / pnpm dlx / yarn dlx */}
<PackageManagerTabs create="astro@latest" />
```

As abas usam `syncKey="pkg"` por padrão: a escolha do aluno vale para o site inteiro.

### `<ApiRequest>` e `<ApiResponse>`

```mdx
<ApiRequest method="POST" path="/users" baseUrl="http://localhost:3000">
{`
{ "name": "Ana" }
`}
</ApiRequest>

<ApiResponse status={201}>
{`
{ "id": 1, "name": "Ana" }
`}
</ApiResponse>
```

O corpo é opcional. `statusText` é inferido do código e as cores seguem o método HTTP
e a família do status.

> **Indentação do corpo.** O MDX remove um nível de indentação do bloco `{`...`}`, por
> isso o conteúdo é escrito indentado em 2 espaços em relação à tag. O componente
> remove a indentação comum que sobrar, então o JSON aparece exatamente como escrito.

### `<ProjectCard>`

Ver [Como criar um novo `ProjectCard`](#como-criar-um-novo-projectcard).

## Como adicionar um projeto em `examples/`

1. Crie o projeto com `package.json` próprio:

   ```bash
   mkdir -p examples/express-auth/src
   cd examples/express-auth
   pnpm init
   pnpm add express
   ```

2. Garanta que ele roda sozinho — `"type": "module"` e os scripts `dev` e `start`:

   ```json
   {
     "name": "express-auth",
     "private": true,
     "type": "module",
     "scripts": {
       "dev": "node --watch src/server.js",
       "start": "node src/server.js"
     }
   }
   ```

3. Adicione um `README.md` curto com as rotas e como executar.

4. Registre o projeto em `src/lib/projects.ts` (veja abaixo).

5. Crie a página da aula e importe o código com `<SourceCode>`.

Não é preciso configurar nada além disso: `examples/**` já é um diretório autorizado
para leitura.

## Como importar código real em uma aula

Evite copiar código:

````mdx
```js
// cópia manual — vai ficar desatualizada
```
````

Prefira:

```mdx
<SourceCode path="examples/express-mvc/src/app.js" title="src/app.js" showLineNumbers />
```

Blocos de código escritos à mão continuam válidos para o que **não** existe em
`examples/`: pseudocódigo, comparações "antes/depois", trechos ilustrativos e
comandos de terminal.

## Expressive Code

A configuração está em [`ec.config.mjs`](ec.config.mjs) — separada do
`astro.config.mjs` porque o componente `<Code>` precisa carregá-la em runtime e
plugins não são serializáveis em JSON.

Recursos habilitados:

| Recurso                | Como usar                                              |
| ---------------------- | ------------------------------------------------------ |
| Syntax highlighting    | Shiki, automático pela linguagem                        |
| Dark/light             | `github-dark` e `github-light`, seguem o tema do site   |
| Botão Copy             | Automático                                              |
| Título / filename      | `title="src/app.js"`                                    |
| Números de linha       | `showLineNumbers` (e `startLineNumber`)                 |
| Destaque de linhas     | `{5-7}` na fence, `mark` na prop                        |
| Destaque de trechos    | `"texto"` ou `/regex/`                                  |
| Linhas adicionadas     | `ins={3-4}`                                             |
| Linhas removidas       | `del={1-2}`                                             |
| Diff                   | ```` ```diff ```` ou `useDiffSyntax`                    |
| Quebra de linha        | `wrap` e `preserveIndent`                               |
| Frames de terminal     | Automático em `bash`/`sh`; ou `frame="terminal"`        |
| Seções recolhíveis     | `collapse="1-16"`                                       |

Em Markdown, a sintaxe é a da fence:

````md
```js title="src/app.js" {5-7} ins={9} del={11} showLineNumbers wrap
```
````

Nas props do `<SourceCode>`, os equivalentes:

```mdx
<SourceCode
  path="examples/express-mvc/src/app.js"
  showLineNumbers
  mark="7-12"
  ins={14}
  del={[3]}
  collapse="1-5"
  wrap
/>
```

> **Nota sobre `mark`/`ins`/`del`.** No Expressive Code, uma *string* nessas props é
> um marcador de **texto**; intervalos de linha exigem número ou `{ range: '7-12' }`.
> O `<SourceCode>` normaliza isso: uma string formada apenas por números, hífens e
> vírgulas (`"7-12"`, `"1,3-5"`) vira intervalo de linhas, e qualquer outra string
> continua sendo marcador de texto. Regexes e objetos passam intactos.
>
> Ao usar `lines` ou `region`, os intervalos de `mark` referem-se às linhas do
> **trecho exibido** (1-based), não à numeração original mostrada na régua.

## Tailwind CSS

O Tailwind 4 entra pelo plugin nativo do Vite (`@tailwindcss/vite`) e é integrado ao
tema pelo `@astrojs/starlight-tailwind`. A ordem de camadas em
[`src/styles/global.css`](src/styles/global.css) garante que as utilidades vençam os
estilos do Starlight sem `!important`.

As cores do Starlight estão expostas como tokens do Tailwind, então os componentes
acompanham dark/light mode sozinhos:

```html
<div class="rounded-lg border border-sl-gray-5 bg-sl-black text-sl-white">
```

| Token                                     | Origem                       |
| ----------------------------------------- | ---------------------------- |
| `sl-white`, `sl-black`, `sl-gray-1..6`    | Escala de cinza do tema       |
| `sl-accent`                               | `--sl-color-text-accent`      |
| `sl-green`, `sl-orange`, `sl-red`, `sl-purple`, `sl-blue` | Cores semânticas |
| `font-mono`, `text-sl-xs`…`text-sl-h5`    | Tipografia do Starlight       |

Mantenha a identidade do Starlight: use os tokens acima em vez de cores fixas, para
que qualquer componente novo já funcione nos dois temas.

## Como criar um novo `ProjectCard`

Os cartões da homepage e da página de projetos vêm de um catálogo único em
[`src/lib/projects.ts`](src/lib/projects.ts):

```ts
export const projects: Project[] = [
  {
    id: 'express-auth',
    name: 'Express Auth',
    description: 'Autenticação com tokens sobre a estrutura MVC.',
    level: 'Avançado',
    tech: ['Node.js', 'Express.js', 'JWT'],
    concepts: ['Hash de senha', 'Tokens', 'Middleware de autorização'],
    docs: '/courses/cstrc-jp-dw/projects/express-auth/',
    source: 'examples/express-auth',
  },
];
```

Acrescentar um item já o faz aparecer na homepage e em `courses/cstrc-jp-dw/projects/`, que
apenas percorrem a lista:

```mdx
import ProjectCard from '@components/ProjectCard.astro';
import { projects } from '@lib/projects';

<div class="project-grid">
  {projects.map((project) => <ProjectCard {...project} />)}
</div>
```

`docs` é um caminho interno (o `base` é aplicado por `withBase()`) e `source` é o
caminho no repositório (vira link para o GitHub).

## Publicação no GitHub Pages

O workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) publica a
cada push na `main`:

```text
push main → pnpm install → pnpm check → pnpm build → deploy Pages
```

Ative uma vez, em **Settings → Pages → Build and deployment**, a opção
**Source: GitHub Actions**.

### `site` e `base`

Para um repositório publicado como `https://<usuario>.github.io/<repositorio>/`, o
Astro precisa de:

```js
site: 'https://<usuario>.github.io',
base: '/<repositorio>',
```

Esses valores ficam em [`site.config.mjs`](site.config.mjs), lido pelo
`astro.config.mjs`, pelos componentes e pelo validador de links. O arquivo respeita
variáveis de ambiente e, quando elas não existem, deriva o `base` do nome do
repositório no GitHub Actions ou do `name` em `package.json` no uso local:

```js
export const SITE_URL = process.env.SITE_URL ?? `https://${repositoryOwner}.github.io`;
export const BASE_PATH = normalizeBasePath(process.env.BASE_PATH ?? defaultBasePath);
export const REPO_URL =
  process.env.REPO_URL ?? `${githubServerUrl}/${repositoryOwner}/${repositoryName}`;
export const REPO_BRANCH =
  process.env.REPO_BRANCH || process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || 'main';
```

Para publicar em outro lugar, defina variáveis de ambiente ou ajuste os defaults do
arquivo:

| Destino                                    | `SITE_URL`                       | `BASE_PATH`      |
| ------------------------------------------ | -------------------------------- | ---------------- |
| `https://ana.github.io/devlab/`            | `https://ana.github.io`          | `/devlab`        |
| `https://ana.github.io/disciplinas/`       | `https://ana.github.io`          | `/disciplinas`   |
| `https://ana.github.io/` (repo `ana.github.io`) | `https://ana.github.io`     | `/`              |
| Domínio próprio                            | `https://exemplo.com`            | `/`              |

No CI não é preciso editar nada: o workflow roda `scripts/github-pages-env.mjs`,
deriva `SITE_URL` e `BASE_PATH` a partir de `GITHUB_REPOSITORY` e aponta `REPO_URL`
para o próprio repositório. A edição do `site.config.mjs` só afeta builds locais e
serve como padrão.

Ao mudar o `base`, o `pnpm dev` também passa a servir no novo caminho
(`http://localhost:4321/<base>/`).

### Domínio próprio

Coloque o domínio em `SITE_URL`, use `BASE_PATH = '/'` e configure o domínio em
**Settings → Pages → Custom domain**.

## Licença

Material didático — use e adapte à vontade.
