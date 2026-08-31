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
title: "JavaScript: Tipos de Dados e Coerção"
description: "Tipos primitivos vs objetos, operador typeof, coerção implícita/explícita e valores falsy."
---

<!-- _class: lead -->

# JavaScript: Tipos de Dados e Coerção

Tipos primitivos e objetos, modelo de memória (Stack vs Heap), operador `typeof`, coerção de tipos e avaliação de truthy/falsy.

---

## Objetivos da Aula

- **Classificação**: Identificar os 7 tipos primitivos e os tipos de referência.
- **Memória**: Diferenciar armazenamento por valor (Stack) vs armazenamento por referência (Heap).
- **Inspeção**: Analisar o operador `typeof` e reconhecer suas peculiaridades (`typeof null`).
- **Coerção**: Compreender conversões implícitas e explícitas de tipos.

---

## Tipos em JavaScript: Visão Geral

JavaScript é uma linguagem **dinamicamente tipada** (as variáveis não têm tipo fixo, mas os valores sim):

<div style="display: flex; gap: 15px; margin-top: 15px; font-size: 0.85em;">
  <div style="flex: 1; border: 2px solid #0284c7; border-radius: 8px; padding: 12px; background: #f0f9ff;">
    <strong style="color: #0369a1; font-size: 1.1em;">Tipos Primitivos (Imutáveis)</strong><br>
    • Undefined & Null<br>
    • Boolean (true / false)<br>
    • Number (IEEE 754 float)<br>
    • String (UTF-16)<br>
    • Symbol (identificador único)<br>
    • BigInt (inteiros de precisão arbitrária)
  </div>
  <div style="flex: 1; border: 2px solid #16a34a; border-radius: 8px; padding: 12px; background: #f0fdf4;">
    <strong style="color: #15803d; font-size: 1.1em;">Tipos de Referência (Mutáveis)</strong><br>
    • Object literais `{}`<br>
    • Array `[]`<br>
    • Function `function()`<br>
    • Date, RegExp, Map, Set...
  </div>
</div>

---

## Memória: Primitivos vs Referência

- **Primitivos (Cópia por Valor na Stack)**:
```javascript
let a = 10;
let b = a; // Copia o valor exato
b = 20;
console.log(a); // 10 (a permanece inalterado)
```

- **Referência (Cópia de Endereço na Heap)**:
```javascript
let obj1 = { value: 10 };
let obj2 = obj1; // Copia o ponteiro de memória!
obj2.value = 20;
console.log(obj1.value); // 20 (ambos apontam para o mesmo objeto na Heap)
```

---

## O Operador `typeof` e Peculiaridades

O operador `typeof` retorna uma string indicando o tipo do operando:

```javascript
typeof "DevLab"      // "string"
typeof 42            // "number"
typeof true          // "boolean"
typeof undefined     // "undefined"
typeof Symbol("id")  // "symbol"
typeof 100n          // "bigint"
typeof function(){}  // "function"
```

### Quirk Histórico Famoso:
```javascript
typeof null          // "object" (Bug mantido por compatibilidade com ES1!)
typeof NaN           // "number" ("Not-a-Number" é um valor numérico especial)
```

---

## Coerção de Tipos (Type Coercion)

Coerção é o processo de conversão de um valor de um tipo de dado para outro.

### 1. Coerção Explícita (Recomendada)
```javascript
const str = "42";
const num = Number(str);      // 42
const bool = Boolean(1);       // true
const text = String(100);      // "100"
```

### 2. Coerção Implícita (Realizada pelo motor)
```javascript
console.log("5" + 2);  // "52" (Operador + com string força concatenação!)
console.log("5" - 2);  // 3    (Operador - força conversão para Number!)
console.log(true + 1); // 2    (true é convertido para 1)
```

---

## Tabela de Valores Falsy em JavaScript

Em contextos booleanos (`if`, `while`, `&&`, `||`), exatamente **8 valores** são avaliados como `false`:

| Valor Falsy | Descrição |
| :--- | :--- |
| `false` | O próprio booleano falso |
| `0` e `-0` | O número zero (positivo ou negativo) |
| `0n` | BigInt zero |
| `""` ou `''` | String vazia |
| `null` | Ausência intencional de valor |
| `undefined` | Valor não inicializado |
| `NaN` | Resultado de operação matemática inválida |

> **Atenção**: Todos os outros valores em JS são **Truthy** (incluindo `[]`, `{}`, `"0"` e `"false"`!).

---

## Resumo & Revisão

- **Primitivos**: Copiados por valor e imutáveis (`string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`).
- **Referência**: Copiados por ponteiro de memória (`Object`, `Array`, `Function`).
- `typeof null === "object"` é uma falha histórica mantida por compatibilidade.
- **Valores Falsy**: Apenas `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined` e `NaN`.

---

## Referências & Links Úteis

- **MDN**: [Estruturas de Dados no JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Data_structures)
- **MDN**: [Operador typeof](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/typeof)
