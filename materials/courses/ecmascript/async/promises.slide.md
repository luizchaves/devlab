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
title: "JavaScript: Promises"
description: "Slides completos do tópico JavaScript: Promises."
---

<!-- _class: lead -->

# JavaScript: Promises

Operações assíncronas, Promises: estados, criação, encadeamento com then/catch/finally, combinadores estáticos, Event Loop e novidades do ES2024.

---

## Objetivo

Dominar o modelo assíncrono e o uso profissional de Promises em JavaScript:

- Compreender a arquitetura monotthread e o papel do Event Loop
- Instanciar Promises com a função executora e com `Promise.withResolvers()`
- Identificar e diferenciar os estados `Pending`, `Fulfilled` e `Rejected`
- Construir fluxos lineares encadeados com `.then()`, `.catch()` e `.finally()`
- Coordenar requisições simultâneas com os quatro combinadores estáticos
- Validar respostas de rede com a Fetch API e evitar falhas não tratadas

---

## Mapa do Tópico

- O Modelo Assíncrono do JavaScript
- O Conceito e Estados de uma Promise
- Criação com `new Promise` e `Promise.withResolvers()`
- Encadeamento Linear e Tratamento de Erros
- Combinadores Estáticos Concorrentes
- Event Loop e Fila de Microtarefas
- Consumo Seguro da Fetch API
- Resumo e Boas Práticas

---

## O Modelo Assíncrono do JavaScript

- O motor do JavaScript executa em uma única linha principal (*single-thread*)
- Operações de entrada e saída (I/O) possuem tempo de resposta imprevisível
- Para evitar o travamento da interface ou do servidor, o I/O é delegado de forma assíncrona
- O **Event Loop** orquestra o momento de entrega dos resultados de volta à aplicação

---

## A Evolução dos Padrões Assíncronos

| Modelo | Funcionamento | Problema / Desafio |
| ------ | ------------- | ------------------ |
| **Síncrono** | Linha a linha em sequência bloqueante | Congela a execução em operações lentas |
| **Callbacks** | Funções passadas para execução posterior | Aninhamento profundo (*Callback Hell*) |
| **Promises** | Objetos que representam valores futuros | Fluxo linear, encadeável e robusto |

---

## Do Callback Hell às Promises

```js
// 1. Callbacks aninhados (difícil manutenção)
buscarUsuario(1, (user) => {
  buscarPedidos(user.id, (pedidos) => {
    buscarDetalhes(pedidos[0].id, (detalhes) => {
      console.log(detalhes);
    });
  });
});

// 2. Cadeia de Promises (fluxo plano e linear)
buscarUsuario(1)
  .then((user) => buscarPedidos(user.id))
  .then((pedidos) => buscarDetalhes(pedidos[0].id))
  .then((detalhes) => console.log(detalhes))
  .catch((erro) => console.error("Erro na cadeia:", erro));
```

---

## Os Três Estados de uma Promise

Uma Promise atua como um contrato para um valor em três estados exclusivos:

| Estado | Nome | Descrição |
| ------ | ---- | --------- |
| **`pending`** | Pendente | Estado inicial; operação assíncrona em andamento |
| **`fulfilled`** | Realizada | Sucesso na operação; retorna um **valor** imutável |
| **`rejected`** | Rejeitada | Falha na operação; retorna uma **razão de erro** |

*Garantia de Imutabilidade: Uma vez liquidada (settled), a Promise não muda mais.*

---

## Inspeção de Estados no Console

```js
// 1. Promise Pendente
const pending = new Promise(() => {});
console.log(pending); // Promise { <pending> }

// 2. Promise Resolvida
const fulfilled = Promise.resolve("Sucesso!");
console.log(fulfilled); // Promise { 'Sucesso!' }

// 3. Promise Rejeitada
const rejected = Promise.reject(new Error("Falha ao carregar"));
console.log(rejected); // Promise { <rejected> Error: Falha ao carregar }
```

---

## Criando Promises com o Construtor

A função executora recebe os callbacks `resolve` e `reject`:

```js
function checkServer(isOnline) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isOnline) {
        resolve("Servidor operacional (Status 200)");
      } else {
        reject(new Error("Servidor indisponível"));
      }
    }, 1000);
  });
}
```

---

## Recurso Moderno: Promise.withResolvers() (ES2024)

Evita a extração imperativa das funções de controle para fora do executor:

```js
// ES2024: Desestrutura diretamente a Promise e seus controladores
const { promise, resolve, reject } = Promise.withResolvers();

promise
  .then((data) => console.log("Recebido:", data))
  .catch((err) => console.error("Falha:", err.message));

// Resolução disparada a partir de qualquer ponto externo:
setTimeout(() => resolve("Concluído via evento externo!"), 500);
```

---

## Execução Síncrona da Função Executora

Atenção: O executor de `new Promise` roda **imediatamente** e de forma síncrona:

