---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Variáveis"
description: "Slides completos da aula de valores, tipos de dados, variáveis e escopo em JavaScript."


---



<!-- _class: lead -->

# JavaScript: Variáveis

Valores, tipos de dados primitivos e objetos, operador `typeof`, declaração com `const`, `let` e `var`, escopo de bloco e função, *hoisting* e *Temporal Dead Zone*.



---


## Objetivo (Parte 1)

Compreender a representação de dados e declaração de variáveis em JavaScript:

- Reconhecer os 7 tipos primitivos e os objetos.
- Observar tipos em tempo de execução com `typeof` e `Array.isArray()`.
- Diferenciar `undefined` (ausência de inicialização) de `null` (ausência intencional).


---


## Objetivo (Parte 2)

- Declarar variáveis com `const`, `let` e `var`.
- Entender a diferença entre **reassociação** e **mutação**.
- Dominar **escopo de bloco**, **escopo de função**, *hoisting* e *Temporal Dead Zone* (TDZ).


---



## Tipos de Dados Primitivos em JavaScript

A regra de ouro: **O tipo está no valor, não na variável**.

| Tipo | Descrição | Exemplos |
| --- | --- | --- |
| `undefined` | Ausência de valor por falta de inicialização | `undefined` |
| `null` | Ausência intencional de valor | `null` |
| `boolean` | Valor lógico | `true`, `false` |
| `number` | Número de ponto flutuante (IEEE 754) | `42`, `3.14`, `15_000` |
| `bigint` | Inteiro de precisão arbitrária | `42n`, `9007199254740991n` |
| `string` | Sequência de caracteres | `"Alice"`, `'DW'`, `` `Olá` `` |
| `symbol` | Identificador único e imutável | `Symbol("id")` |



---



## Tipos Objeto em JavaScript

| Tipo | Descrição | Exemplos |
| --- | --- | --- |
| `object` | Coleção de chave/valor ou estruturas complexas | `{ id: 1010 }`, `[1, 2, 3]`, `new Date()`, `/dw/i` |
| `function` | Objeto especial executável com escopo | `function sum(a, b) { return a + b; }` |



---

## Observando Tipos com `typeof` (Parte 1)

O operador `typeof` retorna uma string representando o tipo do valor:

```js
console.log(typeof undefined);    // "undefined"
console.log(typeof null);         // "object" (decisão legada da linguagem)
console.log(typeof 42);           // "number"
console.log(typeof 42n);          // "bigint"
```

---

## Observando Tipos com `typeof` (Parte 2)

```js
console.log(typeof "Hello");      // "string"
console.log(typeof Symbol("id")); // "symbol"
console.log(typeof {});           // "object"
console.log(typeof function(){}); // "function"
```

- **Arrays**: `typeof []` retorna `"object"`. Para verificar se é array, use **`Array.isArray([])`** (retorna `true`).

---



## Ausência de Valor: `undefined` vs `null`

- **`undefined`**: Indica que um nome existe no escopo, mas **não foi inicializado** com valor.
- **`null`**: Representa uma **ausência intencional** de valor (atribuído explicitamente).

```js
let notInitialized;
const empty = null;

console.log(notInitialized);        // undefined
console.log(typeof notInitialized); // "undefined"

console.log(empty);                 // null
console.log(typeof empty);          // "object"
```



---



## Booleano e Valores Falsy

Ao avaliar uma condição, JavaScript converte o valor para booleano.

- **Valores Falsy** (convertem para `false`):
  `false`, `0`, `-0`, `0n`, `""` (string vazia), `null`, `undefined`, `NaN`.
- **Valores Truthy** (convertem para `true`):
  Todos os outros, inclusive `[]` (array vazio), `{}` (objeto vazio) e `"0"`.

```js
console.log(Boolean(0));       // false
console.log(Boolean(""));      // false
console.log(Boolean([]));      // true
console.log(Boolean("0"));     // true
```



---



## Precisão Numérica: IEEE 754

Números em JavaScript usam ponto flutuante de precisão dupla de 64 bits (IEEE 754):

```js
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false
```

- **Valores monetários**: Guarde valores em **centavos como inteiros** (`1099` para R$ 10,99) ou utilize o tipo `DECIMAL` no banco de dados.
- Formate a exibição final usando `Intl.NumberFormat`.



---



## Declaração de Variáveis: `const`, `let` e `var`

