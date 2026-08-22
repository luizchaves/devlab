---
title: 'JavaScript: Variáveis'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Variáveis

## Ideia Central

- O tipo pertence ao **valor** e não ao nome da variável
- Nomes dão intenção e evitam repetição de código

## Tipos de Dados

### Primitivos (Imutáveis)
- `undefined`: Não inicializado
- `null`: Ausência intencional de valor (`typeof null === "object"`)
- `boolean`: `true` ou `false`
- `number`: Inteiros e decimais IEEE 754 (`0.1 + 0.2 !== 0.3`)
- `bigint`: Inteiros de precisão arbitrária (`42n`)
- `string`: Cadeias de texto
- `symbol`: Identificadores únicos (`Symbol("id")`)

### Objetos (Estruturas Ricas)
- `object`: Dicionários `{}` e Arrays `[]` (`Array.isArray([]) === true`)
- `function`: Blocos executáveis de primeira classe

## Inspeção e Avaliação

### Operador `typeof`
- Retorna o nome do tipo em string
- `typeof []` resulta em `"object"`

### Conversão Booleana (*Truthy* / *Falsy*)
- *Falsy*: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`
- *Truthy*: Todos os outros (incluindo `[]` e `{}`)

## Declaração de Variáveis

### `const`
- Escopo de Bloco `{}`
- Impedimento de **reassociação**
- Permite **mutação** interna em objetos e arrays

### `let`
- Escopo de Bloco `{}`
- Permite **reassociação**
- Sujeita à *Temporal Dead Zone* (TDZ) antes da declaração

### `var`
- Escopo de Função (vaza blocos)
- Permite redeclaração no mesmo escopo
- *Hoisting* inicializa como `undefined`

## Identificadores e Convenções

- Letras, dígitos, `_` e `$`; não pode iniciar com número
- `camelCase`: Variáveis e funções (`totalPrice`)
- `PascalCase`: Classes e componentes (`UserProfile`)
- `UPPER_CASE`: Constantes de configuração (`API_URL`)
