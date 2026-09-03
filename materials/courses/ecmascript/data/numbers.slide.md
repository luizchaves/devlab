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
title: "JavaScript: Numbers, BigInt e Math"
description: "Representação numérica, limites de precisão, métodos estáticos do Number, objeto Math e formatação de moedas e localidades com Intl.NumberFormat em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Numbers, BigInt e Math

Ponto flutuante IEEE 754, `BigInt`, métodos estáticos de `Number`, `Math` e `Intl.NumberFormat`.

---

## Objetivo

Compreender o tipo de dado Number, limites de precisão e utilitários matemáticos em JavaScript.

- Declarar números em diversas bases (**binária**, **octal**, **hexadecimal**, **exponencial**) e separadores `_`.
- Identificar limites de precisão com **`Number.MAX_SAFE_INTEGER`** e **`Number.EPSILON`**.
- Utilizar **`BigInt` (`123n`)** para inteiros arbitrariamente grandes além de $2^{53} - 1$.
- Dominar valores especiais (**`Infinity`**, **`NaN`**) e a armadilha **`NaN !== NaN`**.
- Realizar conversões estritas e parciais com **`Number()`**, **`parseInt()`** e **`parseFloat()`**.
- Aplicar constantes, arredondamentos e funções utilitárias do objeto **`Math`**.
- Formatar moedas, taxas e porcentagens internacionais com **`Intl.NumberFormat`**.

---

## Mapa da Aula

- Representação Numérica e Padrão IEEE 754
- Bases Numéricas, Literais e Separador `_`
- Limites de Precisão, `Number.EPSILON` e `BigInt`
- Valores Especiais (`NaN`, `Infinity`) e Verificações Estáticas
- Conversão Numérica (`parseInt`, `parseFloat`) e Formatações
- O Objeto `Math` (Constantes, Arredondamentos e Utilitários)
- Formatação Internacional com `Intl.NumberFormat`
- Exercício, Desafio e Revisão

---

## Representação Numérica e IEEE 754

Todos os números do tipo primitivo `number` utilizam o padrão internacional **IEEE 754 de 64 bits** (ponto flutuante de dupla precisão):

```js
const integer = 42;
const decimal = 49.90;
const scientific = 2.5e6; // 2.500.000

console.log(typeof integer);    // "number"
console.log(typeof decimal);    // "number"
console.log(typeof scientific); // "number"
```

- Evite `new Number(42)`: instancia um objeto *wrapper* na memória Heap (`typeof new Number` vira `"object"`).

---

## Literais e Bases Numéricas

```js
// 1. Notações de bases alternativas (todas equivalem a 15):
console.log(15);       // 15 (Decimal)
console.log(0b1111);   // 15 (Binário - base 2)
console.log(0o17);     // 15 (Octal - base 8)
console.log(0xf);      // 15 (Hexadecimal - base 16)

// 2. Notação Exponencial (científica):
console.log(314e-2);   // 3.14 (314 * 10^-2)

// 3. Separador Numérico (ES2021) para legibilidade:
console.log(15_000);         // 15000
console.log(1_000_000_000);   // 1000000000
```

---

## Constantes e Limites do Objeto `Number`

| Constante | Valor / Descrição |
| :--- | :--- |
| **`Number.MAX_SAFE_INTEGER`** | `9007199254740991` ($2^{53} - 1$), maior inteiro seguro |
| **`Number.MIN_SAFE_INTEGER`** | `-9007199254740991` ($-(2^{53} - 1)$), menor inteiro seguro |
| **`Number.MAX_VALUE`** | `1.7976931348623157e+308`, maior número positivo |
| **`Number.MIN_VALUE`** | `5e-324`, menor positivo acima de zero |
| **`Number.EPSILON`** | `2.220446049250313e-16`, menor diferença entre 1 e o próximo float |

```js
console.log(Number.isSafeInteger(9007199254740991));     // true
console.log(Number.isSafeInteger(9007199254740991 + 1)); // false
```

---

## O Tipo Primitivo `BigInt`

Para inteiros além do limite de segurança ($2^{53} - 1$), utilize **`BigInt`** com o sufixo **`n`** ou a função `BigInt()`:

```js
const big1 = 9007199254740991n;
const big2 = BigInt(9007199254740991);

console.log(typeof big1); // "bigint"
console.log(big1 + 1n);   // 9007199254740992n
console.log(big1 + 2n);   // 9007199254740993n (precisão mantida!)

// Atenção: Não misture BigInt com Number na mesma operação!
// console.log(big1 + 1); // TypeError: Cannot mix BigInt and other types
```

---

## Imprecisão de Ponto Flutuante

Devido à representação binária do IEEE 754, certas frações decimais geram pequenas imprecisões:

```js
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false!

// Comparação segura com Number.EPSILON:
const diff = Math.abs((0.1 + 0.2) - 0.3);
console.log(diff < Number.EPSILON); // true
```

**Valores monetários**: guarde valores financeiros em centavos inteiros (`1099` para `R$ 10,99`) ou use bibliotecas decimais dedicadas.

