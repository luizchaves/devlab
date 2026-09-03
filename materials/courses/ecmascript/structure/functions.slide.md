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
    position: absolute;
    bottom: 24px;
    right: 32px;
    padding: 0;
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "JavaScript: Funções e Closures"
description: "Declaração de funções, expressões, arrow functions, parâmetros padrão, rest parameters, callbacks, hoisting, closures, IIFE, métodos call/apply/bind e funções geradoras em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Funções e Closures

Declaração, retorno, parâmetros, callbacks, escopo, `this` e generators.

---

## Objetivo

Dominar a criação, invocação, parâmetros e recursos avançados de funções em JavaScript.

- Declarar funções via **Declaration**, **Expression** e **Arrow Functions**.
- Controlar fluxos com **retorno explícito/implícito** e cláusulas de guarda (*guard clauses*).
- Gerenciar parâmetros com **valores padrão**, **rest parameters (`...`)** e **desestruturação**.
- Identificar o papel do objeto especial **`arguments`** e suas diferenças para rest.
- Compreender **hoisting**, ausência de sobrecarga (*overloading*) e sensibilidade a maiúsculas.
- Aplicar **callbacks**, **closures**, **IIFE**, **`this` léxico**, vinculação com `call`/`apply`/`bind` e **generators (`function*`)**.

---

## Mapa do Tópico

- Formas de Declaração (Declaration, Expression, Arrow)
- Retorno, `this` Léxico e Cláusulas de Guarda
- Hoisting, Redefinição e Case Sensitivity
- Parâmetros: Padrão, Rest, `arguments` e Desestruturação
- Funções de Primeira Classe e Callbacks
- Closures e Encapsulamento
- IIFE (Immediately Invoked Function Expression)
- Manipulação de Contexto (`call`, `apply`, `bind`)
- Funções Geradoras (*Generators*)
- Exercício, Desafio e Revisão

---

## Formas de Declaração

```js
// 1. Function Declaration (sofre hoisting completo)
function sum(a, b) {
  return a + b;
}

// 2. Function Expression (atribuída a uma variável)
const subtract = function(a, b) {
  return a - b;
};

// 3. Arrow Function (sintaxe concisa com =>)
const multiply = (a, b) => a * b;

console.log(sum(2, 3));     // 5
console.log(subtract(5, 2)); // 3
console.log(multiply(3, 4)); // 12
```

*Nota: Argumentos omitidos assumem `undefined`; argumentos extras são ignorados pela assinatura.*

---

## Retorno em Arrow Functions

- **Retorno Explícito**: obrigatório quando o corpo da função utiliza chaves `{ ... }`.
- **Retorno Implícito**: avalia e retorna a expressão diretamente sem chaves.

```js
// Retorno implícito de valor primitivo
const double = (n) => n * 2;
console.log(double(5)); // 10

// Retorno implícito de objeto literal: ENVOLVA EM PARÊNTESES ({ ... })
const createUser = (name) => ({ name });
console.log(createUser("Ana")); // { name: 'Ana' }

// Sem parênteses, as chaves viram o corpo da função:
const wrongUser = (name) => { name };
console.log(wrongUser("Ana")); // undefined
```

---

## `this` Léxico em Arrow Functions

*Arrow Functions* herdam o `this` do escopo onde foram criadas (não possuem `this` dinâmico):

```js
const calculator = {
  factor: 2,
  regularDouble(n) {
    return n * this.factor; // 'this' aponta para calculator
  },
  arrowDouble: (n) => n * this.factor, // 'this' aponta para o escopo global (undefined)
  createArrow() {
    return (n) => n * this.factor; // Herda o 'this' do método tradicional
  }
};

console.log(calculator.regularDouble(5)); // 10
console.log(calculator.arrowDouble(5));   // NaN (undefined * 5)
console.log(calculator.createArrow()(5)); // 10
```

---

## Retorno Padrão e Cláusulas de Guarda

Toda função sem `return` devolve `undefined`. Interrompa fluxos cedo com cláusulas de guarda:

