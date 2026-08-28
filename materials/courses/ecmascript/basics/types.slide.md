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
title: "JavaScript: Tipos de Dados e Coerção"
description: "Slides da aula JavaScript: Tipos de Dados e Coerção do Guia de ECMAScript."
---

<!-- _class: lead -->

# JavaScript: Tipos de Dados e Coerção

Tipos primitivos e objetos, operador typeof, tipagem dinâmica vs fraca e coerção implícita vs explícita.

---

## Objetivos

- Identificar os 7 tipos primitivos.
- Entender a coerção de tipos.
- Utilizar o operador typeof.

---

## Primitivos vs Objetos

- Primitivos: Passados por VALOR.
- Objetos: Passados por REFERÊNCIA.

---

## Coerção Explícita

- Prefira Number(x) a x * 1.

---

## Resumo da Aula

- **Primitivos**: Valores imutáveis
- **Objetos**: Estrutura mutável por referência
