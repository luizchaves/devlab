---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Controllers"
description: "Separação da lógica das rotas em controllers: nomes convencionais, responsabilidades de cada camada, controllers magros e quando extrair uma camada de serviço."
---

<!-- _class: lead -->

# Express.js: Controllers

Separação da lógica das rotas em controllers: nomes convencionais, responsabilidades de cada camada, controllers magros e quando extrair uma camada de serviço.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Controllers** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## O problema

- Conceitos fundamentais de **O problema** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## A separação

- Conceitos fundamentais de **A separação** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Nomes convencionais

- Conceitos fundamentais de **Nomes convencionais** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Quem faz o quê

- ler req.params, req.query e req.body;
- validar e converter a entrada (Number(req.params.id));
- chamar o model;
- escolher o status e enviar a resposta.
- conhecer detalhes de SQL ou do ORM — isso é papel do model;

---

## Controllers magros

- Subtópico: Responsabilidades
- Subtópico: Organização
- [Express — Routing](https://expressjs.com/en/guide/routing.html)
- [MVC | MDN Glossary](https://developer.mozilla.org/en-US/docs/Glossary/MVC)

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Controllers**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Controllers**: Separação da lógica das rotas em controllers: nomes convencionais, responsabilidades de cada camada, controllers magros e quando extrair uma camada de serviço.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
