---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Python: Compreensões e Geradores"
description: "Slides da aula de compreensões e geradores em Python: list/dict/set comprehensions, expressões geradoras, iteradores, yield e itertools."
---

<!-- _class: lead -->

# Python: Compreensões e Geradores

Construção declarativa de coleções, avaliação sob demanda, protocolo de iteração e `yield`.

---

## Objetivo

Transformar e filtrar dados sem laços manuais:

- Escrever **list**, **dict** e **set comprehensions** com filtro e condicional.
- Reconhecer quando uma compreensão perde legibilidade.
- Usar **expressões geradoras** para economizar memória.
- Explicar o protocolo de iteração (`iter` / `next`).
- Criar funções geradoras com `yield` e usar `itertools`.

---

## Do Laço à Compreensão

```python
# imperativo
squares = []
for number in numbers:
    squares.append(number ** 2)

# declarativo
squares = [number ** 2 for number in numbers]
```

```txt
[ expressão  for item in iterável  if condição ]
```

---

## Filtrar x Transformar

```python
evens = [n for n in numbers if n % 2 == 0]                 # filtra
labels = ["par" if n % 2 == 0 else "ímpar" for n in numbers]  # transforma
```

- `if` no **final**: filtra itens.
- `if/else` **antes** do `for`: faz parte da expressão, mantém todos os itens.

---

## Aninhamento e Limite

```python
combinations = [f"{s}-{c}" for s in sizes for c in colors]
flat = [value for row in matrix for value in row]
transposed = [[row[i] for row in matrix] for i in range(3)]
```

*Se a compreensão precisa de comentário para ser entendida, escreva o `for` tradicional.*

---

## Dict e Set Comprehension

```python
lengths = {word: len(word) for word in words}
unique = {len(word) for word in words}
inverted = {v: k for k, v in lengths.items()}

approved = {name: score for name, score in scores.items() if score >= 7}
```

*Chaves repetidas sobrescrevem: o último item vence.*

---

## Expressões Geradoras

```python
import sys

squares_list = [n ** 2 for n in range(100_000)]
squares_gen = (n ** 2 for n in range(100_000))

print(sys.getsizeof(squares_list))   # ~800 KB
print(sys.getsizeof(squares_gen))    # ~200 bytes

print(sum(n ** 2 for n in range(1000)))   # parênteses extras dispensados
```

---

## Lista x Gerador

| Critério | List comprehension | Expressão geradora |
| --- | --- | --- |
| Memória | Todos os itens | Um por vez |
| Reutilização | Várias passagens | Esgota na primeira |
| Índice | Sim | Não |
| Ideal para | Resultado pequeno e reusado | Fluxo grande, uso único |

```python
values = (n for n in range(3))
print(list(values))   # [0, 1, 2]
print(list(values))   # [] — esgotado
```

---

## Protocolo de Iteração

```python
iterator = iter(["python", "go"])

print(next(iterator))   # 'python'
print(next(iterator))   # 'go'
print(next(iterator))   # StopIteration
```

- **Iterável**: implementa `__iter__` (list, str, dict, range).
- **Iterador**: implementa `__iter__` e `__next__`, e guarda a posição.
- O `for` faz exatamente isso, capturando `StopIteration`.

---

## Funções Geradoras

```python
def read_lines(text):
    """Devolve uma linha por vez, sem carregar tudo."""
    for line in text.splitlines():
        clean = line.strip()
        if clean:
            yield clean
```

- `yield` **pausa** a função preservando o estado local.
- `return` encerra; `yield` suspende e retoma na próxima solicitação.

---

## Pipelines Sob Demanda

```python
import itertools

def counter(start=0):
    while True:
        yield start
        start += 1

def only_even(values):
    for value in values:
        if value % 2 == 0:
            yield value

pipeline = only_even(counter(1))
print(list(itertools.islice(pipeline, 5)))   # [2, 4, 6, 8, 10]
```

*Gerador infinito exige consumidor com limite: `islice` ou `break`.*

---

## `itertools`

| Função | Produz |
| --- | --- |
| `count(start, step)` | Contador infinito |
| `cycle(iterável)` | Repetição indefinida |
| `islice(iterável, n)` | Fatia de iterador |
| `chain(a, b)` | Concatenação |
| `groupby(it, key)` | Agrupamento de consecutivos |
| `combinations` | Combinações sem repetição |

---

## Exercício

Crie `students.py` processando notas com compreensões:

1. Parta de `nome -> lista de notas`;
2. Monte `nome -> média` com dict comprehension;
3. Liste os aprovados (média ≥ 7) ordenados da maior para a menor;
4. Monte um conjunto com todas as notas distintas;
5. Calcule a média geral com expressão geradora.

---

## Solução do Exercício

```python
averages = {name: round(sum(v) / len(v), 1) for name, v in GRADES.items()}

approved = sorted(
    (name for name, average in averages.items() if average >= 7),
    key=lambda name: -averages[name],
)

distinct = {grade for values in GRADES.values() for grade in values}
class_average = sum(averages.values()) / len(averages)
```

---

## Resumo da Aula

- Compreensões descrevem **o que** a coleção contém, não o passo a passo.
- `if` no final filtra; `if/else` antes do `for` transforma.
- Parênteses no lugar de colchetes produzem um **gerador**: memória constante, passagem única.
- `iter()` e `next()` são o protocolo por trás de todo `for`.
- `yield` pausa a função preservando o estado — ideal para arquivos e fluxos grandes.
- `itertools` traz contadores, fatias, concatenação e agrupamento prontos.
