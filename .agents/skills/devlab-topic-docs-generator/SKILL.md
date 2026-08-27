---
name: devlab-topic-docs-generator
description: >-
  Generates comprehensive, didactic MDX course documentation pages for DevLab subjects (e.g., ECMAScript, Arrays, Strings, Functions, Control Flow, Objects). Use whenever the user requests creating, updating, or expanding course documentation topics in Astro Starlight MDX format.
---

# DevLab Course Topic Documentation Generator

This skill guides the agent in writing, structuring, and maintaining comprehensive, highly didactic MDX course documentation pages for DevLab subjects (`.mdx`) using Astro Starlight.

---

## 📁 File Location & Naming Conventions

All course topic documentation files in DevLab must be created under `src/content/docs/courses/`:

```
src/content/docs/courses/<course-id>/<category>/<topic>.mdx
```

### Example:
- Course ID: `cstrc-jp-dw` (Construção de Páginas Web / JavaScript)
- Category: `javascript`
- File: `src/content/docs/courses/cstrc-jp-dw/javascript/arrays.mdx`

---

## 📄 Standard MDX Header & Material Links Template

Every DevLab documentation topic **MUST** start with standard Starlight frontmatter, component imports, and material links:

```mdx
---
title: "JavaScript: [Nome do Tópico]"
description: "Descrição completa e didática sobre [Tópico], métodos, sintaxe, casos de uso e boas práticas."
course: cstrc-jp-dw
---

import { Aside, Card, CardGrid, Steps, Tabs, TabItem } from '@astrojs/starlight/components';

Materiais: [slides da aula](../../../../slides/courses/cstrc-jp-dw/javascript/<topic>/) e
[mapa mental](../../../../mindmaps/courses/cstrc-jp-dw/javascript/<topic>/)
```

If an Excalidraw visual presentation exists, include it in the materials line:
```mdx
Materiais: [slides da aula](../../../../slides/courses/cstrc-jp-dw/javascript/<topic>/),
[mapa mental](../../../../mindmaps/courses/cstrc-jp-dw/javascript/<topic>/) e
[apresentação excalidraw](../../../../excalidraw/courses/cstrc-jp-dw/javascript/<topic>.excalidraw)
```

---

## 📐 Required Document Structure & Didactic Progression

To maintain consistency across all subjects in DevLab, every topic page **MUST** include the following logical sections in order:

### 1. Introduction & Real-World Context
Explain what the topic is, why it exists, and where it is used in web development (in browser, in Node.js server, in tooling).

### 2. `## Objetivo`
Clear, bulleted learning outcomes describing what the student will learn and master by reading this page.

### 3. `## Por Que [Tópico] Importa?`
Practical motivation explaining how this topic solves real-world development challenges. Include Starlight Callout components (`<Aside type="note">`).

### 4. Technical Concepts & Internal Mechanisms
Detailed explanation of concepts, terminology, memory model, or internal execution mechanisms.
- Use Markdown comparison tables (`| Conceito | Descrição | Exemplo |`).
- Use `<Aside type="caution">` to highlight common developer pitfalls or syntax traps.

### 5. Sintaxe, Métodos e Operações Principais
Organize methods or operations systematically:
- Group related methods using `<Tabs>` and `<TabItem>` components.
- Provide clear code snippets with comments explaining input, transformation, and output.

```mdx
<Tabs>
  <TabItem label="Leitura & Acesso">
    ```javascript
    const items = ['HTML', 'CSS', 'JS'];
    console.log(items[0]); // 'HTML'
    ```
  </TabItem>
  <TabItem label="Modificação">
    ```javascript
    items.push('Node.js'); // Adiciona ao final
    ```
  </TabItem>
</Tabs>
```

### 6. `## Exemplo Prático Completo`
Provide a complete, realistic, executable code example demonstrating how all concepts work together (e.g. processing data, filtering arrays, transforming strings).

### 7. `## Resumo e Boas Práticas`
Concise bulleted summary of key takeaways and golden rules for clean code.

---

## 🧩 Starlight UI Components Reference

- **`<Aside type="note" title="...">`**: General contextual explanations or tips.
- **`<Aside type="caution" title="...">`**: Warnings, type coercion traps, or common bugs.
- **`<Aside type="tip" title="...">`**: Performance optimizations or modern ES features.
- **`<CardGrid>` and `<Card title="..." icon="...">`**: Visual highlight grids for key features or paradigms.
- **`<Steps>`**: Step-by-step procedures or workflow tutorials.

---

## 🛠️ Verification & Quality Checks

Always verify that generated MDX files build cleanly without Astro diagnostics errors:

```bash
pnpm run check
```

---

## ⚠️ Common Pitfalls to Avoid

1. **Unclosed Component Tags**: Ensure all `<Aside>`, `<Card>`, `<Tabs>`, `<TabItem>` tags have matching closing tags.
2. **Broken Relative Links**: Double check relative depth (`../../../../slides/...`) for material links.
3. **Missing Code Highlighting Identifiers**: Always declare language on code blocks (` ```javascript `, ` ```html `, ` ```bash `).
