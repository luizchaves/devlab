---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Tempo Real"
description: "Atualização em tempo real a partir de uma API Express: polling, Server-Sent Events nativos, WebSocket, comparação entre as três abordagens e o que muda com várias instâncias."
---

<!-- _class: lead -->

# Express.js: Tempo Real

Atualização em tempo real a partir de uma API Express: polling, Server-Sent Events nativos, WebSocket, comparação entre as três abordagens e o que muda com várias instâncias.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Tempo Real** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## Três formas de atualizar o cliente

- Conceitos fundamentais de **Três formas de atualizar o cliente** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Polling

- Conceitos fundamentais de **Polling** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Server-Sent Events

- Conceitos fundamentais de **Server-Sent Events** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## WebSocket

- Conceitos fundamentais de **WebSocket** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O problema das várias instâncias

- Subtópico: Escolha
- Subtópico: Implementação
- [Server-Sent Events | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Server-sentevents)
- [EventSource | MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
- [WebSocket API | MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocketsAPI)

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Tempo Real**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Tempo Real**: Atualização em tempo real a partir de uma API Express: polling, Server-Sent Events nativos, WebSocket, comparação entre as três abordagens e o que muda com várias instâncias.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
