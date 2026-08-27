---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Expressões e Operadores"
description: "Slides da aula JavaScript: Expressões e Operadores do Guia de ECMAScript."
---

<!-- _class: lead -->

# JavaScript: Expressões e Operadores

Operadores aritméticos, lógicos, comparação estrita (===), curto-circuito, nullish coalescing (??) e optional chaining (?.).

---

## Objetivos

- Dominar o operador estrito ===.
- Usar Nullish Coalescing (??).
- Usar Optional Chaining (?.).

---

## Igualdade Estrita

- === compara valor E tipo sem mágicas.

---

## ES2020+

- ?? preserva 0 e string vazia.
- ?. evita TypeError em objetos profundos.

---

## Resumo da Aula

- **===**: Comparação estrita
- **??**: Nullish Coalescing
- **?.**: Optional Chaining
