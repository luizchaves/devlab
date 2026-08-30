---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Chamada de Sistema"
description: "Execução de comandos do sistema operacional a partir de uma rota Express: exec, execFile e spawn, injeção de comando, tempo limite, extração da saída com expressões regulares e quando usar uma biblioteca."
---

<!-- _class: lead -->

# Express.js: Chamada de Sistema

Execução de comandos do sistema operacional a partir de uma rota Express: exec, execFile e spawn, injeção de comando, tempo limite, extração da saída com expressões regulares e quando usar uma biblioteca.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Chamada de Sistema** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## O módulo `node:child_process`

- Conceitos fundamentais de **O módulo `node:child_process`** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Injeção de comando

- Conceitos fundamentais de **Injeção de comando** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Tempo limite e limite de saída

- Conceitos fundamentais de **Tempo limite e limite de saída** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Extraindo dados da saída

- Conceitos fundamentais de **Extraindo dados da saída** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Saída longa: `spawn`

- Conceitos fundamentais de **Saída longa: `spawn`** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Quando usar uma biblioteca

- Subtópico: Execução
- Subtópico: Segurança e robustez
- [Node.js — childprocess](https://nodejs.org/api/childprocess.html)
- [OWASP — Command Injection](https://owasp.org/www-community/attacks/CommandInjection)
- [Expressões Regulares](../../../ecmascript/stdlib/regex/)

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Chamada de Sistema**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Chamada de Sistema**: Execução de comandos do sistema operacional a partir de uma rota Express: exec, execFile e spawn, injeção de comando, tempo limite, extração da saída com expressões regulares e quando usar uma biblioteca.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