```js
console.log("1. Antes da Promise");

const p = new Promise((resolve) => {
  console.log("2. Dentro do executor (síncrono)");
  resolve("Valor pronto");
});

console.log("3. Depois da Promise");
p.then((val) => console.log("4. Dentro do .then() (assíncrono)"));
console.log("5. Fim do script");

// Ordem: 1 -> 2 -> 3 -> 5 -> 4
```

---

## Consumindo com then, catch e finally

Três manipuladores gerenciam todo o ciclo de vida da operação:

| Método | Quando é Executado? | Propósito |
| ------ | ------------------- | --------- |
| `.then()` | Quando a Promise transita para `Fulfilled` | Processa o valor resolvido |
| `.catch()` | Quando a Promise transita para `Rejected` | Captura erros e exceções |
| `.finally()` | Quando a Promise é liquidada | Limpeza de recursos e spinners |

---

## Encadeamento de Promises (Promise Chaining)

- Cada chamada a `.then()` retorna uma **nova Promise**
- Retornar um valor comum o empacota automaticamente em `Promise.resolve`
- Retornar outra Promise faz a cadeia aguardar sua resolução

```js
fetchUser(42)
  .then((user) => {
    console.log("Usuário:", user.name);
    return calculateBonus(user); // Retorna Promise
  })
  .then((bonus) => {
    console.log("Bônus calculado:", bonus);
    return bonus > 100; // Retorna booleano
  })
  .then((isEligible) => console.log("Elegível?", isEligible))
  .catch((err) => console.error("Erro na cadeia:", err.message));
```

---

## Combinadores de Promises

Para orquestrar múltiplas tarefas assíncronas concorrentes:

| Combinador | Comportamento de Sucesso | Tolerância a Falhas |
| ---------- | ------------------------ | ------------------- |
| `Promise.all()` | Todas resolvem com sucesso | Rejeita no **primeiro erro** (*Fail-Fast*) |
| `Promise.allSettled()`| Todas terminam (sucesso ou erro) | **Nunca rejeita**; relata status individual |
| `Promise.race()` | Primeira a liquidar (sucesso ou erro) | Acompanha a vencedora da corrida |
| `Promise.any()` | Primeira resolvida com sucesso | Rejeita só se **todas falharem** |

---

## Exemplo: Promise.all versus Promise.allSettled

```js
const p1 = Promise.resolve("Usuários");
const p2 = Promise.reject(new Error("Falha no serviço D"));

// Promise.all falha rápido (all-or-nothing)
Promise.all([p1, p2])
  .then(console.log)
  .catch((err) => console.error("Erro all:", err.message)); // Captura erro

// Promise.allSettled aguarda todas sem interromper
Promise.allSettled([p1, p2]).then((results) => {
  console.log("Status:", results);
  // [{ status: 'fulfilled', value: 'Usuários' }, { status: 'rejected', reason: ... }]
});
```

---

## Event Loop e Fila de Microtasks

Prioridade absoluta na ordem de execução de tarefas assíncronas:

1. **Passo 1 (Stack → APIs)**: Disparo assíncrono delegado ao ambiente
2. **Passos 2a/2b (Filas)**: Microtasks (Promises) vs. Macrotasks (Timers/IO)
3. **Passo 3 (Event Loop)**: Monitora e aguarda a Call Stack esvaziar
4. **Passo 4 (Drenagem)**: Esvazia 100% das Microtasks para a Stack
5. **Passo 5 (Macrotask)**: Move 1 Macrotask por vez após microtasks zeradas

*Regra de ouro: toda microtarefa tem precedência total sobre macrotarefas.*

---

## Demonstração da Prioridade de Microtasks

```js
console.log("1. Síncrono - Início");

setTimeout(() => {
  console.log("2. Macrotask (setTimeout 0ms)");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Microtask 1");
}).then(() => {
  console.log("4. Microtask 2");
});

console.log("5. Síncrono - Fim");

// Ordem: 1 -> 5 -> 3 -> 4 -> 2
```

---

## Consumo da Fetch API e Validação de response.ok

- A função nativa `fetch()` **não rejeita a Promise em erros HTTP (404 ou 500)**
- Ela só rejeita em falha de conexão física de rede
- É **obrigatório** verificar a propriedade `response.ok`:

```js
fetch("https://api.github.com/users/octocat")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Falha HTTP: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => console.log("Usuário:", data.name))
  .catch((err) => console.error("Erro capturado:", err.message));
```

---

## Rejeições Não Tratadas (Unhandled Rejections)

Promises rejeitadas sem um manipulador `.catch()` disparam eventos globais:

```js
// No Node.js (encerra o processo por padrão com erro fatal):
process.on("unhandledRejection", (reason) => {
  console.error("Aviso: Rejeição não tratada:", reason);
});

// No Navegador:
window.addEventListener("unhandledrejection", (event) => {
  console.error("Erro assíncrono não tratado:", event.reason);
});
```

