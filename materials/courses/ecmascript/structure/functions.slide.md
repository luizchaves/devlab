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

Declaração de funções, expressões, arrow functions, parâmetros padrão, rest parameters, callbacks, hoisting, closures, IIFE, métodos call/apply/bind e funções geradoras em JavaScript.

---

## Objetivo

- Compreender as diferentes formas de declarar e invocar funções (Function Declaration, Function Expression e Arrow Function).

---

## Mapa da Aula

- Formas de declaração
- Retorno
- Hoisting
- Redefinição de função
- Case Sensitive
- Parâmetros e argumentos

---

## Formas de declaração

- Em JavaScript, uma função pode ser definida de diferentes maneiras: por meio de uma declaração tradicional.
- Quando argumentos extras são fornecidos, eles são ignorados pela assinatura da função; quando argumentos esperados são omitidos.
- Uma Function Expression define uma função anônima ou nomeada e a atribui a uma variável ou constante
- As Arrow Functions (introduzidas no ES6) fornecem uma sintaxe mais curta utilizando a notação `=>`
- Quando a arrow function possui corpo entre chaves `{...}`, o uso da instrução `return` é obrigatório para devolver um valor.

---

## Formas de declaração (Exemplo)

```js
function addition(param1, param2) {
  return param1 + param2;
}

console.log(addition(1)); // NaN
console.log(addition(1, 2)); // 3
console.log(addition(1, 2, 3)); // 3
```

---

## Retorno

- Toda função em JavaScript retorna um valor.
- Se nenhum `return` for especificado ou se o `return` for chamado sem um operando, a função retornará `undefined`.
- A instrução `return` interrompe imediatamente a execução da função.
- Isso é muito utilizado no padrão guard clause (retorno antecipado) para evitar aninhamento desnecessário de blocos `if/else`.

---

## Retorno (Exemplo)

```js
function greeting(name) {
  console.log(`Hello, ${name}`);
}

const greetingResult = greeting('Fulano'); // Hello, Fulano
console.log(greetingResult); // undefined

function greetingMessage(name) {
  return `Hello, ${name}`;
}

console.log(greetingMessage('Fulano')); // "Hello, Fulano"
```

---

## Hoisting

- Hoisting é o comportamento do JavaScript de mover declarações para o topo do seu escopo antes da execução do código.
- No entanto, o comportamento difere entre Function Declarations e Function Expressions.
- Function Declarations são completamente elevadas, podendo ser invocadas antes da linha onde foram declaradas
- Se a expressão for declarada com `var`, a variável é elevada com o valor `undefined`.

---

## Hoisting (Exemplo)

```js
console.log(hoistedAddition(2, 3)); // 5

function hoistedAddition(param1, param2) {
  return param1 + param2;
}
```

---

## Redefinição de função

- Em JavaScript não existe sobrecarga de métodos (overloading) nativa baseada na quantidade de argumentos.
- Se duas funções com o mesmo nome forem declaradas no mesmo escopo usando Function Declaration.

---

## Redefinição de função (Exemplo)

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

runRedefinitionExample();
```

---

## Case Sensitive

- Assim como nomes de variáveis, os nomes de funções em JavaScript diferenciam letras maiúsculas de minúsculas (case sensitive).
- `sumLower` e `SumLower` são identificadores totalmente independentes.

---

## Case Sensitive (Exemplo)

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

## Parâmetros e argumentos

- JavaScript oferece recursos flexíveis para manipular dados de entrada em funções
- Permitem definir valores fallback caso o argumento seja omitido ou receba `undefined`.
- Agrupam múltiplos argumentos passados em um único array real (`...rest`).
- Objeto especial do tipo array-like contendo os argumentos passados para funções tradicionais.
- Extrai propriedades de objetos ou elementos de arrays diretamente na assinatura da função.

---

## Parâmetros padrão (Default Parameters)

- É possível atribuir um valor padrão para um parâmetro usando `= defaultValue`.
- O valor padrão só é ativado se o argumento for omitido ou se for passado explicitamente o valor `undefined`.
- Passar `null` como argumento não dispara o parâmetro padrão, pois `null` é um valor atribuído intencionalmente.
- Na operação `2 ** null`, `null` é coagido numericamente para `0`, resultando em `1`.
- Os valores padrão também podem ser expressões dinâmicas calculadas em tempo de execução ou depender de parâmetros anteriores

---

## Parâmetros padrão (Default Parameters) (Exemplo)

```js
function power(base, exponent = 1) {
  return base ** exponent;
}

console.log(power(2)); // 2
console.log(power(2, 3)); // 8
console.log(power(2, undefined)); // 2
console.log(power(2, null)); // 1
```

---

## Rest parameters (`...rest`)

- Os rest parameters utilizam a sintaxe `...` para capturar os argumentos restantes e armazená-los em um array de verdade.
- Diferente do objeto `arguments`, o rest parameter resulta em uma instância legítima de `Array`.
- O parâmetro rest deve ser obrigatoriamente o último parâmetro na declaração da função.
- Tentar colocar outros parâmetros após um rest parameter gera um erro de sintaxe.

---

## Rest parameters (`...rest`) (Exemplo)

```js
function collect(first, ...rest) {
  console.log(first); // 1
  console.log(rest); // [2, 3]
  console.log(Array.isArray(rest)); // true
}

