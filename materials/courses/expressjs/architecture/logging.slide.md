---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Log"
description: "Log de requisições em uma API Express: middleware nativo, morgan e pino, níveis de log, log estruturado em JSON, correlação por request id e health check."
---

<!-- _class: lead -->

# Express.js: Log

Log de requisições em uma API Express: middleware nativo, morgan e pino, níveis de log, log estruturado em JSON, correlação por request id e health check.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Log** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## O que registrar

- Conceitos fundamentais de **O que registrar** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Um middleware de log

- Conceitos fundamentais de **Um middleware de log** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Correlacionando com um request id

- Conceitos fundamentais de **Correlacionando com um request id** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Log legível e log estruturado

- Conceitos fundamentais de **Log legível e log estruturado** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Níveis

- Conceitos fundamentais de **Níveis** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Pacotes prontos

- Conceitos fundamentais de **Pacotes prontos** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Health check

- Subtópico: Log de requisições
- Subtópico: Operação
- [Express — Production best practices: performance and reliability](https://expressjs.com/en/advanced/best-practice-performance.html)
- [morgan](https://www.npmjs.com/package/morgan)
- [pino-http](https://www.npmjs.com/package/pino-http)

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Log**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Log**: Log de requisições em uma API Express: middleware nativo, morgan e pino, níveis de log, log estruturado em JSON, correlação por request id e health check.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
