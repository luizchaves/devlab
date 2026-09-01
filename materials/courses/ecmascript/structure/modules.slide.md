---
marp: true
theme: default
paginate: true
style: |
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 70px;
    font-size: 1.5rem;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
    padding-bottom: 0;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: 'JavaScript: Módulos ES (ESM)'
description: 'Sistemas de módulos, ES Modules (import/export), CommonJS (require/module.exports), namespace imports, dynamic imports, alias e resolução no Node.js.'
---

<!-- _class: lead -->

# JavaScript: Módulos ES (ESM)

Escopo de arquivo, `import`, `export`, CommonJS, npm, SemVer e Node.js.

---

## Objetivo

Dominar a modularização moderna em JavaScript com ES Modules no Node.js e navegadores.

- Compreender o **isolamento de escopo** entre arquivos JavaScript.
- Diferenciar o sistema legado **CommonJS (`require`/`module.exports`)** do padrão moderno **ESM (`import`/`export`)**.
- Dominar **exportações e importações nomeadas** e **export default**.
- Utilizar **aliases (`as`)**, **namespace imports (`* as`)** e **dynamic imports (`import()`)**.
- Entender a **avaliação única** (*singleton*) e **vínculos vivos** (*live bindings*).
- Configurar o Node.js com `"type": "module"`, gerenciar dependências e interpretar o versionamento semântico (**SemVer**).

---

## Mapa da Aula

- Isolamento de Escopo e Necessidade de Módulos
- Sistemas de Módulos: CommonJS (CJS) vs ES Modules (ESM)
- Named Exports e Aliases com `as`
- Export e Import Default
- Namespace Imports (`import * as`)
- Dynamic Imports (`await import()`)
- Avaliação Única (Singleton) e Live Bindings
- Configuração do Node.js (`"type": "module"`)
- Gerenciamento de Pacotes NPM e SemVer
- Exercício, Desafio e Revisão

---

## Isolamento de Escopo

Por padrão, tudo o que é declarado dentro de um arquivo `.js` é **privado**:

```js
// lib.js (não exporta)
function sum(a, b) {
  return a + b;
}
```

```js
// main.js (tenta acessar diretamente sem importar)
console.log(sum(2, 1));
// ReferenceError: sum is not defined
```

- Para compartilhar valores e lógicas entre arquivos, é obrigatório **exportar** na origem e **importar** no destino.

---

## CommonJS (CJS) vs ES Modules (ESM)

| Característica | CommonJS (CJS) | ES Modules (ESM) |
| :--- | :--- | :--- |
| **Sintaxe de Export** | `module.exports = ...` | `export` / `export default` |
| **Sintaxe de Import** | `const x = require('./x')` | `import x from './x.js'` |
| **Carregamento** | Síncrono (tempo de execução) | Estático / Assíncrono |
| **Padrão Oficial** | Legado do Node.js clássico | Padrão oficial do ECMAScript (ES6+) |
| **Ambiente** | Node.js (requer bundler na web) | Nativo no Node.js e Browsers |

---

## CommonJS: Export e Import Padrão

```js
// lib.js - Exportando a função principal
module.exports = function sum(a, b) {
  return a + b;
};
```

```js
// main.js - Importando com require()
const sum = require('./lib.js');

console.log(sum(2, 1)); // 3
```

- `module.exports` expõe o valor diretamente.
- `require('./lib.js')` carrega o módulo de forma síncrona no tempo de execução.

---

## CommonJS: Exportações Nomeadas

```js
// lib.js - Exportando múltiplas funções como propriedades de objeto
module.exports = {
  sum: (a, b) => a + b,
  subtract: (a, b) => a - b,
};
```

```js
// main.js - Desestruturando e renomeando na importação
const { sum: add, subtract } = require('./lib.js');

console.log(add(2, 1));      // 3
console.log(subtract(2, 1)); // 1
```

- Permite exportar múltiplos membros em um único objeto exportado.

---

## ES Modules: Exportações Nomeadas (Named Exports)

