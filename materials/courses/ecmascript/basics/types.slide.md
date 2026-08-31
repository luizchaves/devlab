---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Tipos de Dados e Coerção"
description: "Slides completos da aula JavaScript: Tipos de Dados e Coerção."
---

<!-- _class: lead -->

# JavaScript: Tipos de Dados e Coerção

Tipos primitivos e de referência, operador typeof, undefined vs null, coerção de tipos implícita e explícita, valores truthy/falsy e igualdade estrita em JavaScript.

---

## Objetivo

- Compreender o sistema de tipos dinâmico do JavaScript
- Identificar todos os tipos primitivos e de referência, utilizar corretamente o operador `typeof`, manipular conversões...

---

## Mapa da Aula

- Categorias de Tipos de Dados
- Imutabilidade dos Primitivos
- O Operador `typeof`
- Tipagem Dinâmica e Tipagem Fraca (Weak Typing)
- Coerção de Tipos (Implícita vs Explícita)
- `undefined` vs `null`
- Booleanos, Falsy e Truthy
- Executando

---

## Introdução

- Esta aula apresenta o sistema de tipos de dados do ECMAScript, detalhando a separação entre valores primitivos imutáveis...

---

## Categorias de Tipos de Dados

- No ECMAScript, as variáveis não possuem tipo fixo
- os valores armazenados é que possuem tipo
- A linguagem divide seus tipos de dados em duas categorias fundamentais
- Primitivos e Objetos (Tipos de Referência)
- O diagrama a seguir ilustra a taxonomia completa dos tipos no JavaScript, destacando a separação entre primitivos e objetos

---

## Categorias de Tipos de Dados: Comparação

| Categoria | Tipo (`typeof`) | Descrição | Exemplos de Literais |
| :--- | :--- | :--- | :--- |
| **Primitivo** | `undefined` | Ausência de valor atribuído por padrão | `undefined` |
| **Primitivo** | `null` | Ausência intencional de referência a objeto (*retorna 'object' no typeof*) | `null` |
| **Primitivo** | `boolean` | Valor lógico verdadeiro ou falso | `true`, `false` |
| **Primitivo** | `number` | Número em ponto flutuante IEEE 754 (64-bit) | `42`, `-15`, `3.14`, `314e-2`, `0b1111`, `0o17`, `0xf`, `15_000`, `NaN` |
| **Primitivo** | `bigint` | Inteiro com precisão arbitrária superior a 2⁵³ - 1 | `42n`, `9007199254740991n` |
| ... | ... | ... | ... |

---

## Valores primitivos

```js
console.log(undefined); // undefined
console.log(null); // null
console.log(true); // true
console.log(false); // false
console.log("Programacao para Web 2"); // Programacao para Web 2
console.log(`Hello, ${1 + 1}`); // Hello, 2
console.log(42); // 42
console.log(42n); // 42n
console.log(Symbol("id")); // Symbol(id)
```

---

## Valores objeto

```js
console.log([]); // []
console.log([1, 2, 3]); // [1, 2, 3]
console.log([1, , 3]); // [1, <1 empty item>, 3]
console.log([1010, "Fulano", true, ["DW", "PW2"]]);
console.log({ id: 1010, name: "Fulano", active: true });
console.log(new Date("2026-08-12T00:00:00.000Z"));
console.log(/dw/i);
```

---

## Hierarquia de tipos em uma imagem

- A representação a seguir, do livro *JavaScript for impatient programmers*, resume a mesma taxonomia em forma de diagrama...
- JavaScript for impatient programmers (Book)

---

## Hierarquia de tipos em uma imagem: Comparação

| Category  | Types                               | Values                                                                                        |
| --------- | ----------------------------------- | --------------------------------------------------------------------------------------------- |
| Primitive | Undefined | `undefined`                                                                                    |
| Primitive | Null      | `null`                                                                                        |
| Primitive | Boolean   | `true`, `false`                                                                               |
| Primitive | Number    | `-15`<br />`15`, `0b1111`, `0o17`, `0xf`<br />`-123.45`<br />`123.45`, `1.2345e2`, `12345E-2` |
| Primitive | String    | `'Hello'`, `"Hello"`, `` `Hello` ``                                                           |
| ... | ... | ... |

---

## Imutabilidade dos Primitivos

- Valores primitivos são imutáveis
- Métodos chamados em uma string ou number retornam novos valores sem alterar a instância original

---

## Imutabilidade de primitivos

```js
let title = "javascript";
title.toUpperCase(); // Retorna "JAVASCRIPT"
console.log(title); // Continua "javascript" (imutable)

title = title.toUpperCase(); // Reatribuição do identificador para o novo valor
console.log(title); // "JAVASCRIPT"
```

---

## O Operador `typeof`

