---
title: 'JavaScript: Map, Set e Coleções'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Map, Set e Coleções

## Objetivo
- Compreender as coleções estruturadas `Map`, `Set`, `WeakMap` e `WeakSet` em JavaScript.

## O Objeto Map
- Um `Map` é uma coleção ordenada de pares chave-valor na qual qualquer valor (seja um objeto.
### Comparativo: Map vs Objeto Literal
- Tipos de Chaves: Apenas `String` ou `Symbol`.; Qualquer valor (objetos, funções, números, booleans).
- Ordem de Inserção: Nem sempre garantida para chaves numéricas.; Garantida estritamente na ordem de inserção.
- Tamanho da Coleção: Manual via `Object.keys(obj).length`.; Direta via propriedade `.size`.
- Desempenho: Otimizado para dados estruturados estáticos.; Otimizado para inserções e remoções frequentes.
- Iteração: Exige `Object.keys()` ou `for...in`.; Iterável nativo via `for...of` ou `.forEach()`.
### Instanciação e Métodos Principais
- O `Map` é criado vazio ou a partir de uma lista de pares, e sua API é baseada em métodos, não em acesso por colchetes

## O Objeto Set
- Um `Set` é uma coleção de valores únicos.
- Um mesmo valor não pode ser inserido duplicadamente em um `Set`.
### Instanciação e Métodos do Set
- O `Set` guarda apenas valores únicos e responde a um conjunto reduzido de métodos
### Operações de Conjuntos (ES2024 / Métodos Utilitários)
- O ecossistema JavaScript moderno introduziu métodos nativos de teoria dos conjuntos no protótipo do `Set`

## Iteração sobre Map e Set
- Tanto o `Map` quanto o `Set` são iteráveis nativos e mantêm a ordem em que os elementos foram inseridos.
### Iterando sobre um Map
- A iteração devolve os pares na ordem de inserção, e a desestruturação separa chave e valor em cada passo
### Iterando sobre um Set
- Como o `Set` só tem valores, a iteração é direta — e `entries()` existe apenas por compatibilidade com o `Map`

## WeakMap e WeakSet (Coleções de Referência Fraca)
- Tipos Permitidos: Qualquer tipo primitivo ou objeto.; Apenas Objetos (e Symbols não registrados).
- Coleta de Lixo (Garbage Collection): Mantém a referência forte, impedindo a limpeza..
- Propriedade `.size`: Presente (ex: `map.size`).; Ausente (indeterminada).
- Iteração: Suporta `for...of`, `.keys()`, `.values()`.; Não iterável (não é possível listar os elementos).
- O JavaScript fornece duas variantes especiais de coleções chamadas `WeakMap` e `WeakSet`.

## Caso de Uso: Dados Privados e Metadados de Objetos
- O `WeakMap` é ideal para associar dados ou metadados privados a uma instância de objeto.

## Síntese de Estudo
- **Página**: aprofunda conceitos, exemplos e exercícios
- **Slides**: organizam a exposição em sala
- **Mapa mental**: revisa relações entre tópicos
- **Prática**: execute os exemplos antes de memorizar regras