Um módulo pode ter múltiplas exportações nomeadas com nomes únicos:

```js
// lib.js
export function sum(a, b) {
  return a + b;
}

export const subtract = (a, b) => a - b;
export const PI = 3.14159;
```

```js
// main.js
import { sum, subtract, PI } from './lib.js';
import { sum as add } from './lib.js'; // Renomeando com "as" (Alias)

console.log(sum(2, 1));      // 3
console.log(add(5, 5));      // 10
console.log(subtract(10, 4)); // 6
```

---

## ES Modules: Export Default

Usado para expor a funcionalidade principal do módulo (máximo de **1 por arquivo**):

```js
// math.js
export default function multiply(a, b) {
  return a * b;
}
```

```js
// main.js - importado SEM chaves {} com nome local livre
import multiply from './math.js';
import mult from './math.js';

console.log(multiply(3, 4)); // 12
console.log(mult(2, 5));     // 10
```

- **Atenção**: Importar default com `{ multiply }` falha com `SyntaxError`, pois busca um named export inexistente.

---

## Combinando Default e Named Exports

É possível exportar ambos no mesmo arquivo e consumi-los em uma única instrução:

```js
// lib.js
export function sum(a, b) { return a + b; }
export const multiply = (a, b) => a * b;

export default { sum, multiply };
```

```js
// main.js
import MathLib, { sum as add, multiply } from './lib.js';

console.log(MathLib.sum(2, 1)); // 3
console.log(add(10, 5));        // 15
console.log(multiply(3, 3));    // 9
```

---

## Import de Namespace (`import * as`)

Agrupa todas as exportações do módulo em um único objeto prefixado:

```js
// main.js
import * as MathService from './lib.js';

console.log(MathService.sum(2, 1));        // 3
console.log(MathService.multiply(4, 2));   // 8
console.log(MathService.default);          // { sum: [Function], multiply: [Function] }
console.log(Object.keys(MathService));     // ['default', 'multiply', 'sum']
```

- **Objeto Imutável**: O namespace é estritamente *read-only*.
- `MathService.sum = null;` lança `TypeError: Cannot assign to read only property`.

---

## Dynamic Imports (`import()`)

Instruções `import` estáticas só podem existir no *top-level*. Para carregamento sob demanda ou condicional, utilize `import()`, que retorna uma `Promise`:

```js
// main.js
const shouldLoad = true;

if (shouldLoad) {
  const { sum, default: MathLib } = await import('./lib.js');
  
  console.log(sum(5, 5));        // 10
  console.log(MathLib.sum(2, 3)); // 5
}
```

- **Dica**: No import dinâmico, renomeie `default` como `{ default: Alias }`, pois `default` é palavra reservada da linguagem.

---

## Avaliação Única (*Singleton*) e Vínculos Vivos

1. **Avaliação Única**: O código do topo de um módulo roda apenas **uma única vez**, no primeiro import da aplicação (resultado em cache).
2. **Live Bindings (Vínculos Vivos)**: Variáveis exportadas refletem mutações internas do módulo de origem instantaneamente.

```js
// counter.js
export let count = 0;
export const increment = () => count++;

// main.js
import { count, increment } from './counter.js';
console.log(count); // 0
increment();
console.log(count); // 1 (reflete o novo valor!)
// count = 10; // TypeError: Assignment to constant variable (leitura local)
```

---

## Resolução de Módulos no Node.js

Para utilizar ES Modules nativamente no Node.js:

1. **`package.json`**: Declare `"type": "module"`.
2. **Extensão Obrigatória**: Em caminhos relativos locais (`./` ou `../`), inclua sempre `.js`.

```json
{
  "name": "meu-app",
  "private": true,
  "type": "module"
}
```

```js
// Correto:
import { sum } from './lib.js';

// Incorreto no Node.js ESM nativo (dispara ERR_MODULE_NOT_FOUND):
// import { sum } from './lib';
```

---

## Especificadores Relativos vs Pacotes NPM

