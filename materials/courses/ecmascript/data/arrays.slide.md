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
title: "JavaScript: Arrays e Métodos Funcionais"
description: "Criação, métodos mutadores vs não-mutadores, iteração com HOFs (map, filter, reduce) e ES2023+."
---

<!-- _class: lead -->

# JavaScript: Arrays e Métodos Funcionais

Coleções ordenadas, mutabilidade, métodos de busca, iteração funcional (`map`, `filter`, `reduce`) e novos métodos imutáveis (ES2023).

---

## Objetivos da Aula

- **Estrutura**: Compreender a natureza dinâmica e heterogênea dos Arrays em JavaScript.
- **Mutabilidade**: Diferenciar métodos mutadores (`splice`, `sort`) de imutáveis (`slice`, `toSorted`).
- **HOFs**: Dominar os métodos de ordem superior de iteração (`map`, `filter`, `reduce`).
- **ES2023+**: Aplicar novos métodos de alteração por cópia (`toSpliced`, `with`).

---

## Caracterização dos Arrays em JS

Em JavaScript, Arrays são coleções ordenadas de elementos dinâmicas e heterogêneas:

```javascript
const items = [42, "DevLab", true, { role: "admin" }, [1, 2]];

console.log(items[0]);        // 42
console.log(items.length);    // 5
console.log(typeof items);    // "object"
console.log(Array.isArray(items)); // true (Teste oficial!)
```

- **Acesso pelo final com `.at()`**:
```javascript
console.log(items.at(-1)); // [1, 2] (Último elemento)
```

---

## Métodos Mutadores vs Não-Mutadores

<div style="display: flex; gap: 15px; margin-top: 15px; font-size: 0.85em;">
  <div style="flex: 1; border: 2px solid #ef4444; border-radius: 8px; padding: 12px; background: #fef2f2;">
    <strong style="color: #991b1b; font-size: 1.1em;">Métodos Mutadores (Altera o original)</strong><br>
    • <code>push()</code> / <code>pop()</code> (fim)<br>
    • <code>unshift()</code> / <code>shift()</code> (início)<br>
    • <code>splice(start, deleteCount, ...items)</code><br>
    • <code>sort()</code> / <code>reverse()</code>
  </div>
  <div style="flex: 1; border: 2px solid #16a34a; border-radius: 8px; padding: 12px; background: #f0fdf4;">
    <strong style="color: #15803d; font-size: 1.1em;">Métodos Imutáveis (Retorna Cópia)</strong><br>
    • <code>concat()</code><br>
    • <code>slice(start, end)</code><br>
    • <code>toSorted()</code> / <code>toReversed()</code> (ES2023)<br>
    • <code>toSpliced()</code> / <code>with(index, val)</code> (ES2023)
  </div>
</div>

---

## Novos Métodos de Alteração por Cópia (ES2023)

Evitam mutações indesejadas em estados (ex: em aplicações React):

```javascript
const original = [3, 1, 4, 2];

// Ordenação imutável com toSorted():
const sorted = original.toSorted((a, b) => a - b);
console.log(sorted);   // [1, 2, 3, 4]
console.log(original); // [3, 1, 4, 2] (original preservado!)

// Substituição imutável de elemento com with():
const updated = original.with(0, 99); // [99, 1, 4, 2]
```

---

## Iteração Funcional: `map()` e `filter()`

### 1. `map()`: Transforma cada elemento e retorna um NOVO array de mesmo tamanho
```javascript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(n => n * 2); // [2, 4, 6, 8]
```

### 2. `filter()`: Filtra elementos que satisfazem a condição booleana
```javascript
const users = [
  { name: "Ana", age: 22 },
  { name: "Pedro", age: 16 }
];
const adults = users.filter(user => user.age >= 18);
// [{ name: "Ana", age: 22 }]
```

---

## Iteração Funcional: `reduce()`

Reduz todos os elementos de um Array a **um único valor final** (acumulador):

```javascript
const cart = [
  { item: "Teclado", price: 150 },
  { item: "Mouse", price: 80 },
  { item: "Monitor", price: 900 }
];

const total = cart.reduce((accumulator, product) => {
  return accumulator + product.price;
}, 0); // 0 é o valor inicial do acumulador!

console.log(total); // 1130
```

---

## Buscas e Verificações em Arrays

```javascript
const numbers = [10, 20, 30, 40, 50];

// 1. Encontrar primeiro elemento / índice:
const found = numbers.find(n => n > 25);      // 30
const index = numbers.findIndex(n => n > 25); // 2

// 2. Testes de condição:
const hasLargeNum = numbers.some(n => n > 45); // true (ao menos 1 satisfaz)
const allPositive = numbers.every(n => n > 0); // true (TODOS satisfazem)

// 3. Verificação de presença:
numbers.includes(30); // true
```

---

## Resumo & Revisão

- Use `Array.isArray(val)` para testar o tipo oficial de um Array.
- Prefira **métodos imutáveis** (`map`, `filter`, `toSorted`, `slice`) para código previsível.
- **`map()`** transforma, **`filter()`** reduz o tamanho por condição, **`reduce()`** acumula em um valor.
- Use **`find()`** para obter o objeto e **`findIndex()`** para a posição do elemento.

---

## Referências & Links Úteis

- **MDN**: [Array - Protótipo](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array)
- **MDN**: [Métodos de Iteração em Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#iterative_methods)
