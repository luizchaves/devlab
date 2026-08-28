---
marp: true
theme: default
paginate: true
style: |
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 70px;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "JavaScript: Módulos ES (ESM)"
description: "Slides da aula JavaScript: Módulos ES (ESM) do Guia de ECMAScript."
---

<!-- _class: lead -->

# JavaScript: Módulos ES (ESM)

Modularização nativa com export/import nomeado e default, dynamic import(), e diferenças entre CommonJS e ECMAScript Modules.

---

## Objetivos

- Utilizar export e import.
- Diferenciar ESM de CommonJS.

---

## ES Modules

- Padrão nativo do ECMAScript com import/export.

---

## Resumo da Aula

- **ESM**: Módulos nativos ES
- **CommonJS**: Módulos legados Node
