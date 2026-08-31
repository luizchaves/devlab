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
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "JavaScript: Módulos ES (ESM)"
description: "Sistemas de módulos, ES Modules (import/export), CommonJS (require/module.exports), namespace imports, dynamic imports, alias e resolução no Node.js."
---

<!-- _class: lead -->

# JavaScript: Módulos ES (ESM)

Escopo de arquivo, `import`, `export`, CommonJS, npm, SemVer e Node.js.

---

## Objetivo

- Entender por que módulos isolam escopo entre arquivos.
- Diferenciar CommonJS de ES Modules.
- Usar exports nomeados, default, aliases e namespace imports.
- Carregar módulos sob demanda com `await import()`.
- Configurar Node.js com `"type": "module"`.
- Ler dependências npm e versões SemVer no `package.json`.

---

## Mapa da Aula

- Arquivos sem módulo
- CommonJS e ES Modules
- Named, default, namespace e dynamic imports
- Avaliação única e *live bindings*
- Resolução no Node.js, npm e SemVer
- Cenários, execução, exercício e desafio

---

## O que é um Módulo?

```txt
arquivo .js
  ├─ variáveis privadas por padrão
  ├─ funções privadas por padrão
  └─ exportações explícitas
          |
          v
      outro arquivo importa
```

- Um módulo é um arquivo JavaScript isolado.
- Nada fica visível fora dele sem `export`.

---

## Sem Importar nem Exportar

`lib.js` declara `sum`, mas não exporta:

```js
function sum(a, b) {
  return a + b;
}
```

`main.js` tenta chamar `sum` diretamente:

```js
console.log(sum(2, 1));
```

---

## Output sem Módulo

```txt
ReferenceError: sum is not defined
    at Object.<anonymous> (main.js:1:13)
```

---

## Por que Falha?

- Cada arquivo tem escopo próprio.
- `sum` existe em `lib.js`.
- `main.js` não enxerga `sum`.
- Para compartilhar valores, use um sistema de módulos.

```txt
lib.js  ── sem export ──X──► main.js
```

---

## Sistemas de Módulos

| Sistema | Sintaxe | Carregamento | Uso comum |
| ------- | ------- | ------------ | --------- |
| CommonJS | `require`, `module.exports` | síncrono | Node legado |
| ES Modules | `import`, `export` | estático/assíncrono | JS moderno |

- CommonJS nasceu no ecossistema Node.js.
- ESM é o padrão oficial da linguagem.

---

## CommonJS: Uma Função

`lib.js` exporta um valor principal:

```js
function sum(a, b) {
  return a + b;
}

module.exports = sum;
```

`main.js` importa com `require()`:

```js
const sum = require('./lib.js');

console.log(sum(2, 1)); // 3
```

---

## CommonJS: Várias Funções

```js
function sum(a, b) {
  return a + b;
}

function minus(a, b) {
  return a - b;
}

module.exports = { sum, minus };
```

- O objeto em `module.exports` agrupa os membros públicos.

---

## CommonJS: Desestruturação

```js
const { sum, minus } = require('./lib.js');

console.log(sum(2, 1)); // 3
console.log(minus(2, 1)); // 1
```

- A desestruturação extrai propriedades do objeto exportado.
- Esse padrão aparece muito em projetos Node antigos.

---

## ES Modules: Exports Nomeados

```js
function sum(a, b) {
  return a + b;
}

function minus(a, b) {
  return a - b;
}

export { minus, sum };
```

- Um arquivo pode ter várias exportações nomeadas.
- Cada nome exportado precisa ser único.

---

## ES Modules: Imports Nomeados

```js
import { minus, sum } from './lib.js';

console.log(sum(2, 1)); // 3
console.log(minus(2, 1)); // 1
```

- Chaves `{}` indicam named import.
- O nome importado precisa existir no módulo.

---

## Alias com `as`

```js
import { sum as add } from './lib.js';

console.log(add(2, 1)); // 3
```

- `as` cria um nome local.
- Use quando houver conflito ou quando outro nome comunicar melhor a intenção.

---

## Erros em Named Imports

```js
// SyntaxError: Identifier 'sum' has already been declared.
// export function sum(a, b) { return a + b; }
// export function sum(a, b) { return a + b; }

// SyntaxError: module './lib.js' does not export 'add'.
// import { add } from './lib.js';
```

- ESM permite análise estática antes da execução.

---

## Export Default

```js
function sum(a, b) {
  return a + b;
}

export default sum;
```

- O default representa o valor principal do módulo.
- Cada módulo pode ter no máximo um `export default`.

---

## Import Default

```js
import sum from './lib.js';

console.log(sum(2, 1)); // 3
```

- Não há chaves no import default.
- O nome local é livre.

---

## Default com Qualquer Nome

```js
import add from './lib.js';
import anyName from './lib.js';

console.log(add(2, 1)); // 3
console.log(anyName(2, 1)); // 3
```

- O arquivo exporta um default.
- Quem importa escolhe o nome local.

---

## Named + Default

```js
export const PI = 3.14;

export function sum(a, b) {
  return a + b;
}

export function minus(a, b) {
  return a - b;
}

export default { sum, minus, PI };
```

