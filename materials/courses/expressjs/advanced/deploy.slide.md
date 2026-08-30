---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Deploy"
description: "Colocar uma API Express em produção: build e execução, variáveis de ambiente, migrations, Dockerfile, encerramento gracioso, proxy reverso, health check e checklist de produção."
---

<!-- _class: lead -->

# Express.js: Deploy

Colocar uma API Express em produção: build e execução, variáveis de ambiente, migrations, Dockerfile, encerramento gracioso, proxy reverso, health check e checklist de produção.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Deploy** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## O que muda em produção

- Conceitos fundamentais de **O que muda em produção** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Porta e host

- Conceitos fundamentais de **Porta e host** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Migrations em produção

- Conceitos fundamentais de **Migrations em produção** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Encerramento gracioso

- Conceitos fundamentais de **Encerramento gracioso** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Empacotando com Docker

- Conceitos fundamentais de **Empacotando com Docker** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Proxy reverso

- Conceitos fundamentais de **Proxy reverso** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Health check

- Conceitos fundamentais de **Health check** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Onde publicar

- Conceitos fundamentais de **Onde publicar** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Checklist antes de publicar

- Subtópico: Ambiente
- Subtópico: Operação
- [Express — Production best practices: performance and reliability](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Node.js — Docker best practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [Prisma — Deploy migrations](https://www.prisma.io/docs/orm/prisma-migrate/workflows/production-troubleshooting)

---

## Na prática

- Conceitos fundamentais de **Na prática** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Deploy**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Deploy**: Colocar uma API Express em produção: build e execução, variáveis de ambiente, migrations, Dockerfile, encerramento gracioso, proxy reverso, health check e checklist de produção.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