---

## Valores Especiais: `Infinity` e `-Infinity`

Representam números além do limite de precisão do ponto flutuante:

```js
console.log(1 / 0);   // Infinity
console.log(-1 / 0);  // -Infinity

console.log(Number.isFinite(100));     // true
console.log(Number.isFinite(Infinity)); // false
console.log(Number.isFinite(0 / 0));    // false
```

---

## O Valor Especial `NaN` (*Not-a-Number*)

Representa operações matemáticas indefinidas ou com falha de conversão:

| Operação | Expressão | Resultado |
| :--- | :--- | :--- |
| Divisão de zero por zero | `0 / 0` | `NaN` |
| Operações indeterminadas | `Infinity - Infinity`, `0 * Infinity` | `NaN` |
| Raiz de negativo | `Math.sqrt(-1)` | `NaN` |
| Conversão inválida | `Number("abc")`, `parseInt("texto")` | `NaN` |
| Aritmética com `undefined` | `undefined + 10` | `NaN` |

```js
console.log(typeof NaN); // "number"
```

---

## A Armadilha de Igualdade: `NaN !== NaN`

`NaN` é o **único valor em JavaScript que não é igual a si mesmo**:

```js
console.log(NaN === NaN); // false!

// Errado: comparação direta com NaN
// if (result === NaN) { ... }

// Correto: formas seguras de testar
console.log(Number.isNaN(0 / 0));         // true
console.log(Object.is(NaN, NaN));         // true
console.log(Number.isNaN("texto"));       // false (estrito, sem coerção!)
console.log(isNaN("texto"));              // true (global legado com coerção!)
```

---

## Métodos Estáticos de Verificação do `Number`

```js
// 1. Number.isNaN() - checagem estrita de NaN
console.log(Number.isNaN(NaN));          // true
console.log(Number.isNaN("não-número")); // false

// 2. Number.isFinite() - verifica número finito
console.log(Number.isFinite(42));       // true
console.log(Number.isFinite(Infinity)); // false

// 3. Number.isInteger() - verifica se é inteiro
console.log(Number.isInteger(42));   // true
console.log(Number.isInteger(42.5)); // false

// 4. Number.isSafeInteger() - verifica inteiro no limite seguro
console.log(Number.isSafeInteger(2 ** 53 - 1)); // true
```

---

## Conversões: `Number()` vs `parseInt()` vs `parseFloat()`

| Entrada | `Number()` | `parseInt()` | `parseFloat()` |
| :--- | :--- | :--- | :--- |
| `"42"` | `42` | `42` | `42` |
| `"42.50px"` | `NaN` | `42` | `42.5` |
| `true` | `1` | `NaN` | `NaN` |
| `null` | `0` | `NaN` | `NaN` |

```js
console.log(Number("42.5px"));     // NaN (conversão estrita da string inteira)
console.log(parseInt("42.5px"));   // 42 (descarta decimal e sufixo)
console.log(parseFloat("42.5px")); // 42.5 (preserva decimal, descarta sufixo)

// Sempre especifique a base (radix) no parseInt:
console.log(parseInt("1010", 2));  // 10 (binário)
console.log(parseInt("FF", 16));   // 255 (hexadecimal)
```

---

## Métodos de Formatação do Protótipo

```js
const val = 1234.5678;

// 1. toFixed(casas): fixa casas decimais e arredonda
console.log(val.toFixed(2)); // "1234.57"
console.log(val.toFixed(0)); // "1235"

// 2. toPrecision(dígitos): total de dígitos significativos
console.log(val.toPrecision(4)); // "1235"
console.log((0.001234).toPrecision(2)); // "0.0012"

// 3. toExponential(): notação científica
console.log((12345).toExponential(2)); // "1.23e+4"

// 4. toString(radix): conversão de base
console.log((255).toString(16)); // "ff"
```

---

## O Objeto Estático `Math`

Objeto nativo com constantes e utilitários (não possui construtor `new Math()`):

```js
// Constantes:
console.log(Math.PI);    // 3.141592653589793
console.log(Math.E);     // 2.718281828459045
console.log(Math.SQRT2); // 1.4142135623730951

// Operações:
console.log(Math.pow(2, 3));  // 8 (ou 2 ** 3)
console.log(Math.sqrt(25));   // 5
console.log(Math.abs(-15));   // 15
console.log(Math.min(10, 5, 20, 2)); // 2
console.log(Math.max(10, 5, 20, 2)); // 20
```

---

## Funções de Arredondamento (`Math`)

| Função | Comportamento | `3.7` | `3.2` | `-3.7` |
| :--- | :--- | :--- | :--- | :--- |
| **`Math.floor(x)`** | Sempre para baixo (menor inteiro) | `3` | `3` | `-4` |
| **`Math.ceil(x)`** | Sempre para cima (maior inteiro) | `4` | `4` | `-3` |
| **`Math.round(x)`** | Inteiro mais próximo | `4` | `3` | `-4` |
| **`Math.trunc(x)`** | Trunca (descarta fração) | `3` | `3` | `-3` |

