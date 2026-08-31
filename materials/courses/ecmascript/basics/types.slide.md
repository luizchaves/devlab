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
description: "Tipos primitivos e de referência, operador typeof, undefined vs null, coerção de tipos implícita e explícita, valores truthy/falsy e igualdade estrita em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Tipos de Dados e Coerção

Tipos primitivos e de referência, operador typeof, undefined vs null, coerção de tipos implícita e explícita, valores truthy/falsy e igualdade estrita em JavaScript.

---

## Objetivo

- Compreender o sistema de tipos dinâmico do JavaScript.
- Identificar todos os tipos primitivos e de referência, utilizar corretamente o operador `typeof`.

---

## Mapa da Aula

- Categorias de Tipos de Dados
- Imutabilidade dos Primitivos
- O Operador `typeof`
- Tipagem Dinâmica e Tipagem Fraca (Weak Typing)
- Coerção de Tipos (Implícita vs Explícita)
- `undefined` vs `null`

---

## Categorias de Tipos de Dados

- No ECMAScript, as variáveis não possuem tipo fixo; os valores armazenados é que possuem tipo.
- A linguagem divide seus tipos de dados em duas categorias fundamentais: Primitivos e Objetos (Tipos de Referência).
- O diagrama a seguir ilustra a taxonomia completa dos tipos no JavaScript, destacando a separação entre primitivos e objetos
- A tabela a seguir apresenta a consolidação completa de todos os tipos de dados da linguagem.
- Referência: JavaScript data types and data structures | MDN.

---

## Categorias de Tipos de Dados (Comparação)

| Categoria | Tipo (`typeof`) | Descrição | Exemplos de Literais |
| :--- | :--- | :--- | :--- |
| **Primitivo** | `undefined` | Ausência de valor atribuído por padrão | `undefined` |
| **Primitivo** | `null` | Ausência intencional de referência a objeto (*retorna 'object' no typeof*) | `null` |
| **Primitivo** | `boolean` | Valor lógico verdadeiro ou falso | `true`, `false` |
| **Primitivo** | `number` | Número em ponto flutuante IEEE 754 (64-bit) | `42`, `-15`, `3.14`, `314e-2`, `0b1111`, `0o17`, `0xf`, `15_000`, `NaN` |
| **Primitivo** | `bigint` | Inteiro com precisão arbitrária superior a 2⁵³ - 1 | `42n`, `9007199254740991n` |

---

## Categorias de Tipos de Dados (Exemplo)

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

## Hierarquia de tipos em uma imagem

- A representação a seguir, do livro JavaScript for impatient programmers, resume a mesma taxonomia em forma de diagrama e tabela.
- !JavaScript's type hierarchy
- JavaScript for impatient programmers (Book)

---

## Hierarquia de tipos em uma imagem (Comparação)

| Category  | Types                               | Values                                                                                        |
| --------- | ----------------------------------- | --------------------------------------------------------------------------------------------- |
| Primitive | Undefined | `undefined`                                                                                    |
| Primitive | Null      | `null`                                                                                        |
| Primitive | Boolean   | `true`, `false`                                                                               |
| Primitive | Number    | `-15`<br />`15`, `0b1111`, `0o17`, `0xf`<br />`-123.45`<br />`123.45`, `1.2345e2`, `12345E-2` |
| Primitive | String    | `'Hello'`, `"Hello"`, `` `Hello` ``                                                           |

---

## Imutabilidade dos Primitivos

- Valores primitivos são imutáveis.
- Métodos chamados em uma string ou number retornam novos valores sem alterar a instância original.

---

## Imutabilidade dos Primitivos (Exemplo)

```js
let title = "javascript";
title.toUpperCase(); // Retorna "JAVASCRIPT"
console.log(title); // Continua "javascript" (imutable)

title = title.toUpperCase(); // Reatribuição do identificador para o novo valor
console.log(title); // "JAVASCRIPT"
```

---

## O Operador `typeof`

- O operador unário `typeof` inspeciona e retorna uma string representando o tipo do operando atual.
- Na especificação inicial do JavaScript (1995), os valores eram representados por rótulos de tipo em memória de 32 bits.
- O rótulo para objetos era `000`.
- Como o ponteiro para `null` era um ponteiro nulo (`0x00`), o `typeof null` retornou `"object"`.
- Esse comportamento foi mantido no ECMAScript para preservar compatibilidade com a web antiga.

---

## O Operador `typeof` (Exemplo)

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

## Tipagem Dinâmica e Tipagem Fraca (Weak Typing)

- Utilize coerção explícita (`Number(val)`, `String(val)`).
- Utilize sempre igualdade estrita (`===`) em vez de igualdade ampla (`==`).
- Tipagem Dinâmica (Dynamic Typing)
- Em JavaScript, as variáveis não possuem tipos fixos associados; os tipos pertencem aos valores atribuídos a elas.
- Por isso, a mesma variável pode armazenar um número em um momento e uma string no momento seguinte.

---

## Tipagem Dinâmica e Tipagem Fraca (Weak Typing) (Comparação)

