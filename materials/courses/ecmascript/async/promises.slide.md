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
title: "JavaScript: Assincronismo e Promises"
description: "Event Loop, Call Stack, Task Queue, Microtask Queue, estados de Promises e encadeamento."
---

<!-- _class: lead -->

# JavaScript: Assincronismo e Promises

O modelo de concorrência mono-thread do Event Loop, Call Stack, Microtasks vs Macrotasks, estados das Promises e encadeamento.

---

## Objetivos da Aula

- **Event Loop**: Compreender o modelo não-bloqueante do JavaScript.
- **Filas de Tarefas**: Diferenciar a Call Stack, a Task Queue (Macrotasks) e a Microtask Queue.
- **Estados da Promise**: Identificar `Pending`, `Fulfilled` e `Rejected`.
- **Combinadores**: Utilizar `Promise.all()`, `allSettled()`, `race()` e `any()`.

---

## O Modelo de Execução: Event Loop

JavaScript é **single-threaded** (uma única thread de execução). Para não travar a interface em operações demoradas (rede, arquivos), utiliza um modelo assíncrono não-bloqueante baseado em **Event Loop**:

<div style="display: flex; flex-direction: column; align-items: center; gap: 8px; margin-top: 15px; font-size: 0.85em;">
  <div style="border: 2px solid #0284c7; border-radius: 6px; padding: 8px 16px; background: #f0f9ff; width: 90%; text-align: center;">
    <strong>1. Call Stack (Pilha de Chamadas)</strong>: Executa o código síncrono atual.
  </div>
  <div style="font-weight: bold; color: #0284c7;">↓ (Delega Web / Node APIs)</div>
  <div style="border: 2px solid #eab308; border-radius: 6px; padding: 8px 16px; background: #fefce8; width: 90%; text-align: center;">
    <strong>2. Microtask Queue (Prioridade Máxima)</strong>: Callbacks de Promises (`.then`), `queueMicrotask`.
  </div>
  <div style="font-weight: bold; color: #16a34a;">↓ (Executa após esvaziar Microtasks)</div>
  <div style="border: 2px solid #16a34a; border-radius: 6px; padding: 8px 16px; background: #f0fdf4; width: 90%; text-align: center;">
    <strong>3. Task Queue (Macrotasks)</strong>: Callbacks de `setTimeout`, `setInterval`, eventos DOM.
  </div>
</div>

---

## Anatomia de uma Promise

Uma **Promise** é um objeto que representa a eventual conclusão ou falha de uma operação assíncrona.

<div style="display: flex; gap: 10px; font-size: 0.8em; margin-bottom: 10px;">
  <div style="flex: 1; border: 1px solid #facc15; padding: 8px; background: #fefce8; border-radius: 6px;">
    <strong>Pending (Pendente)</strong><br>Estado inicial; a operação ainda não foi concluída.
  </div>
  <div style="flex: 1; border: 1px solid #4ade80; padding: 8px; background: #f0fdf4; border-radius: 6px;">
    <strong>Fulfilled (Realizada)</strong><br>A operação foi concluída com sucesso (`resolve`).
  </div>
  <div style="flex: 1; border: 1px solid #f87171; padding: 8px; background: #fef2f2; border-radius: 6px;">
    <strong>Rejected (Rejeitada)</strong><br>A operação falhou (`reject`).
  </div>
</div>

```javascript
const myPromise = new Promise((resolve, reject) => {
  const success = true;
  if (success) {
    resolve("Dados carregados com sucesso!");
  } else {
    reject(new Error("Falha no carregamento"));
  }
});
```

---

## Encadeamento (`.then`, `.catch`, `.finally`)

```javascript
fetchData()
  .then((data) => {
    console.log("Passo 1:", data);
    return processData(data); // Retornar um valor passa para o próximo .then!
  })
  .then((result) => {
    console.log("Passo 2 (Processado):", result);
  })
  .catch((error) => {
    // Captura QUALQUER erro ocorrido na cadeia anterior!
    console.error("Erro capturado:", error.message);
  })
  .finally(() => {
    // Executa sempre (limpeza de spinnners, loaders etc)
    console.log("Operação finalizada.");
  });
```

---

## Métodos Combinadores de Promises

| Método | Comportamento Principal | Caso de Uso |
| :--- | :--- | :--- |
| **`Promise.all([p1, p2])`** | Aguarda TODAS realizarem. Se UMA rejeitar, rejeita tudo imediatamente. | Buscar várias APIs em paralelo onde todas são obrigatórias. |
| **`Promise.allSettled([p1, p2])`** | Aguarda TODAS terminarem (independentemente de realizarem ou rejeitarem). | Relatório completo de status sem interromper por falhas. |
| **`Promise.race([p1, p2])`** | Retorna o resultado da PRIMEIRA promise que terminar (seja sucesso ou erro). | Timeout de requisições de rede. |
| **`Promise.any([p1, p2])`** | Retorna a PRIMEIRA promise a REALIZAR com sucesso. | Espelhos / Mirrored CDNs alternativos. |

---

## Exemplo: Execução Pararela com `Promise.all()`

```javascript
const fetchUsers = fetch("/api/users").then(res => res.json());
const fetchPosts = fetch("/api/posts").then(res => res.json());

// Executa as duas requisições simultaneamente (em paralelo):
Promise.all([fetchUsers, fetchPosts])
  .then(([users, posts]) => {
    console.log(`Carregados ${users.length} usuários e ${posts.length} posts.`);
  })
  .catch(err => console.error("Falha em uma das chamadas:", err));
```

---

## Resumo & Revisão

- O **Event Loop** prioriza a Microtask Queue (Promises) antes da Macrotask Queue (`setTimeout`).
- Promises sobem do estado `Pending` para `Fulfilled` ou `Rejected` (imutáveis após resolvidas).
- Retornar um valor dentro de um `.then()` passa esse valor empacotado para o próximo `.then()`.
- Use **`Promise.all()`** para paralelo e **`Promise.allSettled()`** para tolerância a falhas.

---

## Referências & Links Úteis

- **MDN**: [Usando Promises](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Using_promises)
- **MDN**: [Event Loop e Modelo de Concorrência](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/EventLoop)