| Palavra-chave | Pode Reassociar? | Escopo Principal | Uso Recomendado |
| --- | --- | --- | --- |
| **`const`** | Não | Bloco `{}` | **Padrão**: para valores que não mudam de referência |
| **`let`** | Sim | Bloco `{}` | Para variáveis que serão **reassociadas** |
| **`var`** | Sim | Função | Código legado (evitar em arquivos novos) |

```js
const price = 79.9;
let discount = 10;
var legacyTotal = price - discount;
```

*Boas práticas: Comece sempre com `const`. Só mude para `let` quando houver reassociação.*



---



## Reassociação vs. Mutação

- **Reassociação**: Fazer o nome apontar para outro valor. Bloqueado em `const`.
- **Mutação**: Modificar propriedades de um objeto ou elementos de um array existente. **Permitido em `const`**!

```js
const user = { name: "Alice" };

// MUTAÇÃO: Permitida em const!
user.name = "Bob";
console.log(user); // { name: "Bob" }

// REASSOCIAÇÃO: Bloqueada em const!
// TypeError: Assignment to constant variable.
// user = { name: "Carlos" };
```



---



## Escopo: Bloco vs. Função

- **`let` e `const`**: Possuem **escopo de bloco** (restritos ao par de chaves `{...}`).
- **`var`**: Possui **escopo de função** (vaza fora de blocos `if`, `for`, etc).

```js
if (true) {
  var functionScoped = "Eu vazo!";
  let blockScoped = "Eu fico no bloco!";
}

console.log(functionScoped); // "Eu vazo!"

// ReferenceError: blockScoped is not defined
// console.log(blockScoped);
```



---



## Hoisting e Temporal Dead Zone (TDZ)

- **`var`**: A declaração é elevada (*hoisted*) para o topo do escopo e inicializada como `undefined`.
- **`let` e `const`**: São elevadas, mas ficam na **Temporal Dead Zone (TDZ)** até a linha da declaração. Acessá-las antes causa `ReferenceError`.

```js
console.log(varVariable); // undefined
var varVariable = 10;

// ReferenceError: Cannot access 'letVariable' before initialization
// console.log(letVariable);
// let letVariable = 20;
```



---



## Comportamento de `var` em Laços

`var` compartilha uma única variável no escopo da função para todas as iterações:

```js
const callbacksWithVar = [];

for (var i = 0; i < 3; i++) {
  callbacksWithVar.push(() => i);
}

console.log(callbacksWithVar.map(cb => cb())); // [3, 3, 3]
```



---



## Comportamento de `let` em Laços

`let` cria uma nova associação (*binding*) para cada iteração do laço `for`:

```js
const callbacksWithLet = [];

for (let j = 0; j < 3; j++) {
  callbacksWithLet.push(() => j);
}

console.log(callbacksWithLet.map(cb => cb())); // [0, 1, 2]
```



---



## Identificadores e Convenções de Nomes

Identificadores podem conter letras, dígitos, `_` e `$`. Não podem iniciar com dígitos.

```js
const _total = 10;
const $price = 19.9;
const fullName = "Fulano";
```

### Convenções de Nomenclatura:
- **`camelCase`**: Variáveis e funções (`userName`, `totalPrice`).
- **`PascalCase`**: Classes e componentes (`UserProfile`).
- **`UPPER_CASE`**: Constantes globais de configuração (`API_URL`, `MAX_ATTEMPTS`).



---



## Exercício Prático: Calculadora com Nomes

Crie um arquivo `variables.js` para declarar valores e aplicar cálculos nomeados:

```js
const price = 79.9;
const discountFactor = 0.9;
const shipping = 12;

const subtotal = price * discountFactor;
const total = subtotal + shipping;

console.log(`Subtotal: R$ ${subtotal.toFixed(2)}`); // "Subtotal: R$ 71.91"
console.log(`Total: R$ ${total.toFixed(2)}`);       // "Total: R$ 83.91"
```



---


## Resumo da Aula (Parte 1)

- O tipo pertence ao **valor** e não à variável.
- Use **`typeof`** para inspecionar tipos e **`Array.isArray()`** para checar arrays.
- Prefira **`const`** por padrão para evitar reassociações acidentais.


---


## Resumo da Aula (Parte 2)

- Use **`let`** apenas quando a variável precisar receber novos valores.
- Evite **`var`** para não sofrer com vazamento de escopo de bloco e inicialização implícita de `undefined`.
- Lembre-se: `const` previne reassociação, mas permite a **mutação** de objetos e arrays.