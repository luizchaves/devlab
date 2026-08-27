---
title: 'Python: Coleções'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Python: Coleções

## Ideia Central

- Quatro coleções embutidas: `list`, `tuple`, `dict` e `set`
- A escolha certa rende mais legibilidade e desempenho que otimizar depois

## Panorama

- **`list`**: ordenada, mutável, aceita duplicatas, acesso por índice
- **`tuple`**: ordenada, **imutável**, hasheável
- **`dict`**: chaves únicas, ordem de inserção garantida (3.7+)
- **`set`**: elementos únicos, **sem ordem**, busca rápida

## Listas

### Acesso
- Índices e fatiamento como em strings
- Atribuição por índice: `numbers[0] = 99`
- `len()`, `in`, `index()`, `count()`

### Métodos mutadores
- `append`, `extend`, `insert`
- `remove`, `pop`, `clear`
- `sort`, `reverse` — todos devolvem `None`

### Ordenação
- `sorted(lista)` devolve nova lista; `lista.sort()` altera no lugar
- `key=len`, `key=lambda item: item[1]`, `reverse=True`

### Cópia
- Atribuição **não** copia: cria outro nome para o mesmo objeto
- Rasa: `copy()`, `list()`, `[:]`
- Profunda: `copy.deepcopy()` para estruturas aninhadas

## Tuplas

- A **vírgula** define a tupla, não os parênteses
- `(42,)` é tupla; `(42)` é número
- Desempacotamento: `x, y = point`, `first, *rest = valores`
- Usos: retorno múltiplo, chave composta, registro fixo

## Dicionários

- `user["chave"]` levanta `KeyError`; `get()` devolve padrão
- `setdefault()` cria a chave se não existir
- `update()`, `pop()`, `del`, união com `|` (3.9+)
- Iteração: `keys()`, `values()`, `items()`
- `max(scores, key=scores.get)` encontra a maior chave

## Conjuntos

- União `|`, interseção `&`, diferença `-`, simétrica `^`
- Subconjunto `<=`, superconjunto `>=`
- `set()` cria vazio — `{}` cria **dicionário**
- Elementos precisam ser **hasheáveis**
- `list(dict.fromkeys(itens))` remove duplicatas preservando ordem

## Escolhendo

- Tem rótulo ou identificador? → `dict`
- Quero apenas únicos? → `set`
- O conteúdo muda? → `list`
- Registro fixo ou chave composta? → `tuple`

## Boas Práticas

- **Nunca faça `lista = lista.sort()`**: o retorno é `None`
- **Use `get()`** para chaves opcionais
- **Prefira `set`** para testes de pertencimento em coleções grandes
- **Ordene conjuntos** antes de exibir: a ordem interna não é garantida
