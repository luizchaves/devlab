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
title: "JavaScript: Promises e Async/Await"
description: "Slides da aula JavaScript: Promises e Async/Await do Guia de ECMAScript."
---

<!-- _class: lead -->

# JavaScript: Promises e Async/Await

Modelo assíncrono, Event Loop, Microtask Queue, estados de uma Promise, combinadores (all, allSettled, race, any) e async/await.

---

## Objetivos

- Compreender o Event Loop.
- Dominar Promises e Async/Await.

---

## Async/Await

- Açúcar sintático sobre Promises que simplifica o fluxo.

---

## Resumo da Aula

- **Promises**: Objetos assíncronos
- **async/await**: Sintaxe limpa
