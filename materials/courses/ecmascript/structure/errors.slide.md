---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Tratamento de Erros"
description: "Slides completos da aula JavaScript: Tratamento de Erros."
---

<!-- _class: lead -->

# JavaScript: Tratamento de Erros

Hierarquia do objeto Error, tratamento com try/catch/finally, lançamento com throw e criação de erros customizados em JavaScript.

---

## Objetivo

- Compreender o ciclo de vida de exceções em JavaScript, aplicar o bloco `try...catch...finally` para evitar interrupções...

---

## Mapa da Aula

- O Bloco `try...catch...finally`
- Lançamento de Exceções (`throw`)
- Tipos de Erros Nativos em JavaScript
- Erros Personalizados (*Custom Errors*)
- Tratamento de Erros em Código Assíncrono
- Executando
- Próxima aula

---

## Introdução

- Esta aula apresenta os mecanismos para Tratamento de Erros e Gestão de Exceções em JavaScript
- como utilizar a estrutura `try...catch...finally`, disparar erros com `throw`, identificar exceções nativas (`TypeError`,...

---

## O Bloco `try...catch...finally`

- Quando ocorre um erro em tempo de execução (*runtime error*), o JavaScript interrompe imediatamente a execução do script...
- Para interceptar essas exceções e tratar a falha de forma graciosa sem encerrar o programa, utiliza-se a estrutura...

---

## Fluxo de Controle

- `try`: Contém o bloco de código sujeito a falhas (ex: operações de I/O, parsing de JSON, requisições de rede).
- `catch`: Intercepta o objeto de erro lançado e permite tomar medidas corretivas (ex: registrar logs, exibir mensagens...
- `finally`: Executado incondicionalmente ao término da operação. É ideal para tarefas de limpeza (*cleanup*), como fechar...

---

## Fluxo de Controle

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

## Exemplo: try...catch...finally

```js
function parseUserData(jsonString) {
console.log("Iniciando processamento...");

try {
 const user = JSON.parse(jsonString);
 console.log(`Usuário carregado: ${user.name}`);
 return user;
} catch (error) {
 console.error(`Falha ao ler JSON: ${error.message}`);
 return null;
} finally {
 console.log("Finalizando operação (limpeza de recursos).\n");
  // ...
// 1. Caso de Sucesso:
parseUserData('{"name": "Ana"}');

// 2. Caso de Erro de Sintaxe no JSON:
parseUserData('JSON_INVÁLIDO');
```

---

## Opcional: Catch sem Parâmetro (ES2019)

- A partir do ES2019, caso você não precise inspecionar os detalhes do objeto de erro, é possível omitir os parênteses do...

---

## Optional Catch Binding (ES2019)

```js
try {
performRiskyAction();
} catch {
console.log("Ação falhou, mas não precisamos dos detalhes do erro.");
}
```

---

## Lançamento de Exceções (`throw`)

- A instrução `throw` permite interromper o fluxo normal do programa e lançar uma exceção intencionalmente
- Em JavaScript, é possível lançar qualquer tipo de dado (strings, números, booleanos ou objetos), mas a boa prática padrão...

---

## O Objeto `Error` Nativo

- `.message`: A mensagem descritiva do erro.
- `.name`: O nome do tipo de erro (por padrão, `"Error"`).
- `.stack`: A pilha de chamadas (*stack trace*) que mostra em qual linha e arquivo a exceção foi gerada.
- `.cause` *(ES2022)*: Propriedade para encadear a causa raiz original do erro.

---

## Lançando erros com throw new Error()

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

try {
console.log(divide(10, 2)); // 5
divide(10, 0);             // Lança RangeError
} catch (error) {
console.log(`[${error.name}]: ${error.message}`);
}
```

---

## Encadeamento de Erro com `cause` (ES2022)

- Introduzida no ES2022, a opção `cause` permite encapsular um erro de baixo nível em um erro de alto nível com mais...

---

## Encadeamento de causa com cause (ES2022)

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
readConfigFile();
} catch (error) {
console.error(error.message); // "Falha ao carregar as configurações do sistema."
console.error("Causa raiz:", error.cause.message); // "Unexpected token 'J'..."
}
```

---

## Tipos de Erros Nativos em JavaScript

- O JavaScript possui um conjunto de subclasses nativas da classe base `Error`, cada uma representando uma categoria...

---

## Tipos de Erros Nativos em JavaScript: Comparação

| Tipo de Erro | Causa Comum | Exemplo de Código |
| :--- | :--- | :--- |
| **`TypeError`** | Operação executada em tipo incompatível ou acesso a `null`/`undefined`. | `"texto".push(1)` ou `null.prop` |
| **`ReferenceError`** | Acesso a uma variável que não foi declarada no escopo ou acessada na TDZ. | `console.log(naoDeclarado)` |
| **`SyntaxError`** | Código ferindo a gramática da linguagem ou JSON malformatado. | `JSON.parse("{ bad }")` |
| **`RangeError`** | Número ou argumento fora do intervalo numérico aceitável. | `new Array(-1)` ou estouro de pilha |
| **`URIError`** | Uso de caracteres inválidos nas funções `decodeURI()` ou `encodeURI()`. | `decodeURIComponent("%")` |
| **`AggregateError`** | Agrupa múltiplos erros em uma única exceção (ex: `Promise.any()`). | `Promise.any([p1_falsas])` |

---

## Exemplos de erros nativos

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

- Em aplicações de grande porte, é recomendável criar classes de erros customizadas herdando de `Error`
- Isso permite categorizar falhas de negócio (como erros de validação de formulário, autenticação ou banco de dados) e...

---

## Criando e identificando Erros Personalizados

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
 console.error(`[Não Encontrado]: ${error.message}`);
} else {
 console.error(`[Erro Inesperado]: ${error.message}`);
}
}
```

---

## Tratamento de Erros em Código Assíncrono

- O tratamento de erros em operações assíncronas varia de acordo com o padrão utilizado (Promises ou `async/await`)

---

## Tratamento com Promises (`.catch()`)

- Nas Promises, exceções lançadas ou rejeições ocorridas dentro da cadeia assíncrona são capturadas pelo método `.catch()`:

---

## Tratamento de erro em Promises

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

## Tratamento com `async/await` (`try...catch`)

- Funções declaradas com `async` permitem utilizar a sintaxe tradicional `try...catch` para capturar exceções de Promises...

---

## Tratamento de erro com async/await

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

## Executando

- Crie um arquivo chamado `error-demo.js`:
- Execute o arquivo com Node.js no terminal:

---

## error-demo.js

```js
class AppError extends Error {
  constructor(msg, code) {
    super(msg);
    this.name = "AppError";
    this.code = code;
  }
}

