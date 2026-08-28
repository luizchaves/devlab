---
name: marp-slides-generator
description: >-
  Cria e mantém decks de slides didáticos em Markdown para o Marp CLI (`slides/**.md`)
  do DevLab, compilados em HTML por `pnpm build:slides`. Use sempre que o usuário pedir
  slides de aula, apresentação de um tópico, deck Marp ou material de projeção.
---

# DevLab — Gerador de Slides Marp

Guia para escrever decks Marp seguindo o padrão **real** dos 15 decks já existentes em
`slides/courses/dw-cstrc-jp/`.

---

## 📁 Localização e nomes

```
slides/courses/<course-id>/<categoria>/<topico>.md
```

O caminho **espelha** o da aula, e o build gera a URL pública:

| Arquivo | Resultado |
| ------- | --------- |
| `src/content/docs/courses/ecmascript/data/arrays.mdx` | aula |
| `slides/courses/ecmascript/data/arrays.md`            | fonte do deck |
| `public/slides/courses/ecmascript/data/arrays/index.html` | HTML gerado |
| `/slides/courses/ecmascript/data/arrays/`             | URL linkada na aula |

`public/slides/` é gitignorado: **versione apenas o `.md`**.

---

## 🎨 Frontmatter (copiar literalmente)

```yaml
---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Arrays"
description: "Slides completos da aula de Arrays em JavaScript (criação, índices, métodos mutadores e acessores, HOFs)."
---
```

- `title` **idêntico** ao `title` da aula `.mdx` e do mapa mental.
- Não invente tema: todos os decks usam `theme: default`.
- O bloco `style` é o que produz a paginação `3 / 21`.

---

## 📐 Arco do deck

1. **Capa** — `<!-- _class: lead -->`, `# <título da aula>` e uma linha de subtítulo
   listando os eixos da aula.
2. **`## Objetivo`** — frase de abertura + 4–6 bullets com verbo no infinitivo
   ("Entender…", "Diferenciar…", "Executar…"), termos-chave em **negrito**.
3. **`## Por Que <Tópico> Importa?`** (opcional, comum nas aulas de abertura) — impacto
   no navegador / servidor / ferramentas + linha em *itálico* com a regra de ouro.
4. **Slides de conteúdo** — **um conceito por slide**, título curto podendo usar código
   (`## Repetição por Condição: \`while\``). Cada slide é uma destas formas:
   - 4–6 bullets com o termo em **negrito** e explicação curta;
   - **uma** tabela comparativa (`| Termo | O que é | Exemplo |`);
   - **um** bloco de código ` ```js ` de até ~15 linhas, com o resultado em comentário;
   - um diagrama ASCII em ` ```txt ` com caracteres de caixa (`┌ ─ ┬ ▼ │ └`).
   Quando um conceito exige código + explicação, quebre em dois slides
   (`## Template Literals (Crase)` / `## Template Literals (Exemplo de Código)`).
5. **`## Exercício`** — enunciado curto com dados de entrada e 2–3 passos numerados.
6. **`## Solução do Exercício`** — código comentado e saída esperada.
7. **`## Resumo da Aula`** — 5–7 bullets de fechamento. Se passar disso, divida em
   `## Resumo da Aula (Parte 1)` e `## Resumo da Aula (Parte 2)`.

Separe **todo** slide com `---` em linha isolada.

Tamanho real dos decks: 128–547 linhas (~15 a 45 slides). Aulas de fundamento ficam
perto de 150 linhas; aulas densas (objetos, módulos, HTML) passam de 400.

---

## ✍️ Convenções de escrita

- Português (pt-BR), termos técnicos em inglês em *itálico* (`*shallow copy*`,
  `*empty slots*`) e identificadores em `` `crase` ``.
- Blocos de código com ` ```js ` (não `javascript`); os demais: `html`, `css`, `bash`,
  `json`, `txt`.
- Nada de imagens ou emojis nos slides; diagramas são ASCII.
- Diretivas Marp em uso: apenas `<!-- _class: lead -->` na capa. Comentários HTML
  simples (`<!-- certo -->`, `<!-- errado -->`) servem como nota de contraste.
- Alguns decks abrem com um lembrete do comando de build em comentário HTML — opcional:

  ```markdown
  <!--
  Conversão para HTML:
  pnpm run build:slides
  -->
  ```

---

## 🛠️ Build

```bash
pnpm build:slides
```

Roda `scripts/build-slides.mjs`, que percorre `slides/**/*.md` e invoca
`marp --no-stdin <arquivo> -o public/slides/<caminho>/index.html`. O build falha inteiro
se o Marp reclamar de um arquivo.

```bash
pnpm validate
```

Roda lint + `astro check` + build completo + `check:links` — use quando a aula linkar
o deck pela primeira vez (o link só resolve depois que o HTML existe).

---

## ⚠️ Armadilhas

1. **Slide sem `---`**: o conteúdo gruda no slide anterior e estoura a área visível.
2. **Excesso de conteúdo**: acima de ~6 bullets ou ~15 linhas de código o texto vaza para
   fora do slide (o Marp não rola). Divida em `(Parte 1)` / `(Parte 2)`.
3. **Perder o bloco `style`**: a paginação passa a mostrar só o número, sem o total.
4. **Título fora de sincronia** com a aula e o mapa mental do mesmo tópico.
5. **Cercas aninhadas**: ao mostrar Markdown dentro de Markdown, use cercas externas de
   4 crases.
6. **Editar `public/slides/`**: é saída de build, sobrescrita e gitignorada.
