---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Tratamento de Erros"
description: "Slides da aula JavaScript: Tratamento de Erros do Guia de ECMAScript."
---

<!-- _class: lead -->

# JavaScript: Tratamento de Erros

Hierarquia do objeto Error, tratamento com try/catch/finally, lançamento com throw e criação de erros customizados.

---

## Objetivos

- Utilizar o bloco try/catch/finally.
- Lançar erros com throw.
- Criar exceções legíveis.

---

## try...catch

- Captura exceções de runtime sem travar o app.

---

## finally

- Bloco executado sempre ao final.

---

## Resumo da Aula

- **try/catch**: Tratamento de erro
- **throw**: Lançamento explícito