---

## Conexão com Async/Await

`async/await` é uma camada de conveniência (*syntactic sugar*) sobre Promises:

```js
// Encadeamento tradicional com .then()
function loadDataThen() {
  fetchUser(42)
    .then((u) => calculateBonus(u))
    .then((b) => console.log("Bônus:", b))
    .catch((e) => console.error(e.message));
}

// Sintaxe moderna com async/await (mesmo comportamento subjacente)
async function loadDataAsync() {
  try {
    const user = await fetchUser(42);
    const bonus = await calculateBonus(user);
    console.log("Bônus:", bonus);
  } catch (err) {
    console.error(err.message);
  }
}
```

---

## Resumo e Boas Práticas

| Prática Recomendada | Motivo Técnico |
| ------------------- | -------------- |
| **Sempre usar `.catch()`** | Evita rejeições não tratadas que encerram o processo |
| **Retornar Promises** | Permite encadeamento ou consumo com `await` |
| **Validar `response.ok`** | O método `fetch()` resolve mesmo diante de erros 404 e 500 |
| **Evitar `.then()` aninhados** | Retorne a Promise interna mantendo a cadeia plana (*flat*) |
| **Usar `Promise.withResolvers()`** | Elimina variáveis externas e simplifica código reativo |

---

## Resumo Prático Consolidado

```js
function syncDevice(deviceId) {
  return checkServer(true)
    .then(() => Promise.allSettled([fetchUser(deviceId), Promise.resolve({ ok: true })]))
    .then(([userRes, syncRes]) => ({
      user: userRes.status === "fulfilled" ? userRes.value : null,
      sync: syncRes.status === "fulfilled",
    }))
    .catch((err) => {
      console.error("Falha irrecuperável:", err.message);
      throw err;
    })
    .finally(() => console.log("Sincronização encerrada."));
}
```

---

## Executando: Demonstração no Terminal

1. Crie o arquivo `promises-demo.js`:
```js
function task(name, ms) {
  return new Promise((res) => setTimeout(() => res(`[OK] ${name}`), ms));
}
Promise.all([task("A", 300), task("B", 100)]).then(console.log);
```
2. Execute no terminal:
```bash
$ node promises-demo.js
[ '[OK] A', '[OK] B' ]
```

---

## Exercício Prático: Sistema de Pedidos

Crie o arquivo `promise-exercise.js`:

1. Escreva `checkStock(item, qtd)` retornando Promise (rejeita se `qtd > 10`)
2. Escreva `processPayment(order)` simulando aprovação em 400ms
3. Encadeie a verificação de estoque e o pagamento usando `.then()`
4. Adicione tratamento de erros unificado com `.catch()`
5. Teste um pedido válido de 5 unidades e um pedido inválido de 15 unidades

---

## Desafio: Painel Resiliente

Crie o arquivo `dashboard-loader.js`:

1. Crie 3 funções simulando serviços: `fetchUserData()`, `fetchMetrics()`, `fetchNotifications()`
2. Simule uma falha na busca de notificações
3. Utilize `Promise.allSettled()` para carregar todas as informações simultaneamente
4. Filtre e imprima os serviços atendidos com sucesso sem interromper o painel
5. Exiba avisos no console para os módulos rejeitados

---

## Perguntas de Revisão: Conceitos e Estados

1. O que é o modelo assíncrono em JavaScript e por que ele é indispensável?
2. Quais são os 3 estados possíveis de uma Promise e como ocorrem as transições?
3. O que é a função executora de uma Promise e como ela é executada?
4. Para que serve o método moderno `Promise.withResolvers()` do ES2024?

---

## Perguntas de Revisão: Encadeamento e Ciclo de Vida

5. Como funciona o encadeamento (*chaining*) linear com o método `.then()`?
6. Qual é a vantagem de utilizar um único manipulador `.catch()` ao final da cadeia?
7. O que acontece com o retorno do método `.finally()` na cadeia de Promises?
8. O que é uma rejeição não tratada (*Unhandled Rejection*) e qual o seu risco?

---

## Perguntas de Revisão: Combinadores e Event Loop

9. Qual é a diferença fundamental entre `Promise.all()` e `Promise.allSettled()`?
10. Em que situações práticas é recomendado utilizar o combinador `Promise.any()`?
11. Qual é a prioridade da Fila de Microtarefas em relação às Macrotarefas?
12. Por que requisições feitas com `fetch()` não caem no `.catch()` em status 404?

---

## Síntese do Tópico

- **Contrato Assíncrono**: três estados com liquidação imutável
- **Encadeamento Limpo**: transformação contínua sem aninhamentos
- **Concorrência**: combinadores adaptados a cada nível de resiliência
- **Event Loop**: microtasks têm prioridade sobre temporizadores
