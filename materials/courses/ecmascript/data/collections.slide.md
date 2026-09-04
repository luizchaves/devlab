---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Map, Set e Coleções"
description: "Slides completos da aula JavaScript: Map, Set e Coleções."
---

<!-- _class: lead -->

# JavaScript: Map, Set e Coleções

Coleções de dados em JavaScript: mapas chave-valor com Map, conjuntos de valores únicos com Set e versões de referência fraca com WeakMap e WeakSet.

---

## Objetivo

- Compreender as coleções estruturadas `Map`, `Set`, `WeakMap` e `WeakSet` em JavaScript, reconhecer as vantagens do `Map`...

---

## Mapa da Aula

- O Objeto Map
- O Objeto Set
- Iteração sobre Map e Set
- WeakMap e WeakSet (Coleções de Referência Fraca)
- Caso de Uso: Dados Privados e Metadados de Objetos
- Executando
- Próxima aula

---

## Introdução

- Esta aula apresenta as estruturas de dados Map e Set (introduzidas no ES6) e suas variações fracas WeakMap e WeakSet
- como armazenar mapeamentos complexos de chave-valor, garantir a unicidade de elementos, iterar sobre coleções e evitar...

---

## O Objeto Map

- Um `Map` é uma coleção ordenada de pares chave-valor na qual qualquer valor (seja um objeto, função ou tipo primitivo)...

---

## Comparativo: Map vs Objeto Literal

- Diferente de objetos literais comuns (onde as chaves são convertidas para Strings ou Symbols), o `Map` preserva os tipos...

---

## Comparativo: Map vs Objeto Literal: Comparação

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
- Ao utilizar objetos ou arrays como chaves em um `Map`, a busca via `.get()` é baseada na referência de memória, e não no...
- Por isso, `map.get( )` retornará `undefined` se for passado um novo objeto literal com a mesma estrutura

---

## Uso do Objeto Map

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
userRoles.delete(userCarlos);
console.log(userRoles.size);         // 2

// 5. Limpeza total com .clear()
// userRoles.clear();
```

---

## Referência de memória em chaves do Map

```js
const map = new Map();

map.set({ id: 1 }, "Produto A");

// Tentar buscar com um novo objeto literal igual falha:
console.log(map.get({ id: 1 })); // undefined (referências diferentes)

// Forma correta: guardar a referência da chave numa variável
const keyObj = { id: 1 };
map.set(keyObj, "Produto B");
console.log(map.get(keyObj)); // "Produto B"
```

---

## O Objeto Set

- Um `Set` é uma coleção de valores únicos
- Um mesmo valor não pode ser inserido duplicadamente em um `Set`

---

## Instanciação e Métodos do Set

- O `Set` guarda apenas valores únicos e responde a um conjunto reduzido de métodos:

---

## Uso do Objeto Set

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

// 4. Removendo elemento com .delete()
tags.delete("frontend");
console.log(tags.size); // 3
```

---

## Caso de Uso Clássico: Removendo Duplicatas de um Array

- Uma das aplicações mais populares do `Set` é a remoção instantânea de elementos duplicados de um Array utilizando o...

---

## Removendo duplicatas de um Array

```js
const numbers = [1, 2, 2, 3, 4, 4, 5, 1];

// Converter Array -> Set (remove duplicatas) -> Array
const uniqueNumbers = [...new Set(numbers)];

console.log(uniqueNumbers); // [1, 2, 3, 4, 5]
```

---

## Operações de Conjuntos (ES2024 / Métodos Utilitários)

- O ecossistema JavaScript moderno introduziu métodos nativos de teoria dos conjuntos no protótipo do `Set`:

---

## Operações com conjuntos no Set

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

- Tanto o `Map` quanto o `Set` são iteráveis nativos e mantêm a ordem em que os elementos foram inseridos

---

## Iterando sobre um Map

- A iteração devolve os pares na ordem de inserção, e a desestruturação separa chave e valor em cada passo:

---

## Formas de iterar sobre um Map

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

// 4. Usando .forEach(valor, chave)
prices.forEach((price, fruit) => {
console.log(`${fruit} -> R$ ${price}`);
});
```

---

## Iterando sobre um Set

- Como o `Set` só tem valores, a iteração é direta — e `entries()` existe apenas por compatibilidade com o `Map`:

---

## Formas de iterar sobre um Set

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

- O JavaScript fornece duas variantes especiais de coleções chamadas `WeakMap` e `WeakSet`
- A palavra *Weak* ("fraca") refere-se à forma como o Coletor de Lixo (*Garbage Collector*) do navegador lida com as...

---

## WeakMap e WeakSet (Coleções de Referência Fraca): Comparação

| Característica | `Map` / `Set` | `WeakMap` / `WeakSet` |
| :--- | :--- | :--- |
| **Tipos Permitidos** | Qualquer tipo primitivo ou objeto. | **Apenas Objetos** (e Symbols não registrados). |
| **Coleta de Lixo (Garbage Collection)** | Mantém a referência forte, **impedindo a limpeza**. | **Referência Fraca**: permite a liberação da memória. |
| **Propriedade `.size`** | Presente (ex: `map.size`). | **Ausente** (indeterminada). |
| **Iteração** | Suporta `for...of`, `.keys()`, `.values()`. | **Não iterável** (não é possível listar os elementos). |

---

## Caso de Uso: Dados Privados e Metadados de Objetos

- O `WeakMap` é ideal para associar dados ou metadados privados a uma instância de objeto
- Se o objeto for destruído no sistema, os dados associados a ele no `WeakMap` serão automaticamente removidos da memória...

---

## Exemplo prático de WeakMap

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
}

const user = new User("Ana", "SECRET_123");
console.log(user.name);             // "Ana"
console.log(user.getSecretToken()); // "SECRET_123"
console.log(user.secretToken);      // undefined (protegido contra acesso direto!)
```

---

## Executando

- Crie um arquivo chamado `collections-demo.js`:
- Execute o arquivo com Node.js no terminal:

---

## collections-demo.js

```js
// 1. Eliminar duplicatas com Set
const rawRoles = ["user", "admin", "user", "editor", "admin"];
const uniqueRoles = [...new Set(rawRoles)];
console.log("Cargos únicos:", uniqueRoles);

// 2. Mapeamento complexo com Map
const cache = new Map();
cache.set("query_users", [{ id: 1, name: "Maria" }]);

if (cache.has("query_users")) {
  console.log("Dados em cache:", cache.get("query_users"));
}
```

---

## Terminal

```bash
node collections-demo.js
```

---

## Output

```txt
Cargos únicos: [ 'user', 'admin', 'editor' ]
Dados em cache: [ { id: 1, name: 'Maria' } ]
```

---

## Map vs Objeto Literal

- Por que usar um `Map` em vez de um Objeto literal (` `) quando as chaves são objetos ou funções
- Qual é a diferença entre buscar uma chave numérica em um `Map` e em um Objeto literal

---

## Set e Eliminação de Duplicatas

- Como o `Set` lida com valores duplicados ao tentar adicionar o mesmo elemento duas vezes com `.add()`
- Como podemos converter um Array com valores duplicados em um Array com elementos únicos usando `Set`

---

## WeakMap e WeakSet

- Por que o `WeakMap` e o `WeakSet` não possuem a propriedade `.size` e não podem ser iterados com `for...of`

---

## Próxima aula

- Expressões Regulares (RegExp)
- Padrões de busca, quantificadores, classes de caracteres e métodos RegExp

---

## Resumo da Aula

- Revise o Objeto Map
- Revise o Objeto Set
- Revise iteração sobre Map e Set
- Revise weakMap e WeakSet (Coleções de Referência Fraca)
- Revise caso de Uso: Dados Privados e Metadados de Objetos
- Revise executando
- Revise próxima aula