- O operador unário `typeof` inspeciona e retorna uma string representando o tipo do operando atual
- Na especificação inicial do JavaScript (1995), os valores eram representados por rótulos de tipo em memória de 32 bits
- O rótulo para objetos era `000`
- Como o ponteiro para `null` era um ponteiro nulo (`0x00`), o `typeof null` retornou `"object"`
- Esse comportamento foi mantido no ECMAScript para preservar compatibilidade com a web antiga

---

## Exemplos com typeof

```js
console.log(typeof 42); // "number"
console.log(typeof "DevLab"); // "string"
console.log(typeof true); // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof Symbol()); // "symbol"
console.log(typeof 10n); // "bigint"
console.log(typeof {}); // "object"
console.log(typeof [1, 2]); // "object" (Arrays são objetos!)
console.log(typeof function() {}); // "function"
```

---

## O Operador `typeof`

```js
console.log(typeof null); // "object" (Erro histórico do JS!)
```

---

## Inspecionando tipos

```js
console.log(typeof undefined); // "undefined"
console.log(typeof null); // "object"
console.log(typeof true); // "boolean"
console.log(typeof "Hello"); // "string"
console.log(typeof 42); // "number"
console.log(typeof 42n); // "bigint"
console.log(typeof Symbol("id")); // "symbol"
console.log(typeof []); // "object"
console.log(Array.isArray([])); // true
console.log(typeof {}); // "object"
console.log(typeof function () {}); // "function"
```

---

## Tipagem Dinâmica e Tipagem Fraca (Weak Typing)

- Utilize coerção explícita (`Number(val)`, `String(val)`).
- Utilize sempre igualdade estrita (`===`) em vez de igualdade ampla (`==`).

---

## Tipagem Dinâmica e Tipagem Fraca (Weak Typing): Comparação

| Operação | Resultado | Comportamento da Tipagem Fraca |
| :--- | :--- | :--- |
| `"5" + 2` | `"52"` | O operador `+` com string converte `2` para `"2"` e concatena. |
| `"5" - 2` | `3` | O operador `-` força conversão da string `"5"` para o número `5`. |
| `"5" * "2"` | `10` | O operador `*` converte ambas as strings para números. |
| `true + 1` | `2` | O booleano `true` é convertido para `1`. |
| `false * 10` | `0` | O booleano `false` é convertido para `0`. |

---

## Tipagem Dinâmica e Tipagem Fraca (Weak Typing): Comparação

| Característica | Tipagem Fraca (JavaScript) | Tipagem Forte (Python / Rust) |
| :--- | :--- | :--- |
| **Operação `"5" + 2`** | Retorna `"52"` (Converte `2` para string `"2"`) | Lança `TypeError` (Não concatena str com int automaticamente) |
| **Operação `"5" - 2`** | Retorna `3` (Converte `"5"` para número `5`) | Lança `TypeError` |
| **Execução** | Tenta converter silenciosamente em runtime | Lança exceção ou exige conversão explícita |

---

## Reatribuição com tipos diferentes

```js
let data = 42;            // number
console.log(typeof data); // "number"

data = "DevLab";          // reatribuído para string
console.log(typeof data); // "string"
```

---

## Exemplos de comportamento da tipagem fraca

```js
console.log("10" + 5);    // "105" (String)
console.log("10" - 5);    // 5     (Number)
console.log(true + true); // 2     (Number: 1 + 1)
console.log("10" == 10);  // true  (Coerção implícita na igualdade ampla)
```

---

## Coerção de Tipos (Implícita vs Explícita)

- Coerção é o processo de conversão de um valor de um tipo de dado para outro
- Coerção Explícita (Casting) Ocorre quando o desenvolvedor converte o tipo intencionalmente usando funções construtoras...
- Coerção Implícita Ocorre automaticamente quando o motor JavaScript tenta realizar uma operação entre tipos incompatíveis
- O operador de igualdade ampla (`==`) tenta realizar coerção implícita de tipos antes de comparar, gerando resultados...
- Sempre utilize a igualdade estrita (`===`) e a desigualdade estrita (`!==`), que comparam o tipo e o valor sem coerção

---

## Conversão explícita

```js
const input = "42";
const count = Number(input); // 42 (number)
const text = String(100); // "100" (string)
const isValid = Boolean(1); // true (boolean)
```

---

## Coerção implícita e surpresas

```js
console.log("5" + 2); // "52" (Operador + com string realiza concatenação!)
console.log("5" - 2); // 3 (Operador - força conversão para number)
console.log("5" * "2"); // 10 (Multiplicação força conversão numérica)
console.log(true + 1); // 2 (true é convertido para 1)
console.log(false + 1); // 1 (false é convertido para 0)
```

---

## Coerção de Tipos (Implícita vs Explícita)

