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
title: "JavaScript: Async/Await"
description: "Slides completos do tópico JavaScript: Async/Await."
---

<!-- _class: lead -->

# JavaScript: Async/Await

Sintaxe async/await como camada sobre Promises, tratamento de erros com try...catch...finally, concorrência sequencial vs. paralela, Top-Level Await e integração no Express 5.

---

## Objetivo

Dominar o fluxo assíncrono moderno com `async` e `await`:

- Compreender o papel de `async/await` como camada sintática sobre Promises
- Tratar erros defensivamente e evitar a armadilha do `return await` em `try/catch`
- Eliminar gargalos sequenciais com chamadas paralelas via `Promise.all()`
- Utilizar *Top-Level Await* em módulos ES e iteração com `for await...of`
- Integrar controllers assíncronos no Express 5 com tratamento automático de erros

---

## Mapa do Tópico

- O que é Async/Await? (Açúcar Sintático)
- Declaração e Coerção de Funções Async
- Tratamento de Erros e a Armadilha do `return await`
- Execução Sequencial vs. Paralela
- Iteração Assíncrona e Top-Level Await
- Controllers Assíncronos no Express 5
- Resumo e Boas Práticas

---

## O que é Async/Await?

- Introduzidas no ES2017 (ES8) para simplificar o consumo de Promises
- Não substituem as Promises: operam **sobre as Promises**
- Oferecem estrutura sequencial e leitura idêntica à do código síncrono
- O `await` suspende a função localmente sem bloquear o Event Loop

---

## Papel das Palavras-Chave

| Palavra-Chave | Onde é Aplicada? | Efeito / Comportamento |
| ------------- | ---------------- | ---------------------- |
| **`async`** | Antes da declaração de funções | Força a função a **retornar uma Promise** |
| **`await`** | Antes de chamadas assíncronas | **Pausa a execução local** até a Promise liquidar |

*Nota: O operador `await` só pode ser usado dentro de funções `async` ou em Top-Level Await.*

---

## Comparação de Sintaxe: Promises versus Async/Await

```js
// 1. Consumo com .then() encadeado
function fetchUserThen(id) {
  return fetch(`https://api.devlab.org/users/${id}`)
    .then((res) => res.json())
    .then((user) => console.log(user))
    .catch((err) => console.error(err.message));
}

// 2. Consumo idêntico com async/await
async function fetchUserAsync(id) {
  try {
    const res = await fetch(`https://api.devlab.org/users/${id}`);
    const user = await res.json();
    console.log(user);
  } catch (err) {
    console.error(err.message);
  }
}
```

---

## Formas de Declaração de Funções Async

Válido em todas as declarações de funções em JavaScript:

```js
// 1. Função tradicional
async function getData() {
  return "Dados carregados";
}

// 2. Arrow function assíncrona
const getCategories = async () => ["Web", "Node", "React"];

// 3. Método em objeto ou classe
const apiService = {
  async fetchStatus() {
    return { status: "OK", uptime: 99.9 };
  },
};
```

---

## Coerção Automática de Retornos e Erros

- `return valor` é automaticamente convertido em `Promise.resolve(valor)`
- `throw erro` é automaticamente convertido em `Promise.reject(erro)`

```js
async function checkNumber(num) {
  if (num < 0) throw new Error("Número negativo"); // Vira Promise.reject
  return num * 2; // Vira Promise.resolve
}