```js
// 1. Sem return: devolve undefined (gera NaN em cálculos seguintes)
function showPower(base, exp) { console.log(base ** exp); }
const res = showPower(2, 3); // Imprime 8
console.log(res);            // undefined
console.log(res * 2);        // NaN (undefined * 2)

// 2. Com return explícito: reutilizável em expressões
function calcPower(base, exp) { return base ** exp; }
console.log(calcPower(2, 3) * 2); // 16

// 3. Guard Clause: encerramento antecipado do fluxo
function checkAge(age) {
  if (age < 18) return "menor de idade";
  return "maior de idade";
}
```

---

## Hoisting de Funções

*Function Declarations* são elevadas completamente; *Expressions* obedecem às regras da variável:

```js
// 1. Function Declaration: pode ser invocada antes da sua linha
console.log(add(2, 3)); // 5

function add(a, b) {
  return a + b;
}

// 2. Function Expression com const: erro de referência (TDZ)
// sub(5, 2); // ReferenceError: Cannot access 'sub' before initialization
const sub = (a, b) => a - b;

// 3. Function Expression com var: elevada como undefined
// mult(2, 3); // TypeError: mult is not a function
var mult = function(a, b) { return a * b; };
```

---

## Redefinição e Case Sensitivity

- **Sem Sobrecarga (*Overloading*)**: Se duas *Function Declarations* tiverem o mesmo nome no mesmo escopo, a última **sobrescreve** a primeira.
- **Case Sensitive**: Letras maiúsculas e minúsculas diferenciam identificadores independentes.

```js
function calc(n) { return n + 1; }
function calc(n, m) { return n + m; } // Sobrescreve calc(n)!
console.log(calc(5)); // NaN (5 + undefined)

function power(a, b) { return a ** b; }
function Power(a, b) { return Math.pow(a, b); }
console.log(power(2, 3)); // 8
console.log(Power(2, 3)); // 8 (identificador independente)
```

---

## Parâmetros Padrão (*Default Parameters*)

Valores de contingência caso o argumento seja omitido ou receba `undefined`:

```js
function power(base, exponent = 1) {
  return base ** exponent;
}

console.log(power(2));          // 2 (exponent = 1)
console.log(power(2, 3));       // 8
console.log(power(2, undefined));// 2 (ativa o fallback padrão)
console.log(power(2, null));     // 1 (null é valor válido -> 2 ** 0 = 1)

// Parâmetros padrão com expressões dinâmicas:
function logEvent(msg, date = new Date().toISOString()) {
  return `[${date}] ${msg}`;
}
console.log(logEvent("Login")); // "[2026-09-02T...] Login"
```

---

## Rest Parameters (`...rest`)

Capturam os argumentos restantes e os agrupam em uma instância legítima de `Array`:

```js
// 1. Coleta todos os argumentos em um Array real
function sumAll(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sumAll(1, 2, 3)); // 6

// 2. Parâmetro posicional fixo seguido de rest
function scaleSum(factor, ...numbers) {
  return factor * sumAll(...numbers);
}
console.log(scaleSum(2, 1, 2, 3)); // 12 (fator 2 * soma 6)

// Rest deve ser obrigatoriamente o último parâmetro:
// function invalid(...nums, last) {} // SyntaxError!
```

---

## Objeto `arguments` vs Rest Parameters

`arguments` é um objeto legado *array-like* disponível apenas em funções tradicionais:

```js
function inspectArgs() {
  console.log(arguments.length);          // 3
  console.log(arguments[0]);              // 10
  console.log(Array.isArray(arguments));  // false (array-like!)

  // Conversão necessária para usar métodos de array:
  const argsArray = Array.from(arguments);
  return argsArray.reduce((acc, n) => acc + n, 0);
}

console.log(inspectArgs(10, 20, 30)); // 60

// Em Arrow Functions, arguments não existe (resolve no escopo externo):
const arrow = () => typeof arguments; // "undefined" (no navegador)
```

---

## Comparação entre Formas de Declaração

Depois de ver sintaxe, retorno, `this`, hoisting e `arguments`, a tabela fecha as diferenças principais:

| Característica | Function Declaration | Function Expression | Arrow Function |
| :--- | :--- | :--- | :--- |
| **Sintaxe básica** | `function f() {}` | `const f = function() {}` | `const f = () => {}` |
| **Hoisting** | Completo (corpo + nome) | TDZ (`const`/`let`) | TDZ (`const`/`let`) |
| **Contexto `this`** | Dinâmico (na chamada) | Dinâmico (na chamada) | Léxico (escopo pai) |
| **Objeto `arguments`** | Presente | Presente | Ausente (léxico) |
| **Construtor (`new`)** | Sim | Sim (tradicional) | Não (`TypeError`) |

