---
marp: true
theme: default
paginate: true
lang: pt-BR
title: "JavaScript: Funções"
description: "Slides completos da aula de Funções em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Funções

Declaração, expressões, *arrow functions*, parâmetros, callbacks, *hoisting*, *closures* e operador `this`.

---

## Objetivo

Compreender os fundamentos e comportamentos avançados das funções em JavaScript:

- Diferenciar *Function Declaration*, *Function Expression* e *Arrow Function*.
- Dominar parâmetros padrão, *rest parameters* (`...rest`) e desestruturação.
- Entender retorno explícito versus implícito.
- Trabalhar com funções de primeira classe e *callbacks*.
- Reconhecer *hoisting*, ausência de sobrecarga, *closures* e o `this` léxico.

---

## O que são Funções?

Funções são os blocos de construção fundamentais em JavaScript:

- Agrupam um conjunto de instruções reutilizáveis.
- Evitam repetição de código (princípio DRY).
- Criam abstrações e isolam a lógica da aplicação.
- Podem ser armazenadas em variáveis, passadas como parâmetros e retornadas por outras funções.

---

## Formas de Declaração

### 1. Function Declaration (Declaração Tradicional)

```js
function addition(param1, param2) {
  return param1 + param2;
}

console.log(addition(1, 2)); // 3
console.log(addition(1)); // NaN (1 + undefined)
console.log(addition(1, 2, 3)); // 3 (extra ignorado)
```

- Possui nome obrigatório na declaração.
- Sofre *hoisting* completo (pode ser chamada antes de sua linha).

---

## Formas de Declaração

### 2. Function Expression (Expressão de Função)

Define uma função anônima ou nomeada atribuída a uma variável:

```js
const subtraction = function (param1, param2) {
  return param1 - param2;
};

console.log(subtraction); // [Function: subtraction]
console.log(subtraction(2, 1)); // 1
```

- Não sofre *hoisting* de inicialização quando declarada com `const` ou `let`.

---

## Formas de Declaração

### 3. Arrow Functions (Notação `=>`)

Sintaxe mais curta introduzida no ES6 (ES2015):

```js
const multiplication = (param1, param2) => {
  return param1 * param2;
};

const division = (param1, param2) => param1 / param2;
const double = (number) => number * 2;

console.log(multiplication(2, 3)); // 6
console.log(division(6, 2)); // 3
console.log(double(5)); // 10
```

---

## Arrow Functions: Retorno Implícito

- **Corpo com chaves `{...}`**: O uso da instrução `return` é **obrigatório**.
- **Sem chaves**: A expressão é avaliada e retornada **implicitamente**.
- **Retorno implícito de objetos**: Envolva o objeto em parênteses `({ ... })`:

```js
const createObject = (name) => ({ name });
const wrongCreateObject = (name) => { name };

console.log(createObject("Fulano")); // { name: 'Fulano' }
console.log(wrongCreateObject("Fulano")); // undefined
```

---

## Operador `this` em Arrow Functions

Arrow Functions possuem **`this` léxico**: herdam o `this` do escopo onde foram criadas.

```js
const calculator = {
  factor: 2,
  regularDouble(number) {
    return number * this.factor; // this dinâmico (calculator)
  },
  arrowDouble: (number) => number * this.factor, // this global (undefined)
};

console.log(calculator.regularDouble(5)); // 10
console.log(calculator.arrowDouble(5)); // NaN
```

- **Regra**: Evite usar *arrow functions* como métodos diretos de objetos.

---

## Retorno e Controle de Fluxo

Toda função em JavaScript retorna um valor. Se nenhum `return` for executado, retorna `undefined`.

```js
function greeting(name) {
  console.log(`Hello, ${name}`);
}

const result = greeting("Fulano"); // Hello, Fulano
console.log(result); // undefined
```

- O `return` interrompe a execução imediatamente.
- **Guard Clause** (retorno antecipado) evita ninhos profundos de `if/else`.

---

## Retorno Antecipado (Guard Clause)

```js
function checkAge(age) {
  if (age < 18) {
    return "Menor de idade";
  }

  return "Maior de idade";
}

console.log(checkAge(15)); // "Menor de idade"
console.log(checkAge(20)); // "Maior de idade"
```

O código fica plano, legível e mais fácil de manter.

---

## Parâmetros Padrão (*Default Parameters*)

Permitem definir valores padrão quando argumentos forem omissos ou `undefined`:

