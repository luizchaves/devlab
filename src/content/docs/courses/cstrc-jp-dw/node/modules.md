---
title: Node.js — Modules
description: CommonJS e ES Modules no Node.js, e como organizar os arquivos de um projeto.
course: cstrc-jp-dw
sidebar:
  label: Modules
  order: 3
---

O Node.js entende dois sistemas de módulos. Saber diferenciá-los evita a maior parte
dos erros de importação que aparecem no começo.

## CommonJS (legado)

Foi o sistema original do Node. Você ainda o encontra em tutoriais antigos e em
pacotes mais velhos:

```js title="commonjs.cjs"
const express = require('express');

module.exports = app;
```

## ES Modules (o que usamos)

É o padrão da linguagem e o que adotamos em toda a disciplina:

```js title="esm.js"
import express from 'express';

export default app;
```

Para ativá-lo, declare no `package.json`:

```json title="package.json" ins={3}
{
  "name": "minha-api",
  "type": "module"
}
```

## Três diferenças que causam erro

```js title="diferencas.js" del={2,6,10} ins={3,7,11}
// 1. Extensão obrigatória em caminhos relativos
import app from './app';
import app from './app.js';

// 2. Módulos internos com o prefixo node:
import fs from 'fs';
import fs from 'node:fs';

// 3. __dirname não existe em ESM
console.log(__dirname);
console.log(import.meta.dirname);
```

## Top-level await

Em ES Modules, `await` funciona no corpo do arquivo, sem função `async` em volta:

```js title="top-level.js"
import { readFile } from 'node:fs/promises';

const conteudo = await readFile('dados.json', 'utf-8');
```

## Organização de um projeto

A estrutura que usaremos a partir da aula de MVC separa responsabilidades por pasta:

```text
src/
├── app.js              # monta a aplicação Express
├── server.js           # sobe o servidor
├── routes/             # que caminhos existem
├── controllers/        # o que acontece em cada caminho
├── models/             # acesso aos dados
└── middlewares/        # comportamentos transversais
```

A regra prática: **um arquivo, uma responsabilidade**. Se um arquivo precisa de "e"
para ser descrito ("faz rota e valida e grava"), ele provavelmente deve ser dois.

## Exercício

Pegue um script único com pelo menos três funções e divida-o em módulos coesos,
usando exports nomeados e um `index.js` que apenas orquestra as chamadas.

## Próxima aula

[Express.js → Introdução](../../express/) — o primeiro servidor com Express.