collect(1, 2, 3);
```

---

## Objeto `arguments`

- Em funções declaradas com `function`, a variável local `arguments` contém todos os argumentos passados para a função.
- Trata-se de um objeto array-like (possui propriedade `.length` e índices numéricos, mas não é um `Array` real).
- Para aplicar métodos de array sobre `arguments`, é necessário convertê-lo primeiro com `Array.
- Arrow functions não possuem seu próprio objeto `arguments`.
- Se `arguments` for acessado dentro de uma arrow function, ele será resolvido no escopo léxico externo.

---

## Objeto `arguments` (Exemplo)

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

## Parâmetros desestruturados

- Podemos desestruturar objetos diretamente na lista de parâmetros da função.
- Fornecer `= {}` como padrão para o objeto desestruturado evita erros de execução caso a função seja chamada sem nenhum argumento.
- Sem ele, a tentativa de desestruturar `undefined` lança um `TypeError`.

---

## Parâmetros desestruturados (Exemplo)

```js
function createUser({ name = 'anonymous', active = true } = {}) {
  return `${name} / ${active}`;
}

console.log(createUser({ name: 'Fulano' })); // "Fulano / true"
console.log(createUser({ name: 'Beltrano', active: false })); // "Beltrano / false"
console.log(createUser()); // "anonymous / true"
```

---

## Callbacks e funções de primeira classe

- Em JavaScript, funções são cidadãs de primeira classe (first-class citizens).
- Uma função passada como argumento para ser executada posteriormente é chamada de callback.
- Callbacks também são comuns em predicados de filtragem e validação
- Ao passar um callback, envie o nome ou a referência da função (ex: `addition`).
- Se você passar `addition()`, a função será executada imediatamente e seu resultado será enviado no lugar da função.

---

## Callbacks e funções de primeira classe (Exemplo)

```js
function addition(param1, param2) {
  return param1 + param2;
}

function calc(param1, param2, callback) {
  return callback(param1, param2);
}

console.log(calc(2, 1, addition)); // 3
console.log(calc(2, 1, (x, y) => x * y)); // 2
```

---

## Recursos Avançados de Funções

- Além das declarações e callbacks básicas, o JavaScript disponibiliza recursos avançados para controle de escopo, encapsulamento.

---

## Closures

- Uma Closure ocorre quando uma função interna guarda a referência ao seu escopo léxico externo.
- Esse comportamento permite criar dados e estados privados que persistem entre chamadas.
- No exemplo acima, a função `increment` mantém acesso à variável `count` mesmo após a função `createCounter` ter terminado de rodar.

---

## Closures (Exemplo)

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

## IIFE (Immediately Invoked Function Expression)

- Encapsulamento e Isolamento de Escopo: Evita poluir o escopo global com variáveis temporárias ou de inicialização.
- Padrão Módulo (Module Pattern): Permite criar dados e estados privados acessíveis apenas por funções internas.
- Uma IIFE (Expressão de Função Invocada Imediatamente) é uma função em JavaScript que é executada assim que é definida.
- Ela é estruturada envolvendo uma expressão de função entre parênteses e invocando-a imediatamente com `()`.
- Principais casos de uso de IIFEs

---

## IIFE (Immediately Invoked Function Expression) (Exemplo)

```js
// 1. IIFE Tradicional
(function () {
  const secret = 'TokenSecreto123';
  console.log('IIFE executada automaticamente!');
})();

// 2. IIFE com Arrow Function e parâmetros
((name) => {
  console.log(`Olá, ${name}! Inicializando módulo...`);
})('DevLab');

// Tentativa de acessar a variável interna fora da IIFE:
// console.log(secret); // ReferenceError: secret is not defined
```

---

## Manipulação de Contexto (`call`, `apply` e `bind`)

- Em JavaScript, o valor de `this` em funções tradicionais é dinâmico e depende de como a função é chamada.

---

## Manipulação de Contexto (`call`, `apply` e `bind`) (Comparação)

| Método        | Execução | Passagem de Argumentos                 | Retorno                                  |
| :------------ | :------- | :------------------------------------- | :--------------------------------------- |
| **`call()`**  | Imediata | Lista individual (`arg1, arg2, ...`)   | O retorno da função invocada             |
| **`apply()`** | Imediata | Array de argumentos (`[arg1, arg2]`)   | O retorno da função invocada             |
| **`bind()`**  | Diferida | Lista individual (parcial ou completa) | Uma **nova função** com `this` vinculado |

---

## Manipulação de Contexto (`call`, `apply` e `bind`) (Exemplo)

