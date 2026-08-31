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
title: "JavaScript: Async / Await"
description: "Sintaxe async/await, tratamento de erros com try/catch, execução sequencial vs paralela e Top-level await."
---

<!-- _class: lead -->

# JavaScript: Async / Await

Sintaxe `async/await`, desaçucaramento para Promises, tratamento de erros com `try...catch`, concorrência paralela e Top-level Await.

---

## Objetivos da Aula

- **Sintaxe**: Escrever código assíncrono com aparência síncrona utilizando `async` e `await`.
- **Tratamento de Erros**: Capturar falhas de Promises usando blocos `try...catch` legíveis.
- **Concorrência**: Identificar quando executar tarefas em série (sequencial) vs em paralelo (`Promise.all`).
- **Top-Level Await**: Utilizar `await` no escopo raiz de módulos ES (ESM).

---

## O Que É `async / await`?

Introduzido no ES2017 (ES8), o `async/await` é uma **camada de sintaxe amigável (syntactic sugar)** construída sobre Promises:

```javascript
// Com Promises (.then):
function getUserThen(id) {
  return fetch(`/api/users/${id}`)
    .then(res => res.json())
    .then(user => user.name);
}

// Com async/await:
async function getUserAsync(id) {
  const res = await fetch(`/api/users/${id}`);
  const user = await res.json();
  return user.name; // Retorna automaticamente uma Promise cumprida com a String!
}
```

---

## Regras Fundamentais do `async / await`

1. **A palavra-chave `async`**:
   - Declarar uma função como `async` faz com que ela **retorne sempre uma Promise**.
   - Se você retornar um valor primitivo `42`, ela retorna `Promise.resolve(42)`.

2. **A palavra-chave `await`**:
   - Só pode ser usada dentro de funções marcadas com `async` (ou em Top-level Await em módulos).
   - Pausa a execução da função assíncrona até que a Promise seja resolvida, **sem bloquear a thread principal do navegador**.

---

## Tratamento de Erros com `try...catch`

Erros e rejeições de Promises em `async/await` são capturados diretamente por blocos `try...catch` tradicionais:

```javascript
async function loadDashboardData() {
  try {
    const response = await fetch("/api/dashboard");

    if (!response.ok) {
      throw new Error(`Erro HTTP: status ${response.status}`);
    }

    const data = await response.json();
    renderUI(data);
  } catch (error) {
    console.error("Falha ao carregar dashboard:", error.message);
    showErrorMessage("Não foi possível carregar os dados.");
  }
}
```

---

## Armadilha Comum: Execução Sequencial Indesejada

Ao colocar múltiplos `await` seguidos sem necessidade, o código é executado em série (desperdiçando tempo de rede):

```javascript
// LENTO (Sequencial): Aguarda a busca de A terminar para SÓ ENTÃO iniciar B!
async function loadSlow() {
  const user = await fetchUser(); // Leva 2 segundos
  const posts = await fetchPosts(); // Leva 2 segundos
  // Tempo total: 4 segundos!
}

// RÁPIDO (Paralelo): Dispara as requisições juntas e aguarda ambas!
async function loadFast() {
  const userPromise = fetchUser();
  const postsPromise = fetchPosts();

  const [user, posts] = await Promise.all([userPromise, postsPromise]);
  // Tempo total: 2 segundos!
}
```

---

## Top-Level Await (ES2022)

Em **Módulos ES (ESM)**, você pode usar `await` diretamente no topo do arquivo sem precisar de uma função `async` receptora:

```javascript
// dbConnection.js (em ambiente ES Module)
import { connectDB } from "./database.js";

// Aguarda a conexão antes de liberar a exportação do módulo!
export const db = await connectDB();
console.log("Banco de dados pronto para uso.");
```

- **Utilidade**: Carregamento dinâmico de dependências, inicializações de bancos de dados e fallbacks.

---

## Resumo & Revisão

- Functions marcadas com `async` sempre retornam uma Promise.
- `await` pausa a função assíncrona sem travar a thread de execução do navegador.
- Use `try...catch` para tratar exceções em fluxos `async/await`.
- Use `await Promise.all([p1, p2])` para evitar a armadilha do encadeamento sequencial desnecessário.

---

## Referências & Links Úteis

- **MDN**: [async function](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/async_function)
- **MDN**: [await](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/await)
