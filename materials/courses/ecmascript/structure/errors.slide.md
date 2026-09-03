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
    padding-bottom: 0;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "JavaScript: Tratamento de Erros"
description: "Hierarquia do objeto Error, tratamento com try/catch/finally, lançamento com throw e criação de erros customizados em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Tratamento de Erros

Estrutura `try...catch...finally`, `throw`, tipos de erro nativos, `cause` e erros customizados.

---

## Objetivo

Compreender o ciclo de vida de exceções e implementar tolerância a falhas em JavaScript.

- Interceptar exceções em tempo de execução com **`try...catch...finally`**.
- Lançar erros estruturados intencionalmente utilizando **`throw`**.
- Preservar diagnósticos de causa raiz com a opção **`cause` (ES2022)**.
- Reconhecer os principais tipos nativos (**`TypeError`**, **`ReferenceError`**, **`SyntaxError`**, **`RangeError`**).
- Criar e identificar **erros customizados** com classes e **`instanceof`**.
- Tratar falhas em fluxos assíncronos com **Promises (`.catch`)** e **`async/await`**.

---

## Mapa do Tópico

- Ciclo de Vida de Exceções e `try...catch...finally`
- Garantia de Execução do `finally` e Optional Catch
- Lançamento com `throw` e o Objeto `Error`
- Encadeamento de Diagnóstico com `cause`
- Hierarquia de Erros Nativos do JavaScript
- Criação de Classes de Erros Customizados
- Tratamento em Código Assíncrono (Promises e `async/await`)
- Execução, Exercício, Desafio e Revisão

---

## O Bloco `try...catch...finally`

Controla a execução e impede a interrupção abrupta da aplicação:

```js
try {
  // Bloco monitorado sujeito a falhas (I/O, parsing, rede)
} catch (error) {
  // Executado SOMENTE se ocorrer exceção no try
} finally {
  // Executado SEMPRE ao término (sucesso ou falha)
}
```

- **`try`**: isola o código de risco.
- **`catch`**: intercepta o erro para log ou recuperação amigável.
- **`finally`**: executa tarefas incondicionais de limpeza (*cleanup*).

---

## Exemplo: Parsing Seguro com `try/catch`

```js
function parseUserData(jsonString) {
  try {
    const user = JSON.parse(jsonString);
    console.log(`Usuário: ${user.name}`);
    return user;
  } catch (error) {
    console.error(`Falha: ${error.message}`);
    return null;
  } finally {
    console.log("Limpeza de recursos finalizada.");
  }
}

parseUserData('{"name": "Ana"}'); // "Usuário: Ana" -> "Limpeza..."
parseUserData("JSON_INVALIDO");    // "Falha: Unexpected token..." -> "Limpeza..."
```

---

## Garantia do Bloco `finally`

O bloco `finally` **sempre executa**, mesmo quando há `return` dentro do `try` ou `catch`:

```js
function checkConnection() {
  try {
    console.log("Conectando ao banco...");
    return "OK";
  } finally {
    console.log("Fechando conexão (cleanup garantido)!");
  }
}

const status = checkConnection();
console.log(`Retorno recebido: ${status}`);
```

```txt
Conectando ao banco...
Fechando conexão (cleanup garantido)!
Retorno recebido: OK
```

---

## Optional Catch Binding (ES2019)

Quando os detalhes do erro não são necessários, o parâmetro do `catch` pode ser omitido:

```js
function isValidJSON(text) {
  try {
    JSON.parse(text);
    return true;
  } catch {
    // Parâmetro (error) omitido intencionalmente
    return false;
  }
}

console.log(isValidJSON('{"a": 1}')); // true
console.log(isValidJSON("invalido")); // false
```

---

## Lançamento de Exceções (`throw`)

A instrução **`throw`** interrompe o fluxo normal e dispara uma exceção:

```js
function divide(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError("Ambos os argumentos devem ser números.");
  }
  if (b === 0) {
    throw new RangeError("Divisão por zero não permitida.");
  }
  return a / b;
}

try {
  console.log(divide(10, 2)); // 5
  divide(10, 0);              // Dispara RangeError
} catch (err) {
  console.log(`[${err.name}]: ${err.message}`); // "[RangeError]: Divisão por zero..."
}
```

---

## O Objeto `Error` e Encadeamento com `cause`

O `Error` captura a mensagem, o nome e o rastreamento da pilha (*stack trace*):

```js
function loadSettings(rawContent) {
  try {
    return JSON.parse(rawContent);
  } catch (originalError) {
    // ES2022: Encapsula o erro raiz através da propriedade cause
    throw new Error("Falha ao inicializar configurações.", {
      cause: originalError,
    });
  }
}

try {
  loadSettings("TEXTO_INVALIDO");
} catch (err) {
  console.error(err.message);        // "Falha ao inicializar configurações."
  console.error(err.cause.message);  // "Unexpected token 'T'..."
}
```

---

## Tipos de Erro Nativos do JavaScript

| Tipo | Causa Comum | Exemplo |
| :--- | :--- | :--- |
| **`TypeError`** | Operação em tipo incompatível ou leitura em `null`/`undefined`. | `"txt".push(1)` |
| **`ReferenceError`** | Acesso a identificador não declarado ou em TDZ. | `console.log(x)` |
| **`SyntaxError`** | Sintaxe inválida da linguagem ou JSON malformatado. | `JSON.parse("{")` |
| **`RangeError`** | Valor numérico fora dos limites válidos. | `(42).toFixed(200)` |
| **`URIError`** | Sequência inválida em `decodeURI()` ou `encodeURI()`. | `decodeURIComponent("%")` |

---

## Identificação com `instanceof`

