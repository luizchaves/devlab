---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Variáveis, Escopo e Hoisting"
description: "Slides da aula JavaScript: Variáveis, Escopo e Hoisting do Guia de ECMAScript."
---

<!-- _class: lead -->

# JavaScript: Variáveis, Escopo e Hoisting

Declaração de variáveis com var, let e const, escopo de bloco vs função, hoisting e Temporal Dead Zone (TDZ).

---

## Objetivos

- Compreender escopo de bloco e função.
- Entender a diferença entre let, const e var.
- Identificar hoisting e TDZ.

---

## Escopos

- Global: Acessível em todo o script.
- Função: Isolado dentro de function.
- Bloco: Isolado dentro de chaves {}.

---

## Hoisting

- Elevação da declaração antes da execução.

---

## Resumo da Aula

- **const**: Uso padrão
- **let**: Para reatribuição
- **var**: Legado
