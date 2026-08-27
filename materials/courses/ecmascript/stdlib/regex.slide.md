---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
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
