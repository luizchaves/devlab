---
title: 'JavaScript: Arrays e Métodos Funcionais'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Arrays e Métodos Funcionais

## Ideia Central

- **Coleção Ordenada**: lista dinâmica e heterogênea indexada numericamente a partir de 0.
- **Paradigmas**: manipulação mutadora clássica e processamento funcional imutável.

## Criação e Estrutura

- **Literal de Array**: sintaxe recomendada `[1, 2, 3]`.
- **Validação de Tipo**: `Array.isArray(val)` (evita o falso positivo `typeof [] === 'object'`).
- **Geração de Intervalos**: `Array.from({ length: 5 }, (_, i) => i + 1)` para sequências.

## Acesso e Desestruturação

- **Indexação**: leitura com colchetes `arr[0]` e tamanho dinâmico `.length`.
- **Acesso Moderno com `.at()`**: suporte nativo a índices negativos (`.at(-1)`).
- **Desestruturação Posicional**: `const [first, ...rest] = arr` e troca de variáveis (*swap*).
- **Operador Spread (`...`)**: clonagem rasa (*shallow copy*) e fusão sem mutação.

## Métodos Mutadores Clássicos

- **Bordas**: `push()` / `pop()` (fim) e `unshift()` / `shift()` (início).
- **Corte e Emenda**: `splice(start, deleteCount, ...items)`.
- **Ordenação In-place (`.sort()`)**:
  - Números: requer comparador `(a, b) => a - b`.
  - Strings com acentos: requer `(a, b) => a.localeCompare(b, "pt-BR")`.
  - Algoritmo Timsort (ordenação estável).

## Métodos Não-Mutadores do ES2023

- **Cópia Segura (*Change Array by Copy*)**:
  - `toSorted()`: retorna novo array ordenado.
  - `toReversed()`: retorna novo array invertido.
  - `toSpliced()`: retorna novo array com emendas.
  - `with(index, val)`: retorna cópia com elemento substituído.
- **Busca Reversa**: `findLast()` e `findLastIndex()`.

## Métodos Funcionais de Ordem Superior

- **Mapeamento**: `map()` para transformações 1:1 e `flatMap()` para achatar.
- **Filtragem**: `filter()` para seleção por predicado booleano.
- **Redução e Agregação**: `reduce()` para acumular totais e agrupar objetos.
- **Busca e Predicados**: `find()`, `findIndex()`, `includes()`, `some()`, `every()`.

## Boas Práticas

- **Priorize Imutabilidade**: prefira `spread`, `map`, `filter` e métodos do ES2023.
- **Iteração Limpa**: use `for...of` em vez de `for...in` para arrays.
- **Sempre forneça função comparadora ao ordenar**: previna armadilhas de ordenação lexicográfica.
