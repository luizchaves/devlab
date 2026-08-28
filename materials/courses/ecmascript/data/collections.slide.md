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
title: "JavaScript: Map, Set e Coleções Fracas"
description: "Slides da aula JavaScript: Map, Set e Coleções Fracas do Guia de ECMAScript."
---

<!-- _class: lead -->

# JavaScript: Map, Set e Coleções Fracas

Estruturas de dados modernas: dicionários Map, conjuntos Set para valores únicos e referências fracas com WeakMap/WeakSet.

---

## Objetivos

- Utilizar Set para dados únicos.
- Diferenciar Map de Object.
- Conhecer WeakMap e WeakSet.

---

## Set

- Conjunto que elimina duplicatas automaticamente.

---

## Map

- Dicionário com chaves de qualquer tipo.

---

## Resumo da Aula

- **Set**: Valores únicos
- **Map**: Dicionário flexível
