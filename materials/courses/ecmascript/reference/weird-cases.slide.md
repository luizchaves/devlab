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
title: "JavaScript: Casos Bizarros"
description: "Desmistificando comportamentos inesperados do JavaScript: NaN, typeof null, precisão IEEE 754, coerções, objetos wrappers e igualdade."
---

<!-- _class: lead -->

# JavaScript: Casos "Bizarros"

Desmistificando comportamentos inesperados, armadilhas de coerção e regras formais.

---

## Objetivo

Compreender as causas formais por trás dos comportamentos contraintuitivos do JavaScript.

- Classificar anomalias por **IEEE 754**, **compatibilidade histórica**, **coerção** e **referência**.
- Identificar as regras de `NaN !== NaN`, `typeof null` e `0.1 + 0.2 !== 0.3`.
- Compreender por que `Math.min() > Math.max()` e `[] + {}` produzem seus resultados.
- Evitar armadilhas de objetos wrapper (`new Boolean`), arrays esparsos e `parseInt` em `.map()`.
- Utilizar APIs e práticas seguras (`Number.isNaN`, `Object.is`, `===`).

---

## Mapa do Tópico

- As Quatro Fontes de Estranheza
- `NaN !== NaN` e Verificação Segura
- `typeof null === "object"` e Herança Histórica
- `0.1 + 0.2 !== 0.3` e Ponto Flutuante IEEE 754
- Inteiros Seguros e `BigInt`
- `Math.min() > Math.max()`
- Coerção com Objetos e Arrays (`[] + {}`)
- Objetos Wrapper e Truthy (`new Boolean`)
- Igualdade: `==` vs `===`
- Arrays Esparsos e `map(parseInt)`
- Exercício e Desafio

---

## As Quatro Fontes de Estranheza

A grande maioria dos comportamentos decorre de quatro fundamentos:

1. **Padrão IEEE 754**: representação binária de números e valores especiais (`NaN`, `Infinity`).
2. **Compatibilidade Histórica**: decisões de 1995 mantidas para não quebrar a web.
3. **Coerção Implícita**: conversão automática de tipos em operadores como `+`, `-` e `==`.
4. **Referência na Memória**: objetos e arrays são comparados por endereço, não por conteúdo.

---

## Casos Clássicos e Formas Seguras

| Caso | Resultado | Causa | Forma Segura |
| :--- | :--- | :--- | :--- |
| `NaN === NaN` | `false` | Norma IEEE 754 | `Number.isNaN(v)` ou `Object.is()` |
| `typeof null` | `"object"` | Legado em C (tag `000`) | `v === null` |
| `0.1 + 0.2 === 0.3` | `false` | Dízima binária | `Math.abs(a-b) < Number.EPSILON` |
| `[] === []` | `false` | Referências distintas | Comparar itens/propriedades |
| `"5" + 2` | `"52"` | `+` concatena strings | `Number("5") + 2` |
| `Math.min() > Math.max()`| `true` | `Infinity > -Infinity` | Passar arrays: `Math.min(...arr)` |

---

## `NaN !== NaN`

`NaN` (*Not-a-Number*) possui tipo primitivo `number` e representa um resultado indefinido:

```js
const value = Number("abc");

console.log(value);               // NaN
console.log(typeof value);        // "number"
console.log(value === NaN);       // false (nunca use === para testar NaN!)
console.log(value !== value);     // true (único valor não igual a si mesmo)
console.log(Number.isNaN(value)); // true (verificação estrita e segura)
console.log(Object.is(NaN, NaN)); // true
```

*Atenção: Use sempre `Number.isNaN()`; o `isNaN()` global coage strings antes do teste.*

---

## `typeof null === "object"`

`null` indica ausência intencional de objeto, mas `typeof null` devolve `"object"` por herança histórica:

```js
const user = null;

console.log(typeof user);       // "object"
console.log(user === null);      // true (comparação correta)
console.log(user == undefined);  // true (coerção do operador frouxo)
console.log(user === undefined); // false
```

```js
// Verificação segura de objeto real (não-nulo e não-array):
function isPlainObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
console.log(isPlainObject({})); // true
console.log(isPlainObject(null)); // false
```

---

## `0.1 + 0.2 !== 0.3` e Ponto Flutuante

Frações decimais como $0.1$ e $0.2$ viram dízimas periódicas no formato binário de 64 bits:

```js
const sum = 0.1 + 0.2;

console.log(sum); // 0.30000000000000004
console.log(sum === 0.3); // false

// Comparação com tolerância de máquina:
const areClose = Math.abs(sum - 0.3) < Number.EPSILON;
console.log(areClose); // true
```

*Dica Financeira: Para moedas e valores exatos, opere sempre em centavos inteiros.*

---

## Limite de Inteiros Seguros e `BigInt`

Números regulares reservam 53 bits para inteiros (`Number.MAX_SAFE_INTEGER = 9007199254740991`):

