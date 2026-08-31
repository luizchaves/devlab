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
title: 'JavaScript: Funções e Closures'
description: 'Declaração de funções, expressões, arrow functions, parâmetros padrão, rest parameters, callbacks, hoisting, closures, IIFE, métodos call/apply/bind e funções geradoras em JavaScript.'
---

<!-- _class: lead -->

# JavaScript: Funções e Closures

Declaração, retorno, parâmetros, callbacks, escopo, `this` e generators.

---

## Objetivo

- Declarar funções com `function`, expressão e arrow function.
- Controlar retorno explícito, implícito e antecipado.
- Entender _hoisting_, redefinição e nomes _case sensitive_.
- Usar parâmetros padrão, rest, `arguments` e desestruturação.
- Aplicar callbacks, closures, IIFE, `call`, `apply`, `bind` e generators.

---

## Mapa da Aula

- Formas de declaração
- Retorno e _hoisting_
- Parâmetros e argumentos
- Callbacks e primeira classe
- Closures, IIFE e `this`
- Generators, prática e desafio

---

## Funções Organizam Código

```txt
entrada ──► função ──► retorno
              |
              v
       nomeia uma tarefa
       evita repetição
       cria abstração
```

- Funções agrupam instruções.
- Elas tornam regras reutilizáveis.
- Elas são valores em JavaScript.

---

## Formas de Declaração

| Forma           | Sintaxe                                        | Ponto central                  |
| --------------- | ---------------------------------------------- | ------------------------------ |
| Declaration     | `function name() { return expression }`        | sofre _hoisting_ completo      |
| Expression      | `const fn = function () { return expression }` | valor atribuído a uma variável |
| Arrow expressão | `const fn = () => expression`                  | retorno implícito              |
| Arrow bloco     | `const fn = () => { return expression; }`      | `return` explícito             |

---

## Function Declaration

```js
function addition(param1, param2) {
  return param1 + param2;
}

console.log(addition(1)); // NaN
console.log(addition(1, 2)); // 3
console.log(addition(1, 2, 3)); // 3
```

- Argumentos extras são ignorados pela assinatura.
- Argumentos omitidos viram `undefined`.

---

## Function Expression

```js
const subtraction = function (param1, param2) {
  return param1 - param2;
};

console.log(subtraction); // [Function: subtraction]
console.log(subtraction(2, 1)); // 1
```

- A função é um valor.
- A constante aponta para esse valor.

---

## Arrow Function

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

## Retorno em Arrow Function

- Com `{}`, o `return` é obrigatório.
- Sem `{}`, a expressão é retornada implicitamente.
- Para objeto literal implícito, use parênteses.

```js
const createObject = (name) => ({ name });
const wrongCreateObject = (name) => {
  name;
};

console.log(createObject('Fulano')); // { name: "Fulano" }
console.log(wrongCreateObject('Fulano')); // undefined
```

---

## Sintaxe Incorreta

```js
// SyntaxError: Unexpected token '='.
// function wrongAddition = (param1, param2) {
//   return param1 + param2;
// }
```

- `function` declara uma função.
- `=>` pertence à sintaxe de arrow function.
- As duas formas não são misturadas.

---

## `this` em Arrow Functions

- Função tradicional tem `this` definido pela chamada.
- Arrow function captura o `this` do escopo onde foi criada.
- Por isso, arrow function costuma ser ruim como método direto.

```txt
regularDouble()      -> this = calculator
arrowDouble: () =>   -> this = escopo externo
createArrowDouble()  -> arrow captura this do método
```

---

## `this` em Método

```js
const calculator = {
  factor: 2,
  regularDouble(number) {
    return number * this.factor;
  },
  arrowDouble: (number) => number * this.factor,
};

console.log(calculator.regularDouble(5)); // 10
console.log(calculator.arrowDouble(5)); // NaN
```

---

## Arrow Capturando `this`

```js
const calculator = {
  factor: 2,
  createArrowDouble() {
    return (number) => number * this.factor;
  },
};

const double = calculator.createArrowDouble();

console.log(double(5)); // 10
```

- A arrow function nasce dentro do método.
- Ela preserva o `this` correto.

---

## Retorno