checkNumber(5).then(console.log); // 10
checkNumber(-1).catch((e) => console.error(e.message)); // "Número negativo"
```

---

## Tratamento de Erros com try...catch...finally

Reúne o tratamento de falhas assíncronas e exceções síncronas na mesma estrutura:

```js
async function loadUserProfile(userId) {
  try {
    const response = await fetch(`https://api.devlab.org/users/${userId}`);

    // Validação indispensável de status HTTP
    if (!response.ok) {
      throw new Error(`Status ${response.status}: ${response.statusText}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Falha ao carregar perfil:", error.message);
    return null; // Fallback seguro
  } finally {
    console.log("Busca encerrada.");
  }
}
```

---

## Armadilha: return versus return await em try/catch

- `return promise` sem `await` sai do bloco `try` antes da resolução!
- Se a Promise for rejeitada depois, **ela escapa do catch local**:

```js
// ARMADILHA: a rejeição NÃO é capturada pelo catch local!
async function riskyHandler() {
  try {
    return fetchData(); // Sai do try imediatamente com a Promise pendente
  } catch (err) {
    console.error("Catch local:", err); // NUNCA É EXECUTADO!
  }
}

// FORMA CORRETA: aguarda dentro do escopo protegido
async function safeHandler() {
  try {
    return await fetchData(); // Aguarda: se falhar, pula para o catch local!
  } catch (err) {
    console.error("Catch local capturou:", err.message); // Executa com sucesso!
  }
}
```

---

## O Gargalo da Execução Sequencial

Atenção: Encadeamento cego de `await` para tarefas independentes soma latências:

```js
function delay(ms, val) {
  return new Promise((res) => setTimeout(() => res(val), ms));
}

async function loadSequentially() {
  console.time("Sequencial");

  // A busca dos posts só começa depois de 2 segundos!
  const users = await delay(2000, ["Ana", "Bruno"]);
  const posts = await delay(2000, ["Post 1", "Post 2"]);

  console.timeEnd("Sequencial"); // ~4000ms (2s + 2s)
  return { users, posts };
}
```

---

## A Solução Concorrente com Promise.all()

Dispare chamadas independentes simultaneamente e aguarde o conjunto:

```js
async function loadInParallel() {
  console.time("Paralelo");

  // Disparo simultâneo (sem await no início)
  const usersPromise = delay(2000, ["Ana", "Bruno"]);
  const postsPromise = delay(2000, ["Post 1", "Post 2"]);

  // Aguarda a resolução conjunta
  const [users, posts] = await Promise.all([usersPromise, postsPromise]);

  console.timeEnd("Paralelo"); // ~2000ms (tempo da mais demorada)
  return { users, posts };
}
```

---

## Comparativo: Sequencial versus Paralelo

| Abordagem | Funcionamento | Tempo Total | Indicação |
| --------- | ------------- | ----------- | --------- |
| **Sequencial** | `await` após `await` | Soma de todos ($\sum t$) | 2ª chamada depende da 1ª |
| **Paralela** | Dispara tudo + `Promise.all` | Máximo dos tempos ($\max t$) | Tarefas independentes |

---

## Armadilha: await dentro de laços forEach

- O callback do método `.forEach()` **não aguarda o retorno de Promises**
- O laço finaliza antes que as operações assíncronas sejam concluídas
- **Solução canônica**: Utilize `array.map()` com `Promise.all()`:

```js
// INCORRETO: forEach não espera as Promises terminarem
ids.forEach(async (id) => { await fetchUser(id); });

// CORRETO: mapeia para Promises e aguarda todas em paralelo
const users = await Promise.all(ids.map((id) => fetchUser(id)));
```

---

## Iteração Assíncrona com for await...of

Permite iterar sobre fluxos contínuos de dados assíncronos (*AsyncIterables*):

```js
async function* generateData() {
  yield await delay(200, "Chunk 1");
  yield await delay(200, "Chunk 2");
  yield await delay(200, "Chunk 3");
}

async function processStream() {
  // O laço aguarda a chegada sequencial de cada pedaço
  for await (const chunk of generateData()) {
    console.log("Processado:", chunk);
  }
}
```

---

## Top-Level Await em Módulos ES

Permite utilizar `await` na raiz do arquivo sem função envoltória em Módulos ES:

```js
// database.js (Módulo ES com "type": "module")
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Aguarda a conexão antes de exportar
await prisma.$connect();
console.log("Banco de dados pronto para tráfego.");

export default prisma;
```

---

## Controllers Assíncronos no Express 5

A partir do **Express 5**, rejeições em rotas `async` são capturadas automaticamente pelo middleware global de erros:

```js
// src/controllers/user-controller.js
import prisma from "../database.js";

export async function index(req, res) {
  // Se findMany() rejeitar, o Express 5 encaminha direto para o error middleware
  const users = await prisma.user.findMany();
  res.json(users);
}

export async function show(req, res) {
  const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
  if (!user) return res.status(404).json({ error: "Não encontrado" });
  res.json(user);
}
```

---

## Resumo e Boas Práticas

| Prática Recomendada | Motivo Técnico |
| ------------------- | -------------- |
| **Usar `await Promise.all()`** | Evita gargalos sequenciais em tarefas independentes |
| **Usar `return await` em `try/catch`** | Garante que o erro seja capturado pelo `catch` local |
| **Validar `response.ok` no fetch** | Respostas 404 e 500 não lançam erro sozinhas |
| **Evitar `await` em `.forEach()`** | O laço encerra sem aguardar a conclusão dos callbacks |
| **Aproveitar o Express 5** | Elimina blocos `try/catch` manuais repetitivos em rotas |

---

## Resumo Prático Consolidado

```js
async function loadDashboard(userId) {
  try {
    const userP = fetch(`/api/users/${userId}`).then((r) => r.json());
    const configP = fetch("/api/config").then((r) => r.json());

    // Disparo concorrente das buscas
    const [user, config] = await Promise.all([userP, configP]);
    return { user, config };

  } catch (err) {
    console.error("Falha ao carregar dashboard:", err.message);
    throw err;
  }
}
```

---

## Executando: Demonstração no Terminal

1. Crie o arquivo `async-demo.js`:
```js
async function getUser() {
  return "Ana Silva";
}
console.log(await getUser());
```
2. Execute no terminal:
```bash
$ node async-demo.js
Ana Silva
```

---

## Exercício Prático: Busca Concorrente

Crie o arquivo `async-exercise.js`:

1. Escreva uma função `fetchUserProfiles(userIds)` recebendo array de IDs
2. Dispare requisições para `https://jsonplaceholder.typicode.com/users/${id}`
3. Execute todas as buscas em paralelo utilizando `.map()` com `Promise.all()`
4. Valide `response.ok` em cada chamada
5. Capture erros com `try/catch` e imprima nomes e cidades dos usuários

---

## Desafio: Auditoria de Microsserviços

Crie o arquivo `api-aggregator.js`:

1. Crie 3 funções assíncronas: `checkDatabase()`, `checkCache()`, `checkAuthService()`
2. Simule uma rejeição de timeout em `checkAuthService()`
3. Dispare as 3 checagens simultaneamente com `Promise.allSettled()`
4. Imprima os serviços online e alerte sobre os serviços em falha
5. Utilize `finally` para registrar o carimbo de data/hora final da auditoria

---

## Perguntas de Revisão: Declaração e Funcionamento

1. O que são as palavras-chave `async` e `await` e qual a sua relação com Promises?
2. O que acontece com o retorno de uma função `async` que dispara um `throw`?
3. O que é *Top-Level Await* e onde ele pode ser utilizado legitimamente?
4. O operador `await` pode ser utilizado antes de valores que não são Promises?

---

## Perguntas de Revisão: Tratamento de Erros e Armadilhas

5. Por que a instrução `return promise` em `try/catch` pode gerar bugs graves?
6. Por que `fetch()` não entra no bloco `catch` em status HTTP 404 ou 500?
7. Para que serve o bloco `finally` em uma estrutura assíncrona?
8. Por que nunca devemos colocar `await` dentro do callback de um `.forEach()`?

---

## Perguntas de Revisão: Desempenho e Aplicações

9. O que é o gargalo da execução sequencial e como evitá-lo com `Promise.all()`?
10. Como disparar requisições em paralelo a partir de um array dinâmico?
11. Qual é a vantagem de utilizar controllers `async` no Express 5?
12. O que é o laço `for await...of` e quando ele deve ser empregado?

---

## Síntese do Tópico

- **Sintaxe Linear**: código assíncrono com a clareza e estrutura do síncrono
- **Segurança com try/catch**: use `return await` para capturar falhas locais
- **Concorrência Eficiente**: `Promise.all()` para tarefas independentes
- **Modernização**: compatibilidade nativa com Express 5 e módulos ES
