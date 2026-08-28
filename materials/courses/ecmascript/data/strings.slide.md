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
title: "JavaScript: Strings e Template Literals"
description: "Slides da aula JavaScript: Strings e Template Literals do Guia de ECMAScript."
---

<!-- _class: lead -->

# JavaScript: Strings e Template Literals

Imutabilidade de strings, interpolação com template literals, métodos de fatiamento, busca e tagged templates.

---

## Objetivos

- Utilizar Template Literals (${}).
- Dominar métodos de busca e fatiamento.

---

## Imutabilidade

- Métodos de string retornam uma nova string.

---

## Template Literals

- Interpolação de expressões com crases.

---

## Resumo da Aula

- **Template Literals**: Interpolação limpa
- **Imutabilidade**: Retorna nova string
