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
title: "JavaScript: Arrays e Métodos Funcionais"
description: "Slides da aula JavaScript: Arrays e Métodos Funcionais do Guia de ECMAScript."
---

<!-- _class: lead -->

# JavaScript: Arrays e Métodos Funcionais

Coleções ordenadas, mutação vs imutabilidade, métodos iterativos (map, filter, reduce, find, flatMap) e métodos de cópia (toSorted).

---

## Objetivos

- Dominar map, filter e reduce.
- Diferenciar métodos mutáveis de imutáveis.

---

## Métodos Funcionais

- map: Transforma elementos.
- filter: Seleciona elementos.
- reduce: Acumula um valor final.

---

## Resumo da Aula

- **map**: Transformação
- **filter**: Filtragem
- **reduce**: Acumulação