- Toda função retorna um valor.
- Sem `return`, o retorno é `undefined`.
- `return` interrompe a execução da função.

```js
function greeting(name) {
  console.log(`Hello, ${name}`); // Hello, Fulano
}

const result = greeting('Fulano');

console.log(result); // undefined
```

---

## Retornando um Valor

```js
function greetingMessage(name) {
  return `Hello, ${name}`;
}

console.log(greetingMessage('Fulano')); // "Hello, Fulano"
```

- `console.log` exibe um valor.
- `return` devolve um valor para quem chamou.

---

## Retorno Antecipado

```js
function checkAge(age) {
  if (age < 18) {
    return 'minor';
  }

  return 'adult';
}

console.log(checkAge(17)); // "minor"
console.log(checkAge(18)); // "adult"
```

- O primeiro `return` encerra a função.
- Esse padrão reduz aninhamento.

---

## Hoisting

- _Hoisting_ processa declarações antes da execução.
- Function Declaration pode ser chamada antes da linha da declaração.
- Function Expression depende da inicialização da variável.

```txt
function name() {}        -> chamada antes funciona
const fn = function () {} -> chamada antes falha
var fn = function () {}   -> variável existe como undefined
```

---

## Hoisting com Declaration

```js
console.log(hoistedAddition(2, 3)); // 5

function hoistedAddition(param1, param2) {
  return param1 + param2;
}
```

- A declaração inteira é elevada.
- A chamada antes da função funciona.

---

## Hoisting com `const`

```js
// ReferenceError: Cannot access before initialization.
// console.log(notHoistedSubtraction(2, 3));

// const notHoistedSubtraction = function (param1, param2) {
//   return param1 - param2;
// };
```

- `const` e `let` ficam na _Temporal Dead Zone_.
- A variável ainda não pode ser lida.

---

## Hoisting com `var`

```js
// TypeError: notHoistedMultiplication is not a function.
// console.log(notHoistedMultiplication(2, 3));

// var notHoistedMultiplication = function (param1, param2) {
//   return param1 * param2;
// };
```

- A variável é elevada como `undefined`.
- Chamar `undefined` como função gera `TypeError`.

---

## Redefinição de Função

- JavaScript não tem sobrecarga nativa por quantidade de argumentos.
- Duas Function Declarations com o mesmo nome competem.
- A última declaração sobrescreve a anterior.

```js
function operation(param1, param2) {
  return param1 + param2;
}

function operation(param) {
  return param + 1;
}
```

---

## Efeito da Redefinição

```js
function runRedefinitionExample() {
  function operation(param1, param2) {
    return param1 + param2;
  }

  function operation(param) {
    return param + 1;
  }

  console.log(operation(1)); // 2
  console.log(operation(1, 2)); // 2
}
```

---

## Case Sensitive

- Nomes de função diferenciam maiúsculas e minúsculas.
- `sumLower` e `SumLower` são identificadores independentes.

```js
function sumLower(param1, param2) {
  return param1 + param2;
}

function SumLower(param) {
  return param + 1;
}

console.log(sumLower(1, 2)); // 3
console.log(SumLower(1, 2)); // 2
```

---

## Parâmetros e Argumentos

| Recurso         | Uso                                       |
| --------------- | ----------------------------------------- |
| Padrão          | valor _fallback_ para `undefined`         |
| Rest            | captura vários argumentos em array        |
| `arguments`     | objeto _array-like_ de função tradicional |
| Desestruturação | extrai campos na assinatura               |

---

## Parâmetros Padrão

- `= defaultValue` define o valor padrão.
- O padrão entra quando o argumento é omitido.
- Também entra quando o argumento é `undefined`.
- `null` não ativa o padrão.

```js
function power(base, exponent = 1) {
  return base ** exponent;
}

console.log(power(2)); // 2
console.log(power(2, 3)); // 8
```

---

## `undefined` vs `null`

```js
function power(base, exponent = 1) {
  return base ** exponent;
}

console.log(power(2, undefined)); // 2
console.log(power(2, null)); // 1
```

- `undefined` ativa o padrão.
- `null` é valor intencional.
- `2 ** null` usa coerção para `0`.

---

## Valores Padrão Dinâmicos

