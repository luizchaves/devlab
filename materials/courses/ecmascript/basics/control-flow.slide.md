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
title: "JavaScript: Estruturas de Controle"
description: "Slides da aula JavaScript: Estruturas de Controle do Guia de ECMAScript."
---

<!-- _class: lead -->

# JavaScript: Estruturas de Controle

Desvio condicional com if/else e switch/case, laços de repetição for, while, do...while, for...of e for...in.

---

## Objetivos

- Dominar condicionais if/else e switch.
- Diferenciar for...of de for...in.

---

## for...of

- Itera sobre os VALORES da coleção.

---

## for...in

- Itera sobre as CHAVES do objeto.

---

## Resumo da Aula

- **for...of**: Valores de coleção
- **for...in**: Chaves de objeto
