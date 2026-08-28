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
title: "JavaScript: Introdução e Ecossistema"
description: "Slides da aula JavaScript: Introdução e Ecossistema do Guia de ECMAScript."
---

<!-- _class: lead -->

# JavaScript: Introdução e Ecossistema

Origem do JavaScript, especificação ECMA-262, comitê TC39, motores V8/JSC e separação entre linguagem e ambiente.

---

## Objetivos

- Diferenciar JavaScript de ECMAScript.
- Compreender a função do comitê TC39.
- Diferenciar Web APIs de Node APIs.

---

## Padronização

- ECMAScript define as regras do idioma.
- TC39 gerencia as propostas de novas edições.

---

## Runtimes

- Node.js, Deno e Bun rodam código no servidor.

---

## Resumo da Aula

- **ECMAScript**: Especificação base
- **JavaScript**: Implementação comercial
