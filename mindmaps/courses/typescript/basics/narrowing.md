---
title: 'TypeScript: Narrowing'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# TypeScript: Narrowing

## Ideia Central

- O compilador acompanha o fluxo e sabe o que a variável pode ser em cada linha
- O mesmo `if` que você escreveria já faz o estreitamento

## typeof

- Cobre `string`, `number`, `boolean`, `bigint`, `symbol`, `undefined`, `function`
- **Armadilha**: `typeof null === "object"`
- Combine sempre com `value !== null` ao testar objetos

## Veracidade e Igualdade

### Veracidade
- `if (!value)` elimina todos os *falsy*
- Captura `0` e `""` por engano quando eles são válidos

### Igualdade
- `===` estreita os **dois** lados da comparação
- `value == null` captura `null` e `undefined` — único uso aceito de `==`

## in e instanceof

- **`in`**: presença de propriedade; funciona com interfaces e tipos
- **`instanceof`**: cadeia de protótipos; só com classes (`Date`, `Error`)
- Interfaces não existem em runtime: `instanceof` não serve para elas

## Type Predicates

- Assinatura `value is Tipo` informa o que a função prova
- Estreita dentro do `if` que a chamou
- Funciona em `filter`, removendo `null` do tipo resultante
- O compilador **acredita** no predicate: ele merece teste

## Funções de Asserção

- Assinatura `asserts value is Tipo`
- Lança exceção quando a condição falha
- Estreita do ponto da chamada em diante, sem bloco
- Útil em validação de entrada no topo da função

## Uniões Discriminadas

- Propriedade comum com tipo literal distinto em cada variação
- `switch` sobre ela ativa o narrowing automático
- Acessar campo de outra variação vira erro de compilação

## Exaustividade

- `const exhaustive: never = value` no `default`
- Variação nova passa a falhar a compilação
- O compilador entrega a lista de pontos a atualizar

## Nulos

- `strictNullChecks` exige tratar `null` e `undefined`
- `?.` interrompe a cadeia em vez de lançar
- `??` só substitui `null` e `undefined` — diferente de `||`

## Boas Práticas

- **Estreite em vez de asserir**: `if` no lugar de `as`
- **Compare explicitamente** quando `0` e `""` forem válidos
- **Teste os predicates**: eles são pontos de confiança cega
- **Use `never`** para transformar refatoração em erro de compilação