---

## Importando Named + Default

```js
import Math, { sum } from './lib.js';

console.log(sum(1, 1)); // 2
console.log(Math.minus(1, 1)); // 0
```

- `Math` recebe o default.
- `{ sum }` recebe a exportação nomeada.

---

## Erros com Default

```js
// SyntaxError: Identifier '.default' has already been declared.
// export default function sum(a, b) { return a + b; }
// export default function subtract(a, b) { return a - b; }

// SyntaxError: module './lib.js' does not export 'sum'.
// import { sum } from './lib.js'; // lib.js só tem default
```

- Default não é named export.

---

## Namespace Import

```js
export const PI = 3.14;

export function sum(a, b) {
  return a + b;
}

export default {
  PI,
  sum,
};
```

- Um módulo pode ser importado como objeto de namespace.

---

## `import * as`

```js
import * as Lib from './lib.js';

console.log(Lib.sum(2, 1)); // 3
console.log(Lib.PI); // 3.14
console.log(Lib.default.PI); // 3.14
console.log(Object.keys(Lib)); // ["PI", "default", "sum"]
```

- `Lib` agrupa todas as exportações.
- `default` aparece como uma propriedade.

---

## Namespace é Read-only

```js
// TypeError: Cannot assign to read only property 'PI'.
// Lib.PI = 3;
```

- O objeto de namespace é somente leitura.
- O importador não reatribui exportações diretamente.

---

## Import Estático

- `import` estático fica no nível superior do arquivo.
- Ele é analisado antes da execução.
- Não pode entrar em `if`, laço ou função.

```js
const needsCalculation = true;

// SyntaxError: import declarations may only appear at top level.
// if (needsCalculation) {
//   import { sum } from './lib.js';
// }
```

---

## Import Dinâmico

```js
const needsCalculation = true;

if (needsCalculation) {
  const { sum, default: MathLib } = await import('./lib.js');

  console.log(sum(2, 1)); // 3
  console.log(MathLib.sum(2, 1)); // 3
}
```

- `import()` retorna uma `Promise`.
- O resultado é um objeto de namespace.
- `default` precisa ser renomeado na desestruturação.

---

## Avaliação Única

- Um módulo executa uma vez na primeira importação.
- Importações seguintes reaproveitam a instância em cache.
- Código de topo do módulo não roda de novo.

```txt
main.js ── imports ──► counter.js executa
other.js ─ imports ──► counter.js reutilizado
```

---

## Live Bindings: Origem

```js
console.log("Módulo counter.js executado"); // uma vez

export let count = 0;

export function increment() {
  count++;
}
```

- A exportação `count` é um vínculo vivo.
- Ela não é uma cópia congelada do valor inicial.

---

## Live Bindings: Importador

```js
import { count, increment } from './counter.js';
import { count as countRef } from './counter.js';

console.log(count); // 0
increment();
console.log(count); // 1
console.log(countRef); // 1

// count = 10; // TypeError
```

- O valor muda na origem.
- O importador observa a mudança.

---

## Node.js e ESM

- Node.js precisa saber como interpretar arquivos `.js`.
- `"type": "module"` ativa ES Modules no projeto.
- Sem isso, `.js` tende ao CommonJS em muitos contextos.

```json
{
  "name": "meu-projeto",
  "private": true,
  "type": "module"
}
```

---

## Extensão Obrigatória

```js
// Error [ERR_MODULE_NOT_FOUND]: Cannot find module './lib'.
// import MathLib from './lib';

import MathLib from './lib.js'; // correto
```

- Em ESM no Node.js, caminho relativo precisa de extensão.
- Use `./lib.js`, não apenas `./lib`.

---

## Relativo vs Pacote npm

```js
import MathLib, { sum as add } from './lib.js';
import { sqrt } from 'mathjs';

console.log(add(2, 1)); // 3
console.log(sqrt(4)); // 2
```

- `./` e `../` apontam para arquivos locais.
- Sem `./` ou `../`, o Node busca em `node_modules`.

---

## Instalando Pacotes

```bash
npm install mathjs
```

```bash
pnpm add mathjs
```

```bash
yarn add mathjs
```

- O gerenciador atualiza `package.json`.
- O lockfile fixa versões exatas da árvore.

---

## `package.json` Antes

```json
{
  "name": "meu-projeto",
  "private": true,
  "type": "module"
}
```

---

## `package.json` Depois

```json
{
  "name": "meu-projeto",
  "private": true,
  "type": "module",
  "dependencies": {
    "mathjs": "^14.0.1"
  }
}
```

---

## SemVer

```txt
14.0.1
│  │ │
│  │ └─ PATCH: correção compatível
│  └─── MINOR: recurso compatível
└────── MAJOR: mudança incompatível
```

- SemVer organiza impacto de atualização.
- O número maior à esquerda é o mais arriscado.

---

## Prefixos de Versão

| Prefixo | Exemplo | Atualizações aceitas |
| ------- | ------- | -------------------- |
| `^` | `"^14.0.1"` | minor e patch, menor que `15.0.0` |
| `~` | `"~14.0.1"` | patch, menor que `14.1.0` |
| nenhum | `"14.0.1"` | versão exata |

