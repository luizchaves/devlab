---
title: 'Python: Compreensões e Geradores'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Python: Compreensões e Geradores

## Ideia Central

- Compreensão descreve **o que** a coleção contém, não o passo a passo
- Gerador produz valores **sob demanda**, com memória constante

## List Comprehension

- Estrutura: `[expressão for item in iterável if condição]`
- `if` no **final** filtra itens
- `if/else` **antes** do `for` transforma cada item
- Vários `for` percorrem combinações e achatam matrizes
- Limite prático: se precisar de comentário, use `for` tradicional

## Dict e Set Comprehension

- `{palavra: len(palavra) for palavra in palavras}`
- `{len(palavra) for palavra in palavras}`
- Inversão: `{v: k for k, v in mapa.items()}`
- Chaves repetidas: o **último** item vence

## Expressões Geradoras

### Sintaxe
- Parênteses no lugar de colchetes
- Em chamada de função, os parênteses extras são dispensáveis

### Comportamento
- Memória constante, independentemente do tamanho
- **Passagem única**: esgota após o primeiro percurso
- Não aceita acesso por índice

## Protocolo de Iteração

- **Iterável**: implementa `__iter__` (`list`, `str`, `dict`, `range`)
- **Iterador**: implementa `__iter__` e `__next__`, guarda a posição
- `iter()` obtém o iterador; `next()` pede o próximo valor
- Esgotado, levanta `StopIteration` — capturada pelo `for`

## Funções Geradoras

- `yield` **pausa** a função preservando o estado local
- `return` encerra; `yield` suspende e retoma
- `yield from` repassa todos os valores de outro iterável
- Geradores infinitos exigem consumidor com limite

## itertools

- `count()`, `cycle()`, `repeat()`
- `islice()` fatia iteradores
- `chain()` concatena iteráveis
- `groupby()` agrupa consecutivos
- `combinations()` e `permutations()`

## Boas Práticas

- **Não use compreensão só por efeito colateral**: ela existe para construir coleções
- **Prefira gerador** ao processar arquivos e fluxos grandes
- **Materialize com `list()`** quando precisar percorrer mais de uma vez
- **Limite geradores infinitos** com `islice` ou `break`
