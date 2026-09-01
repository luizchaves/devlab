---
title: 'JavaScript: Funções e Closures'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Funções e Closures

## Ideia Central

- **Modularização**: blocos reutilizáveis para nomear tarefas e evitar repetição.
- **Primeira Classe**: funções podem ser atribuídas, passadas como argumento e retornadas.

## Formas de Declaração

- **Function Declaration**: `function sum(a, b) {}` (sofre *hoisting* completo).
- **Function Expression**: `const sum = function(a, b) {}` (sujeita a TDZ com `const`/`let`).
- **Arrow Function**: sintaxe concisa `(a, b) => a * b` (retorno implícito e `this` léxico).
- **Retorno de Objetos**: `(name) => ({ name })` exige parênteses para não virar bloco.

## Parâmetros e Argumentos

- **Valores Padrão**: `(a, b = 1)` ativado por `undefined` (mas não por `null`).
- **Rest Parameters (`...rest`)**: captura argumentos restantes em um `Array` real.
- **Objeto `arguments`**: coleção *array-like* legada em funções tradicionais.
- **Desestruturação**: extração direta na assinatura com *fallback* `= {}`.

## Escopo e Execução

- **Hoisting**: declarações tradicionais podem ser invocadas antes da linha de definição.
- **Sem Sobrecarga (*Overloading*)**: funções com mesmo nome sobrescrevem a anterior.
- **Case Sensitive**: `sum` e `Sum` são identificadores distintos.
- **Guard Clauses**: retornos antecipados eliminam aninhamento de `if/else`.

## Recursos Avançados

- **Callbacks**: passagem de referências funcionais para execução posterior.
- **Closures**: retenção do escopo léxico externo para proteção de estado privado.
- **IIFE**: Expressão de Função Invocada Imediatamente para isolar variáveis globais.
- **Manipulação de `this`**:
  - `call()`: invoca imediatamente com lista individual de argumentos.
  - `apply()`: invoca imediatamente passando argumentos em Array.
  - `bind()`: retorna nova função com o `this` vinculado permanentemente.
- **Generators (`function*`)**: produção preguiçosa de valores via `yield` e `.next()`.

## Boas Práticas

- **Prefira Rest Parameters**: evite `arguments` para manter compatibilidade com métodos funcionais.
- **Atenção ao `this`**: não declare métodos de objetos com Arrow Functions.
- **Sempre use `= {}`**: proteja parâmetros desestruturados contra chamadas sem argumento.
- **Referência em Callbacks**: passe o nome da função `fn`, e não sua invocação `fn()`.
