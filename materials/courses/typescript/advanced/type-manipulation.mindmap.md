---
title: 'TypeScript: Manipulação de Tipos'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# TypeScript: Manipulação de Tipos

## Ideia Central

- O sistema de tipos é uma pequena linguagem funcional
- Tem entrada, condicional, iteração e extração de valores

## Operadores de Consulta

- **`keyof T`**: união das chaves de `T`
- **`T[K]`**: tipo daquela propriedade (indexed access)
- **`typeof valor`**: tipo de um valor existente
- `(typeof ARRAY)[number]` deriva a união dos elementos

## Tipos Mapeados

### Forma geral
- `{ [K in keyof T]: Transformação<T[K]> }`
- Percorre as chaves e transforma cada valor

### Modificadores
- `?` e `readonly` **adicionam**
- `-?` e `-readonly` **removem**
- É assim que `Partial`, `Required` e `Readonly` são escritos

### Renomeação
- `as` reescreve o nome de cada chave
- Mapear para `never` **remove** a chave — é o filtro

## Tipos Condicionais

- `T extends U ? X : Y`, avaliado pelo compilador
- Base de `Exclude`, `Extract` e `NonNullable`
- Podem ser recursivos, com limite de profundidade

## Distributividade

- Parâmetro nu com união: o condicional avalia **membro a membro**
- Os resultados são reunidos em uma nova união
- `never` desaparece da união: é o que faz `Exclude` filtrar
- `[T] extends [U]` desliga a distribuição

## infer

- Captura parte do tipo dentro de um condicional
- `T extends (infer U)[] ? U : never` extrai o elemento
- `F extends (...args: infer P) => infer R` extrai parâmetros e retorno
- Combina com recursão para desembrulhar `Promise` aninhada

## Template Literal Types

- Compõem literais como template strings
- Geram todas as combinações das uniões envolvidas
- `infer` também funciona dentro do template
- Combinações explodem rápido e travam o editor

## Limites

- Um utility type pronto costuma resolver
- Se exige comentário para ser entendido, simplifique
- Mensagens de erro ilegíveis anulam o benefício
- Nomear tipos intermediários melhora tudo

## Boas Práticas

- **Comece pelo utilitário pronto**, escreva o seu só se faltar
- **Nomeie intermediários** em composições longas
- **Teste tipos** com `Assert<A, B>` ou `expect-type`
- **Prefira legibilidade** à elegância do tipo