```js
console.log(Math.floor(4.9)); // 4
console.log(Math.ceil(4.1));  // 5
console.log(Math.round(4.5)); // 5
console.log(Math.trunc(4.9)); // 4
```

---

## Geração de Números Aleatórios (`Math.random`)

`Math.random()` produz float no intervalo semi-aberto `[0, 1)`:

```js
// Função para gerar inteiros no intervalo [min, max] (inclusivo):
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log(getRandomInt(1, 10)); // Inteiro entre 1 e 10
console.log(getRandomInt(1, 6));  // Simula dado de 6 faces
```

---

## Formatação com `Intl.NumberFormat`

Formata números, moedas e porcentagens de acordo com a localidade:

```js
const price = 1250.5;

// 1. Moeda em Real Brasileiro (pt-BR / BRL):
const fmtBRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
console.log(fmtBRL.format(price)); // "R$ 1.250,50"

// 2. Moeda em Dólar Americano (en-US / USD):
const fmtUSD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
console.log(fmtUSD.format(price)); // "$1,250.50"

// 3. Porcentagem (multiplica por 100 e adiciona %):
const fmtPercent = new Intl.NumberFormat("pt-BR", { style: "percent", minimumFractionDigits: 1 });
console.log(fmtPercent.format(0.155)); // "15,5%"
```

---

## Exercício Prático: Métricas Geométricas

1. Crie `calculateCircleMetrics(radius)`.
2. Calcule `area = Math.PI * Math.pow(radius, 2)` formatada com `toFixed(2)`.
3. Calcule `perimeter = 2 * Math.PI * radius` arredondado com `Math.round()`.
4. Retorne o objeto `{ area, perimeter }` e teste com raio `7`.

---

## Solução do Exercício

```js
function calculateCircleMetrics(radius) {
  const area = Math.PI * Math.pow(radius, 2);
  const perimeter = 2 * Math.PI * radius;

  return {
    area: Number(area.toFixed(2)),
    perimeter: Math.round(perimeter),
  };
}

console.log(calculateCircleMetrics(7));
// { area: 153.94, perimeter: 44 }
```

---

## Desafio: Fatura com `Intl.NumberFormat`

1. Crie `generateInvoice(subtotal, taxPercent, discount = 0)`.
2. Calcule o imposto: `taxAmount = subtotal * (taxPercent / 100)`.
3. Calcule o total final: `total = (subtotal + taxAmount) - discount`.
4. Formate moedas em Real (`pt-BR` / `BRL`) e a taxa com `style: 'percent'`.

---

## Solução do Desafio

```js
function generateInvoice(subtotal, taxPercent, discount = 0) {
  const taxAmount = subtotal * (taxPercent / 100);
  const total = subtotal + taxAmount - discount;

  const curFmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const pctFmt = new Intl.NumberFormat("pt-BR", { style: "percent", minimumFractionDigits: 1 });

  return {
    subtotal: curFmt.format(subtotal),
    taxRate: pctFmt.format(taxPercent / 100),
    taxAmount: curFmt.format(taxAmount),
    discount: curFmt.format(discount),
    total: curFmt.format(total),
  };
}

console.log(generateInvoice(1500, 8.5, 100));
// {
//   subtotal: 'R$ 1.500,00',
//   taxRate: '8,5%',
//   taxAmount: 'R$ 127,50',
//   discount: 'R$ 100,00',
//   total: 'R$ 1.527,50'
// }
```

---

## Perguntas de Revisão

- Por que `0.1 + 0.2 === 0.3` retorna `false` e como contornar?
- Qual a diferença entre `Number.isNaN(val)` e o `isNaN(val)` global?
- Por que `NaN === NaN` retorna `false`?
- Qual a diferença prática entre `parseInt("10px")` e `Number("10px")`?
- Quando devemos utilizar `BigInt` em vez do tipo `number`?
- Qual a diferença entre `Math.floor()`, `Math.ceil()` e `Math.trunc()` para números negativos?
- Quais opções são obrigatórias em `Intl.NumberFormat` para formatar moedas?

---

## Resumo da Aula

- **IEEE 754 (64-bit)**: tipo `number` unifica inteiros e ponto flutuante.
- **Limites e BigInt**: inteiros seguros até $2^{53} - 1$; use `BigInt` (`123n`) acima disso.
- **Valores Especiais**: `Infinity` (estouro/divisão por zero) e `NaN` (operações indefinidas).
- **Verificação Estrita**: `Number.isNaN()`, `Number.isFinite()` e `Number.isSafeInteger()`.
- **Conversão e Formatação**: `parseInt()`, `parseFloat()`, `toFixed()` e `toString(radix)`.
- **Matemática**: constantes, arredondamentos (`floor`, `ceil`) e números aleatórios no `Math`.
- **Internacionalização**: `Intl.NumberFormat` para moedas (`currency`) e taxas (`percent`).