```js
try {
  const value = null;
  value.calculate(); // Dispara TypeError
} catch (err) {
  if (err instanceof TypeError) {
    console.log("Erro de Tipo detectado!"); // "Erro de Tipo detectado!"
  } else if (err instanceof ReferenceError) {
    console.log("Erro de Referência!");
  } else {
    console.log("Outro erro:", err.message);
  }
}
```

- O operador `instanceof` permite roteamento granular de erros no bloco `catch`.

---

## Erros Customizados (Classes com `extends Error`)

Permitem modelar regras de negócio e falhas de domínio específicas:

```js
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

function validateEmail(email) {
  if (!email || !email.includes("@")) {
    throw new ValidationError("E-mail corporativo inválido.", "email");
  }
  return true;
}

try {
  validateEmail("contatodevlab.org");
} catch (err) {
  console.log(`[${err.name}] Campo '${err.field}': ${err.message}`);
  // "[ValidationError] Campo 'email': E-mail corporativo inválido."
}
```

---

## Tratamento de Erros Assíncronos

**1. Promises com `.catch()`:**

```js
function fetchHost(id) {
  return id > 0 ? Promise.resolve({ id, ip: "10.0.0.1" }) : Promise.reject(new Error("ID inválido"));
}

fetchHost(-1)
  .then((data) => console.log(data))
  .catch((err) => console.error(`[Catch]: ${err.message}`)) // "[Catch]: ID inválido"
  .finally(() => console.log("Finalizado."));              // "Finalizado."
```

**2. `async/await` com `try...catch`:**

```js
async function loadHost() {
  try {
    const host = await fetchHost(-1);
    console.log(host);
  } catch (err) {
    console.error(`[Async Error]: ${err.message}`); // "[Async Error]: ID inválido"
  }
}
loadHost();
```

---

## Exercício Prático: Leitor Seguro de JSON

Crie a função `parseJSONSafe(jsonString, fallback = {})`:

1. Utilize `try` para converter `jsonString` com `JSON.parse()`.
2. No `catch`, registre o erro com `console.error` e retorne o `fallback`.
3. Adicione `finally` exibindo `"Tentativa de parsing concluída."`.
4. Teste com `'{"status":"ok"}'` e com `'{ bad }'`.

---

## Solução do Exercício

```js
function parseJSONSafe(jsonString, fallback = {}) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(`[Erro no JSON]: ${error.message}`);
    return fallback;
  } finally {
    console.log("Tentativa de parsing concluída.");
  }
}

console.log(parseJSONSafe('{"status":"ok"}'));
// Tentativa de parsing concluída.
// { status: 'ok' }

console.log(parseJSONSafe('{ bad }', { status: "fallback" }));
// [Erro no JSON]: Unexpected token 'b'...
// Tentativa de parsing concluída.
// { status: 'fallback' }
```

---

## Desafio: Saque Bancário Granular

1. Crie a classe `InsufficientFundsError` herdando de `Error` com `balance` e `amount`.
2. Crie `BankAccount` com método `withdraw(amount)`.
3. Lance `TypeError` para `amount <= 0` e `InsufficientFundsError` se `amount > balance`.
4. Trate os erros com `try/catch` usando `instanceof`.

---

## Solução do Desafio

```js
class InsufficientFundsError extends Error {
  constructor(balance, amount) {
    super(`Saldo insuficiente: disp R$ ${balance}, pedido R$ ${amount}`);
    this.name = "InsufficientFundsError";
    this.balance = balance;
    this.amount = amount;
  }
}

class BankAccount {
  constructor(balance) { this.balance = balance; }
  withdraw(amount) {
    if (typeof amount !== "number" || amount <= 0) {
      throw new TypeError("Valor de saque inválido.");
    }
    if (amount > this.balance) {
      throw new InsufficientFundsError(this.balance, amount);
    }
    return (this.balance -= amount);
  }
}
```

---

## Execução da Solução do Desafio

```js
const account = new BankAccount(200);

try {
  account.withdraw(300);
} catch (error) {
  if (error instanceof InsufficientFundsError) {
    console.error(`[Recusado]: ${error.message}`);
    // "[Recusado]: Saldo insuficiente: disp R$ 200, pedido R$ 300"
  } else if (error instanceof TypeError) {
    console.error(`[Tipo]: ${error.message}`);
  }
} finally {
  console.log(`Saldo final: R$ ${account.balance}`);
  // "Saldo final: R$ 200"
}
```

---

## Perguntas de Revisão

- O que acontece se uma exceção lançada no `try` não encontrar bloco `catch`?
- O bloco `finally` roda se o bloco `try` executar uma instrução `return`?
- Qual a diferença essencial entre `TypeError` e `ReferenceError`?
- Para que serve a propriedade `cause` ao instanciar `new Error(msg, { cause })`?
- Por que devemos estender a classe `Error` ao criar erros customizados?
- Como o operador `instanceof` ajuda no tratamento seletivo de falhas?
- Como o tratamento de exceções se integra a funções assíncronas (`async/await`)?

---

## Resumo e Boas Práticas

- **Prevenção de Falhas**: `try...catch...finally` intercepta erros sem quebrar a execução.
- **Limpeza Garantida**: `finally` sempre executa, mesmo após `return` antecipado.
- **Lançamento Estruturado**: dispare instâncias de `Error` com `throw`.
- **Causa Raiz**: utilize `{ cause: err }` no ES2022 para rastreabilidade de diagnósticos.
- **Erros Nativos**: identifique `TypeError`, `ReferenceError`, `SyntaxError` e `RangeError`.
- **Custom Errors**: estenda `Error` e filtre no `catch` via `instanceof`.
- **Assincronismo**: use `.catch()` em Promises ou envolva chamadas `await` com `try/catch`.