```js
const max = Number.MAX_SAFE_INTEGER;

console.log(max + 1 === max + 2); // true (ambos viram 9007199254740992!)

// Solução com BigInt (precisão arbitrária):
const bigA = 9007199254740991n + 1n;
const bigB = 9007199254740991n + 2n;

console.log(bigA === bigB); // false (precisão exata mantida!)
```

---

## `Math.min() > Math.max()`

Sem argumentos, os algoritmos retornam seus valores iniciais acumuladores:

```js
console.log(Math.min()); // Infinity
console.log(Math.max()); // -Infinity

console.log(Math.min() > Math.max()); // true (Infinity > -Infinity)
```

- `Math.min()` inicia com `Infinity` para que qualquer número fornecido seja menor.
- `Math.max()` inicia com `-Infinity` para que qualquer número fornecido seja maior.

---

## Coerção com Objetos e Arrays

O operador `+` converte objetos e arrays para suas representações em string:

```js
// [] converte para "" e {} converte para "[object Object]"
console.log([] + []);         // "" (duas strings vazias)
console.log([] + {});         // "[object Object]" ("" + "[object Object]")
console.log([1, 2] + [3, 4]); // "1,23,4" (concatena textos)

// Subtração força conversão numérica:
console.log("5" - 2);         // 3
console.log("5" * "2");       // 10
```

*Nota: Em REPLs, `{}` no início de linha pode ser lido como bloco vazio: `{} + [] = 0`.*

---

## Objetos Wrapper e Truthy

Valores primitivos (`false`, `0`, `""`) são *falsy*, mas qualquer **objeto** no Heap é *truthy*:

```js
const primBool = false;
const objBool = new Boolean(false);

console.log(Boolean(primBool)); // false
console.log(Boolean(objBool));  // true (objetos são sempre truthy!)

if (objBool) {
  console.log("Executa mesmo contendo false internamente!");
}
```

*Regra: Nunca use construtores com `new` para primitivos (`new Boolean`, `new String`).*

---

## Igualdade: `==` vs `===`

O operador `==` tenta converter tipos; `===` compara valor e tipo diretamente:

```js
// Igualdade Solta (==) - Aplica coerções imprevisíveis:
console.log(0 == false);        // true (coerção numérica)
console.log("" == false);       // true (coerção numérica)
console.log("5" == 5);          // true
console.log(null == undefined); // true

// Igualdade Estrita (===) - Padrão obrigatório em projetos:
console.log(0 === false);        // false
console.log("" === false);       // false
console.log("5" === 5);          // false
console.log(null === undefined); // false
```

---

## Arrays Esparsos e `map(parseInt)`

```js
// 1. Buracos em arrays esparsos são ignorados por iterações:
const sparse = [1, , 3];
console.log(sparse.length); // 3
console.log(1 in sparse);   // false (índice 1 não existe!)

// 2. A pegadinha de map com parseInt:
console.log(["1", "2", "3"].map(parseInt)); // [1, NaN, NaN]
// map passa (elemento, índice) -> parseInt("2", 1) tem base 1 inválida!

// Forma segura:
console.log(["1", "2", "3"].map(Number)); // [1, 2, 3]
```

---

## Exercício Prático

Avalie mentalmente cada instrução antes de verificar a saída:

1. `Number.isNaN(Number("abc"))`
2. `typeof []`
3. `Array.isArray([])`
4. `"10" + 5` vs `"10" - 5`
5. `Boolean("false")`
6. `[1, , 3].map((n) => n * 2)`
7. `Object.is(NaN, NaN)`

---

## Solução do Exercício

```js
console.log(Number.isNaN(Number("abc"))); // true
console.log(typeof []);                   // "object"
console.log(Array.isArray([]));           // true
console.log("10" + 5);                    // "105"
console.log("10" - 5);                    // 5
console.log(Boolean("false"));            // true
console.log([1, , 3].map((n) => n * 2));  // [2, <empty>, 6]
console.log(Object.is(NaN, NaN));         // true
```

---

## Desafio: Soma Segura com Tolerância

Crie uma função `safeSum(a, b)` que aceite números ou strings numéricas, valide valores finitos e compare contra resultados esperados com margem de tolerância:

```js
function toFiniteNumber(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new TypeError(`Inválido: ${v}`);
  return n;
}

function safeSum(a, b) { return toFiniteNumber(a) + toFiniteNumber(b); }
function almostEqual(a, b, eps = Number.EPSILON) { return Math.abs(a - b) <= eps; }

const total = safeSum("0.1", "0.2");
console.log(total); // 0.30000000000000004
console.log(almostEqual(total, 0.3)); // true
```

---

## Perguntas de Revisão

- Por que `NaN === NaN` retorna `false` e como testá-lo com segurança?
- Por que `0.1 + 0.2` não resulta exatamente em `0.3`?
- Por que `Math.min() > Math.max()` retorna `true` quando chamadas sem argumentos?
- Por que `typeof null` retorna `"object"`?
- Por que `[] === []` retorna `false`?
- Por que `['1', '2', '3'].map(parseInt)` resulta em `[1, NaN, NaN]`?
