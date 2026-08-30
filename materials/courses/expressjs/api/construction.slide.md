---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Construção de API"
description: "Do requisito ao endpoint: modelagem de recursos, definição do contrato, implementação em camadas, teste com arquivos .http e integração com um front-end web."
---

<!-- _class: lead -->

# Express.js: Construção de API

Do requisito ao endpoint: modelagem de recursos, definição do contrato, implementação em camadas, teste com arquivos .http e integração com um front-end web.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Construção de API** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## Do requisito ao recurso

- Conceitos fundamentais de **Do requisito ao recurso** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O contrato antes do código

- Conceitos fundamentais de **O contrato antes do código** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## A ordem de implementação

- Conceitos fundamentais de **A ordem de implementação** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Servir o front-end junto ou separado

- Conceitos fundamentais de **Servir o front-end junto ou separado** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## A camada de serviço no front-end

- Conceitos fundamentais de **A camada de serviço no front-end** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## A estrutura resultante

- Conceitos fundamentais de **A estrutura resultante** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Verificando o contrato

- Subtópico: Modelagem
- Subtópico: Integração
- [Express — Serving static files](https://expressjs.com/en/starter/static-files.html)
- [Fetch API | MDN](https://developer.mozilla.org/en-US/docs/Web/API/FetchAPI)
- [HTTP response status codes | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

## Na prática

- Conceitos fundamentais de **Na prática** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Construção de API**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Construção de API**: Do requisito ao endpoint: modelagem de recursos, definição do contrato, implementação em camadas, teste com arquivos .http e integração com um front-end web.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
