---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Requisição e Resposta"
description: "Os objetos req e res do Express: cabeçalhos, negociação de conteúdo, métodos que encerram a resposta, redirecionamento, download e arquivos estáticos."
---

<!-- _class: lead -->

# Express.js: Requisição e Resposta

Os objetos req e res do Express: cabeçalhos, negociação de conteúdo, métodos que encerram a resposta, redirecionamento, download e arquivos estáticos.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Requisição e Resposta** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## Anatomia de uma mensagem HTTP

- Conceitos fundamentais de **Anatomia de uma mensagem HTTP** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Lendo a requisição

- Conceitos fundamentais de **Lendo a requisição** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Negociação de conteúdo

- Conceitos fundamentais de **Negociação de conteúdo** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Escrevendo a resposta

- Conceitos fundamentais de **Escrevendo a resposta** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Redirecionamento

- Conceitos fundamentais de **Redirecionamento** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Arquivos estáticos e download

- Conceitos fundamentais de **Arquivos estáticos e download** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Cabeçalhos de cache

- Subtópico: Requisição
- Subtópico: Resposta
- [Express — Request](https://expressjs.com/en/5x/api.html#req)
- [Express — Response](https://expressjs.com/en/5x/api.html#res)
- [Express — Serving static files](https://expressjs.com/en/starter/static-files.html)

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Requisição e Resposta**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Requisição e Resposta**: Os objetos req e res do Express: cabeçalhos, negociação de conteúdo, métodos que encerram a resposta, redirecionamento, download e arquivos estáticos.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
