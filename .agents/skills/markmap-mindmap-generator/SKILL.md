---
name: markmap-mindmap-generator
description: >-
  Cria e mantém mapas mentais Markmap em Markdown (`materials/**/*.mindmap.md`) do DevLab,
  compilados em HTML interativo por `pnpm build:mindmaps`. Use sempre que o usuário pedir
  mapa mental, mindmap, mapa de tópicos ou resumo visual em árvore de uma aula.
---

# DevLab — Gerador de Mapas Mentais Markmap

Guia para escrever mapas mentais seguindo o padrão **real** dos mapas existentes em
`materials/courses/`.

---

## 📁 Localização e nomes

```
materials/courses/<course-id>/<categoria>/<topico>.mindmap.md
```

O caminho espelha o da aula e o dos slides:

| Arquivo | Resultado |
| ------- | --------- |
| `src/content/docs/courses/ecmascript/data/arrays.mdx` | aula |
| `materials/courses/ecmascript/data/arrays.mindmap.md` | fonte do mapa |
| `public/mindmaps/courses/ecmascript/data/arrays/index.html` | HTML gerado |
| `/mindmaps/courses/ecmascript/data/arrays/`           | URL linkada na aula |

`public/mindmaps/` é gitignorado: **versione apenas o `.md`**.

## 🔎 Cobertura da página

Antes de criar ou revisar um mapa mental, leia a página correspondente em
`src/content/docs/courses/<course-id>/<categoria>/<topico>.mdx` e rastreie sua estrutura:

- cada `##` conceitual importante da página deve aparecer como ramo `##` ou estar
  claramente absorvido por um ramo equivalente;
- `###` densos devem virar sub-ramos `###`, principalmente quando explicam regras,
  exceções, APIs, comparações, armadilhas ou boas práticas;
- tabelas da página devem virar folhas curtas com o padrão `- **Rótulo**: síntese`;
- exemplos de código não são copiados; extraia a ideia, o retorno, a regra ou a
  comparação que o exemplo demonstra;
- mantenha densidade proporcional: páginas longas normalmente precisam de 60–120 linhas
  de mapa, sem transformar folhas em parágrafos;
- compare o mapa com os slides da mesma aula: o mapa deve cobrir os mesmos conceitos
  principais, mas em formato de revisão relacional.

Um mapa mental não deve ser apenas um sumário. Ele precisa preservar relações suficientes
para o estudante revisar a página sem perder os conceitos centrais.

---

## 📄 Frontmatter (copiar literalmente)

```yaml
---
title: 'JavaScript: Arrays'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---
```

- Aspas **simples** no título (padrão do repositório), idêntico ao `title` da aula e do deck.
- `colorFreezeLevel: 2` mantém uma cor por ramo principal.
- `initialExpandLevel: 2` abre o mapa já focado nos ramos de nível 2 — combina com o
  botão "2" injetado pelo build.

---

## 📐 Estrutura da árvore

```markdown
# JavaScript: Arrays

## Ideia Central

- Lista ordenada, dinâmica e heterogênea de valores
- Internamente é um `object` (verifique com `Array.isArray()`)

## Criação e Acesso

- **Literal**: `const items = [1, 2, 3]` (forma recomendada)
- **Índices**: começam em `0`; `.at(-1)` acessa o último

## Métodos

### Mutadores
- `push()` / `pop()`: adiciona e remove no fim
- `splice()`: remove, substitui ou insere reorganizando índices

### Acessores
- `slice()`: fatia sem alterar o original
- `concat()` / `join()`: combina e serializa

## Boas Práticas

- **Prefira imutabilidade**: `map`, `filter`, `toSorted()`
- **Evite `for...in`** em arrays: itera chaves, não garante ordem
```

Regras observadas:

- `#` (nível 1): **um único** nó raiz, igual ao título da aula.
- `##` (nível 2): 4–8 ramos principais, **sem numeração** — títulos temáticos como
  `Ideia Central`, `Sintaxe`, `Métodos`, `Boas Práticas`. Comece por `Ideia Central`
  e termine por `Boas Práticas` quando fizer sentido.
- `###` (nível 3): subdivisão opcional de um ramo; nem todo mapa usa.
- `-` (bullets): folhas, no formato `- **Rótulo**: explicação curta`.
- Identificadores em `` `crase` ``; termos em inglês em *itálico*.
- Uma linha por folha, ~4–12 palavras. Sem parágrafos, sem blocos de código.
- Não copie Mermaid, HTML, MDX ou blocos de código da página. Diagramas devem ser
  convertidos para relações textuais curtas no mapa, como `**Fluxo**: entrada -> etapa ->
  saída`.
- Tamanho real: 51–239 linhas (a maioria entre 55 e 90).

---

## 🛠️ Build

```bash
pnpm build:mindmaps
```

Roda `scripts/build-mindmaps.mjs`, que invoca
`markmap <arquivo.md> -o public/mindmaps/<caminho>/index.html --offline --no-open` e
injeta no HTML o controle flutuante **"Níveis: 2 · 3 · 4 · Todos"** (com suporte a tema
escuro). Por isso, hierarquias além do nível 4 ficam acessíveis só pelo botão "Todos" —
mantenha a profundidade útil em até 4 níveis contando a raiz.

```bash
pnpm validate
```

Use quando a aula passar a linkar o mapa (o link só resolve depois do HTML gerado).

---

## ⚠️ Armadilhas

1. **Numerar os ramos** (`## 1. Ideia Central`): não é o padrão do repositório.
2. **Nós densos**: parágrafos e frases longas destroem a legibilidade do mapa.
3. **Pular níveis** (`#` direto para `###`): quebra a hierarquia visual.
4. **Mais de um `#`**: cada `#` vira uma raiz separada e o mapa perde o centro.
5. **Omitir o frontmatter `markmap`**: o mapa abre todo expandido e os botões de nível
   ficam dessincronizados do estado inicial.
6. **Editar `public/mindmaps/`**: é saída de build, sobrescrita e gitignorada.
7. **Título fora de sincronia** com a aula e os slides do mesmo tópico.
8. **Mapa superficial**: se a página tem muitas seções e o mapa fica com menos de 40–50
   linhas, provavelmente ele está omitindo conceitos importantes.
9. **Copiar artefatos da página**: blocos ` ```js `, `<Mermaid>`, `flowchart` e HTML não
   pertencem ao mapa; transforme-os em folhas conceituais.
