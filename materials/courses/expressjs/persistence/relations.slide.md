---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Relações com Prisma"
description: "Modelagem de relacionamentos com Prisma em uma API Express: um-para-muitos, muitos-para-muitos, chave estrangeira, include e select aninhados, criação encadeada e comportamento na exclusão."
---

<!-- _class: lead -->

# Express.js: Relações com Prisma

Modelagem de relacionamentos com Prisma em uma API Express: um-para-muitos, muitos-para-muitos, chave estrangeira, include e select aninhados, criação encadeada e comportamento na exclusão.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Relações com Prisma** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## O modelo de dados

- Conceitos fundamentais de **O modelo de dados** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Um-para-muitos

- Conceitos fundamentais de **Um-para-muitos** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Muitos-para-muitos

- Conceitos fundamentais de **Muitos-para-muitos** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Carregando dados relacionados

- Conceitos fundamentais de **Carregando dados relacionados** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Filtrando por relação

- Conceitos fundamentais de **Filtrando por relação** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Criando registros ligados

- Conceitos fundamentais de **Criando registros ligados** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O que acontece na exclusão

- Conceitos fundamentais de **O que acontece na exclusão** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O problema N+1

- Subtópico: Modelagem
- Subtópico: Consultas
- [Prisma — Relations](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations)
- [Prisma — Select fields](https://www.prisma.io/docs/orm/prisma-client/queries/select-fields)
- [Prisma — Nested writes](https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries)

---

## Na prática

- Conceitos fundamentais de **Na prática** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Relações com Prisma**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Relações com Prisma**: Modelagem de relacionamentos com Prisma em uma API Express: um-para-muitos, muitos-para-muitos, chave estrangeira, include e select aninhados, criação encadeada e comportamento na exclusão.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
