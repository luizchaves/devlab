---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Documentação de API"
description: "Descrição do contrato de uma API Express: arquivos .http executáveis, especificação OpenAPI, Swagger UI, geração a partir de schemas Zod e o que documentar além dos endpoints."
---

<!-- _class: lead -->

# Express.js: Documentação de API

Descrição do contrato de uma API Express: arquivos .http executáveis, especificação OpenAPI, Swagger UI, geração a partir de schemas Zod e o que documentar além dos endpoints.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Documentação de API** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## Documentação que apodrece

- Conceitos fundamentais de **Documentação que apodrece** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Arquivos `.http`

- Subtópico: Login — guarda o token para as próximas requisições
- Subtópico: Lista os investimentos do usuário autenticado
- Subtópico: Sem token (401)

---

## OpenAPI

- Conceitos fundamentais de **OpenAPI** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Publicando com Swagger UI

- Conceitos fundamentais de **Publicando com Swagger UI** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Gerando a partir dos schemas

- Conceitos fundamentais de **Gerando a partir dos schemas** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O que documentar além dos endpoints

- Subtópico: Formas de documentar
- Subtópico: Conteúdo
- [OpenAPI Specification](https://swagger.io/specification/)
- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
- [REST Client (VS Code)](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Documentação de API**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Documentação de API**: Descrição do contrato de uma API Express: arquivos .http executáveis, especificação OpenAPI, Swagger UI, geração a partir de schemas Zod e o que documentar além dos endpoints.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
