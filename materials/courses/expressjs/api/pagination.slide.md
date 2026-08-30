---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Paginação, Filtros e Ordenação"
description: "Parâmetros de consulta em coleções que crescem: paginação por offset e por cursor, envelope de resposta, filtros combináveis, ordenação com lista de campos permitidos e limites de segurança."
---

<!-- _class: lead -->

# Express.js: Paginação, Filtros e Ordenação

Parâmetros de consulta em coleções que crescem: paginação por offset e por cursor, envelope de resposta, filtros combináveis, ordenação com lista de campos permitidos e limites de segurança.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Paginação, Filtros e Ordenação** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## Por que não devolver tudo

- Conceitos fundamentais de **Por que não devolver tudo** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Paginação por offset

- Conceitos fundamentais de **Paginação por offset** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Paginação por cursor

- Conceitos fundamentais de **Paginação por cursor** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Filtros combináveis

- Conceitos fundamentais de **Filtros combináveis** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Ordenação com lista de permitidos

- Conceitos fundamentais de **Ordenação com lista de permitidos** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O contrato completo

- Subtópico: Paginação
- Subtópico: Filtros e ordenação
- [Prisma — Pagination](https://www.prisma.io/docs/orm/prisma-client/queries/pagination)
- [RFC 8288 — Web Linking (cabeçalho Link)](https://www.rfc-editor.org/rfc/rfc8288.html)
- [OWASP — Mass Assignment Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/MassAssignmentCheatSheet.html)

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Paginação, Filtros e Ordenação**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Paginação, Filtros e Ordenação**: Parâmetros de consulta em coleções que crescem: paginação por offset e por cursor, envelope de resposta, filtros combináveis, ordenação com lista de campos permitidos e limites de segurança.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
