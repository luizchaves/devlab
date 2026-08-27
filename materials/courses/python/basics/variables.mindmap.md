---
title: 'Python: Variáveis e Tipos de Dados'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Python: Variáveis e Tipos de Dados

## Ideia Central

- Variável é um **nome ligado a um objeto**, não uma caixa que guarda o valor
- Tudo em Python é objeto: números, textos, funções e módulos

## Atribuição e Nomes

- **Sem declaração**: `name = "DevLab"` cria e liga de uma vez
- **PEP 8**: `snake_case` para variáveis, `UPPER_SNAKE_CASE` para constantes
- **Não existe `const`**: maiúsculas comunicam intenção, não impedem mudança
- **Palavras reservadas**: 35 nomes em `keyword.kwlist`

## Modelo de Referências

### Identidade e igualdade
- `==` compara **valor**; `is` compara **identidade**
- `is` só para `None`, `True` e `False`
- `id(objeto)` mostra o endereço lógico

### Mutabilidade
- **Imutáveis**: `int`, `float`, `bool`, `str`, `tuple`, `frozenset`
- **Mutáveis**: `list`, `dict`, `set`, instâncias de classes
- Dois nomes para o mesmo objeto mutável enxergam a mesma alteração

## Tipos Numéricos

- **`int`**: precisão arbitrária, sem overflow (`2 ** 200`)
- **`float`**: IEEE 754, com erro de arredondamento
- **`complex`**: `3 + 4j`, uso científico
- `0.1 + 0.2 != 0.3`: use `Decimal("0.1")` ou centavos em `int` para dinheiro

## Booleanos e None

- `bool` é subtipo de `int`: `True + True` resulta em `2`
- **Falsy**: `0`, `0.0`, `""`, `[]`, `()`, `{}`, `set()`, `None`, `False`
- `None` é o único valor de `NoneType`; teste com `is None`
- Função sem `return` devolve `None`

## Conversão de Tipos

- `int(x)` trunca; `round(x)` arredonda
- `float(x)`, `str(x)`, `bool(x)`, `list(x)`
- `input()` **sempre** devolve `str`
- `int("abc")` levanta `ValueError`

## Atribuições Especiais

- **Múltipla**: `x, y, z = 1, 2, 3`
- **Troca**: `x, y = y, x`
- **Com resto**: `first, *rest = [10, 20, 30]`
- **Aumentada**: `total += 5`
- **Walrus**: `if (size := len(nome)) > 3:`

## Anotações de Tipo

- `name: str`, `tags: list[str]`, `nickname: str | None`
- Documentam a intenção e alimentam `mypy`, `pyright` e o editor
- **Não** são verificadas em tempo de execução

## Boas Práticas

- **Compare com `==`**, reserve `is` para os *singletons*
- **Nunca use `float` para dinheiro**
- **Converta explicitamente** entradas do usuário
- **Prefira `is None`** a `not valor` quando `0` e `""` forem válidos
