---
title: JavaScript — Modules
description: Import e export com ES Modules, o sistema de módulos usado em todos os projetos da disciplina.
course: cstrc-jp-dw
sidebar:
  label: Modules
  order: 2
---

Um módulo é um arquivo. Tudo que ele declara é privado até ser exportado
explicitamente. Usaremos **ES Modules** (`import`/`export`) em todos os projetos.

## Export nomeado

Exporta vários valores com nome. É a forma preferida quando o arquivo expõe um
conjunto de funções relacionadas.

```js title="src/models/user-model.js"
export function findAll() {
  return users;
}

export function findById(id) {
  return users.find((user) => user.id === id);
}
```

```js title="src/controllers/user-controller.js"
import { findAll, findById } from '../models/user-model.js';
```

## Export default

Exporta **um** valor principal por arquivo. É o que usamos para o `app` do Express e
para cada router.

```js title="src/app.js"
const app = express();

export default app;
```

```js title="src/server.js"
import app from './app.js';
```

## Import de namespace

Importa tudo de uma vez, com prefixo. Deixa claro de onde cada função veio.

```js title="src/routes/user-router.js" {1,4-5}
import * as userController from '../controllers/user-controller.js';

const router = Router();
router.get('/', userController.index);
router.get('/:id', userController.show);
```

## Regras importantes no Node.js

Para que o Node interprete os arquivos como ES Modules, o `package.json` precisa ter:

```json title="package.json" {4}
{
  "name": "express-mvc",
  "private": true,
  "type": "module"
}
```

E as importações de arquivos locais precisam da **extensão**:

```js
import app from './app.js'; // correto
import app from './app'; // Erro: ERR_MODULE_NOT_FOUND
```

```js title="src/server.js" del={1} ins={2}
import app from './app';
import app from './app.js';
```

## Exercício

Reescreva o exercício da aula anterior separando o código em dois arquivos:
`produtos.js` (dados e funções, com exports nomeados) e `index.js` (que importa e
imprime os resultados).

## Próxima aula

[Async/Await](../async-await/) — código assíncrono legível.
