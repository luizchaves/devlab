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
title: "JavaScript: Coleções (Map, Set, WeakMap, WeakSet)"
description: "Coleções chave-valor com Map, conjuntos únicos com Set, referências fracas e novos métodos de conjuntos ES2024."
---

<!-- _class: lead -->

# JavaScript: Coleções (Map, Set, WeakMap, WeakSet)

Coleções de dados chave-valor (`Map`), conjuntos de valores únicos (`Set`), gerenciamento de memória (`WeakMap`/`WeakSet`) e métodos de conjunto (ES2024).

---

## Objetivos da Aula

- **Map**: Utilizar dicionários de chave-valor que aceitam tipos arbitrários como chave.
- **Set**: Criar coleções de valores únicos e realizar desduplicação eficiente.
- **Weak Collections**: Aplicar `WeakMap` e `WeakSet` para prevenir vazamentos de memória (*Memory Leaks*).
- **ES2024 Set Methods**: Operar uniões, interseções e diferenças de conjuntos.

---

## Map vs Objeto Literal

Embora Objetos façam mapeamento chave-valor, a coleção **`Map`** resolve diversas limitações:

| Característica | Objeto Literal `{}` | Coleção `Map` |
| :--- | :--- | :--- |
| **Tipos de Chave** | Apenas `String` ou `Symbol` | **Qualquer tipo** (Objetos, Funções, Numbers) |
| **Tamanho** | Requer `Object.keys(obj).length` | Propriedade nativa `.size` |
| **Ordem de Chaves** | Não garantida para todos os tipos | **Garantida** (ordem de inserção) |
| **Desempenho** | Não otimizado para adições/remoções frequentes | **Otimizado** para busca e alteração de chave-valor |

---

## Utilizando a Coleção `Map`

```javascript
const userSession = new Map();

const user1 = { id: 101, name: "Ana" };
const user2 = { id: 102, name: "Carlos" };

// Adicionando pares chave-valor (chave pode ser o próprio OBJETO!):
userSession.set(user1, { token: "abc.123", loginTime: Date.now() });
userSession.set(user2, { token: "xyz.789", loginTime: Date.now() });

console.log(userSession.get(user1).token); // "abc.123"
console.log(userSession.size);             // 2
console.log(userSession.has(user2));       // true

userSession.delete(user1); // Remove entrada
```

---

## Utilizando a Coleção `Set`

Um **`Set`** é uma coleção de valores **únicos** (duplicatas são ignoradas automaticamente):

```javascript
const numbers = new Set([1, 2, 2, 3, 4, 4, 4, 5]);
console.log(numbers); // Set(5) { 1, 2, 3, 4, 5 }

// Adicionando elementos:
numbers.add(6);
numbers.add(6); // Ignorado!

console.log(numbers.has(3)); // true (Busca O(1) super rápida!)
console.log(numbers.size);  // 6

// Desduplicação instantânea de Arrays:
const arrayWithDuplicates = [10, 20, 10, 30, 20];
const uniqueArray = [...new Set(arrayWithDuplicates)]; // [10, 20, 30]
```

---

## Novos Métodos de Conjunto (ES2024)

O ES2024 introduziu métodos nativos para operações de teoria dos conjuntos no `Set`:

```javascript
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

// 1. União (elementos de A ou B):
const union = setA.union(setB); // Set { 1, 2, 3, 4, 5, 6 }

// 2. Interseção (elementos presentes em A E B):
const intersection = setA.intersection(setB); // Set { 3, 4 }

// 3. Diferença (elementos em A que NÃO estão em B):
const difference = setA.difference(setB); // Set { 1, 2 }
```

---

## WeakMap e WeakSet: Gestão de Memória

`WeakMap` e `WeakSet` mantém apenas **referências fracas** para suas chaves/elementos (que **devem ser objetos**):

- Se não houver outra referência para um objeto chave no código, ele é **coletado pelo Garbage Collector** automaticamente.
- Útil para metadados privados ou caches vinculados a instâncias de DOM/Objetos sem causar vazamento de memória.

```javascript
let element = document.getElementById("button");
const metaData = new WeakMap();

metaData.set(element, { clicks: 10 });

// Se o elemento for removido do DOM e nulo:
element = null; // O objeto em metaData será limpo da memória automaticamente pelo GC!
```

---

## Resumo & Revisão

- Use **`Map`** quando precisar de chaves que não são strings ou necessitar da propriedade `.size`.
- Use **`Set`** para garantir elementos únicos e fazer busca de presença em $O(1)$.
- Desduplique arrays rapidamente com `[...new Set(array)]`.
- Use **`WeakMap`** e **`WeakSet`** para associar dados a objetos sem impedir o Garbage Collector.

---

## Referências & Links Úteis

- **MDN**: [Coleções Chaveadas (Map e Set)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Keyed_collections)
- **MDN**: [Map](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Map)
- **MDN**: [Set](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Set)
