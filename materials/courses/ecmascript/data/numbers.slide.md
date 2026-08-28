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
