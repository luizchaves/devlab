---
title: 'Python: Strings'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Python: Strings

## Ideia Central

- `str` é uma sequência **imutável** de caracteres Unicode
- Todo método devolve uma **nova** string; o original nunca muda

## Criação

- Aspas simples e duplas são equivalentes
- Três aspas preservam quebras de linha
- Literais adjacentes se juntam: `"Py" "thon"`
- `str(valor)` converte qualquer objeto em texto

## Escapes

- `\n` quebra de linha, `\t` tabulação, `\\` barra
- `\u00e9` caractere Unicode pelo código
- **String crua** `r"\d+"`: desativa escapes (obrigatória em regex)

## Índices e Fatiamento

- Índices começam em `0`; negativos contam do fim
- `texto[início:fim:passo]`, com fim **exclusivo**
- `s[:n]` prefixo, `s[n:]` sufixo, `s[::-1]` invertido
- Índice inválido levanta `IndexError`; fatia fora do limite devolve `""`

## Métodos

### Caixa e limpeza
- `strip()`, `lstrip()`, `rstrip()`
- `lower()`, `upper()`, `title()`, `capitalize()`
- `casefold()` para comparação ciente de Unicode

### Busca e verificação
- `in` é a forma idiomática de testar substring
- `find()` devolve `-1`; `index()` levanta `ValueError`
- `count()`, `startswith()`, `endswith()` (aceitam tupla)
- `isdigit()`, `isalpha()`, `isalnum()`

### Divisão e junção
- `split(sep)`, `split()` sem argumento colapsa espaços
- `splitlines()`, `partition()`
- `join()` é a forma eficiente de concatenar muitos pedaços

### Substituição e preenchimento
- `replace(old, new, count)`
- `zfill()`, `ljust()`, `rjust()`, `center()`
- `removeprefix()`, `removesuffix()`

## f-strings

- Interpolam expressões no próprio literal (PEP 498)
- `:.2f` casas decimais, `:,.2f` milhar
- `:>10` `:<10` `:^10` alinhamento
- `:.1%` percentual, `:b` `:o` `:x` bases
- `f"{valor=}"` imprime expressão e valor (depuração)

## Texto e Bytes

- `str`: caracteres Unicode | `bytes`: octetos
- `encode("utf-8")` e `decode("utf-8")`
- `ord()` e `chr()` convertem caractere e código
- Codificação errada gera `UnicodeDecodeError`

## Boas Práticas

- **Normalize antes de comparar**: `strip()` e `lower()`
- **Nunca concatene em laço**: use `"".join(lista)`
- **Prefira f-string** a `%` e `.format()`
- **Sempre string crua** em padrões de expressão regular
