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
title: "Python: Funções"
description: "Slides da aula de funções em Python: parâmetros, valores padrão, *args e **kwargs, retorno múltiplo, escopo LEGB, closures, lambda e decoradores."

---


<!-- _class: lead -->

# Python: Funções

Definição, parâmetros, retorno, escopo LEGB, closures, funções como valores e decoradores.


---


## Objetivo

Empacotar comportamento em blocos reutilizáveis:

- Definir funções com `def` e documentar com **docstring**.
- Usar parâmetros posicionais, nomeados e com **valor padrão** seguro.
- Aceitar quantidades variáveis com `*args` e `**kwargs`.
- Explicar a regra de escopo **LEGB** e criar **closures**.
- Usar funções como valores: `lambda`, ordem superior e **decoradores**.


---


## Anatomia de uma Função

```python
def apply_discount(price, percentage):
    """Devolve o preço com o desconto aplicado."""
    return price * (1 - percentage)


print(apply_discount(200, 0.15))              # 170.0
print(apply_discount(price=200, percentage=0.1))
```

- `def` cria o objeto função; o corpo só roda na chamada.
- Sem `return`, a função devolve `None` implicitamente.


---


## Parâmetros e Argumentos

```python
def register(name, email, active):
    ...

register("Ana", "ana@devlab.dev", True)         # posicionais
register(email="b@dev.dev", name="Bia", active=False)  # nomeados
register("Caio", active=True, email="c@dev.dev")       # misto
```

- **Parâmetro**: nome na definição. **Argumento**: valor na chamada.
- Booleano na chamada pede nome: `active=True` documenta sem custo.


---


## Valores Padrão

```python
def connect(host, port=5432, timeout=30):
    return f"{host}:{port} (timeout {timeout}s)"

connect("localhost")
connect("db.dev", timeout=5)
```

- Parâmetros opcionais vêm **depois** dos obrigatórios.
- O padrão é avaliado **uma única vez**, na definição.


---


## Armadilha do Padrão Mutável

```python
def add_item(item, items=[]):     # ARMADILHA
    items.append(item)
    return items

print(add_item("a"))   # ['a']
print(add_item("b"))   # ['a', 'b'] — a lista persistiu!


def add_item(item, items=None):   # correção
    items = [] if items is None else items
    items.append(item)
    return items
```


---


## `*args` e `**kwargs`

```python
def summarize(title, *values, **options):
    print(title, values)      # tupla
    print(options)            # dicionário
    return sum(values) * options.get("factor", 1)

summarize("Vendas", 10, 20, 30, factor=2)
```

Na chamada, os mesmos operadores **desempacotam**:

```python
create_user(*["Ana", "ana@dev.dev"], **{"role": "admin"})
```


---


## `/` e `*` na Assinatura

```python
def transfer(source, target, /, amount, *, confirm=False):
    ...
```

| Marcador | Efeito |
| --- | --- |
| `/` | Tudo **antes** é somente-posicional |
| `*` | Tudo **depois** é somente-nomeado |

*Evita chamadas ilegíveis como `transfer(a, b, 100, True)`.*


---


## Retorno Múltiplo

```python
def statistics(numbers):
    return min(numbers), max(numbers), sum(numbers) / len(numbers)


lowest, highest, average = statistics([4, 8, 15, 16, 23, 42])
print(statistics([1, 2, 3]))   # (1, 3, 2.0) — é uma tupla
```

*Guard clause: trate os casos de saída no início e mantenha o corpo principal sem aninhamento.*


---

## Escopo LEGB (Parte 1)

```txt
Local  ──▶  Enclosing  ──▶  Global  ──▶  Built-in  ──▶  NameError
```

---

## Escopo LEGB (Parte 2)

```python
value = "global"

def outer():
    value = "enclosing"

    def inner():
        value = "local"
        print(value)      # local
    inner()
    print(value)          # enclosing
```

---

## `global` e `nonlocal` (Parte 1)

```python
counter = 0

def increment():
    global counter        # sem isto: UnboundLocalError
    counter += 1


```

---

## `global` e `nonlocal` (Parte 2)

```python
def make_accumulator():
    total = 0
    def add(value):
        nonlocal total    # escopo da função externa
        total += value
        return total
    return add
```

*`global` é sinal de alerta: prefira parâmetros e retorno.*

---


## Closures

```python
def multiplier(factor):
    def multiply(number):
        return number * factor
    return multiply


double = multiplier(2)
triple = multiplier(3)
print(double(10), triple(10))   # 20 30
```

- A função interna continua enxergando `factor` depois que `multiplier` terminou.


---


## Funções São Valores

```python
print(sorted(people, key=lambda person: person[1]))
print(list(map(str.upper, words)))
print(list(filter(lambda w: len(w) > 2, words)))

operations = {"soma": lambda a, b: a + b}
print(operations["soma"](6, 7))
```

- `lambda`: função anônima de **uma expressão**, ideal como argumento curto.
- A PEP 8 desaconselha `nome = lambda ...`: nesse caso, use `def`.


---

## Decoradores (Parte 1)

```python
import functools, time

def timed(function):
    @functools.wraps(function)
    def wrapper(*args, **kwargs):
        started = time.perf_counter()
        result = function(*args, **kwargs)
        print(f"{function.__name__}: {(time.perf_counter()-started)*1000:.2f} ms")
        return result
    return wrapper

```

---

## Decoradores (Parte 2)

```python

@timed
def total_squares(limit):
    return sum(n ** 2 for n in range(limit))
```

*`@timed` equivale a `total_squares = timed(total_squares)`.*

---


## Exercício

Crie `text_tools.py` com funções utilitárias:

1. `normalize(text)` — remove espaços das bordas e devolve em minúsculas;
2. `initials(full_name, separator=".")` — iniciais separadas pelo caractere;
3. `word_count(text, *, ignore=None)` — conta palavras descartando as ignoradas;
4. `apply_to_all(texts, *functions)` — aplica todas as funções a cada texto;
5. Documente com docstring e use anotações de tipo.


---

## Solução do Exercício (Parte 1)

```python
def normalize(text: str) -> str:
    """Remove espaços das bordas e converte para minúsculas."""
    return text.strip().lower()


def initials(full_name: str, separator: str = ".") -> str:
    """Devolve as iniciais de cada parte do nome."""
    return separator.join(part[0].upper() for part in full_name.split())

```

---

## Solução do Exercício (Parte 2)

```python

def word_count(text: str, *, ignore: set[str] | None = None) -> int:
    """Conta palavras, descartando as listadas em ignore."""
    ignored = ignore or set()
    return sum(1 for word in text.split() if word.lower() not in ignored)
```

---

## Resumo da Aula (Parte 1)

- `def` define; os parênteses chamam. Sem `return`, a função devolve `None`.
- Valor padrão é avaliado **uma vez**: nunca use lista ou dicionário como padrão.
- `*args` vira tupla, `**kwargs` vira dicionário — e os mesmos operadores desempacotam na chamada.

---

## Resumo da Aula (Parte 2)

- Retorno múltiplo é uma **tupla** desempacotada na atribuição.
- Nomes são resolvidos por **LEGB**; `global` e `nonlocal` mudam o escopo de atribuição.
- Funções são valores: podem ser passadas, devolvidas e decoradas com `@`.