```js
function register(
  message,
  date = new Date('2026-08-12T00:00:00.000Z'),
  prefix = message.length,
) {
  return `${prefix}: ${message} (${date.toISOString()})`;
}

console.log(register('PW2'));
// "3: PW2 (2026-08-12T00:00:00.000Z)"
```

---

## Rest Parameters

- `...rest` captura os argumentos restantes.
- O resultado é um array real.
- O parâmetro rest deve ser o último.

```js
function collect(first, ...rest) {
  console.log(first); // 1
  console.log(rest); // [2, 3]
  console.log(Array.isArray(rest)); // true
}

collect(1, 2, 3);
```

---

## Iterando sobre Rest

```js
function sumAll(...numbers) {
  let total = 0;

  for (const number of numbers) {
    total += number;
  }

  return total;
}

console.log(sumAll()); // 0
console.log(sumAll(1, 2, 3)); // 6
```

---

## Rest com Spread

```js
function sumAll(...numbers) {
  return numbers.reduce((total, number) => total + number, 0);
}

const values = [1, 2, 3];

console.log(sumAll(...values)); // 6
```

- Rest junta argumentos.
- Spread espalha itens de um array.

---

## Rest em Posição Inválida

```js
// SyntaxError: Rest parameter must be last formal parameter.
// function invalidRest(...rest, last) {}
```

- O rest consome o restante da lista.
- Não há como declarar outro parâmetro depois dele.

---

## Objeto `arguments`

- Existe em funções tradicionais.
- Contém todos os argumentos passados.
- Parece array, mas não é `Array`.

```js
function showArguments() {
  console.log(arguments.length); // 3
  console.log(arguments[0]); // 1
  console.log(Array.isArray(arguments)); // false
  console.log(typeof arguments); // "object"
}

showArguments(1, 2, 3);
```

---

## Convertendo `arguments`

```js
function sumArguments() {
  return Array.from(arguments).reduce((total, number) => {
    return total + number;
  }, 0);
}

console.log(sumArguments(1, 2, 3)); // 6
```

- `Array.from()` transforma o _array-like_ em array real.
- Em código novo, prefira rest parameters.

---

## `arguments` em Arrow Function

- Arrow functions não têm `arguments` próprio.
- O nome é resolvido no escopo léxico externo.

```js
function outerArguments() {
  const arrow = () => arguments.length;
  return arrow(9, 9);
}

console.log(outerArguments(1, 2, 3)); // 3
```

---

## Parâmetros Desestruturados

- A função recebe um objeto.
- A assinatura extrai propriedades.
- Cada propriedade pode ter padrão.
- O objeto inteiro também pode ter padrão.

```js
function createUser({ name = 'anonymous', active = true } = {}) {
  return `${name} / ${active}`;
}
```

---

## Chamando com Desestruturação

```js
function createUser({ name = 'anonymous', active = true } = {}) {
  return `${name} / ${active}`;
}

console.log(createUser({ name: 'Fulano' })); // "Fulano / true"
console.log(createUser({ name: 'Beltrano', active: false }));
// "Beltrano / false"
console.log(createUser()); // "anonymous / true"
```

- O `= {}` evita erro quando a chamada vem sem argumento.

---

## Sem Fallback de Objeto

```js
// TypeError: Cannot destructure property 'name' of 'undefined'.
// function createInvalidUser({ name }) {
//   return name;
// }
// createInvalidUser();
```

- A desestruturação tenta ler propriedades de `undefined`.
- O padrão `= {}` impede esse caso.

---

## Funções de Primeira Classe

- Funções podem ser guardadas em variáveis.
- Funções podem ser passadas como argumentos.
- Funções podem ser retornadas por outras funções.
- Uma função passada para execução posterior é um callback.

```txt
calc(2, 1, addition)
          |
          v
      callback
```

---

## Callback em Calculadora

```js
function addition(param1, param2) {
  return param1 + param2;
}

function subtraction(param1, param2) {
  return param1 - param2;
}

function calc(param1, param2, callback) {
  return callback(param1, param2);
}
```

---

## Chamando Callbacks

