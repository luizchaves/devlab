---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Configuração e Ambiente"
description: "Variáveis de ambiente em uma API Express: --env-file nativo, .env versus .env.example, módulo de configuração validado na inicialização, segredos e as diferenças entre desenvolvimento e produção."
---

<!-- _class: lead -->

# Express.js: Configuração e Ambiente

Variáveis de ambiente em uma API Express: --env-file nativo, .env versus .env.example, módulo de configuração validado na inicialização, segredos e as diferenças entre desenvolvimento e produção.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Configuração e Ambiente** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## Por que não no código

- Conceitos fundamentais de **Por que não no código** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## `process.env` e `--env-file`

- Conceitos fundamentais de **`process.env` e `--env-file`** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## `.env` e `.env.example`

- Conceitos fundamentais de **`.env` e `.env.example`** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Um módulo de configuração

- Conceitos fundamentais de **Um módulo de configuração** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O que muda entre ambientes

- Subtópico: Ambiente
- Subtópico: Configuração
- [Node.js — --env-file](https://nodejs.org/api/cli.html#--env-fileconfig)
- [Node.js — process.env](https://nodejs.org/api/process.html#processenv)
- [The Twelve-Factor App — Config](https://12factor.net/config)

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Configuração e Ambiente**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Configuração e Ambiente**: Variáveis de ambiente em uma API Express: --env-file nativo, .env versus .env.example, módulo de configuração validado na inicialização, segredos e as diferenças entre desenvolvimento e produção.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
