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
title: "JavaScript: Tratamento de Erros"
description: "Hierarquia do objeto Error, tratamento com try/catch/finally, lançamento com throw e criação de erros customizados em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Tratamento de Erros

Hierarquia do objeto Error, tratamento com try/catch/finally, lançamento com throw e criação de erros customizados em JavaScript.

---

## Objetivo

- Compreender o ciclo de vida de exceções em JavaScript.
- Aplicar `try`, `catch` e `finally` no tratamento de falhas.
- Lançar erros com `throw` e escolher tipos nativos adequados.
- Criar erros customizados quando o domínio da aplicação exigir.

---

## Mapa da Aula

- O Bloco `try...catch...finally`
- Lançamento de Exceções (`throw`)
- Tipos de Erros Nativos em JavaScript
- Erros Personalizados (*Custom Errors*)
- Tratamento de Erros em Código Assíncrono

---

## O Bloco `try...catch...finally`

- Para interceptar essas exceções e tratar a falha de forma graciosa sem encerrar o programa.

---

## Fluxo de Controle

- `try`: Contém o bloco de código sujeito a falhas (ex: operações de I/O, parsing de JSON, requisições de rede).
- `catch`: Intercepta o objeto de erro lançado e permite tomar medidas corretivas (ex: registrar logs.
- `finally`: Executado incondicionalmente ao término da operação. É ideal para tarefas de limpeza (cleanup).
- O bloco a seguir mostra a estrutura completa e a ordem em que cada parte é executada
- O bloco `finally` é executado mesmo se houver uma instrução `return` dentro dos blocos `try` ou `catch`.

---

## Fluxo de Controle (Exemplo)

```js
try {
  // Código protegido que pode lançar uma exceção
} catch (error) {
  // Bloco executado SOMENTE se ocorrer um erro no bloco try
} finally {
  // Bloco executado SEMPRE, independentemente de ter ocorrido erro ou não
}
```

---

## Opcional: Catch sem Parâmetro (ES2019)

- A partir do ES2019, caso você não precise inspecionar os detalhes do objeto de erro.

---

## Opcional: Catch sem Parâmetro (ES2019) (Exemplo)

```js
try {
  performRiskyAction();
} catch {
  console.log("Ação falhou, mas não precisamos dos detalhes do erro.");
}
```

---

## Lançamento de Exceções (`throw`)

- A instrução `throw` permite interromper o fluxo normal do programa e lançar uma exceção intencionalmente.
- Em JavaScript, é possível lançar qualquer tipo de dado (strings, números, booleanos ou objetos).

---

## O Objeto `Error` Nativo

- `.message`: A mensagem descritiva do erro.
- `.name`: O nome do tipo de erro (por padrão, `"Error"`).
- `.stack`: A pilha de chamadas (stack trace) que mostra em qual linha e arquivo a exceção foi gerada.
- `.cause` (ES2022): Propriedade para encadear a causa raiz original do erro.

---

## O Objeto `Error` Nativo (Exemplo)

```js
function divide(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError("Ambos os argumentos devem ser números.");
  }

  if (b === 0) {
    throw new RangeError("Divisão por zero não é permitida.");
  }

  return a / b;
}

// ...
```

---

## Encadeamento de Erro com `cause` (ES2022)

- Introduzida no ES2022, a opção `cause` permite encapsular um erro de baixo nível em um erro de alto nível com mais contexto.

---

## Encadeamento de Erro com `cause` (ES2022) (Exemplo)

```js
function readConfigFile() {
  try {
    JSON.parse("JSON_CORRUPTO");
  } catch (originalError) {
    // Encapsula o erro original na propriedade 'cause'
    throw new Error("Falha ao carregar as configurações do sistema.", {
      cause: originalError,
    });
  }
}

try {
// ...
```

---

## Tipos de Erros Nativos em JavaScript

- O JavaScript possui um conjunto de subclasses nativas da classe base `Error`, cada uma representando uma categoria específica de falha

---

## Tipos de Erros Nativos em JavaScript (Comparação)

| Tipo de Erro | Causa Comum | Exemplo de Código |
| :--- | :--- | :--- |
| **`TypeError`** | Operação executada em tipo incompatível ou acesso a `null`/`undefined`. | `"texto".push(1)` ou `null.prop` |
| **`ReferenceError`** | Acesso a uma variável que não foi declarada no escopo ou acessada na TDZ. | `console.log(naoDeclarado)` |
| **`SyntaxError`** | Código ferindo a gramática da linguagem ou JSON malformatado. | `JSON.parse("{ bad }")` |
| **`RangeError`** | Número ou argumento fora do intervalo numérico aceitável. | `new Array(-1)` ou estouro de pilha |
| **`URIError`** | Uso de caracteres inválidos nas funções `decodeURI()` ou `encodeURI()`. | `decodeURIComponent("%")` |

---

## Tipos de Erros Nativos em JavaScript (Exemplo)

```js
// 1. TypeError
try {
  const num = 42;
  num.toUpperCase(); // Método de String chamado em Number
} catch (err) {
  console.log(err instanceof TypeError); // true
}

// 2. ReferenceError
try {
  console.log(nonExistentVar);
} catch (err) {
  console.log(err instanceof ReferenceError); // true
}
```

---

## Erros Personalizados (*Custom Errors*)

- Em aplicações de grande porte, é recomendável criar classes de erros customizadas herdando de `Error`.
- Isso permite categorizar falhas de negócio (como erros de validação de formulário.

---

## Erros Personalizados (*Custom Errors*) (Exemplo)

```js
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
// ...
```

---

## Tratamento de Erros em Código Assíncrono

- O tratamento de erros em operações assíncronas varia de acordo com o padrão utilizado (Promises ou `async/await`).

---

## 1. Tratamento com Promises (`.catch()`)

- Nas Promises, exceções lançadas ou rejeições ocorridas dentro da cadeia assíncrona são capturadas pelo método `.catch()`

---

## 1. Tratamento com Promises (`.catch()`) (Exemplo)

```js
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    if (id <= 0) {
      reject(new Error("ID de usuário inválido."));
    } else {
      resolve({ id, name: "Lucas" });
    }
  });
}

fetchUser(-1)
  .then((user) => console.log(user))
  .catch((error) => console.error(`[Promise Error]: ${error.message}`))
  .finally(() => console.log("Operação de busca encerrada."));
```

---

## 2. Tratamento com `async/await` (`try...catch`)

- Funções `async` permitem tratar falhas de `await` com `try...catch`.
- O código fica mais próximo do fluxo síncrono, mas continua retornando uma Promise.

---

## 2. Tratamento com `async/await` (`try...catch`) (Exemplo)

```js
async function loadData() {
  try {
    const user = await fetchUser(-1);
    console.log(user);
  } catch (error) {
    console.error(`[Async/Await Error]: ${error.message}`);
  } finally {
    console.log("Finalizado.");
  }
}

loadData();
```

---

## Bloco try...catch...finally

- O que acontece se uma exceção for lançada dentro do bloco `try` e não houver um bloco `catch` correspondente?
- O erro não será tratado no escopo atual e continuará propagando (bubbling) para os blocos externos da pilha de chamadas.
- O bloco `finally` é executado se houver uma instrução `return` dentro do bloco `try`?
- O bloco `finally` sempre é executado antes que o controle de execução seja devolvido ao chamador da função.

---

## Tipos de Erro e Exceções Customizadas

- Qual é a diferença essencial entre `TypeError` e `ReferenceError`?
- O `ReferenceError` ocorre ao tentar utilizar uma variável ou identificador que não existe no escopo atual.
- Para que serve a propriedade `cause` ao instanciar `new Error(message, { cause })` no ES2022?
- A propriedade `cause` serve para armazenar o erro original de baixo nível que provocou a falha atual.
- Como podemos identificar e tratar diferentes tipos de erros em um único bloco `catch`?

---

## Executando

- Crie um arquivo chamado `error-demo.js`
- Execute o arquivo com Node.js no terminal
- Os conceitos de `try...catch`, `throw` e erros customizados podem ser executados com Node.js no seu terminal.

---

## Resumo da Aula

- **try / catch / finally**: `try` isola código arriscado, `catch` trata a exceção e `finally` executa sempre para limpeza de recursos.
- **Erros Nativos**: `TypeError` (operação em tipo/valor inválido), `ReferenceError` (variável inexistente/TDZ), `SyntaxError`, `RangeError`.
- **Erros Customizados**: Estender a classe `Error` nativa (`class AppError extends Error`) para criar exceções semânticas de domínio.
- **Error Cause (ES2022)**: Relançar erros de alto nível preservando a causa original com `new Error("msg", { cause: err })`.
- **Boas Práticas**: Nunca silenciar erros em blocos vazios; lançar sempre instâncias de `Error` com Stack Trace; tratar rejeições assíncronas.