```js
const user1 = { name: 'Ana', role: 'Desenvolvedora' };
const user2 = { name: 'Carlos', role: 'Designer' };

function introduce(greeting, punctuation) {
  console.log(
    `${greeting}, eu sou ${this.name}, atuando como ${this.role}${punctuation}`,
  );
}

// 1. call(): Invoca imediatamente passando argumentos individuais
introduce.call(user1, 'Olá', '!');
// Output: Olá, eu sou Ana, atuando como Desenvolvedora!

// 2. apply(): Invoca imediatamente passando argumentos em um Array
// ...
```

---

## Funções Geradoras (_Generators_: `function*`)

- É declarada com a sintaxe `function* name()`.
- Ao ser invocada, retorna um objeto Generator (que implementa o protocolo de iteração).
- O método `.next()` retoma a execução até encontrar o próximo `yield`, retornando um objeto no formato `{ value, done }`.
- Uma Função Geradora (Generator Function) é uma função especial que pode ter sua execução pausada e retomada posteriormente.

---

## Funções Geradoras (_Generators_: `function*`) (Exemplo)

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
// ...
```

---

## Declaração e Arrow Functions

- Qual a diferença de sintaxe e comportamento entre retorno explícito e implícito em Arrow Functions?
- Quando uma arrow function usa chaves `{...}`, a instrução `return` é obrigatória para retornar um valor.
- Quando as chaves são omitidas, a expressão seguinte é retornada implicitamente.
- Por que a expressão `const foo = (name) => { name }` retorna `undefined` ao ser executada?
- Porque as chaves `{ name }` são interpretadas como o bloco de código da função e não como um objeto literal.

---

## Parâmetros e argumentos

- O que acontece quando se passa `null` para um parâmetro que possui valor padrão?
- O valor padrão não é acionado, pois o padrão só é ativado quando o argumento é omitido ou recebe `undefined`.
- `null` é mantido como o valor do parâmetro.
- Qual é a vantagem de utilizar Rest Parameters (`...rest`) em relação ao objeto `arguments`?
- Os rest parameters resultam em um `Array` real (permitindo uso direto de métodos como `.map()` e `.reduce()`).

---

## Callbacks e Elevação

- Qual é a diferença entre passar `myFunc` e `myFunc()` como parâmetro de callback?
- `myFunc` passa a referência da função para que a função receptora possa executá-la quando desejar.
- `myFunc()` executa a função imediatamente e passa o seu valor de retorno no lugar da função.
- O que acontece ao tentar invocar uma Function Declaration e uma Function Expression antes de suas definições no código?
- Function Declarations são completamente elevadas (hoisted) e funcionam normalmente.

---

## Conceitos avançados

- O que é uma Closure em JavaScript?
- É a capacidade de uma função de lembrar e acessar seu escopo léxico externo (variáveis locais).
- Como o operador `this` se comporta dentro de uma Arrow Function comparado a uma função tradicional?
- Em funções tradicionais, `this` é dinâmico e definido pelo modo de invocação.
- Em arrow functions, `this` é léxico, herdando o contexto do escopo onde a arrow function foi definida.

---

## Executando

- Crie um arquivo chamado `function.js`
- Execute o arquivo com Node.js no terminal
- Modifique e adicione novas funções para praticar os comportamentos descritos nesta aula.
- Os conceitos de funções podem ser testados com o Node.js no seu terminal ou no Console do navegador.

---

## Exercício

- Crie uma função `formatResult(label, value = 0)` que retorne a string `` `${label}: ${value}` ``;
- Crie uma função `calculate(operation, ...numbers)` que receba uma função de operação e uma quantidade variável de números;
- Implemente as funções de operação `sum` e `multiply` usando arrow functions;
- Teste `calculate` passando `sum`, `multiply` e um callback anônimo em linha para divisão;
- Exiba os resultados formatados com `formatResult`.

---

## Desafio

- Crie uma função `createScoreTracker(initialScore = 0)` que retorne uma função interna `addPoints(points)`.
- Crie uma função `registerUser({ name = "Convidado", role = "user" } = {})` que retorne uma string formatada no padrão `"[ROLE] Name"`.
- Instancie um rastreador de pontos para um usuário e execute chamadas sucessivas demonstrando o acúmulo de estado.
- Crie um arquivo `userSystem.js` que gerencie o cadastro e pontuação de usuários aplicando desestruturação.

---

## Resumo da Aula

- **Declarações vs Expressões**: Function declarations sofrem hoisting completo; Function expressions e Arrow Functions respeitam TDZ.
- **Arrow Functions**: Sintaxe concisa, retorno implícito e vinculação léxica do `this` (não possuem `this` nem `arguments` próprios).
- **Parâmetros Modernos**: Parâmetros default (`param = default`) e Rest Parameters (`...args`) substituindo o objeto `arguments`.
- **Closures**: Funções preservam acesso ao escopo léxico onde foram criadas, permitindo encapsulamento e variáveis privadas em memória.
- **High-Order Functions (HOFs)**: Funções de primeira classe que aceitam ou retornam outras funções para composição modular.
