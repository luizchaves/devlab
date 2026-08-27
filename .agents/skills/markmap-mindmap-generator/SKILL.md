---
name: markmap-mindmap-generator
description: >-
  Generates interactive Markmap mindmap Markdown files (.md) and compiles them into interactive HTML mindmap visualizations. Use whenever the user requests creating mindmaps, visual branch maps, topic hierarchies, or Markmap diagrams.
---

# Markmap Mindmap Generator

This skill guides the agent in designing, structuring, and generating interactive Markmap mindmaps (`.md`) and building them into HTML visualizations with level controls in DevLab.

---

## 📁 File Location & Naming Conventions

All mindmap Markdown files in DevLab must be created under `mindmaps/`, mirroring the course hierarchy:

```
mindmaps/courses/<course-id>/<category>/<topic>.md
```

### Example:
- Course documentation: `src/content/docs/courses/cstrc-jp-dw/javascript/ecmascript.mdx`
- Mindmap source: `mindmaps/courses/cstrc-jp-dw/javascript/ecmascript.md`
- Compiled HTML output: `public/mindmaps/courses/cstrc-jp-dw/javascript/ecmascript/index.html`

---

## 📄 Markmap Frontmatter & Metadata Template

Every Markmap mindmap file **MUST** begin with the standard YAML frontmatter:

```yaml
---
title: 'JavaScript: [Nome do Tópico]'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---
```

---

## 📐 Mindmap Tree Structure Guide

Markmaps use standard Markdown heading levels (`#`, `##`, `###`) and unordered bullet lists (`-`) to represent visual tree nodes:

```markdown
# Main Subject Title (Level 1 Root Node)

## 1. Ideia Central & Contexto (Level 2 Main Branch)

- **Definição**: Conceito principal em 1 frase.
- **Propósito**: Para que serve e onde se aplica na prática.

## 2. Conceitos & Arquitetura (Level 2 Main Branch)

### Sub-conceito A (Level 3 Node)
- **Detalhe 1**: Descrição concisa com palavras em **negrito**.
- **Detalhe 2**: Exemplo curto ou método `` `method()` ``.

### Sub-conceito B (Level 3 Node)
- **Detalhe 1**: Explicação da funcionalidade.
- **Detalhe 2**: Casos de uso práticos.

## 3. Métodos & Sintaxe (Level 2 Main Branch)

- `` `métodoA()` ``: Descrição rápida de entrada/saída.
- `` `métodoB()` ``: Descrição rápida da transformação.

## 4. Boas Práticas & Regras de Ouro (Level 2 Main Branch)

- **Regra 1**: Recomendação principal para código previsível.
- **Regra 2**: O que evitar (pitfalls/armadilhas).
```

---

## 🛠️ Build & Compilation Commands

### 1. Build All Mindmaps:
```bash
pnpm run build:mindmaps
```
This executes `node scripts/build-mindmaps.mjs`, which:
- Invokes `markmap <file.md> -o <output.html> --offline --no-open`.
- Automatically injects interactive level control buttons (`Níveis: 2, 3, 4, Todos`) into the output HTML.

### 2. Verify Astro Project & Diagnostics:
```bash
pnpm run check
```

---

## ⚠️ Common Pitfalls to Avoid

1. **Overly Dense Nodes**: Keep text inside mindmap nodes short and punchy (1-2 lines per bullet). Long paragraphs clutter the visual map.
2. **Inconsistent Heading Levels**: Do not skip heading levels (e.g. going from `#` directly to `###`).
3. **Missing `initialExpandLevel: 2`**: Always include frontmatter so the mindmap opens neatly focused on level 2 nodes.
