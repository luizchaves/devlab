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
title: 'JavaScript: Funções e Closures'
description: 'Declaração de funções, expressões, arrow functions, parâmetros padrão, rest parameters, callbacks, hoisting, closures, IIFE, métodos call/apply/bind e funções geradoras em JavaScript.'
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

## Mapa da Aula

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

console.log(sum(2, 3), subtract(5, 2), multiply(3, 4)); // 5 3 12
```

- Argumentos omitidos recebem `undefined`; argumentos extras são ignorados pela assinatura.

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

// Sem parênteses, as chaves são lidas como bloco vazio -> undefined!
const wrongUser = (name) => { name };
console.log(wrongUser("Ana")); // undefined
```

---

## O Operador `this` em Arrow Functions

- Funções tradicionais têm **`this` dinâmico** (definido no momento em que são chamadas).
- Arrow functions têm **`this` léxico** (herdam o contexto do escopo em que foram criadas).

```js
const calculator = {
  factor: 2,
  regularDouble(n) {
    return n * this.factor; // this aponta para calculator
  },
  arrowDouble: (n) => n * this.factor, // this aponta para o escopo externo (global)
};

console.log(calculator.regularDouble(5)); // 10
console.log(calculator.arrowDouble(5));   // NaN (undefined * 5)
```

- **Regra**: Evite declarar métodos de objetos como arrow functions diretas.

---

## Retorno Padrão e Cláusulas de Guarda

- Funções sem instrução `return` explícita retornam **`undefined`** por padrão.
- **Guard Clauses**: retornos antecipados para simplificar o fluxo e eliminar blocos `if/else` aninhados.

```js
function checkAccess(age) {
  if (age < 18) {
    return "minor"; // encerra imediatamente
  }

  return "adult";
}

console.log(checkAccess(16)); // "minor"
console.log(checkAccess(20)); // "adult"
```

---

## Hoisting em Funções

- **Function Declarations**: são elevadas por completo, podendo ser chamadas antes da declaração.
- **Function Expressions (`const`/`let`)**: permanecem na TDZ (*Temporal Dead Zone*).

```js
// Funciona perfeitamente devido ao hoisting:
console.log(add(2, 3)); // 5
function add(a, b) { return a + b; }

// Gera ReferenceError (não inicializada):
// console.log(sub(5, 2));
const sub = (a, b) => a - b;

// Com var: a variável é elevada com undefined -> TypeError: sub is not a function!
```

---

## Redefinição e Case Sensitivity

- JavaScript **não possui sobrecarga de métodos** (*overloading*) por número de argumentos.
- Declarar duas `function` com o mesmo nome no mesmo escopo **sobrescreve** a primeira.

```js
function calculate(x) { return x * 10; }
function calculate(x, y) { return x + y; }

console.log(calculate(5)); // NaN (5 + undefined) -> a segunda venceu!
```

- Nomes são **case-sensitive**: `sum` e `Sum` são identificadores distintos.

---

## Parâmetros Padrão (Default Parameters)

Atribuem valores de *fallback* quando o argumento for omitido ou receber **`undefined`**:

```js
function power(base, exponent = 2) {
  return base ** exponent;
}

console.log(power(3));          // 9 (usa exponent = 2)
console.log(power(3, 3));       // 27
console.log(power(3, undefined)); // 9 (ativa padrão)
console.log(power(3, null));    // 1 (null NÃO ativa padrão; vira 0 numericamente!)
```

- Valores padrão podem ser dinâmicos: `function log(msg, date = new Date())`.

---

## Rest Parameters (`...rest`)

Capturam múltiplos argumentos e os agrupam em uma instância real de **`Array`**:

```js
function sumAll(label, ...numbers) {
  const total = numbers.reduce((acc, n) => acc + n, 0);
  return `${label}: ${total}`;
}

console.log(sumAll("Total", 10, 20, 30)); // "Total: 60"
console.log(sumAll("Vazio"));             // "Vazio: 0"
```

- Permite uso direto de métodos como `.map()`, `.filter()`, `.reduce()` e laços `for...of`.
- **Obrigatório**: o parâmetro rest deve ser o **último** da assinatura.

---

## Objeto `arguments` vs Rest Parameters

- `arguments`: objeto especial *array-like* presente apenas em funções tradicionais.
- Possui `.length` e índices numéricos, mas **não é um Array real**.

```js
function showArgs() {
  console.log(arguments.length);       // 3
  console.log(Array.isArray(arguments)); // false
  
  // Para usar métodos de array com arguments:
  const argsArray = Array.from(arguments);
  return argsArray.join("-");
}

console.log(showArgs("a", "b", "c")); // "a-b-c"
```

- **Prefira `...rest`**: mais moderno, legível e compatível com arrow functions.

---

## Parâmetros Desestruturados

Extrai propriedades de objetos diretamente na assinatura da função:

```js
function registerUser({ name = "Anônimo", role = "user" } = {}) {
  return `[${role.toUpperCase()}] ${name}`;
}

console.log(registerUser({ name: "Ana", role: "admin" })); // "[ADMIN] Ana"
console.log(registerUser({ name: "Carlos" }));             // "[USER] Carlos"
console.log(registerUser());                               // "[USER] Anônimo"
```

- **Boas Práticas**: inclua sempre o *fallback* `= {}` para evitar `TypeError` caso a função seja chamada sem argumentos.

---

## Funções de Primeira Classe e Callbacks

Funções em JavaScript podem ser passadas como argumentos e retornadas por outras funções:

```js
function execute(a, b, operation) {
  return operation(a, b);
}

const add = (x, y) => x + y;
const multiply = (x, y) => x * y;

console.log(execute(10, 5, add));            // 15
console.log(execute(10, 5, multiply));       // 50
console.log(execute(10, 2, (x, y) => x / y)); // 5
```

- **Atenção**: passe a **referência** `add`, não a invocação `add()`.

---

## Closures (Fechamentos Léxicos)

Uma **closure** ocorre quando uma função interna retém o acesso ao escopo léxico onde foi criada, mesmo após o término da função externa:

```js
function createCounter(initialValue = 0) {
  let count = initialValue; // Variável privada encapsulada

  return function increment() {
    count += 1;
    return count;
  };
}

const counter1 = createCounter(10);
console.log(counter1()); // 11
console.log(counter1()); // 12

const counter2 = createCounter(0);
console.log(counter2()); // 1 (instâncias com estados independentes)
```

---

## IIFE (Immediately Invoked Function Expression)

Funções executadas imediatamente no ponto de definição para isolar escopo:

```js
// IIFE Tradicional
(function() {
  const secretKey = "12345";
  console.log("Módulo inicializado em escopo protegido!");
})();

// IIFE com Arrow Function e argumentos
((appName, version) => {
  console.log(`${appName} v${version} carregado.`);
})("DevLab", "2.0");

// secretKey é inacessível aqui fora -> ReferenceError
```

- Muito utilizada para evitar poluição do escopo global e criar módulos encapsulados.

---

## Manipulação de Contexto: `call`, `apply` e `bind`

Permitem vincular e alterar o valor de `this` em funções tradicionais:

| Método | Invocação | Argumentos | Retorno |
| :--- | :--- | :--- | :--- |
| **`call()`** | Imediata | Lista individual (`arg1, arg2`) | Retorno da função |
| **`apply()`** | Imediata | Array de argumentos (`[arg1, arg2]`) | Retorno da função |
| **`bind()`** | Diferida | Lista individual (currying parcial) | **Nova função** com `this` fixado |

---

## Exemplo: `call`, `apply` e `bind`

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

// 3. bind(): cria nova função com this permanentemente amarrado
const introduceAna = introduce.bind(user1, "Bem-vinda");
console.log(introduceAna("!!!")); 
// "Bem-vinda, sou Ana (Dev)!!!"
```

---

## Funções Geradoras (*Generators*: `function*`)

Funções que podem ter sua execução **pausada** e **retomada** sob demanda (*lazy evaluation*) via **`yield`**:

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

- Implementam o protocolo de iteração, podendo ser consumidas diretamente em laços `for...of`.

---

## Exercício Prático: Calculadora Modular

Crie `calculator.js` com funções de alta ordem, rest e valores padrão:

1. `formatResult(label, value = 0)` retorna `` `${label}: ${value}` ``.
2. `calculate(operation, ...numbers)` executa a operação sobre a lista.
3. Crie as operações `sum` e `multiply` com arrow functions e `.reduce()`.
4. Teste `calculate` com soma, multiplicação e callback anônimo de divisão.

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

1. Crie `createScoreTracker(initialScore = 0)` retornando uma função que acumula pontos no estado privado (closure).
2. Crie `registerUser({ name = "Convidado", role = "user" } = {})` retornando `"[ROLE] Name"`.
3. Instancie o rastreador e acumule pontuações.

```js
function createScoreTracker(initialScore = 0) {
  let score = initialScore;
  return (points) => (score += points);
}

function registerUser({ name = "Convidado", role = "user" } = {}) {
  return `[${role.toUpperCase()}] ${name}`;
}

const tracker = createScoreTracker(100);
console.log(registerUser({ name: "Ana", role: "admin" })); // "[ADMIN] Ana"
console.log(tracker(50)); // 150
console.log(tracker(30)); // 180
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

---

## Resumo da Aula

- **Declaração**: `function` (hoisting completo), expressão (TDZ) e arrow (`=>`).
- **Arrow Functions**: sintaxe concisa, retorno implícito e `this` léxico.
- **Parâmetros Modernos**: valores padrão, `...rest` (Array real) e desestruturação `= {}`.
- **Funções de 1ª Classe**: funções como valores, callbacks e guard clauses.
- **Closures & IIFE**: isolamento de escopo e retenção de estado privado.
- **Contexto & Generators**: `call`/`apply`/`bind` controlam `this`; `yield` pausa fluxos.
