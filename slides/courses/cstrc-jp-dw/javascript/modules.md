---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Módulos (ESM e CommonJS)"
description: "Slides completos da aula de Módulos em JavaScript (CommonJS, ES Modules, export/import, default/named exports, npm e dynamic import)."


---



<!-- _class: lead -->

# JavaScript: Módulos

Organização de código em arquivos independentes, escopo de módulo, CommonJS (`require`/`module.exports`) vs. ES Modules (`import`/`export`), exportações nomeadas e padrão, npm e importações dinâmicas.



---


## Objetivo (Parte 1)

Compreender o uso de módulos em JavaScript:

- Entender os benefícios da modularização e do encapsulamento.
- Identificar as diferenças históricas e práticas entre **CommonJS** e **ES Modules**.
- Utilizar exportações nomeadas (*named exports*) e padrão (*default export*).


---


## Objetivo (Parte 2)

- Renomear importações com *aliases* (`as`) e agrupar com *namespace* (`* as`).
- Compreender a resolução de especificadores de módulos e gerenciamento com **npm**.
- Aplicar importações dinâmicas (*Dynamic Imports*) com `import()`.


---



## O Que É Um Módulo?

Um **Módulo** é um arquivo JavaScript independente que encapsula seu próprio código, ocultando detalhes de implementação e expondo apenas o que for explicitamente **exportado**.

### Benefícios
- **Encapsulamento**: Variáveis não poluem o escopo global.
- **Reutilização**: Módulos podem ser importados por diferentes partes do sistema.
- **Manutenibilidade**: Código organizado em responsabilidades bem definidas.



---



## CommonJS (CJS) vs. ES Modules (ESM)

| Característica | CommonJS (CJS) | ES Modules (ESM) |
| --- | --- | --- |
| **Ambiente** | Padrão histórico do Node.js | Padrão nativo dos Navegadores e JS moderno |
| **Sintaxe** | `require()` e `module.exports` | `import` e `export` |
| **Carregamento** | Síncrono | Assíncrono |
| **Strict Mode** | Opcional | Ativo por padrão em todos os módulos |



---



## Modos de Módulo no Node.js

Por padrão, o Node.js trata arquivos `.js` como **CommonJS**.

Para habilitar **ES Modules (ESM)** no Node.js, você pode:

1. Usar a extensão `.mjs` nos arquivos.
2. Adicionar `"type": "module"` no arquivo `package.json`:

```json
{
  "name": "meu-projeto",
  "type": "module"
}
```



---



## Estrutura dos Exemplos

Os exemplos a seguir estão disponíveis em `examples/javascript/modules/`:

```text
examples/javascript/modules/
├── cjs-default/       # CommonJS: Exportação Padrão
├── cjs-named/         # CommonJS: Múltiplas Exportações
├── esm-default/       # ESM: Exportação Padrão
├── esm-named/         # ESM: Exportações Nomeadas
├── esm-combined/      # ESM: Exportações Combinadas
├── esm-dynamic/       # ESM: Importação Dinâmica
└── package.json
```



---



## CommonJS (CJS): Exportação Padrão (`lib.js`)

Exportando um único valor principal (*default export*):

```js
// cjs-default/lib.js
function sum(a, b) {
  return a + b;
}

module.exports = sum;
```



---



## CommonJS (CJS): Importação Padrão (`main.js`)

Importando o valor exportado com a função `require()`:

```js
// cjs-default/main.js
const add = require('./lib.js');

console.log(add(2, 1)); // 3
```



---



## CommonJS (CJS): Múltiplas Exportações (`lib.js`)

Atribuindo um objeto ao `module.exports`:

```js
// cjs-named/lib.js
function sum(a, b) { return a + b; }
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;

module.exports = { sum, subtract, multiply };
```



---



## CommonJS (CJS): Importação Nomeada (`main.js`)

Importando os membros desejados através de desestruturação:

```js
// cjs-named/main.js
const { sum, subtract, multiply } = require('./lib.js');

console.log(sum(2, 1));      // 3
console.log(subtract(2, 1)); // 1
```



---

## ES Modules (ESM): Exportações Nomeadas (`lib.js`) (Parte 1)

Em ESM, um arquivo pode conter **múltiplas** exportações nomeadas (*named exports*):

```js
// esm-named/lib.js
export function sum(a, b) {
  return a + b;
}

```

---

## ES Modules (ESM): Exportações Nomeadas (`lib.js`) (Parte 2)

```js
export const subtract = function (a, b) {
  return a - b;
};

export const multiply = (a, b) => a * b;
```

Cada exportação precisa ter um nome único no módulo.

---



## ES Modules (ESM): Importações Nomeadas (`main.js`)

Extraindo elementos específicos entre chaves `{ ... }`:

```js
// esm-named/main.js
import { sum, subtract, multiply } from './lib.js';

console.log(sum(2, 1));      // 3
console.log(subtract(2, 1)); // 1
console.log(multiply(2, 1)); // 2
```



---



## ES Modules (ESM): Aliases com `as`

Renomeando importações para evitar conflitos de nomes no arquivo local:

```js
// esm-named/main.js
import { sum as add, subtract as sub } from './lib.js';

console.log(add(10, 5)); // 15
console.log(sub(10, 5)); // 5
```



