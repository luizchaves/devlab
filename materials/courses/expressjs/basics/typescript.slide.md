---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: TypeScript"
description: "Migração de uma API Express de JavaScript para TypeScript: execução nativa de .ts no Node, tsconfig, tipagem de req e res, tipos do domínio e extensão do Request."
---

<!-- _class: lead -->

# Express.js: TypeScript

Migração de uma API Express de JavaScript para TypeScript: execução nativa de .ts no Node, tsconfig, tipagem de req e res, tipos do domínio e extensão do Request.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: TypeScript** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## Por que migrar cedo

- Conceitos fundamentais de **Por que migrar cedo** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O Node executa `.ts` direto

- Conceitos fundamentais de **O Node executa `.ts` direto** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Instalação

- Conceitos fundamentais de **Instalação** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Imports por `#` em vez de `../../..`

- Conceitos fundamentais de **Imports por `#` em vez de `../../..`** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Tipando `req` e `res`

- Conceitos fundamentais de **Tipando `req` e `res`** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Tipos do domínio

- Conceitos fundamentais de **Tipos do domínio** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Estendendo o `Request`

- Conceitos fundamentais de **Estendendo o `Request`** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## A migração, arquivo por arquivo

- Conceitos fundamentais de **A migração, arquivo por arquivo** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## E o `tsx`?

- Subtópico: Execução
- Subtópico: Tipagem
- [Node.js — TypeScript](https://nodejs.org/api/typescript.html)
- [Node.js — Subpath imports](https://nodejs.org/api/packages.html#subpath-imports)
- [TypeScript — Modules reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html)

---

## Na prática

- Conceitos fundamentais de **Na prática** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: TypeScript**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: TypeScript**: Migração de uma API Express de JavaScript para TypeScript: execução nativa de .ts no Node, tsconfig, tipagem de req e res, tipos do domínio e extensão do Request.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
