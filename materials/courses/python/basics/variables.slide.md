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
    font-size: 1.5rem;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    position: absolute;
    bottom: 24px;
    right: 32px;
    padding: 0;
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "Python: Variáveis e Tipos de Dados"
description: "Slides da aula de variáveis e tipos em Python: atribuição, referências, tipos numéricos, booleanos, None, mutabilidade e conversão."

---


<!-- _class: lead -->

# Python: Variáveis e Tipos de Dados

Atribuição, nomes, modelo de referências, tipos embutidos, mutabilidade, conversão e anotações de tipo.


---


## Objetivo

Entender como Python guarda valores e quais tipos estão sempre disponíveis:

- Criar e reatribuir variáveis seguindo a **PEP 8**.
- Explicar o **modelo de referências** e a diferença entre `is` e `==`.
- Diferenciar objetos **mutáveis** de **imutáveis**.
- Reconhecer `int`, `float`, `bool`, `str` e `None`.
- Converter tipos explicitamente e identificar valores *truthy* e *falsy*.


---


## Atribuição

```python
name = "DevLab"      # str
attempts = 3         # int
price = 19.90        # float
is_active = True     # bool
result = None        # NoneType

attempts = attempts + 1
```

- Sem declaração prévia, sem `let`, `var` ou tipo obrigatório.
- O nome é apenas um **rótulo** ligado a um objeto na memória.


---


## Convenções de Nomes (PEP 8)

| Elemento | Convenção | Exemplo |
| --- | --- | --- |
| Variáveis e funções | `snake_case` | `total_price`, `read_file()` |
| Constantes | `UPPER_SNAKE_CASE` | `TAX_RATE`, `MAX_RETRIES` |
| Classes | `PascalCase` | `InvoiceItem` |
| Uso interno | prefixo `_` | `_cache` |

*Python não tem `const`: MAIÚSCULAS comunicam intenção, não impedem a reatribuição.*


---


## Nomes São Referências

```python
a = [1, 2, 3]
b = a           # mesmo objeto

b.append(4)
print(a)        # [1, 2, 3, 4]
print(a is b)   # True

b = [9, 9]      # agora b aponta para outro objeto
print(a is b)   # False
```


---


## `is` versus `==`

| Operador | Compara | Pergunta |
| --- | --- | --- |
| `==` | Valor | "Os conteúdos são iguais?" |
| `is` | Identidade | "É o mesmo objeto na memória?" |

```python
x, y = [1, 2], [1, 2]
print(x == y)   # True
print(x is y)   # False

value = None
print(value is None)   # uso idiomático de is
```


---


## Mutável x Imutável

| Categoria | Tipos | Efeito |
| --- | --- | --- |
| **Imutáveis** | `int`, `float`, `bool`, `str`, `tuple` | "Alterar" cria novo objeto |
| **Mutáveis** | `list`, `dict`, `set`, instâncias | Alteração no lugar |

```python
text = "python"
print(text.upper(), text)   # PYTHON python

numbers = [1, 2]
numbers.append(3)           # altera o próprio objeto
```


---


## Tipos Numéricos

```python
big = 2 ** 200          # int cresce sem limite fixo
population = 8_100_000_000   # separador visual

print(len(str(big)), "dígitos")   # 61 dígitos
print(7 / 2, 7 // 2, 7 % 2)       # 3.5 3 1
```

- `int`: precisão arbitrária, sem overflow silencioso.
- `float`: IEEE 754, dupla precisão.
- `complex`: `3 + 4j`, raro fora de aplicações científicas.


---


## Precisão de Ponto Flutuante

```python
print(0.1 + 0.2)          # 0.30000000000000004
print(0.1 + 0.2 == 0.3)   # False

from decimal import Decimal
print(Decimal("0.1") + Decimal("0.2"))   # 0.3
```

*Nunca use `float` para dinheiro: prefira `Decimal` (com literais em string) ou inteiros em centavos.*


---


## Booleanos, `None` e Truthy

| Falsy | Exemplo |
| --- | --- |
| Zero numérico | `0`, `0.0` |
| Sequências vazias | `""`, `[]`, `()`, `{}`, `set()` |
| Ausência de valor | `None` |
| Falso | `False` |

```python
print(True + True)              # 2 — bool é subtipo de int
print(bool(""), bool("texto"))  # False True
```


---


## `None` Não É Zero

```python
def log(message):
    print(f"[log] {message}")

result = log("oi")
print(result, type(result))   # None <class 'NoneType'>
```

- `None` é o único valor de `NoneType` e representa **ausência de valor**.
- Teste com `if value is None:` — `if not value:` também captura `0` e `""`.


---


## Conversão de Tipos

```python
quantity = int(input("Quantidade: "))   # input() sempre devolve str
price = float("19.90")

print(int(3.99))     # 3 — trunca
print(round(3.99))   # 4 — arredonda
print(str(42) + " anos")
```

| Função | Converte para |
| --- | --- |
| `int(x)` / `float(x)` | Número |
| `str(x)` | Texto |
| `bool(x)` | Booleano |
| `list(x)` | Lista a partir de iterável |


---


## Atribuições Especiais

```python
x, y, z = 1, 2, 3        # múltipla
x, y = y, x              # troca sem auxiliar
a = b = c = 0            # mesmo valor
first, *rest = [10, 20, 30]   # desempacotamento com resto

total = 10
total += 5               # atribuição aumentada

if (size := len("DevLab")) > 3:   # operador morsa
    print(size)
```


---


## Anotações de Tipo

```python
name: str = "DevLab"
tags: list[str] = ["python", "guia"]
nickname: str | None = None


def total(price: float, quantity: int = 1) -> float:
    return price * quantity
```

- Documentam a intenção e alimentam `mypy`, `pyright` e o editor.
- **Não** são verificadas em tempo de execução: `age: int = "vinte"` executa normalmente.


---


## Exercício

Crie `product.py` praticando tipos e conversões:

1. Declare `name`, `price`, `quantity` e `discount` com os tipos adequados;
2. Leia a quantidade com `input()` e converta antes de calcular;
3. Calcule subtotal e total com desconto;
4. Exiba os valores com f-string e duas casas decimais;
5. Teste `bool()` com cinco valores diferentes.


---


## Solução do Exercício

```python
NAME = "Teclado mecânico"
PRICE = 349.9
DISCOUNT = 0.15

quantity = int(input("Quantidade: "))
subtotal = PRICE * quantity
total = subtotal * (1 - DISCOUNT)

print(f"Subtotal: R$ {subtotal:.2f}")
print(f"Total:    R$ {total:.2f} (desconto de {DISCOUNT:.0%})")
print(bool(0), bool(""), bool([]), bool(None), bool(quantity))
```


---

## Resumo da Aula (Parte 1)

- Variáveis são **nomes ligados a objetos**; a atribuição nunca copia o valor.
- `==` compara conteúdo, `is` compara identidade — use `is` só com `None`, `True` e `False`.
- Tipos **imutáveis** (`str`, `int`, `tuple`) devolvem novos objetos a cada operação.

---

## Resumo da Aula (Parte 2)

- `int` tem precisão arbitrária; `float` segue IEEE 754 e **não** serve para dinheiro.
- A tipagem é forte: conversões com `int()`, `float()` e `str()` são sempre explícitas.
- Anotações de tipo documentam a intenção, mas não são verificadas em execução.