---



## ES Modules (ESM): Importando Tudo com `* as`

Agrupa todas as exportações nomeadas em um único objeto *namespace*:

```js
// esm-named/main.js
import * as MathOps from './lib.js';

console.log(MathOps.sum(3, 4));      // 7
console.log(MathOps.multiply(3, 4)); // 12
```

- O objeto gerado (`MathOps`) é **imutável (read-only)**.
- Reatribuir `MathOps.sum = null` lança erro em runtime (`TypeError`).



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

> Em ESM no Node.js, a extensão `.js` nos caminhos relativos é **obrigatória**.



---



## ES Modules (ESM): Exportação Padrão (`export default`)

Cada módulo ESM pode ter no máximo **uma** exportação padrão:

```js
// esm-default/calculator.js
export default class Calculator {
  sum(a, b) {
    return a + b;
  }
}
```



---



## ES Modules (ESM): Importação Padrão (`main.js`)

Importando um *default export* sem chaves `{}` e podendo escolher qualquer nome local:

```js
// esm-default/main.js
import Calc from './calculator.js';

const calc = new Calc();
console.log(calc.sum(2, 1)); // 3
```



---



## ES Modules (ESM): Combinando Default e Named Exports

É possível combinar uma exportação padrão com exportações nomeadas no mesmo módulo:

```js
// esm-mixed/lib.js
export function sum(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }

export default {
  sum,
  subtract,
};
```



---



## Importando Default e Named Exports Juntos

Importando ambos na mesma instrução:

```js
// esm-mixed/main.js
import MathLib, { sum as add } from './lib.js';

console.log(add(2, 1));              // 3
console.log(MathLib.subtract(2, 1)); // 1
```



---



## Exportando Re-exportações (Barrels)

Podemos re-exportar membros de outros módulos para criar um ponto único de entrada (*Barrel File*):

```js
// index.js (Barrel file)
export { sum, subtract } from './math.js';
export { formatDate } from './date.js';
export { default as User } from './user.js';
```



---

## Dynamic Imports (`import()`) (Parte 1)

A instrução `import()` permite carregar módulos sob demanda e de forma assíncrona (retorna uma `Promise`):

```js
// esm-dynamic/main.js
const enableAdvancedMath = true;

```

---

## Dynamic Imports (`import()`) (Parte 2)

```js
if (enableAdvancedMath) {
  const { power, squareRoot } = await import('./advanced-math.js');
  console.log(power(2, 8));    // 256
  console.log(squareRoot(16)); // 4
}
```

### Casos de Uso
- *Code Splitting* em aplicações web.
- Carregamento de módulos pesados apenas quando necessários.

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


## Gerenciamento de Dependências com npm (Parte 1)

Configuração inicial do `package.json` para projetos ES Modules:

```json
{
  "name": "meu-projeto",
  "private": true,
  "type": "module"
}
```


---


## Gerenciamento de Dependências com npm (Parte 2)

Instalação de bibliotecas de terceiros no terminal:

```bash
npm install mathjs
```

- Atualiza `"dependencies"` no `package.json`.
- Cria/atualiza o `package-lock.json` (trava versões exatas).
- Baixa o código para a pasta `node_modules/`.


---



## Passo a Passo: Projeto Modular com npm

1. Crie o `package.json` com `"type": "module"`.
2. Instale dependências necessárias (`npm install mathjs`).
3. Crie os módulos locais (ex: `math.js`) exportando funções.
4. Crie o ponto de entrada `index.js` importando os módulos.
5. Execute no terminal:

```bash
node index.js
```



---



## Executando os Exemplos no Terminal

Navegue até a pasta do exemplo e execute com Node.js:

```bash
cd examples/javascript/modules

# Executando exemplo ES Modules
node esm-named/main.js

# Executando exemplo CommonJS
node cjs-named/main.js
```



---


## Exercício Prático: Módulo `product-service.js` (Parte 1)

Crie um arquivo `product-service.js` contendo um array privado e exporte:
- `findAll()` e `findById(id)` como exportações nomeadas.
- Um *export default* contendo um objeto com ambas as funções.

```js
// product-service.js
const products = [
  { id: 1, name: "Teclado", price: 150 },
  { id: 2, name: "Mouse", price: 80 },
];

```


---


## Exercício Prático: Módulo `product-service.js` (Parte 2)

```js
export function findAll() { return products; }
export function findById(id) {
  return products.find((p) => p.id === id);
}
export default { findAll, findById };
```


---


## Desafio: Import Dinâmico Condicional (`main.js`) (Parte 1)

Crie um módulo `advanced-math.js`:

```js
// advanced-math.js
export function power(base, exp) { return base ** exp; }
export function squareRoot(val) { return Math.sqrt(val); }
```


---


## Desafio: Import Dinâmico Condicional (`main.js`) (Parte 2)

E um arquivo `main.js` que o carregue dinamicamente usando `await import()`:

```js
// main.js
const enableAdvancedMath = true;

if (enableAdvancedMath) {
  const { power, squareRoot } = await import('./advanced-math.js');
  console.log(power(2, 8));    // 256
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
