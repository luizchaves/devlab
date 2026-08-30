---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Cadastro de Usuário"
description: "A rota pública de cadastro em uma API Express: modelo de usuário, hash da senha no model, campos que nunca saem na resposta, atribuição em massa, e-mail único e enumeração de contas."
---

<!-- _class: lead -->

# Express.js: Cadastro de Usuário

A rota pública de cadastro em uma API Express: modelo de usuário, hash da senha no model, campos que nunca saem na resposta, atribuição em massa, e-mail único e enumeração de contas.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Cadastro de Usuário** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## O modelo de usuário

- Conceitos fundamentais de **O modelo de usuário** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O fluxo do cadastro

- Conceitos fundamentais de **O fluxo do cadastro** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O hash pertence ao model

- Conceitos fundamentais de **O hash pertence ao model** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O controller

- Conceitos fundamentais de **O controller** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## A resposta

- Conceitos fundamentais de **A resposta** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Enumeração de contas

- Conceitos fundamentais de **Enumeração de contas** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Requisitos de senha

- Subtópico: Modelo
- Subtópico: Segurança
- [OWASP — Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AuthenticationCheatSheet.html)
- [NIST SP 800-63B — Digital Identity Guidelines](https://pages.nist.gov/800-63-4/sp800-63b.html)
- [OWASP — Mass Assignment Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/MassAssignmentCheatSheet.html)

---

## Na prática

- Conceitos fundamentais de **Na prática** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Cadastro de Usuário**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Cadastro de Usuário**: A rota pública de cadastro em uma API Express: modelo de usuário, hash da senha no model, campos que nunca saem na resposta, atribuição em massa, e-mail único e enumeração de contas.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