---

## Desestruturação em Parâmetros

Extraia propriedades diretamente na assinatura com fallbacks seguros:

```js
// Desestruturação direta de propriedades
function formatUser({ name, role }) { return `${name} (${role})`; }
console.log(formatUser({ name: "Maria", role: "admin" })); // "Maria (admin)"

// Propriedades padrão e fallback de objeto completo '= {}'
function createUser({ name = "Anônimo", role = "user" } = {}) {
  return `${name} (${role})`;
}

console.log(createUser({ name: "Bob", role: "editor" })); // "Bob (editor)"
console.log(createUser({ name: "Alice" }));              // "Alice (user)"
console.log(createUser());                               // "Anônimo (user)"
```

---

## Funções de Primeira Classe e Callbacks

Funções podem ser armazenadas em variáveis, passadas como parâmetros e retornadas por outras funções:

```js
function calculate(a, b, operation) {
  return operation(a, b);
}

const add = (x, y) => x + y;
const sub = (x, y) => x - y;

console.log(calculate(10, 5, add)); // 15
console.log(calculate(10, 5, sub)); // 5

// Callbacks anônimos em linha:
console.log(calculate(10, 5, (x, y) => x * y)); // 50
console.log(calculate(10, 5, (x, y) => x / y)); // 2
```

*Atenção: Passe a referência `add`, nunca a invocação `add()`.*

---

## Mecanismo de Closures

Uma **Closure** ocorre quando uma função interna retém o acesso às variáveis do seu escopo léxico externo:

```txt
┌──────────────────────────────────────────────────────────┐
│ Escopo Externo: createCounter()                          │
│   let count = 0;  ──┐ (variável privada preservada)      │
│   function increment() { count += 1; return count; }     │
│   return increment;                                      │
└──────────────────────────────────────────────────────────┘
       │ (execução de createCounter() finaliza)
       ▼
┌──────────────────────────────────────────────────────────┐
│ Escopo Global: const counter = createCounter();          │
│   counter(); // Executa increment() com acesso a 'count' │
└──────────────────────────────────────────────────────────┘
```

---

## Prática: Criando Estado Privado com Closures

```js
function createCounter(initialValue = 0) {
  let count = initialValue; // Variável privada na Heap

  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count
  };
}

const counterA = createCounter(10);
const counterB = createCounter(0);

console.log(counterA.increment()); // 11
console.log(counterA.increment()); // 12
console.log(counterB.increment()); // 1 (estados independentes!)
console.log(counterA.getValue());  // 12
```

---

## IIFE (Immediately Invoked Function Expression)

Funções autoexecutáveis para isolar escopo e evitar poluição de variáveis globais:

```js
// 1. IIFE Tradicional
(function() {
  const secretKey = "app_secret_123";
  console.log("IIFE inicializada!");
})();

// 2. IIFE com Arrow Function e passagem de parâmetros
((appName, version) => {
  console.log(`Módulo ${appName} v${version} carregado.`);
})("DevLab", "2.0");

// secretKey permanece inacessível fora da IIFE:
// console.log(secretKey); // ReferenceError!
```

---

## Manipulação de Contexto (`call`, `apply`, `bind`)

Configuram explicitamente o valor de `this` de funções tradicionais:

| Método | Execução | Passagem de Argumentos | Retorno |
| :--- | :--- | :--- | :--- |
| **`call()`** | Imediata | Argumentos individuais (`arg1, arg2`) | Resultado da função |
| **`apply()`** | Imediata | Array de argumentos (`[arg1, arg2]`) | Resultado da função |
| **`bind()`** | Diferida | Argumentos parciais ou completos | **Nova função** com `this` fixado |

---

## Prática: `call`, `apply` e `bind`

```js
const user1 = { name: "Ana", role: "Dev" };
const user2 = { name: "Carlos", role: "Designer" };

function introduce(greeting, punctuation) {
  return `${greeting}, sou ${this.name} (${this.role})${punctuation}`;
}

// 1. call(): argumentos individuais
console.log(introduce.call(user1, "Olá", "!")); 
// "Olá, sou Ana (Dev)!"

// 2. apply(): argumentos em Array
console.log(introduce.apply(user2, ["Oi", "."])); 
// "Oi, sou Carlos (Designer)."

// 3. bind(): cria nova função com this permanentemente vinculado
const introduceAna = introduce.bind(user1, "Bem-vinda");
console.log(introduceAna("!!!")); 
// "Bem-vinda, sou Ana (Dev)!!!"
```

