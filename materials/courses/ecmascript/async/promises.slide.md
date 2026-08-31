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
title: "JavaScript: Promises"
description: "Operações assíncronas, Promises: estados, criação, encadeamento com then/catch/finally, combinadores estáticos e a relação com async/await."
---

<!-- _class: lead -->

# JavaScript: Promises

Operações assíncronas, Promises: estados, criação, encadeamento com then/catch/finally, combinadores estáticos e a relação com async/await.

---

## Objetivo

- Compreender o modelo assíncrono e monotthread do JavaScript, dominar o conceito e o ciclo de vida de uma Promise.

---

## Mapa da Aula

- O que é Assincronismo em JavaScript?
- O Conceito e Estados de uma Promise
- Criando e Consumindo Promises
- Encadeamento de Promises (Promise Chaining)
- Combinadores de Promises
- Ordem de Execução: Event Loop e Microtask Queue

---

## O que é Assincronismo em JavaScript?

- O JavaScript executa código em um ambiente de linha de execução única (single-threaded) guiado por um Event Loop.
- Operações de entrada e saída (I/O) — como buscar dados em uma API, ler um arquivo do disco ou aguardar um temporizador.
- Se o JavaScript congelasse a execução até essas operações terminarem, a interface do usuário travaria.
- Para evitar isso, as operações de I/O são executadas de forma assíncrona.

---

## O que é Assincronismo em JavaScript? (Comparação)

| Modelo | Funcionamento | Problema / Desafio |
| ------ | ------------- | ------------------ |
| **Síncrono** | Cada instrução é executada em sequência, bloqueando a próxima até terminar | Bloqueia a aplicação durante operações lentas |
| **Callbacks** | Funções passadas como argumento para serem executadas após a conclusão | Gera aninhamento excessivo e difícil manutenção (*Callback Hell*) |
| **Promises** | Objetos que representam o resultado futuro de uma operação assíncrona | Permite código assíncrono estruturado, encadeável e legível |

---

## O que é Assincronismo em JavaScript? (Exemplo)

```js
// 1. Abordagem antiga com Callbacks (Callback Hell / Pyramids of Doom)
buscarUsuario(1, (usuario) => {
  buscarPedidos(usuario.id, (pedidos) => {
    buscarDetalhesPedido(pedidos[0].id, (detalhes) => {
      console.log(detalhes);
    });
  });
});

// 2. Abordagem moderna com Promises encadeadas
buscarUsuario(1)
  .then((usuario) => buscarPedidos(usuario.id))
// ...
```

---

## O Conceito e Estados de uma Promise

- Uma Promise é um objeto JavaScript que atua como um "contrato" para um valor que pode estar disponível agora, no futuro ou nunca.
- O diagrama a seguir ilustra as transições possíveis entre os três estados de uma Promise e os manipuladores acionados ao final do ciclo
- Uma Promise possui três estados mutuamente exclusivos
- Uma Promise transita do estado `Pending` para `Fulfilled` (sucesso) ou `Rejected` (erro) uma única vez.
- Após ser resolvida ou rejeitada, seu estado e seu valor tornam-se imutáveis.

---

## O Conceito e Estados de uma Promise (Comparação)

| Estado | Nome | Descrição |
| ------ | ---- | --------- |
| **Pending** | Pendente | Estado inicial. A operação assíncrona ainda está em execução |
| **Fulfilled** | Realizada / Resolvida | A operação foi concluída com sucesso e retornou um **valor** |
| **Rejected** | Rejeitada | A operação falhou e retornou uma **razão de erro** (*reason*) |

---

## Transições e inspeção no console

- Além da descrição de cada estado, vale observar para onde ele pode transitar e como cada caso aparece ao inspecionar a Promise

---

## Transições e inspeção no console (Comparação)

| Estado | Descrição | Transição de Estado |
| :--- | :--- | :--- |
| **`pending`** (Pendente) | Estado inicial da Promise. A operação assíncrona ainda está em andamento. | Pode mudar para `fulfilled` ou `rejected`. |
| **`fulfilled`** (Realizada / Resolvida) | A operação assíncrona foi concluída com sucesso. Retorna um **valor**. | Estado final (imutável). |
| **`rejected`** (Rejeitada) | A operação assíncrona falhou ou gerou um erro. Retorna um **motivo/erro**. | Estado final (imutável). |

---

## Transições e inspeção no console (Exemplo)

