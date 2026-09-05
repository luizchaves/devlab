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
title: "JavaScript: Tipos de Dados e Coerção"
description: "Tipos primitivos e de referência, operador typeof, undefined vs null, coerção de tipos implícita e explícita, valores truthy/falsy e igualdade estrita em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Tipos de Dados e Coerção

Primitivos, objetos, `typeof`, coerção implícita e explícita, `null` vs `undefined`, truthy e falsy.

---

## Objetivo

Compreender o sistema de tipos dinâmico do JavaScript e evitar surpresas de coerção.

- Diferenciar **valores primitivos** (imutáveis) de **objetos** (referência).
- Inspecionar tipos com o operador `typeof` e reconhecer suas peculiaridades.
- Compreender as características de **tipagem dinâmica** e **tipagem fraca**.
- Aplicar **coerção explícita** e evitar armadilhas de coerção implícita.
- Distinguir semanticamente **`undefined`** de **`null`**.
- Identificar todos os 8 valores **falsy** e regras de avaliação booleana.
- Priorizar sempre a **igualdade estrita (`===`)**.

---

## Mapa da Aula

- Categorias: Primitivos vs Objetos.
- Imutabilidade e operador `typeof`.
- Tipagem Dinâmica e Tipagem Fraca.
- Coerção Implícita vs Explícita.
- `undefined` vs `null`.
- Booleanos, Truthy e Falsy.
- Comparação Estrita (`===`) vs Ampla (`==`).
- Executando, Exercício e Revisão.

---

## Onde o Tipo Vive?

- Em JavaScript, as **variáveis não possuem tipo fixo**.
- Os **valores** armazenados é que possuem tipo.
- A mesma variável pode guardar tipos diferentes ao longo do tempo.
- Os tipos são divididos em duas grandes famílias:
  - **Primitivos**: atômicos, imutáveis e copiados por valor.
  - **Objetos**: estruturas compostas, mutáveis e tratadas por referência.

---

## Taxonomia dos Tipos de Dados

```txt
Tipos em JavaScript
├── Primitivos (7 tipos imutáveis)
│   ├── number e bigint
│   ├── string
│   ├── boolean
│   ├── undefined e null
│   └── symbol
└── Objetos (Tipos de referência)
    ├── Object ({}) e Array ([])
    ├── Function
    └── Date, RegExp, Map, Set...
```

---

## Tipos Primitivos (1/2)

| Tipo | Descrição | Exemplo Literal |
| :--- | :--- | :--- |
| `number` | Ponto flutuante IEEE 754 (64-bit) | `42`, `3.14`, `NaN`, `0xff` |
| `bigint` | Inteiro de precisão arbitrária | `42n`, `9007199254740991n` |
| `string` | Sequência imutável de caracteres | `"DevLab"`, `'JS'`, `` `Olá` `` |
| `boolean` | Valor lógico binário | `true`, `false` |

---

## Tipos Especiais e Objetos (2/2)

| Tipo | Descrição | Exemplo Literal |
| :--- | :--- | :--- |
| `undefined` | Variável não inicializada | `undefined` |
| `null` | Ausência intencional de objeto | `null` (*typeof 'object'*) |
| `symbol` | Identificador único de chave | `Symbol("id")` |
| `object` | Estrutura de propriedades / listas | `{ a: 1 }`, `[1, 2, 3]` |
| `function` | Objeto invocável (*callable*) | `function() {}`, `() => {}` |

---

## Literais Primitivos

```js
console.log(42);           // number
console.log(42n);          // bigint
console.log("DevLab");     // string
console.log(true);         // boolean
console.log(undefined);    // undefined
console.log(null);         // null
console.log(Symbol("id")); // symbol
```

- Valores diretos enviados ao console.
- Não dependem de declaração de variáveis.

---

## Literais Numéricos e Bases

```js
console.log(15_000); // 15000 (separador numérico legível)
console.log(0b1111);  // 15    (binário: prefixo 0b)
console.log(0o17);    // 15    (octal: prefixo 0o)
console.log(0xf);     // 15    (hexadecimal: prefixo 0x)
```

- Todos são convertidos para o mesmo tipo `number` (IEEE 754).
- O sublinhado `_` melhora a legibilidade de números grandes.

---

## Valores de Objeto

```js
console.log([1, 2, 3]);              // Array (lista ordenada)
console.log({ id: 1, name: "Ana" }); // Object (chave-valor)
console.log(new Date("2026-08-12")); // Date (instância de data)
console.log(/javascript/i);          // RegExp (expressão regular)
```

