---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Senhas e Hash"
description: "Como guardar senhas com segurança: função de hash, sal, funções de derivação de chave, bcrypt e Argon2, implementação nativa com node:crypto e comparação em tempo constante."
---

<!-- _class: lead -->

# Express.js: Senhas e Hash

Como guardar senhas com segurança: função de hash, sal, funções de derivação de chave, bcrypt e Argon2, implementação nativa com node:crypto e comparação em tempo constante.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Senhas e Hash** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## O que nunca fazer

- Conceitos fundamentais de **O que nunca fazer** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Hash de mão única

- Conceitos fundamentais de **Hash de mão única** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Por que `SHA-256` não basta

- Conceitos fundamentais de **Por que `SHA-256` não basta** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O sal

- Conceitos fundamentais de **O sal** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O custo de computação

- Conceitos fundamentais de **O custo de computação** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## As três KDFs usadas na prática

- Conceitos fundamentais de **As três KDFs usadas na prática** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Implementando com `node:crypto`

- Subtópico: O formato PHC
- Subtópico: Gerando o hash
- Subtópico: Verificando

---

## Comparação em tempo constante

- Conceitos fundamentais de **Comparação em tempo constante** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Testando

- Conceitos fundamentais de **Testando** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Nativo ou pacote?

- Subtópico: Fundamentos
- Subtópico: Implementação
- [Node.js — crypto.argon2Sync](https://nodejs.org/api/crypto.html)
- [Node.js — crypto.timingSafeEqual](https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b)
- [OWASP — Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/PasswordStorageCheatSheet.html)

---

## Na prática

- Conceitos fundamentais de **Na prática** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Senhas e Hash**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Senhas e Hash**: Como guardar senhas com segurança: função de hash, sal, funções de derivação de chave, bcrypt e Argon2, implementação nativa com node:crypto e comparação em tempo constante.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
