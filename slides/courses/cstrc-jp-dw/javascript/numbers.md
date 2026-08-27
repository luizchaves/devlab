---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Number e Math"
description: "Slides completos da aula de Number e Math em JavaScript (ponto flutuante IEEE 754, métodos de Number, funções de Math e formatação com Intl.NumberFormat)."
---

<!-- _class: lead -->

# JavaScript: Number e Math

Representação numérica, limites de precisão IEEE 754, métodos do objeto `Number`, constantes e funções do objeto estático `Math` e formatação internacional com `Intl.NumberFormat`.

---

## Objetivo

Compreender a manipulação e formatação de números em JavaScript:

- Entender a representação de números em **ponto flutuante IEEE 754 de 64 bits**.
- Reconhecer os limites de segurança (`MAX_SAFE_INTEGER`) e a imprecisão decimal (`0.1 + 0.2`).
- Identificar valores numéricos especiais: `NaN`, `Infinity` e `-Infinity`.
- Utilizar conversões explícitas com `Number()`, `parseInt()` e `parseFloat()`.
- Aplicar funções do objeto estático `Math` (arredondamentos, raízes, potências e aleatoriedade).
- Formatar moedas, porcentagens e grandes números com `Intl.NumberFormat`.

---

## Representação Numérica (IEEE 754)

Em JavaScript, todos os números são do tipo primitivo **`number`** armazenados em 64 bits (dupla precisão).

```js
const integer = 42;
const decimal = 3.14159;
const hex = 0xFF; // 255 em base 16
const binary = 0b101010; // 42 em base 2
const scientific = 1.5e3; // 1500

console.log(typeof integer); // "number"
console.log(binary === integer); // true
```

- Não existe separação entre o tipo `int` e `float`; todos são `number`.

---

## Imprecisão de Ponto Flutuante

Devido ao padrão binário de 64 bits, certas frações decimais não possuem representação exata finita:

```js
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false

// Comparação precisa usando Number.EPSILON:
const diff = Math.abs((0.1 + 0.2) - 0.3);
console.log(diff < Number.EPSILON); // true
```

- Para comparações seguras de flutuantes, utilize `Number.EPSILON`.

---

## Valores Especiais (`NaN`, `Infinity`)

JavaScript possui três valores especiais do tipo `number`:

```js
console.log(10 / 0); // Infinity
console.log(-10 / 0); // -Infinity
console.log("abc" * 2); // NaN (Not-a-Number)

// Cuidado: NaN nunca é igual a si próprio!
console.log(NaN === NaN); // false

// Forma correta de checar NaN:
console.log(Number.isNaN(NaN)); // true
```

---

## Conversão Numérica

Diferença entre conversão estrita e extração parcial:

```js
// Number() exige que a string seja inteiramente válida:
console.log(Number("42.5px")); // NaN

// parseInt() e parseFloat() extraem do início do texto:
console.log(parseInt("42.5px")); // 42
console.log(parseFloat("42.5px")); // 42.5

// Especifique sempre a base (radix) no parseInt:
console.log(parseInt("1010", 2)); // 10
```

---

## O Objeto Estático `Math`

Funções de arredondamento e operações essenciais:

```js
// Arredondamentos
console.log(Math.floor(3.9)); // 3 (para baixo)
console.log(Math.ceil(3.1));  // 4 (para cima)
console.log(Math.round(3.5)); // 4 (mais próximo)
console.log(Math.trunc(3.9)); // 3 (descarta decimal)

// Mínimo, Máximo e Aleatório
console.log(Math.min(10, 5, 20)); // 5
console.log(Math.max(10, 5, 20)); // 20
console.log(Math.random());       // Valor entre [0, 1)
```

---

## Formatação Internacional (`Intl.NumberFormat`)

Formatação de moedas e porcentagens por localidade:

```js
const price = 1250.5;

// Real Brasileiro (BRL)
const formatterBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
console.log(formatterBRL.format(price)); // "R$ 1.250,50"

// Porcentagem (%)
const percentFormatter = new Intl.NumberFormat("pt-BR", {
  style: "percent",
});
console.log(percentFormatter.format(0.155)); // "15,5%"
```