---

## Funções Geradoras (*Generators*: `function*`)

Funções que pausam e retomam a execução sob demanda (*lazy evaluation*) via **`yield`**:

```js
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

const gen = idGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
```

*Nota: Implementam o protocolo iterável e podem ser consumidas em loops `for...of`.*

---

## Exercício Prático: Calculadora Modular

Crie `calculator.js` com funções de alta ordem, rest e valores padrão:

1. `formatResult(label, value = 0)` retorna `` `${label}: ${value}` ``.
2. `calculate(operation, ...numbers)` executa a operação sobre os números.
3. Crie as operações `sum` e `multiply` com arrow functions e `.reduce()`.
4. Teste `calculate` com soma, multiplicação e callback anônimo de divisão.
5. Exiba os resultados formatados com `formatResult`.

---

## Solução do Exercício

```js
const formatResult = (label, value = 0) => `${label}: ${value}`;

const sum = (...numbers) => numbers.reduce((acc, n) => acc + n, 0);
const multiply = (...numbers) => numbers.reduce((acc, n) => acc * n, 1);

function calculate(operation, ...numbers) {
  return operation(...numbers);
}

console.log(formatResult("Soma", calculate(sum, 10, 20, 30))); // "Soma: 60"
console.log(formatResult("Mult", calculate(multiply, 2, 3, 4))); // "Mult: 24"
console.log(formatResult("Div", calculate((a, b) => a / b, 100, 4))); // "Div: 25"
console.log(formatResult("Vazio")); // "Vazio: 0"
```

---

## Desafio: Rastreador com Closure e Desestruturação

Crie um módulo de rastreamento com estado privado:

1. Crie `createScoreTracker(initialScore = 0)` retornando uma função interna que acumula pontos na variável privada (closure).
2. Crie `registerUser({ name = "Convidado", role = "user" } = {})` retornando `"[ROLE] Name"`.
3. Instancie o rastreador e execute invocações acumulando a pontuação.

---

## Solução do Desafio

```js
function createScoreTracker(initialScore = 0) {
  let score = initialScore;
  return function addPoints(points) {
    score += points;
    return score;
  };
}

function registerUser({ name = "Convidado", role = "user" } = {}) {
  return `[${role.toUpperCase()}] ${name}`;
}

const tracker = createScoreTracker(100);
console.log(registerUser({ name: "Ana", role: "admin" })); // "[ADMIN] Ana"
console.log(registerUser());                              // "[USER] Convidado"
console.log(tracker(50));                                 // 150
console.log(tracker(30));                                 // 180
```

---

## Perguntas de Revisão

- Qual a diferença de sintaxe entre retorno explícito e implícito em Arrow Functions?
- Por que `(name) => { name }` retorna `undefined` e como corrigir?
- O que acontece ao passar `null` para um parâmetro com valor padrão?
- Qual a vantagem dos *rest parameters* (`...rest`) sobre o objeto `arguments`?
- Por que é recomendável colocar `= {}` ao usar desestruturação em parâmetros?
- O que é uma **closure** e qual problema ela resolve?
- Como o `this` em Arrow Functions se diferencia de funções tradicionais?
- Qual a diferença prática entre `call()`, `apply()` e `bind()`?
- O que o método `.next()` devolve ao ser chamado em um objeto Generator?

---

## Resumo do Tópico

- **Declaração**: `function` (hoisting completo), expressão (TDZ) e arrow (`=>`).
- **Arrow Functions**: sintaxe concisa, retorno implícito e `this` léxico.
- **Parâmetros Modernos**: valores padrão, `...rest` (Array real) e desestruturação `= {}`.
- **Funções de 1ª Classe**: funções como valores, callbacks e guard clauses.
- **Closures & IIFE**: isolamento de escopo e retenção de estado privado.
- **Contexto & Generators**: `call`/`apply`/`bind` controlam `this`; `yield` pausa fluxos sob demanda.