function processOrder(amount) {
  if (amount <= 0) {
    throw new AppError("O valor do pedido deve ser maior que zero.", "INVALID_AMOUNT");
  }
  // ...
    console.error("Erro desconhecido:", err);
  }
} finally {
  console.log("Processamento de pedidos concluído.");
}
```

---

## Terminal

```bash
node error-demo.js
```

---

## Output

```txt
Pedido de R$ 150.00 processado com sucesso!
[INVALID_AMOUNT]: O valor do pedido deve ser maior que zero.
Processamento de pedidos concluído.
```

---

## Bloco try...catch...finally

- O que acontece se uma exceção for lançada dentro do bloco `try` e não houver um bloco `catch` correspondente
- O bloco `finally` é executado se houver uma instrução `return` dentro do bloco `try`

---

## Tipos de Erro e Exceções Customizadas

- Qual é a diferença essencial entre `TypeError` e `ReferenceError`
- Para que serve a propriedade `cause` ao instanciar `new Error(message, )` no ES2022
- Como podemos identificar e tratar diferentes tipos de erros em um único bloco `catch`

---

## Próxima aula

- Módulos ES (ESM)
- Sistemas de módulos, ES Modules (import/export), CommonJS e dynamic imports

---

## Resumo da Aula

- Revise o Bloco `try...catch...finally`
- Revise lançamento de Exceções (`throw`)
- Revise tipos de Erros Nativos em JavaScript
- Revise erros Personalizados (*Custom Errors*)
- Revise tratamento de Erros em Código Assíncrono
- Revise executando
- Revise próxima aula