```js
// Promise em estado PENDING (Pendente)
const pendingPromise = new Promise(() => {});
console.log(pendingPromise); //=> Promise { <pending> }

// Promise resolvida (FULFILLED)
const fulfilledPromise = Promise.resolve("Sucesso!");
console.log(fulfilledPromise); //=> Promise { 'Sucesso!' }

// Promise rejeitada (REJECTED)
const rejectedPromise = Promise.reject(new Error("Falha ao carregar dados"));
console.log(rejectedPromise); //=> Promise { <rejected> Error: Falha ao carregar dados }
```

---

## Criando uma Promise com `new Promise()`

- Uma Promise é criada passando uma função executora (executor) que recebe duas funções de retorno: `resolve` e `reject`.

---

## Criando uma Promise com `new Promise()` (Exemplo)

```js
function checkServerStatus(isOnline) {
  return new Promise((resolve, reject) => {
    // Simula uma operação assíncrona de 1 segundo
    setTimeout(() => {
      if (isOnline) {
        resolve("Servidor operacional (Status 200 OK)");
      } else {
        reject(new Error("Falha na conexão: Servidor indisponível"));
      }
    }, 1000);
  });
}
```

---

## Outro exemplo: validação com resolve e reject

- `Promise.resolve(valor)`: Retorna uma Promise já resolvida com o valor especificado.
- `Promise.reject(motivo)`: Retorna uma Promise já rejeitada com o motivo/erro especificado.
- Além do construtor `new Promise`, a linguagem oferece métodos estáticos para criar Promises já resolvidas ou rejeitadas

---

## Outro exemplo: validação com resolve e reject (Exemplo)

```js
function checkAge(age) {
  return new Promise((resolve, reject) => {
    if (typeof age !== "number" || age < 0) {
      reject(new Error("Idade inválida fornecida"));
    } else if (age >= 18) {
      resolve("Acesso permitido: Usuário é maior de idade");
    } else {
      reject("Acesso negado: Usuário é menor de idade");
    }
  });
}
```

---

## Execução Síncrona do Executor

- A função passada para `new Promise()` é chamada de executor.
- O executor roda imediatamente, antes de qualquer `.then()`, `.catch()` ou `await`.

---

## Execução Síncrona do Executor (Exemplo)

```js
console.log("1. Antes de criar a Promise");

const promise = new Promise((resolve, reject) => {
  console.log("2. Dentro do executor da Promise (execução SÍNCRONA)");
  resolve("Dados prontos");
});

console.log("3. Depois de criar a Promise");

promise.then((data) => {
  console.log("4. Dentro do .then() (execução ASSÍNCRONA)");
});
// ...
```

---

## Consumindo com `.then()`, `.catch()` e `.finally()`

- Três métodos encadeáveis cobrem os caminhos possíveis de uma promessa — sucesso, falha e finalização
- Referência: Promise | MDN.
- O callback passado para `.finally()` não recebe argumentos (não sabe se a Promise resolveu ou rejeitou).
- O valor retornado por `.finally()` é ignorado, repassando o resultado ou erro original da Promise para o restante da cadeia.

---

## Consumindo com `.then()`, `.catch()` e `.finally()` (Comparação)

| Método | Quando é Executado? | Função |
| ------ | ------------------- | ------ |
| `.then(onFulfilled)` | Quando a Promise transita para `Fulfilled` | Recebe o valor resolvido |
| `.catch(onRejected)` | Quando a Promise transita para `Rejected` ou lança um erro | Recebe o erro ocorrido |
| `.finally(onFinally)` | Quando a Promise é liquidada (independente de sucesso ou erro) | Executa código de limpeza |

---

## Consumindo com `.then()`, `.catch()` e `.finally()` (Exemplo)

```js
console.log("Iniciando verificação...");

checkServerStatus(true)
  .then((message) => {
    console.log("Sucesso:", message);
  })
  .catch((error) => {
    console.error("Erro:", error.message);
  })
  .finally(() => {
    console.log("Verificação concluída.");
  });
```

---

## Encadeamento de Promises (Promise Chaining)

- Uma das maiores vantagens das Promises é a capacidade de encadear chamadas `.then()`.
- Se ela retornar outra Promise, o próximo `.then()` aguardará a resolução dessa nova Promise antes de prosseguir.
- Um único bloco `.catch()` ao final da cadeia é capaz de capturar erros ocorridos em qualquer uma das etapas anteriores do encadeamento.

---