```js
console.log(calc(2, 1, addition)); // 3
console.log(calc(2, 1, subtraction)); // 1
console.log(calc(2, 1, (x, y) => x * y)); // 2
console.log(calc(2, 1, (x, y) => x / y)); // 2
console.log(calc(2, 1, (base, exponent) => base ** exponent)); // 2
```

- Passe a referência da função.
- Não execute a função antes de entregar o callback.

---

## Callback como Predicado

```js
function isValidNumber(number, callback) {
  return Boolean(callback(number));
}

console.log(isValidNumber(1, (number) => number > 0)); // true
console.log(isValidNumber(1, (number) => number < 0)); // false
console.log(isValidNumber(1, (number) => number & 1)); // true
```

- O callback decide a regra.
- A função externa padroniza o retorno como booleano.

---

## Invocação Incorreta

```js
// TypeError: callback is not a function.
// console.log(calc(2, 1, addition()));
```

- `addition` é a função.
- `addition()` é o resultado da chamada.
- Se o resultado não for função, `calc` quebra.

---

## Recursos Avançados

- Closures preservam escopo.
- IIFEs executam imediatamente e isolam variáveis.
- `call`, `apply` e `bind` controlam `this`.
- Generators pausam e retomam execução.

---

## Closure

```txt
createCounter()
  count = 0
      |
      v
  retorna increment()
      |
      v
counter() ainda acessa count
```

- A função interna lembra o escopo externo.
- O estado privado persiste entre chamadas.

---

## Closure em Código

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

## IIFE

- IIFE é uma expressão de função invocada imediatamente.
- Ela cria um escopo próprio.
- É útil para inicialização e isolamento.

```js
(function () {
  const secret = 'TokenSecreto123';
  console.log('IIFE executada automaticamente!');
})();

// console.log(secret); // ReferenceError
```

---

## IIFE com Arrow Function

```js
((name) => {
  console.log(`Olá, ${name}! Inicializando módulo...`);
})('DevLab');
```

```txt
Olá, DevLab! Inicializando módulo...
```

- A função é definida e executada no mesmo ponto.

---

## `call`, `apply` e `bind`

| Método    | Execução | Argumentos    | Retorno         |
| --------- | -------- | ------------- | --------------- |
| `call()`  | imediata | lista         | valor retornado |
| `apply()` | imediata | array         | valor retornado |
| `bind()`  | diferida | lista parcial | nova função     |

---

## Função com `this`

```js
const user1 = { name: 'Ana', role: 'Desenvolvedora' };
const user2 = { name: 'Carlos', role: 'Designer' };

function introduce(greeting, punctuation) {
  const message = `${greeting}, eu sou ${this.name}`;
  console.log(`${message}, atuando como ${this.role}${punctuation}`);
}
```

- `this` não vem da declaração.
- `this` depende de como a função será chamada.

---

## `call()` e `apply()`

```js
introduce.call(user1, 'Olá', '!');
// Olá, eu sou Ana, atuando como Desenvolvedora!

introduce.apply(user2, ['Bem-vindo', '.']);
// Bem-vindo, eu sou Carlos, atuando como Designer.
```

- `call()` recebe argumentos separados.
- `apply()` recebe argumentos em array.

---

## `bind()`

```js
const introduceAna = introduce.bind(user1, 'Oi');

introduceAna('!!!');
// Oi, eu sou Ana, atuando como Desenvolvedora!!!
```

- `bind()` não executa na hora.
- Ele retorna uma nova função com `this` fixado.

---

## Generator Function

- É declarada com `function*`.
- `yield` pausa a execução e produz um valor.
- `.next()` retoma até o próximo `yield`.

```js
function* idGenerator() {
  let id = 1;

  while (true) {
    yield id++;
  }
}
```

---

## Chamando um Generator

```js
const gen = idGenerator();

console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
```

- O gerador não executa tudo de uma vez.
- Cada `.next()` avança um passo.

---

## Generator com `for...of`

```js
function* colorsGenerator() {
  yield 'vermelho';
  yield 'verde';
  yield 'azul';
}

for (const color of colorsGenerator()) {
  console.log(color); // vermelho, verde, azul
}
```

- O generator implementa o protocolo de iteração.
- `for...of` consome os valores produzidos por `yield`.

---

## Executando

- Crie um arquivo `function.js`.
- Rode com `node function.js`.
- Modifique uma função por vez.
- Confira retornos com `console.log`.

