---
title: 'JavaScript: Tratamento de Erros'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Tratamento de Erros

## Ideia Central

- **Tolerância a Falhas**: gestão estruturada de exceções para evitar paradas inesperadas.
- **Ciclo de Exceção**: disparo intencional, captura de falhas, tratamento e limpeza.
- **Diagnóstico primeiro**: mensagem, arquivo, linha, coluna e *stack trace* indicam onde investigar.
- **Console como instrumento**: `log`, `table` e `time` ajudam quando a execução fica inesperada ou lenta.

## Estrutura try...catch...finally

- **`try`**: delimita o bloco de código monitorado contra exceções.
- **`catch(error)`**: intercepta a falha e permite ação corretiva ou registro.
- **Optional Catch Binding**: sintaxe `catch { ... }` sem parâmetro (ES2019).
- **`finally`**: execução garantida ao término (roda mesmo com `return` anterior).

## Lançamento com throw e Objeto Error

- **Instrução `throw`**: interrompe o fluxo normal e dispara uma exceção.
- **Objeto `Error`**:
  - `.message`: descrição amigável do erro.
  - `.name`: nome da classe da exceção.
  - `.stack`: rastreamento da pilha de chamadas (*stack trace*).
  - `.cause`: encadeamento de causa raiz (ES2022).

## Erros Nativos da Linguagem

- **`TypeError`**: operação em tipo incompatível ou leitura em `null`/`undefined`.
- **`ReferenceError`**: acesso a variável inexistente no escopo ou antes da TDZ.
- **`SyntaxError`**: sintaxe inválida no código ou parsing de JSON malformatado.
- **`RangeError`**: argumento numérico fora dos limites válidos.
- **`URIError`**: caracteres inválidos em funções de codificação URI.
- **`AggregateError`**: agrupa múltiplos erros em operações concorrentes.

## Erros Customizados

- **Herança de `Error`**: `class ValidationError extends Error` para falhas de domínio.
- **Metadados de Negócio**: propriedades customizadas (`field`, `code`, `amount`).
- **Roteamento com `instanceof`**: tratamento seletivo por classe no bloco `catch`.

## Erros em Fluxos Assíncronos

- **Promises**: encadeamento com `.catch(err)` e finalização com `.finally()`.
- **`async/await`**: captura de exceções assíncronas com `try...catch` síncrono.

## Boas Práticas

- **Sempre lance instâncias de `Error`**: nunca lance strings literais diretamente.
- **Use `finally` para cleanup**: feche conexões, arquivos e indicadores de loading.
- **Preserve causas com `cause`**: facilite a depuração de erros encapsulados.
- **Não engula exceções**: registre logs claros antes de recuperar ou repassar o erro.
