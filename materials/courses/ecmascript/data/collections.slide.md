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
title: "JavaScript: Map, Set e Coleções"
description: "Coleções de dados em JavaScript: mapas chave-valor com Map, conjuntos de valores únicos com Set e versões de referência fraca com WeakMap e WeakSet."
---

<!-- _class: lead -->

# JavaScript: Map, Set e Coleções

Coleções de dados em JavaScript: mapas chave-valor com Map, conjuntos de valores únicos com Set e versões de referência fraca com WeakMap e WeakSet.

---

## Objetivo

- Compreender as coleções estruturadas `Map`, `Set`, `WeakMap` e `WeakSet` em JavaScript.

---

## Mapa da Aula

- O Objeto Map
- O Objeto Set
- Iteração sobre Map e Set
- WeakMap e WeakSet (Coleções de Referência Fraca)
- Caso de Uso: Dados Privados e Metadados de Objetos

---

## O Objeto Map

- Um `Map` é uma coleção ordenada de pares chave-valor na qual qualquer valor (seja um objeto.

---

## Comparativo: Map vs Objeto Literal

- Diferente de objetos literais comuns (onde as chaves são convertidas para Strings ou Symbols).

---

## Comparativo: Map vs Objeto Literal (Comparação)

| Característica | Objeto Literal (`{}`) | Estrutura `Map` |
| :--- | :--- | :--- |
| **Tipos de Chaves** | Apenas `String` ou `Symbol`. | **Qualquer valor** (objetos, funções, números, booleans). |
| **Ordem de Inserção** | Nem sempre garantida para chaves numéricas. | **Garantida estritamente** na ordem de inserção. |
| **Tamanho da Coleção** | Manual via `Object.keys(obj).length`. | Direta via propriedade **`.size`**. |
| **Desempenho** | Otimizado para dados estruturados estáticos. | Otimizado para **inserções e remoções frequentes**. |
| **Iteração** | Exige `Object.keys()` ou `for...in`. | **Iterável nativo** via `for...of` ou `.forEach()`. |

---

## Instanciação e Métodos Principais

- O `Map` é criado vazio ou a partir de uma lista de pares, e sua API é baseada em métodos, não em acesso por colchetes
- Ao utilizar objetos ou arrays como chaves em um `Map`, a busca via `.get()` é baseada na referência de memória, e não no conteúdo.
- Por isso, `map.get({ id: 1 })` retornará `undefined` se for passado um novo objeto literal com a mesma estrutura.

---

## Instanciação e Métodos Principais (Exemplo)

```js
// 1. Instanciação e Inserção com .set(chave, valor)
const userRoles = new Map();

const userAna = { name: "Ana" };
const userCarlos = { name: "Carlos" };

// Usando objetos como chaves do Map:
userRoles.set(userAna, "Admin");
userRoles.set(userCarlos, "Editor");
userRoles.set(100, "ID_Numeric");

// 2. Leitura com .get(chave)
// ...
```

---

## O Objeto Set

- Um `Set` é uma coleção de valores únicos.
- Um mesmo valor não pode ser inserido duplicadamente em um `Set`.

---

## Instanciação e Métodos do Set

- O `Set` guarda apenas valores únicos e responde a um conjunto reduzido de métodos

---

## Instanciação e Métodos do Set (Exemplo)

```js
// 1. Criando um Set com valores iniciais
const tags = new Set(["javascript", "web", "frontend", "javascript"]);

console.log(tags.size); // 3 (a duplicata "javascript" foi descartada automaticamente!)

// 2. Adicionando elementos com .add()
tags.add("react");
tags.add("web"); // Ignorado pois já existe

// 3. Checando existência com .has()
console.log(tags.has("web"));     // true
console.log(tags.has("backend")); // false
// ...
```

---

## Caso de Uso Clássico: Removendo Duplicatas de um Array

- Uma das aplicações mais populares do `Set` é a remoção instantânea de elementos duplicados de um Array utilizando o operador Spread (`.

---

## Caso de Uso Clássico: Removendo Duplicatas de um Array (Exemplo)

```js
const numbers = [1, 2, 2, 3, 4, 4, 5, 1];

// Converter Array -> Set (remove duplicatas) -> Array
const uniqueNumbers = [...new Set(numbers)];

console.log(uniqueNumbers); // [1, 2, 3, 4, 5]
```

---

## Operações de Conjuntos (ES2024 / Métodos Utilitários)

- O ecossistema JavaScript moderno introduziu métodos nativos de teoria dos conjuntos no protótipo do `Set`

---

## Operações de Conjuntos (ES2024 / Métodos Utilitários) (Exemplo)

```js
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

// 1. União (Union): Combina elementos dos dois conjuntos
const union = setA.union(setB);
console.log([...union]); // [1, 2, 3, 4, 5, 6]

// 2. Interseção (Intersection): Apenas elementos presentes em AMBOS
const intersection = setA.intersection(setB);
console.log([...intersection]); // [3, 4]

// 3. Diferença (Difference): Elementos em A que NÃO estão em B
const difference = setA.difference(setB);
console.log([...difference]); // [1, 2]
```

---

## Iteração sobre Map e Set

- Tanto o `Map` quanto o `Set` são iteráveis nativos e mantêm a ordem em que os elementos foram inseridos.

---

## Iterando sobre um Map

- A iteração devolve os pares na ordem de inserção, e a desestruturação separa chave e valor em cada passo

---

## Iterando sobre um Map (Exemplo)

```js
const prices = new Map([
  ["Maçã", 2.5],
  ["Banana", 1.8],
  ["Laranja", 3.0],
]);

// 1. Usando for...of com desestruturação de par [chave, valor]
for (const [fruit, price] of prices) {
  console.log(`${fruit}: R$ ${price.toFixed(2)}`);
}

// 2. Iterando apenas pelas chaves (.keys())
// ...
```

---

## Iterando sobre um Set

- Como o `Set` só tem valores, a iteração é direta — e `entries()` existe apenas por compatibilidade com o `Map`

---

## Iterando sobre um Set (Exemplo)

```js
const colors = new Set(["vermelho", "verde", "azul"]);

// 1. Usando for...of
for (const color of colors) {
  console.log(`Cor: ${color}`);
}

// 2. Usando .forEach()
colors.forEach((color) => {
  console.log(`Item: ${color}`);
});
```

---

## WeakMap e WeakSet (Coleções de Referência Fraca)

- O JavaScript fornece duas variantes especiais de coleções chamadas `WeakMap` e `WeakSet`.

---

## WeakMap e WeakSet (Coleções de Referência Fraca) (Comparação)

| Característica | `Map` / `Set` | `WeakMap` / `WeakSet` |
| :--- | :--- | :--- |
| **Tipos Permitidos** | Qualquer tipo primitivo ou objeto. | **Apenas Objetos** (e Symbols não registrados). |
| **Coleta de Lixo (Garbage Collection)** | Mantém a referência forte, **impedindo a limpeza**. | **Referência Fraca**: permite a liberação da memória. |
| **Propriedade `.size`** | Presente (ex: `map.size`). | **Ausente** (indeterminada). |
| **Iteração** | Suporta `for...of`, `.keys()`, `.values()`. | **Não iterável** (não é possível listar os elementos). |

---

## Caso de Uso: Dados Privados e Metadados de Objetos

- O `WeakMap` é ideal para associar dados ou metadados privados a uma instância de objeto.

---

## Caso de Uso: Dados Privados e Metadados de Objetos (Exemplo)

```js
const privateData = new WeakMap();

class User {
  constructor(name, secretToken) {
    this.name = name;
    // Guarda o token privado no WeakMap usando a instância (this) como chave
    privateData.set(this, { token: secretToken });
  }

  getSecretToken() {
    return privateData.get(this).token;
  }
// ...
```

---

## Map vs Objeto Literal

- Por que usar um `Map` em vez de um Objeto literal (`{}`) quando as chaves são objetos ou funções?
- O `Map` permite usar qualquer tipo de dado como chave sem realizar conversão.
- Qual é a diferença entre buscar uma chave numérica em um `Map` e em um Objeto literal?
- No objeto literal, a chave numérica `100` e a string `"100"` são tratadas como a mesma propriedade.
- No `Map`, a chave numérica `100` e a string `"100"` são chaves distintas e independentes.

---

## Set e Eliminação de Duplicatas

- Como o `Set` lida com valores duplicados ao tentar adicionar o mesmo elemento duas vezes com `.add()`?
- O `Set` ignora silenciosamente a tentativa de inserção e mantém apenas a primeira ocorrência do valor.
- Como podemos converter um Array com valores duplicados em um Array com elementos únicos usando `Set`?
- Instanciando um `Set` com o array original e espalhando o resultado: `[...new Set(arrayOriginal)]`.

---

## WeakMap e WeakSet

- Por que o `WeakMap` e o `WeakSet` não possuem a propriedade `.size` e não podem ser iterados com `for...of`?
- Permitir iteração ou consulta de tamanho geraria resultados inconsistentes.

---

## Executando

- Crie um arquivo chamado `collections-demo.js`
- Execute o arquivo com Node.js no terminal
- Os conceitos de `Map`, `Set` e `WeakMap` podem ser testados com o Node.js no seu terminal ou no Console do navegador.

---

## Resumo da Aula

- **Map vs Objeto**: `Map` aceita chaves de qualquer tipo (inclusive objetos e funções), mantém ordem de inserção e possui `.size` nativo.
- **Set para Unicidade**: `Set` armazena valores únicos com busca rápida $O(1)$ (`has()`) e desduplicação direta via `[...new Set(arr)]`.
- **Métodos de Conjunto (ES2024)**: Operações matemáticas nativas com `.union()`, `.intersection()`, `.difference()` e `.isSubsetOf()`.
- **WeakMap & WeakSet**: Mantêm referências fracas exclusivamente a objetos, permitindo que o Garbage Collector limpe memória automaticamente.
- **Iteração**: `Map` e `Set` são iteráveis nativos e suportam `for...of`, `.forEach()` e métodos `.keys()`, `.values()`, `.entries()`.