- Objetos agregam múltiplos dados e comportamentos.
- Atribuições de objeto compartilham uma referência para a mesma estrutura.

---

## Imutabilidade dos Primitivos

```js
let title = "javascript";
title.toUpperCase(); // Retorna novo valor "JAVASCRIPT"

console.log(title); // "javascript" (o original não mudou!)

title = title.toUpperCase(); // Reatribuição do identificador
console.log(title); // "JAVASCRIPT"
```

- Primitivos não podem ser alterados internamente.
- Métodos de string ou number sempre produzem **novos valores**.

---

## O Operador `typeof`

- Operador unário que retorna uma `string` indicando o tipo.
- Inspeciona o tipo do operando em tempo de execução.
- Permite validação dinâmica de tipos antes de executar operações.

```js
console.log(typeof 42);           // "number"
console.log(typeof "DevLab");     // "string"
console.log(typeof true);         // "boolean"
console.log(typeof undefined);    // "undefined"
console.log(typeof Symbol("id")); // "symbol"
console.log(typeof 10n);          // "bigint"
console.log(typeof {});           // "object"
console.log(typeof function() {});// "function"
```

---

## Armadilha Histórica: `typeof null`

```js
console.log(typeof null); // "object" (Bug histórico de 1995!)
```

- Na 1ª versão do JS (1995), o rótulo de tipo para objeto era `000`.
- O ponteiro nulo (`0x00`) coincidiu com o rótulo de objetos.
- O retorno `"object"` foi mantido para não quebrar sites existentes.
- `null` **é primitivo**, apesar do retorno histórico do `typeof`.

---

## Identificando Arrays

```js
console.log(typeof []);          // "object"
console.log(Array.isArray([]));  // true
console.log(Array.isArray({}));  // false
```

- `typeof` retorna `"object"` para arrays e objetos literais.
- Para verificar se um valor é um array, use `Array.isArray(valor)`.

---

## Tipagem Dinâmica

- O tipo pertence ao valor, não à variável.
- Uma variável pode ser reatribuída com valores de tipos diferentes.

```js
let data = 42;
console.log(typeof data); // "number"

data = "DevLab";
console.log(typeof data); // "string"

data = [1, 2, 3];
console.log(typeof data); // "object"
```

---

## Tipagem Fraca (Weak Typing)

- JavaScript tenta resolver operações entre tipos incompatíveis.
- O motor realiza **conversão automática (coerção implícita)**.
- O script continua executando, mas pode gerar comportamentos inesperados.

```js
console.log("5" + 2);   // "52" (Operador + com string concatena!)
console.log("5" - 2);   // 3    (Operador - converte para number)
console.log("5" * "2"); // 10   (Multiplicação converte ambos para number)
console.log(true + 1);  // 2    (true é convertido para 1)
```

---

## Tipagem Fraca vs Tipagem Forte

| Operação | JavaScript (Fraca) | Python / Rust (Forte) |
| :--- | :--- | :--- |
| `"5" + 2` | `"52"` (converte `2` para texto) | `TypeError` (não soma str com int) |
| `"5" - 2` | `3` (converte `"5"` para número) | `TypeError` |
| `true + 1` | `2` (`true` vira `1`) | `TypeError` |
| **Abordagem** | Converte silenciosamente | Lança exceção imediata |

---

## Coerção Explícita (Casting)

- Conversão intencional feita pelo desenvolvedor no código.
- Usa funções nativas como `Number()`, `String()` e `Boolean()` (sem `new`).

```js
const input = "42";
const count = Number(input);  // 42 (number)
const text = String(100);     // "100" (string)
const isValid = Boolean(1);   // true (boolean)
const px = parseInt("42px");  // 42 (number)
```

- Torna a intenção explícita e evita efeitos colaterais.

---

## Falhas de Coerção e Erros

```js
console.log(Number("abc")); // NaN (Not-a-Number)
console.log(Number(""));    // 0

// Tipos estritos lançam erro para evitar perda de precisão:
// console.log(1n + 1);
// TypeError: Cannot mix BigInt and other types

// console.log("id: " + Symbol("id"));
// TypeError: Cannot convert a Symbol value to a string
```

- `NaN` indica que a conversão numérica falhou.

---

## Comparação Ampla (`==`) vs Estrita (`===`)

- `==` realiza **coerção implícita** antes de comparar os valores.
- `===` compara **tipo e valor** sem nenhuma conversão.

```js
console.log("0" == 0);    // true  (converte string para number)
console.log(0 == false);  // true  (false vira 0)
console.log("" == false); // true  ("" e false viram 0)

console.log("0" === 0);   // false (string !== number)
console.log(0 === false); // false (number !== boolean)
```

