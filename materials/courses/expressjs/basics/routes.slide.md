---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Rotas"
description: "Roteamento no Express: caminhos e padrões, parâmetros de rota, query string e corpo, encadeamento de handlers e modularização com express.Router()."
---

<!-- _class: lead -->

# Express.js: Rotas

Roteamento no Express: caminhos e padrões, parâmetros de rota, query string e corpo, encadeamento de handlers e modularização com express.Router().

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Rotas** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## Caminho, método e handler

- Conceitos fundamentais de **Caminho, método e handler** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Os três lugares por onde os dados chegam

- Subtópico: Parâmetro de rota
- Subtópico: Query string
- Subtópico: Corpo da requisição

---

## Encadeando handlers

- Conceitos fundamentais de **Encadeando handlers** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Modularizando com `express.Router()`

- Conceitos fundamentais de **Modularizando com `express.Router()`** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Testando

- Subtópico: Parâmetros
- Subtópico: Router
- [Express — Routing guide](https://expressjs.com/en/guide/routing.html)
- [Express — Router API](https://expressjs.com/en/5x/api.html#router)
- [Express 5 — Path route matching syntax](https://expressjs.com/en/guide/migrating-5.html#path-syntax)

---

## Na prática

- Conceitos fundamentais de **Na prática** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Rotas**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Rotas**: Roteamento no Express: caminhos e padrões, parâmetros de rota, query string e corpo, encadeamento de handlers e modularização com express.Router().
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
