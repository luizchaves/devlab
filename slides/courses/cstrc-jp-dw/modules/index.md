---
marp: true
theme: default
paginate: true
lang: pt-BR
title: "JavaScript: Módulos"
description: "Slides completos da aula de Módulos (ES Modules e CommonJS)."
---

<!-- _class: lead -->

# JavaScript: Módulos

Sistemas de módulos, ES Modules (`import`/`export`), CommonJS (`require`/`module.exports`), namespace imports, dynamic imports e resolução no Node.js.

---

## Objetivo

Compreender o conceito de modularização em JavaScript:

- Diferenciar **CommonJS** (`require`/`module.exports`) de **ES Modules** (`import`/`export`).
- Dominar exportações e importações **nomeadas** e **default**.
- Utilizar *aliases* (`as`), *namespace imports* (`import * as`) e *dynamic imports* (`await import()`).
- Entender especificadores relativos versus pacotes npm (`package.json`, `node_modules`).

---

## Por que Modularizar?

Um módulo é um arquivo JavaScript isolado.

- Por padrão, tudo declarado (variáveis, funções, classes) é **privado** ao seu próprio escopo.
- Só fica acessível para outros arquivos quando é explicitamente **exportado**.
- Benefícios:
  - Evita poluição do escopo global.
  - Facilita a manutenção e reutilização de código.
  - Permite organizar projetos em múltiplos arquivos desacoplados.

---

## O Que Acontece Sem Módulos?

Declarar uma função em `lib.js` e tentar usá-la em `main.js` sem exportar/importar:

```js
// lib.js
function sum(a, b) { return a + b; }
```

```js
// main.js
console.log(sum(2, 1));
```

Execução no terminal (`node main.js`):

```txt
ReferenceError: sum is not defined
    at Object.<anonymous> (main.js:1:13)
```

Cada arquivo tem escopo isolado: `sum` **não é visível** em `main.js`.

---

## Sistemas de Módulos em JavaScript

| Característica | CommonJS (CJS) | ES Modules (ESM) |
| --- | --- | --- |
| **Padrão** | Legado do Node.js | Oficial da linguagem (ES6+) |
| **Sintaxe de Importação** | `require('...')` | `import ... from '...'` |
| **Sintaxe de Exportação** | `module.exports = ...` | `export ...` / `export default` |
| **Carregamento** | Síncrono em tempo de execução | Estático, assíncrono e analisável |
| **Ambientes** | Node.js antigo / scripts CJS | Navegadores modernos e Node.js |

---

## CommonJS (CJS): Exportação Padrão

Exportando um único valor principal (*default export*):

```js
// cjs-default/lib.js
function sum(a, b) {
  return a + b;
}

module.exports = sum;
```

Importando com `require()`:

```js
// cjs-default/main.js
const add = require('./lib.js');

console.log(add(2, 1)); // 3
```

---

## CommonJS (CJS): Múltiplas Exportações

Atribuindo um objeto ao `module.exports`:

```js
// cjs-named/lib.js
function sum(a, b) { return a + b; }
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;

module.exports = { sum, subtract, multiply };
```

Importando com desestruturação:

```js
// cjs-named/main.js
const { sum, subtract, multiply } = require('./lib.js');

console.log(sum(2, 1)); // 3
console.log(subtract(2, 1)); // 1
```

---

## ES Modules (ESM): Exportações Nomeadas

Em ESM, um arquivo pode conter **múltiplas** exportações nomeadas (*named exports*):

```js
// esm-named/lib.js
export function sum(a, b) {
  return a + b;
}

export const subtract = function (a, b) {
  return a - b;
};

export const multiply = (a, b) => a * b;
```

Cada exportação precisa ter um nome único no módulo.

---

## ES Modules (ESM): Importações Nomeadas e Aliases

Extraindo elementos específicos entre chaves `{ ... }`:

```js
// esm-named/main.js
import { sum, subtract, multiply } from './lib.js';

console.log(sum(2, 1)); // 3
console.log(subtract(2, 1)); // 1
```

Criando um *alias* (nome local alternativo) com `as`:

```js
import { sum as add } from './lib.js';

console.log(add(2, 1)); // 3
```

---

## ES Modules (ESM): Análise Estática e Erros

A linguagem bloqueia declarações duplicadas e importações inválidas em tempo de análise estática:

```js
// SyntaxError: Identifier 'sum' has already been declared
export function sum(a, b) { return a + b; }
export function sum(a, b) { return a + b; }

// SyntaxError: The requested module './lib.js' does not provide an export named 'add'
import { add } from './lib.js';
```

Em ESM no Node.js, a extensão `.js` nos caminhos relativos é **obrigatória**.

---

## ES Modules (ESM): Exportação Padrão (*Default Export*)

Um módulo pode ter no máximo **um** `export default`:

```js
// esm-default/calculator.js
export default class Calculator {
  sum(a, b) {
    return a + b;
  }
}
```

Importando um *default export* (sem chaves `{}` e com nome livre):