```js
function greetingMessage(name = "visitante") {
  return `Hello, ${name}`;
}

console.log(greetingMessage("Fulano")); // "Hello, Fulano"
console.log(greetingMessage()); // "Hello, visitante"
console.log(greetingMessage(undefined)); // "Hello, visitante"
console.log(greetingMessage(null)); // "Hello, null" (null NÃO aciona padrão)
```

---

## Parâmetros Rest (*Rest Parameters*)

Capturam múltiplos argumentos em um **Array real** usando a sintaxe `...rest`:

```js
function sumAll(...numbers) {
  return numbers.reduce((total, number) => total + number, 0);
}

console.log(sumAll()); // 0
console.log(sumAll(1, 2)); // 3
console.log(sumAll(1, 2, 3, 4)); // 10
```

- Deve ser o **último** parâmetro da assinatura.
- Substitui com vantagens o objeto legado `arguments`.

---

## Desestruturação em Parâmetros

Permite extrair propriedades de objetos diretamente na assinatura da função:

```js
function createUser({ name = "anonymous", active = true } = {}) {
  return `${name} / ${active}`;
}

console.log(createUser({ name: "Fulano" })); // "Fulano / true"
console.log(createUser({ name: "Beltrano", active: false })); // "Beltrano / false"
console.log(createUser()); // "anonymous / true"
```

- **Dica**: Forneça sempre o fallback `= {}` para evitar `TypeError` caso nenhum argumento seja passado.

---

## Callbacks e Funções de Primeira Classe

Funções são **cidadãs de primeira classe**: podem ser armazenadas em variáveis e passadas como argumentos.

A função passada como parâmetro é chamada de **callback**:

```js
function calc(param1, param2, callback) {
  return callback(param1, param2);
}

const sum = (a, b) => a + b;

console.log(calc(2, 1, sum)); // 3
console.log(calc(2, 1, (x, y) => x * y)); // 2
```

- **Atenção**: Passe a referência da função (`sum`), e **não** sua invocação (`sum()`).

---

## Hoisting de Funções

Mecanismo que move declarações para o topo do escopo antes da execução.

- **Function Declaration**: Elevação completa.

```js
console.log(sum(2, 3)); // 5 (funciona por causa do hoisting)
function sum(a, b) { return a + b; }
```

- **Function Expression (`const`/`let`)**: Permanece na *Temporal Dead Zone* (TDZ).

```js
// ReferenceError: Cannot access 'sub' before initialization
console.log(sub(2, 3));
const sub = (a, b) => a - b;
```

---

## Redefinição de Funções (Sem Sobrecarga)

JavaScript **NÃO** possui sobrecarga de métodos (*overloading*) nativa.

Se duas declarações com o mesmo nome existirem no mesmo escopo, a **última irá sobrescrever** a primeira:

```js
function operation(param1, param2) {
  return param1 + param2;
}

function operation(param) {
  return param + 1;
}

console.log(operation(1, 2)); // 2 (chama a segunda versão!)
```

---

## Case Sensitivity

Nomes de funções diferenciam maiúsculas de minúsculas (`sumLower` != `SumLower`).

---

## Closures

Uma *closure* ocorre quando uma função interna lembra e acessa o escopo da função pai, mesmo após o encerramento da execução externa:

```js
function createCounter() {
  let count = 0;
  return function increment() {
    count += 1;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

---

## Exercício Prático: Calculadora

Crie uma função `calculate` que receba uma operação e rest parameters:

```js
const formatResult = (label, value = 0) => `${label}: ${value}`;
const sum = (...numbers) => numbers.reduce((total, n) => total + n, 0);
const multiply = (...numbers) => numbers.reduce((total, n) => total * n, 1);

function calculate(operation, ...numbers) {
  return operation(...numbers);
}

console.log(formatResult("Soma", calculate(sum, 10, 20, 30))); // "Soma: 60"
console.log(formatResult("Multiplicação", calculate(multiply, 2, 3, 4))); // "Multiplicação: 24"
```

---

## Resumo da Aula

- Use **Function Declaration** quando precisar de hoisting e `this` dinâmico.
- Use **Arrow Functions** para sintaxe curta, callbacks e `this` léxico.
- Lembre-se: `({ obj })` para retorno implícito de objetos em Arrow Functions.
- Use **Rest Parameters** (`...rest`) em vez do objeto legado `arguments`.
- Passe referências de funções para **callbacks**, nunca invocações acidentais `func()`.
- Utilize **Closures** para manter estado privado e encapsulado.
