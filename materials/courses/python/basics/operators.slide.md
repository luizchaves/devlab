---
marp: true
theme: default
paginate: true
style: |
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 70px;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "Python: Expressões e Operadores"
description: "Slides da aula de expressões e operadores em Python: aritméticos, comparação, lógicos, identidade, associação, bit a bit e precedência."

---


<!-- _class: lead -->

# Python: Expressões e Operadores

Aritmética, comparação encadeada, operadores lógicos, identidade, associação, bits e precedência.


---


## Objetivo

Combinar valores com previsibilidade:

- Aplicar os operadores **aritméticos**, incluindo `//` e `**`.
- Usar **comparação encadeada** (`18 <= idade < 65`).
- Entender que `and` e `or` devolvem **operandos**, não booleanos.
- Distinguir `is` (identidade) de `in` (associação).
- Prever resultados pela tabela de **precedência**.


---


## Operadores Aritméticos

| Operador | Nome | `7 op 2` |
| --- | --- | --- |
| `+` `-` `*` | Soma, subtração, produto | `9` `5` `14` |
| `/` | Divisão real | `3.5` |
| `//` | Divisão inteira (piso) | `3` |
| `%` | Resto | `1` |
| `**` | Potência | `49` |

*`/` sempre devolve `float`: `6 / 2` é `3.0`, não `3`.*


---


## Divisão e Resto

```python
print(-7 // 2)   # -4 — piso, não truncamento em direção a zero
print(-7 % 2)    # 1  — o sinal do resto segue o divisor
print(divmod(7, 2))   # (3, 1)

seconds = 3725
hours, rest = divmod(seconds, 3600)
minutes, secs = divmod(rest, 60)
print(f"{hours:02d}:{minutes:02d}:{secs:02d}")   # 01:02:05
```


---


## `+` e `*` em Sequências

```python
print("Dev" + "Lab")    # 'DevLab'
print("ab" * 3)         # 'ababab'
print([1, 2] + [3])     # [1, 2, 3]
print([0] * 4)          # [0, 0, 0, 0]
print("-" * 30)         # separador visual

print("Total: " + str(10))   # tipagem forte exige conversão
```


---


## Atribuição Aumentada

| Operador | Equivale a |
| --- | --- |
| `x += 1` | `x = x + 1` |
| `x *= 2` | `x = x * 2` |
| `x //= 2` | `x = x // 2` |
| `x **= 2` | `x = x ** 2` |

*Não existe `++` nem `--` em Python: use `x += 1`.*


---


## Comparação

```python
print(10 == 10.0)       # True
print("Z" < "a")        # True — ordem por code point Unicode
print([1, 2] < [1, 3])  # True — elemento a elemento
```

- `==` `!=` `<` `>` `<=` `>=` produzem sempre `True` ou `False`.
- Funcionam com números, strings, listas e tuplas.


---


## Comparação Encadeada

```python
age = 25

print(18 <= age < 65)          # True — avalia age uma única vez
print(age >= 18 and age < 65)  # equivalente, mais verboso
```

- Sintaxe rara entre linguagens, herdada da notação matemática.
- Também aplica **curto-circuito**: se a primeira comparação falha, a segunda não é avaliada.


---


## Operadores Lógicos

| Operador | Devolve |
| --- | --- |
| `and` | Primeiro operando *falsy*, ou o último valor |
| `or` | Primeiro operando *truthy*, ou o último valor |
| `not` | Booleano invertido |

```python
print(True and "texto")   # 'texto'
print(0 and "texto")      # 0
print("" or "padrão")     # 'padrão'
```


---


## Curto-circuito

```python
user = None

# .name nunca é acessado: o primeiro operando já é falsy
if user is not None and user.name:
    print("nunca chega aqui")

name = user.name if user is not None else "visitante"
```

*Cuidado: `quantidade = informado or 10` troca `0` por `10`, porque `0` é falsy.*


---


## Identidade e Associação

```python
languages = ["python", "go"]

print("python" in languages)     # True
print("py" in "python")          # True — substring
print("id" in {"id": 1})         # True — procura nas CHAVES

value = None
print(value is None)             # identidade
```


---


## Operadores Bit a Bit

| Operador | `a = 12`, `b = 10` |
| --- | --- |
| `a & b` | `8` |
| `a \| b` | `14` |
| `a ^ b` | `6` |
| `a << 1` | `24` (multiplica por 2) |
| `a >> 2` | `3` (divide por 4) |

```python
print({1, 2} | {2, 3})       # {1, 2, 3} — também opera conjuntos
print({"a": 1} | {"b": 2})   # união de dicionários (3.9+)
```


---


## Precedência

| Ordem | Operadores |
| --- | --- |
| 1 | `()` |
| 2 | `**` (associa à **direita**) |
| 3 | `+x`, `-x`, `~x` |
| 4 | `*`, `/`, `//`, `%` |
| 5 | `+`, `-` |
| 6 | comparação, `in`, `is` |
| 7 | `not` → `and` → `or` |


---


## Casos Que Confundem

```python
print(2 + 3 * 4)      # 14
print(2 ** 3 ** 2)    # 512 — associa à direita: 2 ** (3 ** 2)
print(-2 ** 2)        # -4  — ** vem antes do menos unário
print((-2) ** 2)      # 4

print(True or False and False)   # True — and antes de or
```

*Na dúvida, use parênteses: custam dois caracteres e eliminam ambiguidade.*


---


## Condicional e Walrus

```python
status = "adulto" if age >= 18 else "menor"

label = "pequeno" if size < 10 else "médio" if size < 100 else "grande"

if (words := text.split()) and len(words) > 1:
    print(f"{len(words)} palavras")
```


---


## Exercício

Crie `calculator.py` aplicando todos os grupos de operadores:

1. Leia dois inteiros com `input()`;
2. Imprima as sete operações aritméticas e o `divmod()`;
3. Classifique o primeiro como par ou ímpar com expressão condicional;
4. Verifique com comparação encadeada se o segundo está entre 1 e 100;
5. Evite divisão por zero usando curto-circuito.


---

## Solução do Exercício (Parte 1)

```python
first = int(input("Primeiro: "))
second = int(input("Segundo: "))

print(first + second, first - second, first * second)

```

---

## Solução do Exercício (Parte 2)

```python
if second != 0:
    print(first / second, first // second, first % second)
    print(divmod(first, second))
else:
    print("Divisão indisponível: o segundo número é zero.")

print(f"{first} é {'par' if first % 2 == 0 else 'ímpar'}")
print(f"Entre 1 e 100? {1 <= second <= 100}")
```

---

## Resumo da Aula (Parte 1)

- `/` devolve `float`; `//` é divisão de **piso** e `%` acompanha o sinal do divisor.
- `+` e `*` também concatenam e repetem sequências — mas nunca misturam tipos.
- Comparações podem ser **encadeadas** e avaliam cada operando uma única vez.

---

## Resumo da Aula (Parte 2)

- `and` e `or` devolvem **operandos** e aplicam **curto-circuito**.
- `is` compara identidade; `in` testa pertencimento (chaves, em dicionários).
- `**` associa à direita e tem precedência sobre o menos unário: `-2 ** 2` é `-4`.