```js
// 1. Especificador Relativo (começa com ./ ou ../): arquivo local
import { sum } from './services/math.js';

// 2. Especificador de Pacote (sem ./): buscado na pasta node_modules/
import { sqrt } from 'mathjs';
```

Instalação com gerenciador de pacotes:

```bash
# Instala biblioteca e registra em "dependencies" no package.json
npm install mathjs
```

- A pasta `node_modules/` **nunca** vai para o Git (deve estar listada no `.gitignore`).

---

## Versionamento Semântico (SemVer)

O formato `MAJOR.MINOR.PATCH` (ex: `"mathjs": "^14.0.1"`):

- **MAJOR (`14`)**: Mudanças que quebram compatibilidade (*breaking changes*).
- **MINOR (`0`)**: Novas funcionalidades mantendo retrocompatibilidade.
- **PATCH (`1`)**: Correções de bugs mantendo retrocompatibilidade.

| Prefixo | Exemplo | Regra de Atualização |
| :--- | :--- | :--- |
| `^` (caret) | `"^14.0.1"` | Permite **MINOR** e **PATCH** (`< 15.0.0`) — padrão npm |
| `~` (tilde) | `"~14.0.1"` | Permite apenas atualizações de **PATCH** (`< 14.1.0`) |
| Sem prefixo | `"14.0.1"` | Trava na versão **exata** |

---

## Exercício Prático: Catálogo de Produtos

1. Crie `product-service.js` com array privado e exporte:
   - `findAll()` (nomeada) retornando todos os produtos;
   - `findById(id)` (nomeada) buscando por id;
   - Objeto `default` contendo `{ findAll, findById }`.
2. Crie `main.js` importando o serviço e exibindo os resultados.

---

## Solução do Exercício

```js
// product-service.js
const products = [
  { id: 1, name: "Teclado", price: 150 },
  { id: 2, name: "Mouse", price: 80 },
];

export const findAll = () => products;
export const findById = (id) => products.find((p) => p.id === id);

export default { findAll, findById };
```

```js
// main.js
import productService, { findById } from './product-service.js';

console.log(productService.findAll()); // [{ id: 1... }, { id: 2... }]
console.log(findById(2));             // { id: 2, name: 'Mouse', price: 80 }
```

---

## Desafio: Módulo Dinâmico com `await import()`

1. Crie `advanced-math.js` exportando `power(base, exp)` e `squareRoot(val)`.
2. No arquivo `main.js`, declare `enableAdvanced = true`.
3. Carregue sob demanda via `await import('./advanced-math.js')` e execute.

```js
// main.js
const enableAdvanced = true;

if (enableAdvanced) {
  const { power, squareRoot } = await import('./advanced-math.js');
  console.log(power(2, 8));     // 256
  console.log(squareRoot(16));  // 4
}
```

---

## Perguntas de Revisão

- Por que variáveis de um arquivo `.js` não são acessíveis em outro sem módulos?
- Qual a diferença fundamental de carregamento entre CommonJS e ES Modules?
- O que acontece ao omitir `.js` em importações relativas no Node.js com ESM?
- Quantos *default exports* e *named exports* um módulo pode possuir?
- O que é um objeto de namespace (`import * as`) e por que ele é imutável?
- Para que serve o *dynamic import* (`import()`) e qual seu tipo de retorno?
- O que são *live bindings* em ES Modules?
- O que significa `"^14.0.1"` no `package.json` de acordo com o SemVer?

---

## Resumo da Aula

- **Escopo Isolado**: arquivos são módulos privados por definição.
- **Padrão Moderno**: ESM (`import`/`export`) é o padrão oficial do JavaScript.
- **Exportações**: múltiplas nomeadas (`export { a, b }`) e no máximo um `export default`.
- **Imports Flexíveis**: aliases (`as`), namespaces (`* as`) e dinâmicos (`import()`).
- **Comportamento ESM**: avaliação singleton e vínculos vivos (*live bindings*).
- **Node.js & Ecossistema**: `"type": "module"`, extensão obrigatória e SemVer.
