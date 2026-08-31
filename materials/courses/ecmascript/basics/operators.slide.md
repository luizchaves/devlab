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
title: "JavaScript: Expressões e Operadores"
description: "Operadores aritméticos, lógicos, de comparação (== vs ===), curto-circuito, nullish coalescing e optional chaining."
---

<!-- _class: lead -->

# JavaScript: Expressões e Operadores

Operadores aritméticos, lógicos e relacionais, igualdade estrita vs solta, avaliação em curto-circuito, Nullish Coalescing (`??`) e Optional Chaining (`?.`).

---

## Objetivos da Aula

- **Igualdade**: Compreender a diferença entre igualdade solta (`==`) e estrita (`===`).
- **Curto-Circuito**: Dominar a avaliação de curto-circuito em operadores lógicos (`&&`, `||`).
- **Operadores Modernos**: Aplicar `??` (Nullish Coalescing) e `?.` (Optional Chaining).
- **Precedência**: Identificar a ordem de execução de expressões complexas.

---

## Igualdade: `==` vs `===`

Em JavaScript, existem dois operadores para testar igualdade:

### 1. Igualdade Solta (`==`) — Coerção Implícita
Converte os operandos para o mesmo tipo antes de comparar. **Evite usar!**
```javascript
5 == "5"       // true  (string "5" vira number 5)
0 == false     // true  (false vira 0)
null == undefined // true
```

### 2. Igualdade Estrita (`===`) — Sem Coerção
Verifica se o **tipo** e o **valor** são idênticos. **Padrão recomendado!**
```javascript
5 === "5"      // false (Number !== String)
0 === false    // false (Number !== Boolean)
null === undefined // false
```

---

## Avaliação em Curto-Circuito (Short-Circuit)

Os operadores lógicos `&&` e `||` não retornam apenas booleanos; eles retornam **o próprio operando que determinou o resultado**:

### 1. Operador `&&` (AND): Retorna o primeiro falsy ou o último truthy
```javascript
const user = { name: "Maria" };
// Se user for truthy, executa a direita
user && console.log("Usuário logado:", user.name);
```

### 2. Operador `||` (OR): Retorna o primeiro truthy ou o último falsy
```javascript
const inputName = "";
const name = inputName || "Anônimo"; // "Anônimo" (pois "" é falsy!)
```

---

## O Problema do `||` e a Solução com `??`

O operador `||` falha quando valores legítimos como `0`, `false` ou `""` são considerados falsy:

```javascript
const score = 0;

// Problema com || (0 é falsy, então pega o valor default!)
const finalScore1 = score || 100; // 100 (ERRADO se 0 for uma pontuação válida!)

// Solução com Nullish Coalescing (??)
// Considera apens NULL ou UNDEFINED como ausência de valor!
const finalScore2 = score ?? 100; // 0 (CORRETO!)
```

| Operando Esquerdo | `val || "Default"` | `val ?? "Default"` |
| :--- | :--- | :--- |
| `null` | `"Default"` | `"Default"` |
| `undefined` | `"Default"` | `"Default"` |
| `0` | `"Default"` *(Falso positivo)* | `0` *(Preservado)* |
| `""` | `"Default"` *(Falso positivo)* | `""` *(Preservado)* |

---

## Encadeamento Opcional (`?.`)

Evita erros de `TypeError: Cannot read properties of undefined/null` ao acessar propriedades aninhadas:

```javascript
const user = {
  profile: {
    // address não está definido
  }
};

// Sem optional chaining:
// const city = user.profile.address.city; // TypeError: Cannot read properties of undefined

// Com optional chaining (?.):
const city = user?.profile?.address?.city; // undefined (sem erro!)

// Funciona também com chamadas de métodos e arrays:
const firstItem = items?.[0];
user.onClick?.();
```

---

## Operador Ternário e Unários Úteis

### 1. Operador Ternário (`condição ? true : false`)
```javascript
const age = 20;
const status = age >= 18 ? "Maior de idade" : "Menor de idade";
```

### 2. Operadores Unários
```javascript
// Conversão rápida para Number com +
const strNum = "100";
console.log(+strNum); // 100 (number)

// Negação dupla para converter em Boolean
console.log(!!"DevLab"); // true
console.log(!!0);        // false
```

---

## Resumo & Revisão

- Always use **`===`** e **`!==`** para evitar coerção acidental de tipos.
- **`||`** falha para `0`, `""` e `false`. Use **`??`** para padrões que só devem tratar `null` e `undefined`.
- **`?.`** evita exceções de leitura em objetos/arrays nulos ou indefinidos.
- **`&&`** e **`||`** curto-circuitam a execução e retornam o próprio valor da expressão.

---

## Referências & Links Úteis

- **MDN**: [Expressões e Operadores](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Expressions_and_Operators)
- **MDN**: [Nullish Coalescing (??)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
- **MDN**: [Optional Chaining (?.)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
