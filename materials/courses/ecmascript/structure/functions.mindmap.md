---
title: 'JavaScript: Funções e Closures'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Funções e Closures

## Objetivo
- Compreender as diferentes formas de declarar e invocar funções (Function Declaration.

## Formas de declaração
- Em JavaScript, uma função pode ser definida de diferentes maneiras: por meio de uma declaração tradicional.
- Quando argumentos extras são fornecidos, eles são ignorados pela assinatura da função.
- Uma Function Expression define uma função anônima ou nomeada e a atribui a uma variável ou constante
- As Arrow Functions (introduzidas no ES6) fornecem uma sintaxe mais curta utilizando a notação `=>`
- Para retornar objeto literal em arrow function implícita, envolva o objeto com parênteses.
- Caso contrário, as chaves serão interpretadas como um bloco de código vazio ou com labels, resultando em `undefined`.

## Retorno
- Toda função em JavaScript retorna um valor.
- Se nenhum `return` for especificado ou se o `return` for chamado sem um operando, a função retornará `undefined`.
- A instrução `return` interrompe imediatamente a execução da função.

## Hoisting
- Hoisting é o comportamento do JavaScript de mover declarações para o topo do seu escopo antes da execução do código.
- No entanto, o comportamento difere entre Function Declarations e Function Expressions.
- Function Declarations são completamente elevadas, podendo ser invocadas antes da linha onde foram declaradas
- Se a expressão for declarada com `var`, a variável é elevada com o valor `undefined`.

## Redefinição de função
- Em JavaScript não existe sobrecarga de métodos (overloading) nativa baseada na quantidade de argumentos.
- Se duas funções com o mesmo nome forem declaradas no mesmo escopo usando Function Declaration.

## Case Sensitive
- `sumLower` e `SumLower` são identificadores totalmente independentes.

## Parâmetros e argumentos
- JavaScript oferece recursos flexíveis para manipular dados de entrada em funções
### Parâmetros padrão (Default Parameters)
- É possível atribuir um valor padrão para um parâmetro usando `= defaultValue`.
- O valor padrão só é ativado se o argumento for omitido ou se for passado explicitamente o valor `undefined`.
### Rest parameters (`...rest`)
- Diferente do objeto `arguments`, o rest parameter resulta em uma instância legítima de `Array`.
### Objeto `arguments`
- Em funções declaradas com `function`, a variável local `arguments` contém todos os argumentos passados para a função.
- Trata-se de um objeto array-like (possui propriedade `.length` e índices numéricos, mas não é um `Array` real).
- Para usar métodos de array em `arguments`, converta antes com `Array.from()`.
### Parâmetros desestruturados
- Podemos desestruturar objetos diretamente na lista de parâmetros da função.

## Callbacks e funções de primeira classe
- Em JavaScript, funções são cidadãs de primeira classe (first-class citizens).
- Uma função passada como argumento para ser executada posteriormente é chamada de callback.
- Callbacks também são comuns em predicados de filtragem e validação

## Recursos Avançados de Funções
- Além das declarações e callbacks básicas, o JavaScript disponibiliza recursos avançados para controle de escopo.
### Closures
- Uma Closure ocorre quando uma função interna guarda a referência ao seu escopo léxico externo.
- Esse comportamento permite criar dados e estados privados que persistem entre chamadas.
### IIFE (Immediately Invoked Function Expression)
- Encapsulamento e Isolamento de Escopo: Evita poluir o escopo global com variáveis temporárias ou de inicialização.
- Padrão Módulo (Module Pattern): Permite criar dados e estados privados acessíveis apenas por funções internas.
- Uma IIFE (Expressão de Função Invocada Imediatamente) é uma função em JavaScript que é executada assim que é definida.
- Ela é estruturada envolvendo uma expressão de função entre parênteses e invocando-a imediatamente com `()`.
- Principais casos de uso de IIFEs
### Manipulação de Contexto (`call`, `apply` e `bind`)
- `call()`: Imediata; Lista individual (`arg1, arg2, ...`)
- `apply()`: Imediata; Array de argumentos (`[arg1, arg2]`)
- `bind()`: Diferida; Lista individual (parcial ou completa)
- Em JavaScript, o valor de `this` em funções tradicionais é dinâmico e depende de como a função é chamada.
- `call()`, `apply()` e `bind()` vêm de `Function.prototype`.
### Funções Geradoras (*Generators*: `function*`)
- É declarada com a sintaxe `function* name()`.
- Ao ser invocada, retorna um objeto Generator (que implementa o protocolo de iteração).
- `.next()` retoma a execução e retorna `{ value, done }`.

## Síntese de Estudo
- **Página**: aprofunda conceitos, exemplos e exercícios
- **Slides**: organizam a exposição em sala
- **Mapa mental**: revisa relações entre tópicos
- **Prática**: execute os exemplos antes de memorizar regras
