---
title: 'JavaScript: Tratamento de Erros'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Tratamento de Erros

## Objetivo
- Compreender o ciclo de vida de exceções em JavaScript.
- Aplicar `try`, `catch` e `finally` para tratar falhas.
- Lançar erros com `throw` e criar erros customizados.

## O Bloco `try...catch...finally`
- Para interceptar essas exceções e tratar a falha de forma graciosa sem encerrar o programa.
### Fluxo de Controle
- `try`: Contém o bloco de código sujeito a falhas (ex: operações de I/O, parsing de JSON, requisições de rede).
- `catch`: Intercepta o objeto de erro lançado e permite tomar medidas corretivas (ex: registrar logs.
- `finally`: Executado incondicionalmente ao término da operação. É ideal para tarefas de limpeza (cleanup).
- O bloco a seguir mostra a estrutura completa e a ordem em que cada parte é executada
### Opcional: Catch sem Parâmetro (ES2019)
- A partir do ES2019, caso você não precise inspecionar os detalhes do objeto de erro.

## Lançamento de Exceções (`throw`)
- A instrução `throw` permite interromper o fluxo normal do programa e lançar uma exceção intencionalmente.
- Em JavaScript, é possível lançar qualquer tipo de dado (strings, números, booleanos ou objetos).
### O Objeto `Error` Nativo
- `.message`: A mensagem descritiva do erro.
- `.name`: O nome do tipo de erro (por padrão, `"Error"`).
- `.stack`: A pilha de chamadas (stack trace) que mostra em qual linha e arquivo a exceção foi gerada.
- `.cause` (ES2022): Propriedade para encadear a causa raiz original do erro.

## Tipos de Erros Nativos em JavaScript
- Tipo de Erro: Causa Comum; Exemplo de Código
- `TypeError`: Operação executada em tipo incompatível ou acesso a `null`/`undefined`.; `"texto".push(1)` ou `null.prop`
- `ReferenceError`: Acesso a uma variável que não foi declarada no escopo ou acessada na TDZ..
- `SyntaxError`: Código ferindo a gramática da linguagem ou JSON malformatado.; `JSON.parse("{ bad }")`
- `RangeError`: Número ou argumento fora do intervalo numérico aceitável.; `new Array(-1)` ou estouro de pilha
- `URIError`: Uso de caracteres inválidos nas funções `decodeURI()` ou `encodeURI()`.; `decodeURIComponent("%")`

## Erros Personalizados (*Custom Errors*)
- Em aplicações de grande porte, é recomendável criar classes de erros customizadas herdando de `Error`.
- Isso permite categorizar falhas de negócio (como erros de validação de formulário.

## Tratamento de Erros em Código Assíncrono
- O tratamento de erros em operações assíncronas varia de acordo com o padrão utilizado (Promises ou `async/await`).
### 1. Tratamento com Promises (`.catch()`)
- Em Promises, rejeições e exceções da cadeia são tratadas com `.catch()`.
### 2. Tratamento com `async/await` (`try...catch`)
- Funções `async` permitem tratar falhas de `await` com `try...catch`.

## Síntese de Estudo
- **Página**: aprofunda conceitos, exemplos e exercícios
- **Slides**: organizam a exposição em sala
- **Mapa mental**: revisa relações entre tópicos
- **Prática**: execute os exemplos antes de memorizar regras
