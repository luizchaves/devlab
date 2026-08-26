---
marp: true
theme: default
paginate: true
lang: pt-BR
title: "JavaScript: Arrays"
description: "Slides completos da aula de Arrays em JavaScript (Criação, manipulação, imutabilidade, métodos mutadores vs acessores e Higher-Order Functions)."
---

<!-- _class: lead -->

# JavaScript: Arrays

Criação, notação de colchetes, propriedade `length`, métodos mutadores vs acessores, desestruturação, operador *spread* e manipulação funcional com *Higher-Order Functions* (`map`, `filter`, `reduce`).

---

## Objetivo

Compreender o conceito e manipulação de Arrays em JavaScript:

- Criar e acessar elementos de arrays indexados.
- Utilizar a propriedade `length` e o método `.at()`.
- Manipular arrays com o operador *spread* (`...`) e desestruturação.
- Diferenciar **métodos mutadores** (que alteram o original) de **métodos acessores** (que retornam novo array).
- Dominar *Higher-Order Functions*: `forEach`, `map`, `filter`, `find` e `reduce`.

---

## O Que É Um Array?

Um **Array** (vetor ou arranjo) é uma estrutura de dados ordenada que armazena uma coleção de elementos.

- Índices numéricos baseados em **zero** (0, 1, 2, ...).
- Podem conter qualquer tipo de dado (heterogêneos) e possuem tamanho dinâmico.

```js
const empty = [];
const numbers = [10, 20, 30, 40];
const mixed = [1, "dois", true, { id: 10 }, [5, 6]];

console.log(typeof numbers); // "object"
console.log(Array.isArray(numbers)); // true
```

---

## Acesso e Modificação por Índice

Acessamos e modificamos elementos utilizando a notação de colchetes `array[índice]`:

```js
const fruits = ["maçã", "banana", "laranja"];

console.log(fruits[0]); // "maçã" (primeiro elemento)
console.log(fruits[1]); // "banana"

// Modificando um elemento existente
fruits[1] = "abacaxi";
console.log(fruits); // ['maçã', 'abacaxi', 'laranja']

// Acesso a índice inexistente retorna undefined
console.log(fruits[99]); // undefined
```

---

## O Método `.at()` e Índices Negativos

A propriedade `.length` indica o total de elementos no array:

```js
const colors = ["vermelho", "verde", "azul"];

console.log(colors.length); // 3

// Acesso ao último elemento da forma tradicional:
console.log(colors[colors.length - 1]); // "azul"

// Forma moderna usando .at() (aceita índices negativos!):
console.log(colors.at(-1)); // "azul" (último)
console.log(colors.at(-2)); // "verde" (penúltimo)
```

---

## Removendo Elementos com `delete` (Armadilha!)

O operador `delete` remove o valor do elemento, mas **mantém a posição vazia** (`empty slot`), preservando o `length` original:

```js
const numbers = [10, 20, 30];

delete numbers[1]; // Remove o valor do índice 1

console.log(numbers); // [10, empty, 30]
console.log(numbers.length); // 3 (Ainda tem tamanho 3!)
console.log(numbers[1]); // undefined
```

> **Aviso:** Evite usar `delete` em arrays. Prefira métodos mutadores como `.splice()`, `.pop()` ou `.shift()`.

---

## Operador Spread (`...`) em Arrays

O operador *spread* espalha os elementos de um array em outro container:

```js
const front = ["HTML", "CSS"];
const back = ["Node.js", "SQL"];

// 1. Concatenando arrays
const fullStack = [...front, "JavaScript", ...back];
console.log(fullStack); // ['HTML', 'CSS', 'JavaScript', 'Node.js', 'SQL']

// 2. Clonando um array (cópia rasa / shallow copy)
const copy = [...front];
copy.push("React");
console.log(front); // ['HTML', 'CSS'] (Original intacto!)
```

---

## Desestruturação de Arrays (*Array Destructuring*)

Extrai elementos de um array ordenadamente para variáveis individuais:

