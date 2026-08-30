---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Autenticação"
description: "Autenticação em uma API Express: sessão com estado versus token sem estado, anatomia de um JWT, assinatura HS256 com node:crypto, middleware de autenticação, expiração, logout e armazenamento no cliente."
---

<!-- _class: lead -->

# Express.js: Autenticação

Autenticação em uma API Express: sessão com estado versus token sem estado, anatomia de um JWT, assinatura HS256 com node:crypto, middleware de autenticação, expiração, logout e armazenamento no cliente.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Autenticação** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## Autenticação não é autorização

- Conceitos fundamentais de **Autenticação não é autorização** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Sessão com estado ou token sem estado

- Conceitos fundamentais de **Sessão com estado ou token sem estado** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Anatomia de um JWT

- Conceitos fundamentais de **Anatomia de um JWT** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Assinando com `node:crypto`

- Conceitos fundamentais de **Assinando com `node:crypto`** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Verificando

- Conceitos fundamentais de **Verificando** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O login

- Conceitos fundamentais de **O login** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O middleware de autenticação

- Conceitos fundamentais de **O middleware de autenticação** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O ciclo completo

- Conceitos fundamentais de **O ciclo completo** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Onde o cliente guarda o token

- Conceitos fundamentais de **Onde o cliente guarda o token** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Expiração, renovação e logout

- Subtópico: Conceitos
- Subtópico: Operação
- [RFC 7519 — JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519.html)
- [RFC 6750 — Bearer Token Usage](https://www.rfc-editor.org/rfc/rfc6750.html)
- [Node.js — crypto.createHmac](https://nodejs.org/api/crypto.html#cryptocreatehmacalgorithm-key-options)

---

## Na prática

- Conceitos fundamentais de **Na prática** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Autenticação**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Autenticação**: Autenticação em uma API Express: sessão com estado versus token sem estado, anatomia de um JWT, assinatura HS256 com node:crypto, middleware de autenticação, expiração, logout e armazenamento no cliente.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
