---
title: 'Python: Expressões e Operadores'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Python: Expressões e Operadores

## Ideia Central

- **Expressão** produz valor; **instrução** executa ação
- A ordem de avaliação segue a tabela de precedência, ajustável com parênteses

## Aritméticos

- `+` `-` `*`: soma, subtração e produto
- `/`: divisão real, **sempre** `float` (`6 / 2` é `3.0`)
- `//`: divisão de piso (`-7 // 2` é `-4`)
- `%`: resto, com sinal do divisor
- `**`: potência, associativa à **direita**
- `divmod(a, b)`: quociente e resto de uma vez

## Em Sequências

- `"Dev" + "Lab"`: concatenação
- `"ab" * 3`: repetição
- `[1, 2] + [3]`, `[0] * 4`: listas
- Tipagem forte: `"Total: " + str(10)`

## Atribuição Aumentada

- `x += 1`, `x *= 2`, `x //= 2`, `x **= 2`
- Não existe `++` nem `--` em Python
- Em lista, `+=` altera no lugar; em `str`, cria novo objeto

## Comparação

- `==` `!=` `<` `>` `<=` `>=` devolvem `True` ou `False`
- Strings comparam por *code point* (`"Z" < "a"`)
- Listas comparam elemento a elemento
- **Encadeada**: `18 <= age < 65` avalia `age` uma única vez

## Lógicos

### Retorno de operandos
- `and` devolve o primeiro *falsy* ou o último valor
- `or` devolve o primeiro *truthy* ou o último valor
- `not` devolve booleano invertido

### Curto-circuito
- `user is not None and user.name` evita `AttributeError`
- Cuidado: `qtd = informado or 10` troca `0` por `10`

## Identidade e Associação

- `is` / `is not`: mesmo objeto na memória
- `in` / `not in`: pertencimento a iterável
- Em dicionário, `in` procura nas **chaves**

## Bit a Bit

- `&` `|` `^` `~`: AND, OR, XOR, NOT
- `<<` `>>`: deslocamento (multiplica/divide por potências de 2)
- `|` e `&` também operam conjuntos e dicionários (3.9+)

## Precedência

- `()` → `**` → unários → `*` `/` `//` `%` → `+` `-`
- comparações → `not` → `and` → `or` → ternário → `:=`
- `-2 ** 2` é `-4`; `2 ** 3 ** 2` é `512`

## Boas Práticas

- **Use parênteses** em expressões compostas: custam pouco e removem dúvida
- **Prefira comparação encadeada** a `and` repetido
- **Não abuse do ternário aninhado**: acima de dois níveis, use `if`
- **Cuidado com `or` como valor padrão** quando `0` for legítimo
