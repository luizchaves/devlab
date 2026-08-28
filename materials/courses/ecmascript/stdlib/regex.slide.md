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
title: "JavaScript: Expressões Regulares (RegExp)"
description: "Slides da aula JavaScript: Expressões Regulares (RegExp) do Guia de ECMAScript."
---

<!-- _class: lead -->

# JavaScript: Expressões Regulares (RegExp)

Padrões de busca em texto, sintaxe de caracteres, metacaracteres, flags (g, i, m, u), test, matchAll, grupos e lookaround.

---

## Objetivos

- Criar padrões com RegExp.
- Usar os métodos test() e matchAll().

---

## RegExp

- Ferramenta poderosa para validação e busca em strings.

---

## Resumo da Aula

- **RegExp**: Busca de padrões
- **test()**: Validação booleana