```bash
node function.js
```

---

## Arquivo de Teste

```js
function calc(param1, param2, callback) {
  return callback(param1, param2);
}

const double = (number) => number * 2;
const sumAll = (...numbers) => {
  return numbers.reduce((total, number) => total + number, 0);
};

console.log(calc(10, 5, (x, y) => x + y)); // 15
console.log(double(4)); // 8
console.log(sumAll(1, 2, 3, 4)); // 10
```

---

## Output

```txt
15
8
10
```

---

## Exercício

Crie `calculator.js`:

- `formatResult(label, value = 0)` formata a saída.
- `calculate(operation, ...numbers)` executa uma operação.
- `sum` e `multiply` devem ser arrow functions.
- Teste soma, multiplicação e divisão em callback anônimo.

---

## Exercício: Operações

```js
const formatResult = (label, value = 0) => `${label}: ${value}`;

const sum = (...numbers) => {
  return numbers.reduce((total, number) => total + number, 0);
};

const multiply = (...numbers) => {
  return numbers.reduce((total, number) => total * number, 1);
};
```

---

## Exercício: Callback

```js
function calculate(operation, ...numbers) {
  return operation(...numbers);
}

const sumResult = calculate(sum, 10, 20, 30);
const multResult = calculate(multiply, 2, 3, 4);
const divResult = calculate((a, b) => a / b, 100, 4);

console.log(formatResult('Soma', sumResult)); // "Soma: 60"
console.log(formatResult('Multiplicação', multResult)); // "Multiplicação: 24"
console.log(formatResult('Divisão', divResult)); // "Divisão: 25"
console.log(formatResult('Vazio')); // "Vazio: 0"
```

---

## Desafio

Crie `userSystem.js`:

- `createScoreTracker(initialScore = 0)` deve retornar uma função interna.
- A função interna acumula pontos em variável privada.
- `registerUser({ name, role } = {})` deve usar desestruturação.
- `role` deve aparecer em letras maiúsculas.

---

## Desafio: Closure

```js
function createScoreTracker(initialScore = 0) {
  let score = initialScore;

  return function addPoints(points) {
    score += points;
    return score;
  };
}

const tracker = createScoreTracker(100);

console.log(tracker(50)); // 150
console.log(tracker(30)); // 180
```

---

## Desafio: Usuário

```js
function registerUser({ name = 'Convidado', role = 'user' } = {}) {
  return `[${role.toUpperCase()}] ${name}`;
}

console.log(registerUser({ name: 'Ana', role: 'admin' }));
// "[ADMIN] Ana"
console.log(registerUser()); // "[USER] Convidado"
```

---

## Revisão: Declaração

- Quando arrow function precisa de `return` explícito?
- Como retornar objeto literal implicitamente?
- O que muda entre Function Declaration e Function Expression?
- Por que declarar duas funções com o mesmo nome é arriscado?
- O que significa nomes de função serem _case sensitive_?

---

## Revisão: Parâmetros

- Quando o parâmetro padrão é ativado?
- O que acontece ao passar `null`?
- Por que rest parameter deve ser o último?
- Qual vantagem de rest sobre `arguments`?
- Por que usar `= {}` em parâmetro desestruturado?

---

## Revisão: Avançado

- Qual a diferença entre passar `myFunc` e `myFunc()`?
- O que uma closure preserva?
- Para que uma IIFE isola escopo?
- Como `this` muda com `call`, `apply` e `bind`?
- Como `yield` muda o fluxo de execução?

---

## Resumo da Aula

- **Funções** nomeiam tarefas e reaproveitam lógica.
- **Arrow functions** encurtam sintaxe e capturam `this` léxico.
- **Retorno** pode ser explícito, implícito ou antecipado.
- **Parâmetros** aceitam padrão, rest, `arguments` e desestruturação.
- **Callbacks** tratam funções como valores.
- **Closures** preservam estado privado.
- **Generators** produzem valores sob demanda.

---

## Próxima Aula

O foco passa para tratamento de erros:

**Tratamento de Erros**

- blocos `try/catch/finally`;
- lançamento com `throw`;
- objeto `Error`;
- erros customizados.