```js
const colors = ["vermelho", "verde", "azul", "amarelo"];

// 1. Atribuição simples via desestruturação
const [first, second] = colors;
console.log(first, second); // "vermelho" "verde"

// 2. Ignorando posições com vírgulas
const [, , third] = colors;
console.log(third); // "azul"

// 3. Rest operator (...) para capturar o restante dos elementos
const [head, ...tail] = colors;
console.log(head); // "vermelho"
console.log(tail); // ['verde', 'azul', 'amarelo']
```

---

## Iteração em Arrays: `for...of` vs `for...in`

```js
const sports = ["futebol", "basquete", "vôlei"];

// 1. for...of (percorre os VALORES) -> Recomendado!
for (const sport of sports) {
  console.log(sport); // "futebol", "basquete", "vôlei"
}

// 2. for...in (percorre os ÍNDICES / Chaves como string)
for (const index in sports) {
  console.log(index, typeof index); // "0" string, "1" string, ...
}
```

- Prefira `for...of` para iterar diretamente sobre os valores.
- O `for...in` percorre nomes de propriedades e pode trazer comportamentos indesejados.

---

## Classificação de Métodos: Mutadores vs Acessores

| Categoria | Comportamento | Exemplos |
| --- | --- | --- |
| **Mutadores** | Modificam o array original | `push`, `pop`, `shift`, `unshift`, `splice`, `reverse`, `sort` |
| **Acessores** | Preservam o array original e retornam novo valor/array | `concat`, `slice`, `join`, `indexOf`, `includes` |
| **HOFs** | Executam um callback para cada elemento | `map`, `filter`, `reduce`, `find`, `findIndex`, `every`, `some` |

---

## Métodos Mutadores: `push`, `pop`, `shift`, `unshift`

**Métodos mutadores** alteram o array original na memória:

```js
const stack = ["a", "b"];

// Adicionar e remover do FINAL
stack.push("c");   // Adiciona ao final -> stack: ['a', 'b', 'c']
const last = stack.pop(); // Remove do final ("c") -> stack: ['a', 'b']

// Adicionar e remover do INÍCIO
stack.unshift("z"); // Adiciona ao início -> stack: ['z', 'a', 'b']
const first = stack.shift(); // Remove do início ("z") -> stack: ['a', 'b']
```

---

## Método Mutador: `splice()`

Insere, remove ou substitui elementos em qualquer posição: `splice(início, quantidadeRemover, ...itensAdicionar)`

```js
const items = [1, 2, 5];

// Inserindo 3 e 4 no índice 2 sem remover ninguém (0)
items.splice(2, 0, 3, 4);

console.log(items); // [1, 2, 3, 4, 5]
```

---

## A Armadilha do Método `.sort()`

Por padrão, o método `.sort()` converte os elementos para **string** e compara em ordem lexicográfica Unicode!

```js
const numbers = [10, 2, 30, 5, 100];

numbers.sort();
console.log(numbers); // [10, 100, 2, 30, 5] -> Errado numericamente!

// Forma correta: fornecendo uma função de comparação (a, b) => a - b
numbers.sort((a, b) => a - b);
console.log(numbers); // [2, 5, 10, 30, 100] -> Correto!
```

---

## Métodos Acessores (Preservam o Original)

**Métodos acessores** geram novos resultados sem modificar o array original:

```js
const letters = ["a", "b", "c", "d"];

// .slice(início, fimExclusivo) -> Extrai uma fatia sem alterar o original
const sub = letters.slice(1, 3);
console.log(sub);     // ['b', 'c']
console.log(letters); // ['a', 'b', 'c', 'd'] (original intacto!)

// .join(separador) e .indexOf() / .includes()
console.log(letters.join(" - "));  // "a - b - c - d"
console.log(letters.indexOf("c")); // 2
console.log(letters.includes("z")); // false
```

---

## Higher-Order Functions: `forEach()` vs `map()`

