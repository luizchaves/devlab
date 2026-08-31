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

Sistemas de módulos, ES Modules (import/export), CommonJS (require/module.exports), namespace imports, dynamic imports, alias e resolução no Node.js.

---

## Objetivo

- Compreender o conceito de modularização em JavaScript, diferenciar o sistema legado CommonJS (`require`/`module.

---

## Mapa da Aula

- O que acontece sem módulos?
- Sistemas de módulos em JavaScript
- CommonJS (CJS)
- Exports e imports nomeados
- Export e import default
- Import de namespace (`import * as`)

---

## O que acontece sem módulos?

- Se você tentar declarar uma função em um arquivo e chamá-la em outro sem exportar nem importar
- Ao executar o arquivo `main.js` com o Node.js (`node main.js`), o código falha com um erro de referência
- Como cada arquivo possui um escopo privado e isolado, a função `sum` declarada em `lib.js` não é visível no arquivo `main.js`.
- Para compartilhar valores entre arquivos, é preciso usar um sistema de módulos.

---

## O que acontece sem módulos? (Exemplo)

```txt
ReferenceError: sum is not defined
    at Object.<anonymous> (main.js:1:13)
```

---

## Sistemas de módulos em JavaScript

- Historicamente, JavaScript não possuía um sistema oficial de módulos.
- Para resolver isso no desenvolvimento de aplicações no servidor com Node.js, surgiram padrões como o CommonJS.
- A partir do ES6 (ES2015), o ecossistema padronizou o ES Modules (ESM).
- Sistema tradicional do Node.js (`require` e `module.exports`).
- Carregamento síncrono em tempo de execução.

---

## CommonJS (CJS)

- No estilo CommonJS, a exportação é feita atribuindo valores ao objeto `module.exports`.
- Para exportar um único valor principal (default export no estilo CommonJS)
- Para exportar múltiplos valores nomeados no CommonJS, atribui-se um objeto ao `module.exports`
- O CommonJS era o padrão exclusivo do Node.js em suas primeiras versões.
- Embora ainda seja amplamente encontrado em projetos antigos e em bibliotecas legadas.

---

## CommonJS (CJS) (Exemplo)

```js
function sum(a, b) {
  return a + b;
}

module.exports = sum;
```

---

## Exports e imports nomeados

- Com o ES Modules (ESM), um módulo pode conter quantas exportações nomeadas (named exports) forem necessárias.
- Cada exportação deve possuir um nome único dentro do arquivo.
- Na importação, os membros desejados são extraídos entre chaves, como em `import { sum } from './math.js'`.
- Caso seja necessário evitar conflitos de nomes ou melhorar a intenção.
- A linguagem bloqueia declarações duplicadas ou importações de nomes inexistentes em tempo de compilação/análise estática

---

## Exports e imports nomeados (Exemplo)

```js
// ESM (ECMAScript Modules) - Named exports
export function sum(a, b) {
  return a + b;
}

export const subtract = function (a, b) {
  return a - b;
};

export const multiply = (a, b) => {
  return a * b;
};

export const divide = (a, b) => a / b;
```

---

## Export e import default

- O export default é usado para definir o valor principal de um módulo (por exemplo.
- Cada módulo pode ter no máximo um `export default`.
- Ao importar um export default, não são utilizadas chaves `{}` e o nome da variável local é livre
- É possível exportar membros nomeados e um export default no mesmo arquivo e importá-los juntos em uma única linha de instrução
- Tentar definir dois `export default` no mesmo arquivo resulta em erro de sintaxe.

---

## Export e import default (Exemplo)

```js
function sum(a, b) {
  return a + b;
}

export default sum;
```

---

## Import de namespace (`import * as`)

- Quando um módulo expõe diversas exportações nomeadas (e opcionalmente um export default).
- O objeto retornado por `import * as` é imutável (read-only).
- Qualquer tentativa de reatribuir ou alterar uma propriedade do objeto de namespace lançará um `TypeError`.

---

## Import de namespace (`import * as`) (Exemplo)

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

---

## Imports dinâmicos (`import()`)

- Instruções `import` estáticas devem ser colocadas no nível superior (top-level) do arquivo.
- Elas são analisadas antes da execução do código.
- Se você precisar carregar um módulo sob demanda, condicionalmente ou dentro de uma função.
- A chamada `await import('./lib.js')` resolve para um objeto de namespace.
- Para desestruturar o export default, renomeie a chave `default` (por exemplo: `{ default: MathLib }`).

---

## Imports dinâmicos (`import()`) (Exemplo)

```js
const needsCalculation = true;

// SyntaxError: import declarations may only appear at top level of a module.
// if (needsCalculation) {
//   import { sum } from './lib.js';
// }

if (needsCalculation) {
  const { sum, default: MathLib } = await import('./lib.js');

  console.log(sum(2, 1)); // 3
  console.log(MathLib.sum(2, 1)); // 3
}
```

---

## Avaliação única e Vínculos Vivos (Live Bindings)

- Dois comportamentos fundamentais caracterizam a execução dos ES Modules no JavaScript

---

## 1. Avaliação Única (*Singleton Evaluation*)

- Um módulo é executado apenas uma única vez, na primeira oportunidade em que é importado.
- Se múltiplos arquivos da aplicação importarem o mesmo módulo `./counter.js`.

---

## 2. Vínculos Vivos (*Live Bindings*)

- As exportações em ESM não são cópias dos valores, mas vínculos vivos (live bindings).
- Quando o módulo de origem altera o valor de uma variável exportada através de uma função interna.
- Contudo, o arquivo que importa o valor não pode reatribuí-lo diretamente.

---

## 2. Vínculos Vivos (*Live Bindings*) (Exemplo)

```js
console.log("Módulo counter.js executado"); // Exibido apenas UMA vez ao iniciar

export let count = 0;

export function increment() {
  count++;
}
```

---

## Configuração do package.json

- Para avisar ao Node.js que os arquivos `.js` do seu projeto devem ser interpretados como ES Modules (e não como o CommonJS legado).

---

## Configuração do package.json (Exemplo)

```json
{
  "name": "meu-projeto",
  "private": true,
  "type": "module"
}
```

---

## Obrigatoriedade da extensão em ESM

- Ao contrário do CommonJS clássico, a especificação do ES Modules no Node.js exige que a extensão do arquivo (ex: `.

---

## Obrigatoriedade da extensão em ESM (Exemplo)

```js
// Error [ERR_MODULE_NOT_FOUND]: Cannot find module './lib'.
// import MathLib from './lib';

import MathLib from './lib.js'; // Correto
```

---

## Especificadores relativos vs. pacotes npm

- Especificador relativo: Começa obrigatoriamente com `./` ou `../` e indica o caminho para um arquivo local do projeto.
- Especificador de pacote: Não possui `./` ou `../`. O Node.js busca a biblioteca dentro da pasta `node_modules`.
- Ao importar um módulo no Node.js, o formato do caminho especificado indica a estratégia de resolução que será utilizada
- Para utilizar pacotes da comunidade como `mathjs`, é necessário instalá-los através de um gerenciador de pacotes.
- Antes da instalação, o `package.json` possui a configuração básica do projeto

---

## Especificadores relativos vs. pacotes npm (Exemplo)

```js
import MathLib, { sum as add } from './lib.js'; // Arquivo relativo local
import { sqrt } from 'mathjs'; // Pacote instalado via npm

console.log(add(2, 1)); // 3
console.log(sqrt(4)); // 2
```

---

## Versionamento semântico (SemVer)

- MAJOR (`14`): Mudanças incompatíveis que podem quebrar o código existente (breaking changes).
- MINOR (`0`): Adição de novas funcionalidades mantendo a compatibilidade retroativa.
- PATCH (`1`): Correção de bugs mantendo a compatibilidade retroativa.
- `node_modules/`: Cria a pasta onde o Node.js armazena o código-fonte do pacote baixado e de suas subdependências.
- Ao instalar um pacote, o npm especifica sua versão no `package.json` utilizando o padrão Semantic Versioning (SemVer).

---

## Versionamento semântico (SemVer) (Comparação)

| Prefixo | Exemplo | Descrição de atualização |
| :--- | :--- | :--- |
| `^` (caret) | `"^14.0.1"` | Permite atualizações **MINOR** e **PATCH** (ex: `< 15.0.0`). É o padrão do npm. |
| `~` (tilde) | `"~14.0.1"` | Permite apenas atualizações de **PATCH** (ex: `< 14.1.0`). |
| Nenhum | `"14.0.1"` | Trava a dependência na versão **exata** especificada. |

---

## CommonJS e ESM lado a lado (LP2)

- Common Javascript - CJS
- ECMAScript Modules - ESM
- A mesma biblioteca escrita nos dois sistemas de módulos, exportando uma função e depois várias, para comparar as sintaxes diretamente.

---

## Cenários

|     | Uma Função | Várias Funções |
| --- | ---------- | -------------- |
| CJS | 1.1        | 2.1            |
| ESM | 1.2        | 2.2            |

---

## Cenários (Exemplo)

```txt
src
├── lib.js
└── main.js
```

---

## Cenário 1.2 - Uma função no ESM

- Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.

---

## Resumo dos Cenários

| Cenário | CommonJS | ES Modules |
| ------- | -------- | ---------- |
| **Uma função** | `module.exports = sum` / `const sum = require('./lib')` | `export default sum` / `import sum from './lib'` |
| **Várias funções** | `module.exports = { sum, minus }` / `const { sum, minus } = require('./lib')` | `export { sum, minus }` / `import { sum, minus } from './lib'` |

---

## Resumo dos Cenários (Exemplo)

```js
// lib.js — uma função
module.exports = sum;
// main.js
const sum = require('./lib');

// lib.js — várias funções
module.exports = { sum, minus };
// main.js
const { sum, minus } = require('./lib');
```

---

## NPM (Exemplo)

```text
$ npm install mathjs
```

---

## CommonJS vs ES Modules

- Qual é a principal diferença de sintaxe e carregamento entre CommonJS e ES Modules?
- CommonJS utiliza `require()` e `module.exports` com carregamento síncrono em tempo de execução.
- ES Modules utiliza `import` e `export` com carregamento estático e assíncrono padronizado pela linguagem.
- O que acontece ao omitir a extensão `.js` ao importar um arquivo relativo em ESM no Node.js?
- O Node.js lança um erro `ERR_MODULE_NOT_FOUND`, pois em ESM especificadores relativos exigem a extensão completa do arquivo.

---

## Named e Default Exports

- Quantos named exports e default exports um mesmo módulo pode conter?*
- Um módulo pode conter múltiplos named exports (desde que cada nome seja único), mas no máximo um `export default`.
- Como a importação de um default export difere da importação de um named export?*
- Named exports exigem o uso de chaves `{}` e os nomes devem corresponder aos exportados (ou usar `as`).
- O default export é importado sem chaves e pode receber qualquer nome local desejado.

---

## Namespace e Dynamic Imports

- Para que serve a sintaxe `import as Namespace` e qual é a propriedade especial de um objeto de namespace?**
- Serve para agrupar todas as exportações de um módulo em um único objeto prefixado.
- O objeto de namespace é imutável (read-only) e qualquer tentativa de mutação causa erro.
- Por que não podemos colocar uma instrução `import` estática dentro de um bloco `if`?
- Como realizar o carregamento condicional de um módulo em tempo de execução?

---

## Resolução e Configuração

- O que diferencia um especificador de arquivo relativo de um especificador de pacote npm?
- Especificadores relativos começam obrigatoriamente com `./` ou `../` para indicar arquivos locais.
- Especificadores de pacote não contêm `./` e são buscados pelo Node.js dentro do diretório `node_modules`.
- Qual configuração é necessária no `package.json` para habilitar ES Modules em um projeto Node.js?
- Incluir a propriedade `"type": "module"` no arquivo `package.json`.

---

## Executando

- Crie uma pasta para o projeto e um arquivo `package.json` com `"type": "module"`
- Instale o pacote `mathjs` via terminal
- Crie o módulo local `math.js`
- Crie o arquivo principal `index.js` importando o módulo local `./math.js` e a biblioteca `mathjs`
- Execute o arquivo com o Node.js no terminal

---

## Exercício

- Crie um arquivo `product-service.js` contendo um array privado de produtos e exporte
- Uma função nomeada `findAll()` que retorne todos os produtos;
- Uma função nomeada `findById(id)` que busque um produto pelo ID;
- Um export default contendo um objeto com as duas funções;
- Crie um arquivo `index.js` que importe o serviço e exiba a lista completa e uma busca por ID;

---

## Desafio

- Crie o módulo `advanced-math.js` exportando funções para `power(base, exp)` e `squareRoot(val)`;
- No arquivo `main.js`, declare uma constante `enableAdvancedMath = true`;
- Se a constante for verdadeira, utilize `await import('./advanced-math.js')` para carregar o módulo sob demanda e calcular `power(2.
- Demonstre a desestruturação do import dinâmico obtendo a função `power`.
- Crie uma aplicação com carregamento condicional e dinâmico de módulos

---

## Resumo da Aula

- **Evolução**: Transição de scripts globais/IIFE e CommonJS (`require`/`module.exports`) para o padrão oficial ES Modules (`import`/`export`).
- **Named vs Default Exports**: Named exports (`export const x`) para múltiplos membros com desestruturação; Default (`export default x`) para recurso principal.
- **Vantagens do ESM**: Análise estática em tempo de compilação, suporte nativo a Tree Shaking, escopo isolado e bindings em tempo real.
- **Dynamic Imports**: `import("./modulo.js")` retorna uma Promise e viabiliza carregamento sob demanda (Code Splitting / Lazy Loading).
- **Node.js Integration**: Ativação com `"type": "module"` no `package.json` ou extensões `.mjs` vs `.cjs`.
