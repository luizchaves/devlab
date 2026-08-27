---
name: marp-slides-generator
description: >-
  Generates educational Markdown slide decks for Marp CLI (.md) and compiles them into static HTML presentations. Use whenever the user requests creating slide decks, lecture slides, Marp presentations, or course slide materials.
---

# Marp Slide Deck Generator

This skill guides the agent in designing, structuring, and generating educational Marp Markdown slide decks (`.md`) and building them into HTML presentations.

---

## 📄 File Location & Naming Conventions

All slide decks in DevLab must be placed under the `slides/` directory, mirroring the course documentation hierarchy:

```
slides/courses/<course-id>/<category>/<topic>.md
```

### Example:
- Course documentation: `src/content/docs/courses/cstrc-jp-dw/javascript/ecmascript.mdx`
- Slide deck source: `slides/courses/cstrc-jp-dw/javascript/ecmascript.md`
- Compiled HTML output: `public/slides/courses/cstrc-jp-dw/javascript/ecmascript/index.html`

---

## 🎨 Marp Frontmatter & Header Template

Every Marp slide deck file **MUST** start with the standard YAML frontmatter:

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
title: "Title of the Lesson"
description: "Detailed description of the lesson slide deck."
---
```

---

## 📐 Didactic Slide Structure Guide

A complete Marp slide deck should follow a clear, educational progression:

### 1. Cover Slide (`<!-- _class: lead -->`)
```markdown
<!-- _class: lead -->

# Title of the Lesson

Subtitle or overview of topics (e.g. Origin, Specifications, Runtimes and Execution).
```

### 2. Lesson Objectives Slide
```markdown
## Objetivos

Compreender os fundamentos e o ecossistema do tema:

- **Tópico 1**: Entender a origem e os conceitos principais.
- **Tópico 2**: Diferenciar a especificação base das APIs do ambiente.
- **Tópico 3**: Executar código e analisar comportamentos na prática.
```

### 3. Context & Importance Slide
```markdown
## Por Que Isso Importa?

- **No Navegador**: Adiciona interatividade e manipula o DOM.
- **No Servidor**: Permite construir APIs HTTP e manipular arquivos.
- **Nas Ferramentas**: Automatiza builds, linters e testes.

*Nota de destaque ou regra de ouro.*
```

### 4. Technical Concepts & Code Examples
Use clear code blocks with proper syntax highlighting:

```markdown
## Exemplo Prático

```javascript
// Exemplo de código limpo e direto
const greeting = "Olá, DevLab!";
console.log(greeting.toUpperCase());
```

- **Observação**: Explicação concisa do código acima.
```

### 5. Text Diagrams & Visual Schemas
Use clean ASCII / Box-drawing characters for architectural flows:

```markdown
## Arquitetura do Ambiente

```txt
┌─────────────────────────────────────────────────────────────┐
│                        ECMAScript                           │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       ┌───────────────┐               ┌───────────────┐
       │   Web APIs    │               │   Node APIs   │
       └───────────────┘               └───────────────┘
```
```

### 6. Summary / Key Takeaways Slide
```markdown
## Resumo & Pontos Chave

- **Conceito A**: Síntese do aprendizado principal.
- **Conceito B**: Diretriz para a prática.
- **Próximos Passos**: Indicação do próximo assunto ou exercício.
```

---

## 🛠️ Build & Compilation Commands

### 1. Build All Slides:
```bash
pnpm run build:slides
```
This executes `node scripts/build-slides.mjs`, invoking `marp --no-stdin <file.md> -o <output.html>` for every slide in `slides/`.

### 2. Verify Astro Project & Diagnostics:
```bash
pnpm run check
```

---

## ⚠️ Common Pitfalls to Avoid

1. **Missing Slide Separators**: Use `---` on a new line between every slide.
2. **Text Overcrowding**: Limit each slide to 4-6 bullet points or 1 short code block so content fits without scrolling.
3. **Unescaped Pagination**: Always include the pagination CSS in `style: |` section for proper total page counts (`1 / 12`).
