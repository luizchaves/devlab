---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Testes"
description: "Testes de uma API Express: node:test nativo, testes de unidade e de integração com supertest, banco de testes isolado, cobertura e testes de ponta a ponta com Playwright."
---

<!-- _class: lead -->

# Express.js: Testes

Testes de uma API Express: node:test nativo, testes de unidade e de integração com supertest, banco de testes isolado, cobertura e testes de ponta a ponta com Playwright.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Testes** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## Os três níveis

- Conceitos fundamentais de **Os três níveis** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O executor nativo

- Conceitos fundamentais de **O executor nativo** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Teste de unidade

- Conceitos fundamentais de **Teste de unidade** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Teste de integração com `supertest`

- Conceitos fundamentais de **Teste de integração com `supertest`** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Testando rotas protegidas

- Conceitos fundamentais de **Testando rotas protegidas** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Isolando o banco

- Conceitos fundamentais de **Isolando o banco** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Cobertura

- Conceitos fundamentais de **Cobertura** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Ponta a ponta com Playwright

- Subtópico: Níveis
- Subtópico: Prática
- [Node.js — Test runner](https://nodejs.org/api/test.html)
- [Node.js — assert](https://nodejs.org/api/assert.html)
- [supertest](https://www.npmjs.com/package/supertest)

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Testes**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Testes**: Testes de uma API Express: node:test nativo, testes de unidade e de integração com supertest, banco de testes isolado, cobertura e testes de ponta a ponta com Playwright.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
