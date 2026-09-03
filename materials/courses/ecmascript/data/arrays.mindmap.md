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
- **Estrutura Dinâmica**: tamanho mutável, heterogeneidade e indexação numérica.

## Imutabilidade, Comparação e Desestruturação

- **Comparação por Referência**: `===` compara endereços na Heap (`[1, 2] === [1, 2]` é `false`).
- **Operador Spread (`...`)**: clonagem rasa (*shallow copy*) e fusão criando nova referência.
- **`structuredClone(arr)`**: clonagem profunda (*deep copy*) isolada para matrizes e aninhamentos.
- **Desestruturação Posicional**: `const [first, ...rest] = arr` e troca de variáveis (*swap*).

## Iteração e Sequências Numéricas

- **Percurso de Valores**: `for...of` para iterar sobre itens do array.
- **Índice + Valor**: `for...of` com `.entries()` para evitar contador manual.
- **Evite `for...in`**: ele percorre chaves/propriedades, não valores da coleção.
- **`Array.from()`**: forma legível para gerar valores a partir de `{ length }`.
- **`keys()` com Spread**: gera índices numéricos (`[...Array(5).keys()]`).
- **`fill()` + `map()`**: alternativa útil quando é preciso preencher antes de transformar.
- **Generator Function**: produz valores sob demanda sem criar o array inteiro na memória.

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

- **Iteração com Efeitos Colaterais**: `forEach()` para percorrer sem retornar novo array.
- **Mapeamento**: `map()` para transformações 1:1 e `flatMap()` para achatar.
- **Filtragem**: `filter()` para seleção por predicado booleano.
- **Redução e Agregação**: `reduce()` para acumular totais e agrupar objetos.
- **Busca e Predicados**: `find()`, `findIndex()`, `includes()`, `some()`, `every()`.

## Resumo e Boas Práticas

- **Criação e Verificação**: use `[]`, `Array.from()` e `Array.isArray(valor)`.
- **Evite Arrays Esparsos**: não use `delete`; prefira remoção por método adequado.
- **Mutação Consciente**: escolha métodos mutadores quando alterar o original for parte da regra.
- **Priorize Imutabilidade**: prefira `spread`, `map`, `filter`, `slice` e métodos do ES2023.
- **Iteração Limpa**: use `for...of` ou métodos funcionais em vez de `for...in`.
- **Comparação Explícita**: não use `===` para comparar conteúdo de arrays distintos.
- **Ordenação Cuidadosa**: forneça comparador numérico ou `localeCompare("pt-BR")`.
