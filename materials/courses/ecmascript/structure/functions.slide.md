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
title: "JavaScript: Funções e Closures"
description: "Declaração vs expressões, arrow functions, escopo léxico, closures e encadeamento de métodos."
---

<!-- _class: lead -->

# JavaScript: Funções e Closures

Declarações, Expressões, Arrow Functions, vinculação do `this`, parâmetros rest/default, escopo léxico e Closures.

---

## Objetivos da Aula

- **Sintaxe**: Comparar declarações clássicas, expressões de função e Arrow Functions.
- **Parâmetros**: Aplicar parâmetros padrão (default) e operador Rest (`...args`).
- **Contexto**: Compreender as regras de vinculação do `this` em funções tradicionais vs Arrow Functions.
- **Closures**: Dominar o conceito de escopo léxico e encapsulamento de estado com Closures.

---

## Formas de Declaração de Funções

### 1. Function Declaration (Sofre Hoisting total)
```javascript
function add(a, b) {
  return a + b;
}
```

### 2. Function Expression (Atribuída a variável)
```javascript
const multiply = function(a, b) {
  return a * b;
};
```

### 3. Arrow Function (Sintaxe concisa - ES6)
```javascript
const subtract = (a, b) => a - b;
```

---

## Parâmetros Padrão e Rest Operator

### Parâmetros Padrão (Default Parameters)
```javascript
function greet(name = "Visitante", role = "Usuário") {
  return `Olá, ${name} (${role})`;
}
console.log(greet()); // "Olá, Visitante (Usuário)"
```

### Parâmetros Rest (`...args`)
Coleta múltiplos argumentos passados em um único Array:
```javascript
function sumAll(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sumAll(10, 20, 30, 40)); // 100
```

---

## O Comportamento do `this`

O valor da palavra-chave `this` em funções tradicionais depende de **como a função é invocada**:

```javascript
const user = {
  name: "DevLab",
  // Função tradicional: 'this' se refere ao objeto que chamou o método (user)
  showName() {
    console.log(this.name);
  },
  // Arrow function: NÃO possui o seu próprio 'this'! Herda o 'this' do escopo léxico externo!
  showNameArrow: () => {
    console.log(this.name);
  }
};

user.showName();      // "DevLab"
user.showNameArrow(); // undefined (no browser, 'this' é Window!)
```

---

## Escopo Léxico e Closures

Um **Closure** é a combinação de uma função empacotada com as referências ao seu escopo léxico circundante. Em JS, **funções lembram do escopo em que foram criadas**, mesmo quando executadas fora dele.

```javascript
function createCounter(initialValue = 0) {
  let count = initialValue; // Variável privada preservada em memória por Closure!

  return {
    increment() { count++; return count; },
    decrement() { count--; return count; },
    getValue() { return count; }
  };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.count);       // undefined (variável encapsulada!)
```

---

## Aplicações Práticas de Closures

1. **Encapsulamento / Dados Privados**: Esconder estado e expor apenas métodos controlados.
2. **Factory Functions**: Funções geradoras de objetos ou configuradores de funções personalizadas.
3. **Currying & Aplicação Parcial**: Transformar funções de múltiplos parâmetros em cadeias de funções:

```javascript
// Exemplo de aplicação parcial com Closure:
const multiplyBy = (factor) => (number) => number * factor;

const double = multiplyBy(2);
const triple = multiplyBy(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

---

## Resumo & Revisão

- **Arrow Functions** não possuem `this` nem `arguments` próprios; usam vinculação léxica.
- **Rest Parameters (`...args`)** substituem o objeto legado `arguments`.
- **Closure**: Ocorre quando uma função interna guarda acesso às variáveis da função externa mesmo após o término de sua execução.
- Closures são o fundamento para padrões de módulo, encapsulamento e programação funcional em JS.

---

## Referências & Links Úteis

- **MDN**: [Funções](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Functions)
- **MDN**: [Arrow Functions](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- **MDN**: [Closures](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Closures)
