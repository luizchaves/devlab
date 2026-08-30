---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: SQL com Node.js"
description: "Persistência sem ORM usando o módulo nativo node:sqlite: conexão, statements preparados, injeção de SQL, migrations, seeders e a camada de model de uma API Express."
---

<!-- _class: lead -->

# Express.js: SQL com Node.js

Persistência sem ORM usando o módulo nativo node:sqlite: conexão, statements preparados, injeção de SQL, migrations, seeders e a camada de model de uma API Express.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: SQL com Node.js** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## Por que começar sem ORM

- Conceitos fundamentais de **Por que começar sem ORM** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O módulo `node:sqlite`

- Conceitos fundamentais de **O módulo `node:sqlite`** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Statements preparados e injeção de SQL

- Conceitos fundamentais de **Statements preparados e injeção de SQL** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Um invólucro de promessas

- Conceitos fundamentais de **Um invólucro de promessas** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Migrations e seeders

- Conceitos fundamentais de **Migrations e seeders** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O model reescrito

- Conceitos fundamentais de **O model reescrito** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Estrutura do projeto

- Subtópico: `node:sqlite`
- Subtópico: Segurança e organização
- [Node.js — node:sqlite](https://nodejs.org/api/sqlite.html)
- [SQLite — SQL syntax](https://www.sqlite.org/lang.html)
- [OWASP — SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQLInjectionPreventionCheatSheet.html)

---

## Na prática

- Conceitos fundamentais de **Na prática** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: SQL com Node.js**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: SQL com Node.js**: Persistência sem ORM usando o módulo nativo node:sqlite: conexão, statements preparados, injeção de SQL, migrations, seeders e a camada de model de uma API Express.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