```js
// esm-default/main.js
import Calc from './calculator.js';

const calc = new Calc();
console.log(calc.sum(2, 1)); // 3
```

---

## ES Modules (ESM): Combinando Default e Named Exports

É possível combinar um *default export* com *named exports* no mesmo arquivo:

```js
// esm-mixed/lib.js
export function sum(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }

export default {
  sum,
  subtract,
};
```

Importando ambos na mesma instrução:

```js
// esm-mixed/main.js
import MathLib, { sum as add } from './lib.js';

console.log(add(2, 1)); // 3
console.log(MathLib.subtract(2, 1)); // 1
```

---

## Namespace Imports (`import * as`)

Agrupa **todas** as exportações nomeadas de um módulo em um único objeto:

```js
// esm-namespace/main.js
import * as MathLib from './lib.js';

console.log(MathLib.sum(2, 1)); // 3
console.log(MathLib.subtract(2, 1)); // 1
```

- O objeto gerado (`MathLib`) é **imutável (read-only)**.
- Qualquer tentativa de reatribuir `MathLib.sum = null` lança um erro em runtime (`TypeError`).

---

## Dynamic Imports (`import()`)

Importação condicional em tempo de execução:

- Instruções `import` estáticas só podem ficar no nível superior (*top-level*).
- Para carregar módulos sob demanda, usa-se a função `import('caminho.js')`, que retorna uma `Promise`:

```js
const enableAdvancedMath = true;

if (enableAdvancedMath) {
  const { power, squareRoot } = await import('./advanced-math.js');

  console.log(power(2, 8)); // 256
  console.log(squareRoot(16)); // 4
}
```

---

## Resolução de Especificadores de Módulos

O caminho passado no `import` ou `require` determina onde o Node.js busca o arquivo:

1. **Especificador Relativo** (começa com `./` ou `../`):
   - Aponta para um arquivo local no projeto.
   - Exemplo: `import { sum } from './lib.js';`

2. **Especificador de Pacote** (sem `./` ou `../`):
   - Aponta para uma biblioteca instalada via npm.
   - O Node busca dentro da pasta `node_modules`.
   - Exemplo: `import { sqrt } from 'mathjs';`

---

## Gerenciamento de Dependências com npm

Configuração inicial do `package.json` para ES Modules:

```json
{
  "name": "meu-projeto",
  "private": true,
  "type": "module"
}
```

Instalação de pacotes no terminal:

```bash
npm install mathjs
```

Efeitos da instalação:
- Atualiza `"dependencies"` no `package.json`.
- Cria/atualiza o `package-lock.json` (trava de versões exatas).
- Baixa o código para a pasta `node_modules/`.

---

## Cuidados com `node_modules` e `.gitignore`

A pasta `node_modules/` **nunca** deve ser enviada ao Git:

```txt
# .gitignore
node_modules/
```

- A pasta pode conter milhares de arquivos e ser muito pesada.
- Qualquer pessoa que clonar o repositório pode recriar a pasta executando:

```bash
npm install
```

---

## Passo a Passo: Criando e Executando um Projeto Modular

1. Crie o `package.json` com `"type": "module"`.
2. Instale dependências necessárias (`npm install mathjs`).
3. Crie os módulos locais (ex: `math.js`) exportando funções.
4. Crie o ponto de entrada `index.js` importando os módulos.
5. Execute no terminal:

```bash
node index.js
```

---

## Exercício Prático: Serviço de Produtos

Crie um arquivo `product-service.js` contendo um array privado e exporte:
- `findAll()` e `findById(id)` como exportações nomeadas.
- Um *export default* contendo um objeto com ambas as funções.

```js
// product-service.js
const products = [
  { id: 1, name: "Teclado", price: 150 },
  { id: 2, name: "Mouse", price: 80 },
];

export function findAll() { return products; }
export function findById(id) {
  return products.find((p) => p.id === id);
}
export default { findAll, findById };
```

---

## Desafio: Import Dinâmico Condicional

Crie um módulo `advanced-math.js` e carregue-o sob demanda:

```js
// advanced-math.js
export function power(base, exp) { return base ** exp; }
export function squareRoot(val) { return Math.sqrt(val); }
```

```js
// main.js
const enableAdvancedMath = true;

if (enableAdvancedMath) {
  const { power, squareRoot } = await import('./advanced-math.js');
  console.log(power(2, 8)); // 256
  console.log(squareRoot(16)); // 4
}
```

---

## Resumo da Aula

- **ES Modules (ESM)** é o padrão moderno do JavaScript.
- Use `export` para múltiplos valores nomeados e `export default` para o valor principal.
- No Node.js com ESM, use `"type": "module"` no `package.json` e inclua a extensão `.js` em imports relativos.
- Use `import * as` para namespaces imutáveis e `import()` para carregamento dinâmico.
- Mantenha `node_modules/` no `.gitignore` e gerencie pacotes com `package.json` e `npm install`.
