---
title: 'TypeScript: Generics'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# TypeScript: Generics

## Ideia Central

- Reutilizam código **preservando** o tipo, ao contrário de `any`
- Existem para **conectar** posições: entrada com saída, chave com valor

## O Problema Que Resolvem

- Uma função por tipo gera duplicação
- `any` aceita tudo e não protege nada
- Generic mantém uma função só, com o tipo que entra saindo intacto

## Declaração

- Parâmetro entre `<>` antes dos parâmetros da função
- Vale por chamada: `first<T>(items: T[]): T | undefined`
- Vários parâmetros: `pair<A, B>(a: A, b: B): [A, B]`
- Convenções: `T`, `U`, `K` para chave, `E` para erro

## Inferência

- Deduzida a partir dos argumentos na maioria das chamadas
- Explicitar só quando não há argumento de onde inferir
- Ou quando se deseja um tipo mais amplo que o inferido

## Restrições

### extends
- Estabelece o mínimo exigido de `T`
- Sem restrição, `T` pode ser qualquer coisa

### Padrões comuns
- `T extends object` para objetos
- `K extends keyof T` para chaves existentes
- `T extends unknown[]` para arrays
- Retorno `T[K]` devolve o tipo exato da propriedade

## Valores Padrão

- `interface ApiResponse<T = unknown>` permite usar sem informar
- Funciona como valor padrão de parâmetro de função
- Útil em tipos usados com frequência na mesma configuração

## Interfaces e Classes

- Contratos parametrizados: `Repository<T, Id = string>`
- Estruturas de dados: `Stack<T>`, `Collection<T extends Entity>`
- A restrição vale para todos os membros da classe
- Métodos podem declarar parâmetros de tipo próprios

## Quando Não Usar

- `T` que aparece uma única vez não conecta nada
- Nesse caso, `unknown` expressa melhor a intenção
- Complexidade genérica cobra manutenção e piora mensagens de erro

## Boas Práticas

- **Deixe inferir**: chamadas idiomáticas não mencionam tipo
- **Restrinja ao mínimo necessário**, não além
- **Mude o parâmetro do retorno** quando a operação muda a forma
- **Nomes descritivos** (`TItem`, `TResult`) em API pública
