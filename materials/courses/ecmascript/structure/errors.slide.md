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
description: "Tratamento de exceções com try/catch/finally, tipos nativos de erros, erros customizados e stack traces."
---

<!-- _class: lead -->

# JavaScript: Tratamento de Erros

Mecanismos de exceção (`try/catch/finally`), tipos nativos de erro, criação de erros customizados e depuração.

---

## Objetivos da Aula

- **Sintaxe**: Dominar a estrutura `try...catch...finally` para tratamento de exceções.
- **Tipos Nativos**: Identificar `TypeError`, `ReferenceError`, `SyntaxError` e `RangeError`.
- **Customização**: Estender a classe `Error` nativa para criar exceções de domínio.
- **Encadeamento**: Utilizar a propriedade `cause` para encadear erros em chamadas assíncronas.

---

## Estrutura `try...catch...finally`

O bloco `try` isola a execução de código suscetível a erros; o `catch` captura e trata a exceção; o `finally` sempre executa:

```javascript
function parseData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    return data;
  } catch (error) {
    console.error("Erro ao converter JSON:", error.message);
    return null;
  } finally {
    console.log("Limpeza de recursos / Finalização");
  }
}
```

---

## Tipos Nativos de Erro em JavaScript

| Tipo de Erro | Causa Principal | Exemplo de Código |
| :--- | :--- | :--- |
| **`ReferenceError`** | Acesso a variável inexistente ou na TDZ | `console.log(x);` |
| **`TypeError`** | Operação em tipo incompatível ou valor nulo | `null.toUpperCase();` |
| **`SyntaxError`** | Sintaxe inválida no código ou JSON.parse | `JSON.parse("{invalid}");` |
| **`RangeError`** | Valor numérico fora do intervalo permitido | `new Array(-1);` |
| **`URIError`** | Uso incorreto de `decodeURIComponent()` | `decodeURIComponent("%");` |

---

## Criando Erros Customizados

Em aplicações profissionais (ex: APIs), é ideal criar erros customizados estendendo a classe base `Error`:

```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
    this.statusCode = 400;
  }
}

// Lançando o erro customizado:
function validateEmail(email) {
  if (!email.includes("@")) {
    throw new ValidationError("E-mail inválido", "email");
  }
}
```

---

## Encadeamento de Erros (Error Cause - ES2022)

Permite encapsular uma exceção de baixo nível mantendo o contexto original através da propriedade `cause`:

```javascript
async function fetchUser(id) {
  try {
    await database.connect();
  } catch (err) {
    // Relança um erro de alto nível preservando a causa raiz!
    throw new Error(`Falha ao obter usuário ${id}`, { cause: err });
  }
}

// Captura e inspeção:
try {
  await fetchUser(42);
} catch (error) {
  console.log(error.message); // "Falha ao obter usuário 42"
  console.log(error.cause);   // Erro de conexão original do banco!
}
```

---

## Boas Práticas no Tratamento de Erros

1. **Nunca Silencie Erros**: Blocos `catch(e) {}` vazios escondem bugs críticos e dificultam o debug.
2. **Lance Objetos da Classe Error**: Evite fazer `throw "string"`; lance sempre instâncias de `Error` para garantir `stack trace`.
3. **Valide Entradas Antecipadamente**: Use guard clauses para checar parâmetros nulos ou inválidos antes de executar a lógica principal.
4. **Trate Rejeições Assíncronas**: Em `async/await`, sempre envolva chamadas externas em `try...catch`.

---

## Resumo & Revisão

- Use `try...catch` para interceptar e recuperar a aplicação de exceções.
- `finally` é executado incondicionalmente, ideal para fechar conexões e liberar recursos.
- Crie classes estendendo `Error` para diferenciar falhas de validação, autenticação ou banco de dados.
- O recurso `{ cause: err }` preserva a rastreabilidade da pilha de erros (*Stack Trace*).

---

## Referências & Links Úteis

- **MDN**: [Tratamento de Exceções](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Control_flow_and_error_handling#exce%C3%A7%C3%B5es_do_javascript)
- **MDN**: [Classe Error](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Error)