---

## Lockfile e `node_modules`

- `package-lock.json`, `pnpm-lock.yaml` ou `yarn.lock` travam versões exatas.
- `node_modules/` guarda o código baixado.
- `node_modules/` não deve ir para o Git.

```txt
node_modules/
```

---

## Cenários Lado a Lado

```txt
src
├── lib.js
└── main.js
```

|     | Uma função | Várias funções |
| --- | ---------- | -------------- |
| CJS | 1.1 | 2.1 |
| ESM | 1.2 | 2.2 |

---

## Uma Função: CJS vs ESM

```js
// CJS: lib.js
module.exports = sum;
// CJS: main.js
const sum = require('./lib.js');
```

```js
// ESM: lib.js
export default sum;
// ESM: main.js
import sum from './lib.js';
```

---

## Várias Funções: CJS vs ESM

```js
// CJS: lib.js
module.exports = { sum, minus };
// CJS: main.js
const { sum, minus } = require('./lib.js');
```

```js
// ESM: lib.js
export { sum, minus };
// ESM: main.js
import { sum, minus } from './lib.js';
```

---

## ESM com Pacote npm

```js
import { sqrt } from 'mathjs';
import Math, { sum } from './lib.js';

console.log(sum(1, 1)); // 2
console.log(Math.minus(1, 1)); // 0
console.log(sqrt(16)); // 4
```

- O mesmo arquivo usa módulo local e pacote instalado.

---

## Executando

- Crie `package.json` com `"type": "module"`.
- Instale `mathjs`.
- Crie `math.js`.
- Crie `index.js`.
- Rode com `node index.js`.

```bash
node index.js
```

---

## `math.js`

```js
export function sum(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export default {
  sum,
  multiply,
};
```

---

## `index.js`

```js
import MathLib, { sum as add, multiply } from './math.js';
import { sqrt } from 'mathjs';

console.log(add(5, 3)); // 8
console.log(multiply(4, 2)); // 8
console.log(MathLib.sum(10, 10)); // 20
console.log(sqrt(16)); // 4
```

---

## Output

```txt
8
8
20
4
```

---

## Exercício

Crie um catálogo modular de produtos:

- `product-service.js` guarda um array privado.
- Exporte `findAll()` e `findById(id)`.
- Exporte um objeto default com as duas funções.
- `index.js` deve importar o serviço e buscar um item por ID.

---

## `product-service.js`

```js
const products = [
  { id: 1, name: "Teclado", price: 150 },
  { id: 2, name: "Mouse", price: 80 },
];

export function findAll() {
  return products;
}

export function findById(id) {
  return products.find((product) => product.id === id);
}

export default { findAll, findById };
```

---

## `index.js`

```js
import productService, { findById } from './product-service.js';

console.log(productService.findAll());
console.log(findById(2));
```

- O array `products` continua privado no módulo.
- O acesso público passa pelas funções exportadas.

---

## Desafio

Crie carregamento condicional e dinâmico:

- `advanced-math.js` exporta `power()` e `squareRoot()`.
- `main.js` declara `enableAdvancedMath = true`.
- Se estiver ativo, use `await import('./advanced-math.js')`.
- Desestruture a função `power` do import dinâmico.

---

## `advanced-math.js`

```js
export function power(base, exp) {
  return base ** exp;
}

export function squareRoot(val) {
  return Math.sqrt(val);
}

export default {
  power,
  squareRoot,
};
```

---

## `main.js`

```js
const enableAdvancedMath = true;

if (enableAdvancedMath) {
  const { power, squareRoot } = await import('./advanced-math.js');

  console.log(power(2, 8)); // 256
  console.log(squareRoot(16)); // 4
}
```

---

## Revisão: CJS vs ESM

- Qual é a diferença entre `require()` e `import`?
- O que acontece ao omitir `.js` em import relativo no ESM?
- Quantos named exports um módulo pode ter?
- Quantos default exports um módulo pode ter?

---

## Revisão: Imports

- Como renomear um named export na importação?
- Quando usar `import * as Namespace`?
- Por que o namespace é read-only?
- Por que `import` estático não entra em `if`?
- Quando usar `await import()`?

---

## Revisão: Node e npm

- Para que serve `"type": "module"`?
- Como diferenciar import relativo de pacote npm?
- O que `node_modules/` armazena?
- Para que serve o lockfile?
- O que significa `"^14.0.1"`?

---

## Resumo da Aula

- **Módulos** isolam escopo e compartilham só o que é exportado.
- **CommonJS** usa `require()` e `module.exports`.
- **ESM** usa `import` e `export`.
- **Named exports** usam chaves; **default export** não usa.
- **Dynamic import** carrega sob demanda com `await import()`.
- **Node.js** exige extensão em import relativo ESM.
- **SemVer** comunica risco de atualização.

---

## Próxima Aula

O foco passa para assincronismo:

**Promises e Async/Await**

- estados de Promises;
- combinadores;
- `async` e `await`;
- fluxo assíncrono em JavaScript.
