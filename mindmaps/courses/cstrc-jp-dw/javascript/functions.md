---
title: 'JavaScript: Funções'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Funções

## Ideia Central

- Blocos fundamentais de reutilização de código
- Encapsulamento, abstração e modularização
- Funções são cidadãs de primeira classe (*first-class citizens*)

## Formas de Declaração

### Function Declaration
- Sintaxe: `function nome(param) { ... }`
- Nome obrigatório
- Hoisting completo (pode ser chamada antes de declarar)
- Possui `this` dinâmico

### Function Expression
- Sintaxe: `const func = function(param) { ... }`
- Atribuída a uma variável
- Sujeita à Temporal Dead Zone (TDZ) com `const`/`let`

### Arrow Functions
- Sintaxe: `const func = (param) => { ... }`
- Retorno explícito com `{ return ... }`
- Retorno implícito sem chaves: `const double = n => n * 2`
- Retorno implícito de objetos com parênteses: `() => ({ prop })`
- Possui `this` léxico (herda do escopo externo)

## Parâmetros e Argumentos

### Argumentos Omitidos e Extras
- Omitidos assumem `undefined`
- Extras são ignorados pela assinatura

### Parâmetros Padrão (*Default Parameters*)
- Sintaxe: `function foo(name = "padrão")`
- Acionado quando o argumento é omitido ou `undefined`
- `null` NÃO dispara o valor padrão

### Rest Parameters (`...rest`)
- Sintaxe: `function foo(...numbers)`
- Agrupa múltiplos argumentos em um Array real
- Deve ser o último parâmetro da função

### Desestruturação em Parâmetros
- Extrai propriedades de objetos diretamente: `function foo({ name })`
- Sempre incluir fallback de objeto: `({ name } = {})`

### Objeto Legado `arguments`
- Presente apenas em funções tradicionais
- Objeto similar a array (*array-like*), sem métodos nativos de Array

## Retorno e Controle de Fluxo

- Retorna `undefined` por padrão se nenhum `return` for especificado
- `return` encerra a execução da função imediatamente
- **Guard Clause**: Retorno antecipado para evitar `if/else` aninhados

## Funções de Primeira Classe e Callbacks

- Funções podem ser armazenadas, passadas e retornadas
- **Callback**: Função passada como argumento para ser executada depois
- Passar a referência da função (`func`), NÃO a invocação (`func()`)

## Comportamentos Especiais

### Hoisting
- Declarações de função sobem para o topo do escopo
- Expressões de função mantêm a variável na TDZ

### Redefinição de Função
- Sem sobrecarga (*overloading*) nativa em JS
- A última declaração de função sobrescreve as anteriores no mesmo escopo

### Case Sensitivity
- Nomes diferenciam maiúsculas/minúsculas (`sum` != `Sum`)

## Closures

- Função interna que lembra e acessa o escopo léxico externo
- Permite manter estado privado e encapsulado
- Exemplo: Geradores de contadores e rastreadores de pontos
