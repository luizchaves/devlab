---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: REST API"
description: "Convenções REST em uma API Express: recursos em vez de ações, os verbos HTTP, status codes, idempotência, segurança dos métodos, subrecursos e versionamento."
---

<!-- _class: lead -->

# Express.js: REST API

Convenções REST em uma API Express: recursos em vez de ações, os verbos HTTP, status codes, idempotência, segurança dos métodos, subrecursos e versionamento.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: REST API** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## Recursos, não ações

- Conceitos fundamentais de **Recursos, não ações** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Os cinco verbos

- Subtópico: Segurança e idempotência
- Subtópico: `PUT` ou `PATCH`?

---

## Status codes

- Conceitos fundamentais de **Status codes** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Um ciclo completo

- Conceitos fundamentais de **Um ciclo completo** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Subrecursos e relações

- Conceitos fundamentais de **Subrecursos e relações** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Versionamento

- Conceitos fundamentais de **Versionamento** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Erros padronizados

- Subtópico: Recursos e verbos
- Subtópico: Status
- [HTTP request methods | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- [HTTP response status codes | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [Idempotent | MDN Glossary](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent)

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: REST API**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: REST API**: Convenções REST em uma API Express: recursos em vez de ações, os verbos HTTP, status codes, idempotência, segurança dos métodos, subrecursos e versionamento.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
