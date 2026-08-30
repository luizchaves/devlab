---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Autorização"
description: "Controle de acesso em uma API Express: 401 versus 403, autorização por posse do recurso, papéis (RBAC), middlewares de autorização, referência direta insegura a objeto e filtro por dono no model."
---

<!-- _class: lead -->

# Express.js: Autorização

Controle de acesso em uma API Express: 401 versus 403, autorização por posse do recurso, papéis (RBAC), middlewares de autorização, referência direta insegura a objeto e filtro por dono no model.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Autorização** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## A falha número um em APIs

- Conceitos fundamentais de **A falha número um em APIs** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## `401` ou `403`?

- Conceitos fundamentais de **`401` ou `403`?** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Os dois modelos de autorização

- Conceitos fundamentais de **Os dois modelos de autorização** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Autorização por posse

- Conceitos fundamentais de **Autorização por posse** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Autorização por papel

- Conceitos fundamentais de **Autorização por papel** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Onde a verificação deve ficar

- Subtópico: Status e semântica
- Subtópico: Implementação
- [OWASP — Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AuthorizationCheatSheet.html)
- [403 Forbidden | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403)

---

## Na prática

- Conceitos fundamentais de **Na prática** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Autorização**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Autorização**: Controle de acesso em uma API Express: 401 versus 403, autorização por posse do recurso, papéis (RBAC), middlewares de autorização, referência direta insegura a objeto e filtro por dono no model.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
