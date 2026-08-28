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
title: "JavaScript: Objetos e Protótipos"
description: "Slides da aula JavaScript: Objetos e Protótipos do Guia de ECMAScript."
---

<!-- _class: lead -->

# JavaScript: Objetos e Protótipos

Objetos literais, propriedades dinâmicas, desestruturação, sintaxe spread/rest, Object.keys/values e a cadeia de protótipos.

---

## Objetivos

- Criar e manipular Objetos literais.
- Usar Desestruturação e Spread.
- Entender a cadeia de Protótipos.

---

## Desestruturação

- Sintaxe limpa para extrair chaves de objetos.

---

## Protótipos

- Objetos herdam métodos através de Object.prototype.

---

## Resumo da Aula

- **Objetos**: Chave-valor
- **Protótipos**: Herança proctotípica