```js
console.log("0" == 0); // true (Coerção implícita de string para number)
console.log(0 == false); // true
console.log("" == false); // true
```

---

## `undefined` vs `null`

- `undefined`: Significa que a variável foi declarada, mas ainda não recebeu nenhum valor, ou que uma função não retornou...
- `null`: Significa a ausência intencional de um objeto ou valor. É atribuído programaticamente pelo desenvolvedor para...

---

## Comparação entre undefined e null

```js
let unassigned;
console.log(unassigned); // undefined

const emptyUser = null; // Definido intencionalmente como vazio
console.log(emptyUser); // null

console.log(undefined == null); // true (Igualdade ampla)
console.log(undefined === null); // false (Tipos diferentes!)
```

---

## Ausência de valor

```js
let notInitialized;
const empty = null;

console.log(notInitialized); // undefined
console.log(typeof notInitialized); // "undefined"
console.log(empty); // null
console.log(typeof empty); // "object"
```

---

## Booleanos, Falsy e Truthy

- `0n` (BigInt zero)
- `""` (string vazia)
- `NaN` (Not-a-Number)
- `document.all` (em navegadores)

---

## Booleanos, Falsy e Truthy: Comparação

| Valor | Conversão |
| ----- | --------- |
| `false` | `false` |
| `0`, `-0`, `0n` | `false` |
| `""` | `false` |
| `null` | `false` |
| `undefined` | `false` |
| ... | ... |

---

## Testando Truthy e Falsy

```js
console.log(Boolean("")); // false (Falsy)
console.log(Boolean("0")); // true (Truthy! String não-vazia)
console.log(Boolean([])); // true (Truthy! Array é objeto)
console.log(Boolean({})); // true (Truthy! Objeto)
```

---

## Conversão booleana

```js
console.log(Boolean(false)); // false
console.log(Boolean(0)); // false
console.log(Boolean(0n)); // false
console.log(Boolean("")); // false
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN)); // false

console.log(Boolean([])); // true
console.log(Boolean({})); // true
```

---

## Aprofundamento nos Próximos Tipos do Curso

- 🔤 Strings, Template Literals e Symbols: Imutabilidade, interpolação, manipulação avançada de texto, códigos Unicode e...
- 🔢 Numbers, BigInt e Math: Precisão IEEE 754, números inteiros de precisão arbitrária (`BigInt`), operações com `Math` e...
- 📋 Arrays e Métodos de Iteração: Coleções ordenadas, mutações, métodos funcionais (`map`, `filter`, `reduce`) e...
- 📦 Objetos e Protótipos: Propriedades, métodos, herança prototípica, manipulação de chaves e objetos imutáveis.
- 🗂️ Coleções Estruturadas (Map, Set, WeakMap, WeakSet): Estruturas de dados avançadas para chave-valor e conjuntos com...

---

## Executando

- Crie um arquivo `types.js`:
- Execute via Node.js:
- Verifique o resultado:

---

## types.js

```js
const val1 = "10";
const val2 = 5;

console.log("Tipo val1:", typeof val1);
console.log("Tipo val2:", typeof val2);
console.log("Soma com +:", val1 + val2);
console.log("Soma com Number():", Number(val1) + val2);
```

---

## Terminal

```bash
node types.js
```

---

## Output

```txt
Tipo val1: string
Tipo val2: number
Soma com +: 105
Soma com Number(): 15
```

---

## Exercício

- Inspecione os tipos dos seguintes valores usando `typeof`: `42`, `"Texto"`, `true`, `undefined`, `null`, `Symbol()`,...
- Explique a diferença entre `undefined` e `null`;
- Liste 5 valores que são convertidos para `false` em condicionais (falsy);
- Escreva uma função que receba uma entrada e utilize coerção explícita para somar dois números passados como texto.

---

## Perguntas de revisão

- O que significa dizer que o tipo está no valor, não na variável
- Por que `typeof null` retorna `"object"`
- Quais valores são avaliados como Falsy em JavaScript
- O que ocorre no comando `"10" + 5` vs `"10" - 5`
- Por que `NaN === NaN` retorna `false` e qual a forma correta de testá-lo

---

## Próxima aula

- Com o entendimento completo de tipos de dados, coerção e igualdade, o próximo passo é aprender a combinar valores em...
- Expressões e Operadores
- Operadores aritméticos, lógicos, relacionais e regras de precedência

---

## Resumo da Aula

- Revise categorias de Tipos de Dados
- Revise imutabilidade dos Primitivos
- Revise o Operador `typeof`
- Revise tipagem Dinâmica e Tipagem Fraca (Weak Typing)
- Revise coerção de Tipos (Implícita vs Explícita)
- Revise `undefined` vs `null`
- Revise booleanos, Falsy e Truthy
