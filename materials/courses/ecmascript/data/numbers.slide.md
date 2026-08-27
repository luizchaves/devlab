---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Numbers, BigInt e Math"
description: "Slides da aula JavaScript: Numbers, BigInt e Math do Guia de ECMAScript."
---

<!-- _class: lead -->

# JavaScript: Numbers, BigInt e Math

Representação IEEE 754 float64, imprecisão de ponto flutuante, inteiros gigantes com BigInt e métodos da biblioteca Math.

---

## Objetivos

- Compreender o padrão IEEE 754.
- Utilizar BigInt para inteiros gigantes.
- Usar a biblioteca Math.

---

## Float64

- 0.1 + 0.2 exige arredondamento com toFixed().

---

## BigInt

- Identificado pelo sufixo n para inteiros grandes.

---

## Resumo da Aula

- **number**: Float64 IEEE 754
- **bigint**: Inteiros de alta precisão
