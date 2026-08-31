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
- Primitivo: `undefined`; Ausência de valor atribuído por padrão
- Primitivo: `null`; Ausência intencional de referência a objeto (retorna 'object' no typeof)
### Hierarquia de tipos em uma imagem
- Category: Types; Values
- Primitive: Undefined; `undefined`
- Primitive: Null; `null`
- Primitive: Boolean; `true`, `false`
- Primitive: Number; `-15``15`, `0b1111`, `0o17`, `0xf``-123.45``123.45`, `1.2345e2`, `12345E-2`

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
- Coerção é o processo de conversão de um valor de um tipo de dado para outro.
- Coerção Explícita (Casting)
- Ocorre quando o desenvolvedor converte o tipo intencionalmente usando funções construtoras nativas como `String()`.
- Ocorre automaticamente quando o motor JavaScript tenta realizar uma operação entre tipos incompatíveis.
- Conversão explícita deixa claro no código que um valor está sendo transformado em outro tipo
- JavaScript também faz conversões implícitas em algumas operações.

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

