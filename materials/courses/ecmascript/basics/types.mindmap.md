---
title: 'JavaScript: Tipos de Dados e Coerção'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Tipos de Dados e Coerção

## Objetivo
- Compreender o sistema de tipos dinâmico do JavaScript.
- Identificar todos os tipos primitivos e de referência, utilizar corretamente o operador `typeof`.

## Categorias de Tipos de Dados
- Primitivos (7 tipos imutáveis): `number`, `bigint`, `string`, `boolean`, `undefined`, `null`, `symbol`.
- Formatos Numéricos: separador (`15_000`), binário (`0b1111`), octal (`0o17`), hexadecimal (`0xf`).
- Objetos (Tipos de Referência): `Object`, `Array`, `Function`, `Date`, `RegExp`, `Map`, `Set`.
- Ausência de valor: `undefined` (não inicializado) vs `null` (intencional).

## Imutabilidade dos Primitivos
- Valores primitivos são imutáveis.
- Métodos chamados em uma string ou number retornam novos valores sem alterar a instância original.

## O Operador `typeof`
- O operador unário `typeof` inspeciona e retorna uma string representando o tipo do operando atual.
- O operador `typeof` ajuda a observar o tipo de um valor em tempo de execução

## Tipagem Dinâmica e Tipagem Fraca (Weak Typing)
- Operação: Resultado; Comportamento da Tipagem Fraca
- `"5" + 2`: `"52"`; O operador `+` com string converte `2` para `"2"` e concatena.
- `"5" - 2`: `3`; O operador `-` força conversão da string `"5"` para o número `5`.
- *`"5" "2"`*: `10`; O operador `` converte ambas as strings para números.
- `true + 1`: `2`; O booleano `true` é convertido para `1`.
- *`false 10`**: `0`; O booleano `false` é convertido para `0`.

## Coerção de Tipos (Implícita vs Explícita)
- Conversão Explícita e Coerção Básica: `Number()`, `String()`, `Boolean()` vs operadores `+`, `-`, `*`.
- Métodos de Conversão: `valueOf()` (primitivo/número) e `toString()` (texto).
- Operação ToPrimitive: hints `number`, `string` e `default` (Date como exceção textual).
- Padrões Práticos: Value Objects (`Money`) com aritmética e comparações relacionais (`<`, `>`).
- Evolução ES6: `[Symbol.toPrimitive](hint)` para controle unificado.

## `undefined` vs `null`
- `undefined`: Significa que a variável foi declarada, mas ainda não recebeu nenhum valor.
- `null`: Significa a ausência intencional de um objeto ou valor.
- Ambos os valores representam ausência de dados, mas com intenções semânticas distintas
- Com `typeof` apresentado, fica mais fácil observar dois valores especiais de ausência.
- `undefined` costuma indicar ausência de inicialização.
- `null` costuma ser usado para representar ausência intencional de valor

## Booleanos, Falsy e Truthy
- Valor: Conversão
- `false`: `false`
- `0`, `-0`, `0n`: `false`
### Aprofundamento nos Próximos Tipos do Curso
- 🔤 Strings, Template Literals e Symbols: Imutabilidade, interpolação, manipulação avançada de texto.
- 🔢 Numbers, BigInt e Math: Precisão IEEE 754, números inteiros de precisão arbitrária (`BigInt`).
- 📋 Arrays e Métodos de Iteração: Coleções ordenadas, mutações, métodos funcionais (`map`, `filter`.
- 📦 Objetos e Protótipos: Propriedades, métodos, herança prototípica, manipulação de chaves e objetos imutáveis.
- 📅 Datas e Tempo com o Objeto Date: Instanciação, timestamps Unix, fusos horários.

## Síntese de Estudo
- **Página**: aprofunda conceitos, exemplos e exercícios
- **Slides**: organizam a exposição em sala
- **Mapa mental**: revisa relações entre tópicos
- **Prática**: execute os exemplos antes de memorizar regras
