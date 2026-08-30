---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: CORS"
description: "Compartilhamento de recursos entre origens em uma API Express: política de mesma origem, requisição simples e preflight, cabeçalhos Access-Control, implementação nativa e com o pacote cors, e credenciais."
---

<!-- _class: lead -->

# Express.js: CORS

Compartilhamento de recursos entre origens em uma API Express: política de mesma origem, requisição simples e preflight, cabeçalhos Access-Control, implementação nativa e com o pacote cors, e credenciais.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: CORS** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## A política de mesma origem

- Conceitos fundamentais de **A política de mesma origem** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O que o CORS realmente faz

- Conceitos fundamentais de **O que o CORS realmente faz** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Requisição simples e preflight

- Conceitos fundamentais de **Requisição simples e preflight** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Os cabeçalhos

- Conceitos fundamentais de **Os cabeçalhos** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Implementando à mão

- Conceitos fundamentais de **Implementando à mão** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Com o pacote `cors`

- Conceitos fundamentais de **Com o pacote `cors`** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## `origin: '*'` e credenciais

- Conceitos fundamentais de **`origin: '*'` e credenciais** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Evitando o problema

- Subtópico: Conceito
- Subtópico: Configuração
- [CORS | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Same-origin policy | MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Same-originpolicy)
- [Pacote cors](https://www.npmjs.com/package/cors)

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: CORS**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: CORS**: Compartilhamento de recursos entre origens em uma API Express: política de mesma origem, requisição simples e preflight, cabeçalhos Access-Control, implementação nativa e com o pacote cors, e credenciais.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
