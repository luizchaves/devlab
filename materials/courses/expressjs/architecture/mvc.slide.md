---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: MVC"
description: "Arquitetura em camadas de uma aplicação Express: model, controller, router e middleware, direção das dependências, o que cada arquivo pode conhecer e quando acrescentar uma camada de serviço."
---

<!-- _class: lead -->

# Express.js: MVC

Arquitetura em camadas de uma aplicação Express: model, controller, router e middleware, direção das dependências, o que cada arquivo pode conhecer e quando acrescentar uma camada de serviço.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: MVC** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## As quatro peças

- Conceitos fundamentais de **As quatro peças** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## A direção das dependências

- Conceitos fundamentais de **A direção das dependências** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Estrutura de diretórios

- Conceitos fundamentais de **Estrutura de diretórios** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## A cadeia montada em `app.ts`

- Conceitos fundamentais de **A cadeia montada em `app.ts`** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O controller nunca toca no armazenamento

- Conceitos fundamentais de **O controller nunca toca no armazenamento** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O que mudou desde a aula de Rotas

- Conceitos fundamentais de **O que mudou desde a aula de Rotas** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Quando acrescentar uma camada

- Conceitos fundamentais de **Quando acrescentar uma camada** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Testando a API

- Subtópico: Camadas
- Subtópico: Evolução
- [Express — Routing](https://expressjs.com/en/guide/routing.html)
- [MVC | MDN Glossary](https://developer.mozilla.org/en-US/docs/Glossary/MVC)
- [Node.js — Anti-patterns](https://nodejs.org/en/learn/getting-started/security-best-practices)

---

## Na prática

- Conceitos fundamentais de **Na prática** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: MVC**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: MVC**: Arquitetura em camadas de uma aplicação Express: model, controller, router e middleware, direção das dependências, o que cada arquivo pode conhecer e quando acrescentar uma camada de serviço.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
