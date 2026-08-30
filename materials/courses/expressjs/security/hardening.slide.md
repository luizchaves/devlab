---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Endurecimento"
description: "Defesas de uma API Express em produção: cabeçalhos de segurança, limite de requisições, limite de tamanho do corpo, injeção de SQL e NoSQL, XSS, segredos e dependências."
---

<!-- _class: lead -->

# Express.js: Endurecimento

Defesas de uma API Express em produção: cabeçalhos de segurança, limite de requisições, limite de tamanho do corpo, injeção de SQL e NoSQL, XSS, segredos e dependências.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Endurecimento** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## O que é preciso defender

- Conceitos fundamentais de **O que é preciso defender** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Cabeçalhos de segurança

- Conceitos fundamentais de **Cabeçalhos de segurança** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Limite de requisições

- Conceitos fundamentais de **Limite de requisições** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Limite de tamanho do corpo

- Conceitos fundamentais de **Limite de tamanho do corpo** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## As injeções que sobram

- Conceitos fundamentais de **As injeções que sobram** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Segredos e dependências

- Conceitos fundamentais de **Segredos e dependências** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## A cadeia de defesa em `app.ts`

- Subtópico: Limites
- Subtópico: Injeção
- [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x00-header/)
- [Express — Production best practices: security](https://expressjs.com/en/advanced/best-practice-security.html)
- [helmet](https://www.npmjs.com/package/helmet)

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Endurecimento**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Endurecimento**: Defesas de uma API Express em produção: cabeçalhos de segurança, limite de requisições, limite de tamanho do corpo, injeção de SQL e NoSQL, XSS, segredos e dependências.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