```js
const numbers = [1, 2, 3, 4];

// .forEach() -> Executa um efeito colateral para cada item (retorna undefined)
numbers.forEach((num) => console.log(num * 2));

// .map() -> Transforma cada item e RETORNA um novo array de mesmo tamanho
const doubled = numbers.map((num) => num * 2);
console.log(doubled); // [2, 4, 6, 8]
console.log(numbers); // [1, 2, 3, 4] (original preservado!)
```

---

## Higher-Order Functions: `filter()`

Retorna um **NOVO array** contendo todos os elementos que passam no teste lógico:

```js
const users = [
  { id: 1, name: "Alice", active: true },
  { id: 2, name: "Bob", active: false },
  { id: 3, name: "Carol", active: true }
];

// .filter() -> Filtra apenas usuários ativos
const activeUsers = users.filter((user) => user.active);
console.log(activeUsers); // [{ Alice }, { Carol }]
```

---

## Higher-Order Functions: `find()`

Retorna o **PRIMEIRO elemento** que atende ao critério de busca (ou `undefined`):

```js
const users = [
  { id: 1, name: "Alice", active: true },
  { id: 2, name: "Bob", active: false },
  { id: 3, name: "Carol", active: true }
];

// .find() -> Retorna o objeto com id === 2
const bob = users.find((user) => user.id === 2);
console.log(bob); // { id: 2, name: 'Bob', active: false }
```

---

## Higher-Order Function: `reduce()`

Acumula os elementos do array em um único valor final (número, objeto, etc.):

```js
const cart = [
  { product: "Teclado", price: 150 },
  { product: "Mouse", price: 80 },
  { product: "Monitor", price: 900 }
];

// array.reduce((acumulador, itemAtual) => ..., valorInicial)
const totalPrice = cart.reduce((total, item) => total + item.price, 0);

console.log(`Total do carrinho: R$ ${totalPrice}`); // "Total do carrinho: R$ 1130"
```

---

## Encadeamento de Higher-Order Functions

É comum encadear `.filter()`, `.map()` e `.reduce()` para processar dados de forma funcional:

```js
const sales = [
  { category: "Eletrônicos", value: 300, status: "pago" },
  { category: "Roupas", value: 120, status: "pago" },
  { category: "Eletrônicos", value: 500, status: "pendente" },
  { category: "Eletrônicos", value: 200, status: "pago" }
];

// Faturamento total de vendas pagas de Eletrônicos
const total = sales
  .filter((s) => s.category === "Eletrônicos" && s.status === "pago")
  .map((s) => s.value)
  .reduce((acc, val) => acc + val, 0);

console.log(total); // 500 (300 + 200)
```

---

## Exercício Prático: Catálogo de Produtos

Dada a lista de produtos:

```js
const products = [
  { name: "Teclado", price: 150 },
  { name: "MousePad", price: 30 },
  { name: "Monitor", price: 900 }
];
```

Crie um script que:
1. Filtre apenas produtos com preço maior que `100`.
2. Formate uma lista de strings no padrão `"PRODUTO - R$ PREÇO"`.

---

## Solução do Exercício

```js
const products = [
  { name: "Teclado", price: 150 },
  { name: "MousePad", price: 30 },
  { name: "Monitor", price: 900 }
];

const formatted = products
  .filter((p) => p.price > 100)
  .map((p) => `${p.name.toUpperCase()} - R$ ${p.price}`);

console.log(formatted);
// ['TECLADO - R$ 150', 'MONITOR - R$ 900']
```

---

## Resumo da Aula

- Arrays em JavaScript são **dinâmicos**, **heterogêneos** e do tipo `object` (verifique com `Array.isArray()`).
- Use `.at(-1)` para acessar facilmente o último elemento com índices negativos.
- `delete arr[i]` cria posições vazias (*empty slots*); use `.splice()` para remover reorganizando índices.
- Diferencie métodos **mutadores** (`push`, `pop`, `splice`, `sort`) de **acessores** (`slice`, `concat`, `join`).
- Sempre passe uma função de comparação `(a, b) => a - b` ao usar `.sort()` com números.
- Use `map`, `filter` e `reduce` para transformar, filtrar e acumular dados de forma declarativa e imutável.
