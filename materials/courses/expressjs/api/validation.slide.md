---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Validação"
description: "Validação de entrada em uma API Express: as camadas de validação, middleware nativo de fábrica, schemas com Zod, restrições no banco de dados e o formato da resposta de erro de validação."
---

<!-- _class: lead -->

# Express.js: Validação

Validação de entrada em uma API Express: as camadas de validação, middleware nativo de fábrica, schemas com Zod, restrições no banco de dados e o formato da resposta de erro de validação.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Validação** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## Validação em camadas

- Conceitos fundamentais de **Validação em camadas** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Middleware de validação nativo

- Conceitos fundamentais de **Middleware de validação nativo** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Schemas com Zod

- Conceitos fundamentais de **Schemas com Zod** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O formato do erro de validação

- Conceitos fundamentais de **O formato do erro de validação** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Restrições no banco

- Subtópico: Camadas
- Subtópico: Implementação
- [Zod](https://zod.dev/)
- [Express — Error handling](https://expressjs.com/en/guide/error-handling.html)
- [OWASP — Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/InputValidationCheatSheet.html)

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Validação**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Validação**: Validação de entrada em uma API Express: as camadas de validação, middleware nativo de fábrica, schemas com Zod, restrições no banco de dados e o formato da resposta de erro de validação.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
