---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Middleware"
description: "A cadeia de middlewares do Express: assinatura, ordem de execução, escopo, middlewares de fábrica, tratamento de erros e os middlewares embutidos e de terceiros."
---

<!-- _class: lead -->

# Express.js: Middleware

A cadeia de middlewares do Express: assinatura, ordem de execução, escopo, middlewares de fábrica, tratamento de erros e os middlewares embutidos e de terceiros.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Middleware** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## A assinatura

- Conceitos fundamentais de **A assinatura** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## A cadeia de responsabilidade

- Conceitos fundamentais de **A cadeia de responsabilidade** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Os cinco tipos

- Conceitos fundamentais de **Os cinco tipos** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Middleware de fábrica

- Conceitos fundamentais de **Middleware de fábrica** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Middleware de erro

- Conceitos fundamentais de **Middleware de erro** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Embutidos e de terceiros

- Subtópico: Cadeia
- Subtópico: Erros
- [Express — Using middleware](https://expressjs.com/en/guide/using-middleware.html)
- [Express — Writing middleware](https://expressjs.com/en/guide/writing-middleware.html)
- [Express — Error handling](https://expressjs.com/en/guide/error-handling.html)

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Middleware**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Middleware**: A cadeia de middlewares do Express: assinatura, ordem de execução, escopo, middlewares de fábrica, tratamento de erros e os middlewares embutidos e de terceiros.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