| Operação | Resultado | Comportamento da Tipagem Fraca |
| :--- | :--- | :--- |
| `"5" + 2` | `"52"` | O operador `+` com string converte `2` para `"2"` e concatena. |
| `"5" - 2` | `3` | O operador `-` força conversão da string `"5"` para o número `5`. |
| `"5" * "2"` | `10` | O operador `*` converte ambas as strings para números. |
| `true + 1` | `2` | O booleano `true` é convertido para `1`. |
| `false * 10` | `0` | O booleano `false` é convertido para `0`. |

---

## Tipagem Dinâmica e Tipagem Fraca (Weak Typing) (Exemplo)

```js
let data = 42;            // number
console.log(typeof data); // "number"

data = "DevLab";          // reatribuído para string
console.log(typeof data); // "string"
```

---

## Coerção de Tipos (Implícita vs Explícita)

- Coerção é o processo de conversão de um valor de um tipo de dado para outro.
- Coerção Explícita (Casting)
- Ocorre quando o desenvolvedor converte o tipo intencionalmente usando funções construtoras nativas como `String()`.
- Ocorre automaticamente quando o motor JavaScript tenta realizar uma operação entre tipos incompatíveis.
- O operador de igualdade ampla (`==`) tenta realizar coerção implícita de tipos antes de comparar, gerando resultados contraintuitivos

---

## Coerção de Tipos (Implícita vs Explícita) (Exemplo)

```js
const input = "42";
const count = Number(input); // 42 (number)
const text = String(100); // "100" (string)
const isValid = Boolean(1); // true (boolean)
```

---

## `undefined` vs `null`

- `undefined`: Significa que a variável foi declarada, mas ainda não recebeu nenhum valor.
- Ambos os valores representam ausência de dados, mas com intenções semânticas distintas
- Com `typeof` apresentado, fica mais fácil observar dois valores especiais de ausência.
- `undefined` costuma indicar ausência de inicialização.
- `null` costuma ser usado para representar ausência intencional de valor

---

## `undefined` vs `null` (Exemplo)

```js
let unassigned;
console.log(unassigned); // undefined

const emptyUser = null; // Definido intencionalmente como vazio
console.log(emptyUser); // null

console.log(undefined == null); // true (Igualdade ampla)
console.log(undefined === null); // false (Tipos diferentes!)
```

---

## Booleanos, Falsy e Truthy

- `0n` (BigInt zero)
- `""` (string vazia)
- `NaN` (Not-a-Number)
- `document.all` (em navegadores)
- Em contextos lógicos (como condicionais `if`), todos os valores em JavaScript são avaliados como Truthy (verdadeiro) ou Falsy (falso).

---

## Booleanos, Falsy e Truthy (Comparação)

| Valor | Conversão |
| ----- | --------- |
| `false` | `false` |
| `0`, `-0`, `0n` | `false` |
| `""` | `false` |
| `null` | `false` |
| `undefined` | `false` |

---

## Booleanos, Falsy e Truthy (Exemplo)

```js
console.log(Boolean("")); // false (Falsy)
console.log(Boolean("0")); // true (Truthy! String não-vazia)
console.log(Boolean([])); // true (Truthy! Array é objeto)
console.log(Boolean({})); // true (Truthy! Objeto)
```

---

## Aprofundamento nos Próximos Tipos do Curso

- 🔤 Strings, Template Literals e Symbols: Imutabilidade, interpolação, manipulação avançada de texto.
- 🔢 Numbers, BigInt e Math: Precisão IEEE 754, números inteiros de precisão arbitrária (`BigInt`).
- 📋 Arrays e Métodos de Iteração: Coleções ordenadas, mutações, métodos funcionais (`map`, `filter`, `reduce`) e desestruturação.
- 📦 Objetos e Protótipos: Propriedades, métodos, herança prototípica, manipulação de chaves e objetos imutáveis.
- 📅 Datas e Tempo com o Objeto Date: Instanciação, timestamps Unix, fusos horários.

---

## Executando

- Crie um arquivo `types.js`
- Execute via Node.js
- Verifique o resultado

---

## Exercício

- Inspecione os tipos dos seguintes valores usando `typeof`: `42`, `"Texto"`, `true`, `undefined`, `null`, `Symbol()`, `[]`.
- Explique a diferença entre `undefined` e `null`;
- Liste 5 valores que são convertidos para `false` em condicionais (falsy);
- Escreva uma função que receba uma entrada e utilize coerção explícita para somar dois números passados como texto.

---

## Resumo da Aula

- **7 Tipos Primitivos**: `string`, `number`, `boolean`, `null`, `undefined`, `symbol` e `bigint` — armazenados por valor e imutáveis.
- **Tipos de Referência**: `Object`, `Array`, `Function`, `Date` — armazenados na Heap e manipulados por ponteiro de referência.
- **Operador typeof**: Identifica tipos, com atenção às peculiaridades históricas `typeof null === "object"` e `typeof NaN === "number"`.
- **Coerção de Tipos**: Explícita (`Number()`, `String()`, `Boolean()`) vs implícita (`"5" + 2 = "52"`, `"5" - 2 = 3`).
- **Valores Falsy**: Exatamente 8 valores são falsy (`false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`); todo o resto é truthy.