- **Regra de ouro**: Use sempre `===` e `!==`.

---

## `undefined` vs `null`

- Ambos indicam ausência de valor, mas com semânticas distintas:
  - **`undefined`**: Variável declarada sem valor atribuído (padrão da engine).
  - **`null`**: Ausência intencional de valor/objeto (atribuído pelo dev).

```js
let unassigned;
console.log(unassigned); // undefined (automático)

const currentUser = null; // Intencionalmente sem usuário logado
console.log(currentUser); // null
```

---

## Comparando `undefined` e `null`

```js
console.log(undefined == null);  // true  (ambos representam "vazio")
console.log(undefined === null); // false (tipos distintos!)

console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object"
```

- `==` considera ambos equivalentes por representarem ausência.
- `===` distingue os dois tipos com segurança.

---

## Booleanos: Os 8 Valores Falsy

Em contextos condicionais, apenas estes **8 valores** viram `false`:

1. `false`
2. `0` e `-0`
3. `0n` (BigInt zero)
4. `""` (string vazia)
5. `null`
6. `undefined`
7. `NaN`
8. `document.all` (navegadores)

---

## Valores Truthy

- **Qualquer valor fora da lista dos 8 Falsy é Truthy!**

```js
console.log(Boolean(""));      // false (string vazia)
console.log(Boolean("0"));     // true (string com conteúdo)
console.log(Boolean("false")); // true (string com conteúdo)
console.log(Boolean([]));      // true (array vazio é truthy!)
console.log(Boolean({}));      // true (objeto vazio é truthy!)
```

- **Cuidado**: `[]` e `{}` são avaliados como `true` em condicionais.

---

## Aprofundamento no Curso

- **Strings e Symbols**: Interpolação, manipulação e chaves únicas.
- **Numbers e BigInt**: Ponto flutuante IEEE 754 e inteiros gigantes.
- **Arrays**: Métodos funcionais (`map`, `filter`, `reduce`).
- **Objetos e Classes**: Chave-valor e herança prototípica.
- **Map e Set**: Estruturas de dados para chaves e conjuntos.
- **Date e RegExp**: Manipulação temporal e expressões regulares.

---

## Executando

```js
const val1 = "10";
const val2 = 5;

console.log("Tipo val1:", typeof val1);
console.log("Tipo val2:", typeof val2);
console.log("Soma com +:", val1 + val2);
console.log("Soma com Number():", Number(val1) + val2);
```

- Observe o contraste entre concatenação e soma aritmética.

---

## Terminal e Saída

```bash
node types.js
```

```txt
Tipo val1: string
Tipo val2: number
Soma com +: 105
Soma com Number(): 15
```

---

## Exercício

1. Inspecione tipos de `42`, `"Texto"`, `true`, `undefined`, `null`, `Symbol()`, `[]`, `{}` e `function(){}` com `typeof`.
2. Explique a diferença semântica entre `undefined` e `null`.
3. Liste 5 valores avaliados como *falsy*.
4. Crie uma função que receba duas strings e retorne a soma numérica usando coerção explícita.

---

## Solução do Exercício

```js
console.log(typeof 42);      // "number"
console.log(typeof "Texto"); // "string"
console.log(typeof null);    // "object" (bug histórico)
console.log(typeof []);      // "object" (use Array.isArray)

// undefined = não inicializado por padrão
// null = ausência intencional definida no código

function sumStrings(a, b) {
  return Number(a) + Number(b);
}
console.log(sumStrings("15", "25")); // 40
```

---

## Perguntas de Revisão

- O que significa o tipo pertencer ao valor e não à variável?
- Por que `typeof null` retorna `"object"`?
- Quais são os 8 valores *falsy* em JavaScript?
- Por que `"10" + 5` resulta em `"105"`, mas `"10" - 5` resulta em `5`?
- Por que `NaN === NaN` retorna `false` e como testá-lo corretamente?
- Por que coleções vazias `[]` e `{}` são avaliadas como *truthy*?

---

## Resumo da Aula

- 7 tipos primitivos imutáveis e tipo Objeto para coleções.
- Variáveis são dinamicamente tipadas.
- `typeof` identifica primitivos, exceto `null` (`"object"`).
- Tipagem fraca realiza coerções implícitas perigosas.
- Use coerção explícita (`Number()`, `String()`, `Boolean()`).
- Compare sempre com igualdade estrita (`===` e `!==`).
- Apenas 8 valores são *falsy*; todos os demais são *truthy*.
