---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Tratamento de Erros"
description: "Centralização do tratamento de erros em uma API Express: classe HttpError, erros operacionais e de programação, tradução de erros do banco, formato de resposta e falhas fora do ciclo de requisição."
---

<!-- _class: lead -->

# Express.js: Tratamento de Erros

Centralização do tratamento de erros em uma API Express: classe HttpError, erros operacionais e de programação, tradução de erros do banco, formato de resposta e falhas fora do ciclo de requisição.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Tratamento de Erros** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## Duas naturezas de erro

- Conceitos fundamentais de **Duas naturezas de erro** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O caminho de um erro

- Conceitos fundamentais de **O caminho de um erro** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## A classe `HttpError`

- Conceitos fundamentais de **A classe `HttpError`** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O middleware de erro

- Conceitos fundamentais de **O middleware de erro** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Erros `async` no Express 5

- Conceitos fundamentais de **Erros `async` no Express 5** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Traduzindo erros de bibliotecas

- Conceitos fundamentais de **Traduzindo erros de bibliotecas** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O formato da resposta de erro

- Conceitos fundamentais de **O formato da resposta de erro** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Falhas fora do ciclo de requisição

- Subtópico: Naturezas
- Subtópico: Fluxo
- [Express — Error handling](https://expressjs.com/en/guide/error-handling.html)
- [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)
- [Node.js — Error handling best practices](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop)

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Tratamento de Erros**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Tratamento de Erros**: Centralização do tratamento de erros em uma API Express: classe HttpError, erros operacionais e de programação, tradução de erros do banco, formato de resposta e falhas fora do ciclo de requisição.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