## Encadeamento de Promises (Promise Chaining) (Exemplo)

```js
function fetchUser(userId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: userId, name: "Alice", points: 100 }), 500);
  });
}

function calculateBonus(user) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(user.points * 1.5), 500);
  });
}

// ...
```

---

## Combinadores de Promises

- Quando precisamos gerenciar múltiplas Promises simultaneamente, a classe `Promise` oferece quatro métodos estáticos combinadores.
- Referência: Promise.all() | MDN.

---

## Combinadores de Promises (Comparação)

| Método Estático | Comportamento de Sucesso | Comportamento de Falha |
| --------------- | ----------------------- | ---------------------- |
| `Promise.all([p1, p2])` | Resolve quando **todas** forem resolvidas (retorna array de resultados) | Rejeita imediatamente no **primeiro erro** (*All-or-Nothing*) |
| `Promise.allSettled([p1, p2])` | Resolve quando **todas forem liquidadas** (sucesso ou falha) | Nunca rejeita globalmente; retorna status individual de cada uma |
| `Promise.race([p1, p2])` | Resolve/rejeita assim que a **primeira** Promise da lista for liquidada | Acompanha a primeira a responder (vencedora da corrida) |
| `Promise.any([p1, p2])` | Resolve assim que a **primeira com sucesso** for resolvida | Rejeita apenas se **todas falharem** (`AggregateError`) |

---

## Combinadores de Promises (Exemplo)

```js
const fetchPosts = new Promise((res) => setTimeout(() => res(["Post 1", "Post 2"]), 300));
const fetchComments = new Promise((res) => setTimeout(() => res(["Comentário 1"]), 500));
const fetchFail = new Promise((_, rej) => setTimeout(() => rej("Falha no servidor D"), 200));

// 1. Promise.all() - Falha rápido se qualquer uma falhar
Promise.all([fetchPosts, fetchComments])
  .then(([posts, comments]) => {
    console.log("Resultados:", posts, comments);
  })
  .catch((err) => console.error("Erro no Promise.all:", err));

// 2. Promise.allSettled() - Aguarda todas independente de falha
// ...
```

---

## Ordem de Execução: Event Loop e Microtask Queue

