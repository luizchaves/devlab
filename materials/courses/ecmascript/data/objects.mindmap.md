---
title: 'JavaScript: Objetos, Classes e Protótipos'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Objetos, Classes e Protótipos

## Objetivo
- Compreender a estrutura de dados de Objeto em JavaScript, dominar a criação por notação literal.

## Criação de Objetos e Notação Literal
- Notação Literal: Forma mais comum e legível de criar objetos com `{}`; `const user = { name: "Ana" };`
- Valor (Value): Qualquer dado associado à chave; `"Ana"`, `28`, `true`, `[1, 2]`
- Tipo de Dado: Tipo de dado não primitivo em JavaScript; `typeof {}` // `"object"`
- Em JavaScript, um Objeto é uma coleção dinâmica de propriedades.
- O valor de uma propriedade pode ser de qualquer tipo: primitivos, arrays.

## Property Shorthand (Sintaxe Abreviada de Propriedades)
- Quando o nome da variável local é idêntico ao nome da chave do objeto que se deseja criar.

## Acesso, Modificação e Remoção de Propriedades
- Propriedades podem ser acessadas por ponto (`obj.name`) ou colchetes (`obj[key]`).
### Notação de Ponto vs Notação de Colchetes
- As duas notações acessam a mesma propriedade, mas só uma delas aceita nomes calculados em tempo de execução
### Adição, Alteração e Remoção
- Objetos em JavaScript são mutáveis por padrão.
- Propriedades podem ser atribuídas ou removidas a qualquer momento.
### Verificação de Existência de Propriedades (Operador `in` e `Object.hasOwn`)
- `Object.hasOwn(obj, prop)`: Retorna `true` apenas se a propriedade for direta/própria do objeto (own property).

## Desestruturação em Parâmetros de Funções
- A desestruturação é extremamente útil em parâmetros de funções, permitindo receber objetos de opção com clareza.

## Operador Spread e Imutabilidade em Objetos
- O operador de espalhamento (`...`) permite copiar e mesclar propriedades de objetos de forma rasa (shallow copy).

## Congelando Objetos com Object.freeze()
- Se você precisa impedir que um objeto tenha suas propriedades alteradas, adicionadas ou deletadas.

## Classes em JavaScript (ES6+ e POO)
### Declaração de Classes e o Construtor
- Uma classe é declarada com a palavra-chave `class`.
### Mapeamento entre Classes e a Cadeia de Protótipos
### Encapsulamento com Atributos Privados (`#`) e Getters/Setters
- No ES2022, o JavaScript introduziu os campos privados prefixados com `#`.
- Atributos e métodos privados não podem ser acessados diretamente de fora da classe.
### Herança de Classes com `extends` e `super`
- Uma classe pode herdar propriedades e métodos de outra classe utilizando a palavra-chave `extends`.
### Métodos e Campos Estáticos (`static`)
- Métodos e propriedades marcados com a palavra-chave `static` pertencem à própria classe.

## Iteração sobre Objetos
- `for...in`: Chaves (`string`); Laço que percorre as chaves enumeráveis do objeto
- `Object.keys(obj)`: `Array`; Retorna um array com os nomes das chaves do objeto
- `Object.values(obj)`: `Array`; Retorna um array com os valores de todas as propriedades
- `Object.entries(obj)`: `Array`; Retorna um array de pares `[chave, valor]`
- Diferente de arrays, objetos comuns não são diretamente iteráveis com `for...of`.

## Síntese de Estudo
- **Página**: aprofunda conceitos, exemplos e exercícios
- **Slides**: organizam a exposição em sala
- **Mapa mental**: revisa relações entre tópicos
- **Prática**: execute os exemplos antes de memorizar regras
