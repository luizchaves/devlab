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
title: "JavaScript: Guia de Referência Rápida (Cheat Sheet)"
description: "Resumo executivo de sintaxe, tipos, escopo, arrays, objetos, promises, async/await e boas práticas em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Guia de Referência (Cheat Sheet)

Resumo executivo de sintaxe, declaração de variáveis, métodos de arrays, desestruturação, Promises e padrões recomendados.

---

## Declaração de Variáveis

```javascript
const name = "DevLab"; // Reatribuição proibida, escopo de bloco (USAR POR PADRÃO)
let count = 0;         // Reatribuição permitida, escopo de bloco
// var legado;         // Evitar! Escopo funcional e hoisting com undefined
```

---

## Manipulação de Arrays

```javascript
const nums = [1, 2, 3, 4];

// Iteração & Transformação:
const doubled = nums.map(n => n * 2);      // [2, 4, 6, 8]
const evens   = nums.filter(n => n % 2===0); // [2, 4]
const sum     = nums.reduce((a, n) => a + n, 0); // 10

// Imutabilidade (ES2023):
const sorted  = nums.toSorted((a, b) => b - a); // [4, 3, 2, 1]
```

---

## Objetos e Desestruturação

```javascript
const user = { id: 1, username: "maria", role: "admin" };

// Desestruturação com renomeação e default:
const { username: name, role, active = true } = user;

// Utilitários:
const keys = Object.keys(user);   // ["id", "username", "role"]
const entries = Object.entries(user); // [["id", 1], ...]
```

---

## Assincronismo: Promises e Async/Await

```javascript
// Função Assíncrona com try/catch:
async function loadUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error("Falha HTTP");
    return await res.json();
  } catch (err) {
    console.error(err.message);
  }
}
```

---

## Resumo Executivo & Checklist

1. Use **`const`** por padrão; use **`let`** apenas se for reatribuir.
2. Use igualdade estrita **`===`** e operadores modernos **`??`** e **`?.`**.
3. Prefira **métodos imutáveis de Array** (`map`, `filter`, `toSorted`).
4. Trate erros em `async/await` com **`try...catch`**.

---

## Referências & Links Úteis

- **DevLab**: [Guia Completo de ECMAScript](https://luizchaves.github.io/devlab/courses/ecmascript/)
- **MDN Web Docs**: [JavaScript Reference](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference)