- Código Síncrono (Call Stack): Executado imediatamente, de cima para baixo.
- Fila de Microtasks (Microtask Queue): Armazena callbacks de Promises (`.then`, `.catch`.
- Fila de Macrotasks (Macrotask / Task Queue): Armazena temporizadores (`setTimeout`.
- Para compreender o comportamento assíncrono das Promises, é essencial entender a diferença de prioridades no Event Loop do JavaScript

---

## Ordem de Execução: Event Loop e Microtask Queue (Exemplo)

```js
console.log("1. Síncrono - Início");

setTimeout(() => {
  console.log("2. Macrotask (setTimeout)");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Microtask 1 (Promise)");
}).then(() => {
  console.log("4. Microtask 2 (Promise encadeada)");
});

// ...
```

---

## Consumo Prático da Fetch API e Validação de `response.ok`

- A Promise retornada pelo `fetch()` NÃO é rejeitada em respostas HTTP de erro (como 404 Not Found ou 500 Internal Server Error).
- A Promise só rejeita caso ocorra uma falha grave de rede ou o destino seja inalcançável.
- Por isso, é obrigatório verificar a propriedade `response.ok` antes de processar o corpo da resposta.

---

## Consumo Prático da Fetch API e Validação de `response.ok` (Exemplo)

```js
fetch("https://api.github.com/users/luizchaves")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Erro na requisição HTTP: Status ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("Usuário encontrado:", data.name);
  })
  .catch((error) => {
    console.error("Falha ao buscar usuário:", error.message);
  });
```

---

## Conexão com Async/Await

- Embora a sintaxe com `.then()` e `.catch()` seja poderosa, encadear dezenas de Promises ainda pode tornar o código verboso.
- No ES2017, o JavaScript introduziu as palavras-chave `async` e `await`.
- O uso de `async/await` não substitui as Promises.
- Por baixo dos panos, o operador `await` está aguardando a resolução de uma Promise, e toda função `async` retorna uma Promise.

---

## Conexão com Async/Await (Exemplo)

```js
// Abordagem 1: Usando .then() tradicional
function loadDataThen() {
  fetchUser(42)
    .then((user) => calculateBonus(user))
    .then((bonus) => console.log("Bônus:", bonus))
    .catch((err) => console.error(err));
}

// Abordagem 2: Usando Async/Await (mesmo comportamento por baixo dos panos!)
async function loadDataAsync() {
  try {
    const user = await fetchUser(42);
// ...
```

---

## Resumo e Boas Práticas

- Lembre-se dos 3 estados de uma Promise: `Pending`, `Fulfilled` e `Rejected`.
- O estado de uma Promise transita uma única vez e torna-se imutável após ser liquidado.
- Use `Promise.all()` quando precisar de todas as respostas em paralelo e uma falha deva cancelar o processo.
- Use `Promise.allSettled()` quando quiser obter os resultados de todas as requisições mesmo que algumas falhem.
- Sempre inclua um tratamento de erro com `.catch()` ou `try...catch` ao consumir Promises.

---

## Conceitos e Estados

- O que é o modelo assíncrono em JavaScript e por que ele é necessário?
- Como o JavaScript executa em uma única linha de execução (single-thread).
- Quais são os 3 estados possíveis de uma Promise e como ela transita entre eles?
- Os estados são `Pending` (pendente/inicial), `Fulfilled` (realizada/sucesso) e `Rejected` (rejeitada/erro).
- A Promise inicia em `Pending` e transita uma única vez para `Fulfilled` (via `resolve()`) ou para `Rejected` (via `reject()`).

---

## Encadeamento e Métodos

- Como funciona o encadeamento de Promises com o método `.then()`?
- Cada chamada a `.then()` retorna uma nova Promise.
- Se a função executada dentro do `.then()` retornar um valor comum ou outra Promise.
- Qual é o papel do método `.catch()` em uma cadeia de Promises?
- O método `.catch()` funciona como um manipulador global de erros para a cadeia.

---

## Combinadores e Async/Await

- Qual é a principal diferença de comportamento entre `Promise.all()` e `Promise.allSettled()`?
- `Promise.all()` falha imediatamente ao primeiro erro encontrado na lista de Promises (all-or-nothing).
- O que acontece quando passamos um array de Promises para `Promise.race()`?
- Qual é a relação entre Promises e a sintaxe `async/await`?
- `async/await` é uma sintaxe simplificada (syntactic sugar) construída diretamente sobre Promises.

---

## Executando

- Crie um arquivo chamado `promises-demo.js`
- Execute o arquivo com Node.js no terminal
- Modifique o último argumento de uma das tarefas para `false` e observe o comportamento do `Promise.all`.
- Os conceitos de Promises podem ser testados diretamente no terminal com o Node.js.

---

## Exercício

- Crie uma função `checkStock(item, quantity)` que retorne uma Promise. Se a quantidade for menor ou igual a `10`.
- Crie uma função `processPayment(amount)` que retorne uma Promise simulando o pagamento (sucesso em 500ms);
- Encadeie a verificação de estoque e o processamento do pagamento usando `.then()`, adicionando tratamento de erro com `.catch()`;
- Teste a cadeia com um pedido de `5` unidades e depois com um pedido de `15` unidades.
- Crie um arquivo chamado `promise-exercise.js` para exercitar a criação e o encadeamento de Promises

---

## Desafio

- Crie 3 funções assíncronas baseadas em Promise
- `fetchUserData()` (resolve em 300ms com `{ name: "Carlos", role: "Admin" }`);
- `fetchMetrics()` (resolve em 500ms com `{ visits: 1250, sales: 42 }`);
- `fetchNotifications()` (simula uma falha em 200ms rejeitando com `"Falha ao carregar notificações"`);
- Filtre os resultados com sucesso para exibir o painel parcial e informe quais módulos apresentaram falha.

---

## Resumo da Aula

- **Event Loop**: Modelo single-thread não-bloqueante; prioriza a Microtask Queue (Promises) antes da Macrotask Queue (setTimeout/eventos).
- **Estados da Promise**: Transição unidirecional e imutável de `Pending` para `Fulfilled` (sucesso) ou `Rejected` (falha).
- **Encadeamento Fluente**: `.then()` para transformação de dados em série, `.catch()` para captura unificada de erros e `.finally()` para limpeza.
- **Combinadores em Paralelo**: `Promise.all()` (tudo ou nada), `Promise.allSettled()` (tolerância a falhas), `Promise.race()` e `Promise.any()`.
- **Criação**: Construtor `new Promise((resolve, reject) => ...)` para encapsular operações assíncronas baseadas em callbacks legados.
