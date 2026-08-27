---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Python: Classes e Objetos"
description: "Slides da aula de orientação a objetos em Python: classes, atributos, métodos, propriedades, métodos especiais, herança e dataclasses."

---


<!-- _class: lead -->

# Python: Classes e Objetos

Estado e comportamento juntos: `__init__`, propriedades, métodos especiais, herança e `dataclasses`.


---


## Objetivo

Modelar entidades do domínio com classes:

- Definir classes com `__init__` e `self`.
- Diferenciar atributos de **instância** dos de **classe**.
- Expor atributos calculados e validados com `@property`.
- Implementar **métodos especiais** (`__str__`, `__eq__`, `__len__`).
- Aplicar **herança** com `super()` e decidir entre herança e composição.


---

## Primeira Classe (Parte 1)

```python
class Product:
    """Um item vendido na loja."""

    def __init__(self, name, price, stock=0):
        self.name = name
        self.price = price
        self.stock = stock

```

---

## Primeira Classe (Parte 2)

```python
    def total_value(self):
        return self.price * self.stock


keyboard = Product("Teclado", 349.9, 10)
print(keyboard.total_value())   # 3499.0
```

---


## `self`

```python
keyboard.total_value()
# equivale a
Product.total_value(keyboard)
```

- `self` é o **primeiro parâmetro** dos métodos de instância, preenchido automaticamente.
- É convenção, não palavra reservada — mas ninguém usa outro nome.


---


## Atributo de Classe x de Instância

```python
class Account:
    bank = "DevLab Bank"      # compartilhado
    count = 0

    def __init__(self, owner):
        self.owner = owner    # individual
        Account.count += 1
```

*Objeto mutável como atributo de classe (`tags = []`) é compartilhado por todas as instâncias — inicialize dentro de `__init__`.*


---


## Tipos de Método

| Tipo | Decorador | Primeiro parâmetro | Uso |
| --- | --- | --- | --- |
| Instância | — | `self` | Operar sobre o objeto |
| Classe | `@classmethod` | `cls` | Construtor alternativo |
| Estático | `@staticmethod` | nenhum | Utilitário relacionado |

```python
@classmethod
def from_fahrenheit(cls, value):
    return cls((value - 32) * 5 / 9)
```


---


## Visibilidade

| Prefixo | Significado | Efeito real |
| --- | --- | --- |
| `nome` | Público | Nenhum |
| `_nome` | Interno | Apenas convenção |
| `__nome` | Fortemente interno | *Name mangling* (`_Classe__nome`) |

*Python não tem `private`: o controle é por convenção.*


---

## `@property` (Parte 1)

```python
class Product:
    @property
    def price(self):
        return self._price

    @price.setter
    def price(self, value):
        if value < 0:
            raise ValueError("preço não pode ser negativo")
        self._price = value

```

---

## `@property` (Parte 2)

```python
    @property
    def price_with_tax(self):     # somente leitura
        return round(self._price * 1.1, 2)
```

*Comece com atributo simples; promova a `property` quando surgir a necessidade.*

---


## `__str__` e `__repr__`

```python
def __repr__(self):
    return f"Product(name={self.name!r}, price={self.price!r})"

def __str__(self):
    return f"{self.name} — R$ {self.price:.2f}"
```

| Função | Usa |
| --- | --- |
| `print(obj)` | `__str__` |
| `repr(obj)`, REPL, `[obj]` | `__repr__` |

*Se for implementar só um, implemente `__repr__`.*


---


## Métodos Especiais

| Método | Ativa |
| --- | --- |
| `__eq__` | `==` |
| `__lt__` | `<` e `sorted()` |
| `__len__` | `len(obj)` |
| `__getitem__` | `obj[i]` e iteração |
| `__contains__` | `x in obj` |
| `__add__` | `obj + outro` |
| `__call__` | `obj()` |


---


## Herança

```python
class CardPayment(Payment):
    def __init__(self, amount, brand):
        super().__init__(amount)      # reaproveita a inicialização
        self.brand = brand

    def process(self):
        base = super().process()      # estende o comportamento
        return f"{base} no cartão {self.brand}"
```

*Polimorfismo: cada subclasse responde à sua maneira ao mesmo método.*


---


## Herança x Composição

```python
class Order:
    def __init__(self, code, logger=None):
        self.logger = logger or Logger()   # TEM um logger
```

- Herança expressa **"é um tipo de"**; composição, **"tem um"**.
- Hierarquias profundas escondem a origem dos métodos e acoplam classes.
- Na dúvida, componha.


---


## `dataclasses`

```python
from dataclasses import dataclass, field


@dataclass
class Product:
    name: str
    price: float
    tags: list[str] = field(default_factory=list)
```

- Gera `__init__`, `__repr__` e `__eq__` automaticamente.
- `frozen=True` torna imutável e hasheável; `slots=True` economiza memória.


---


## Duck Typing

```python
def run_export(exporter, data):
    """Aceita qualquer objeto que tenha export()."""
    return exporter.export(data)
```

- Não é preciso herança comum: basta responder aos mesmos métodos.
- `isinstance()` tem lugar nas **fronteiras** (validação de entrada), não no domínio.


---


## Exercício

Crie `bank.py` modelando contas:

1. `Account` com `owner`, `_balance` privado e histórico;
2. `deposit()` e `withdraw()` validando valores;
3. Propriedade `balance` somente leitura e `statement` formatado;
4. `__str__` e `__eq__` (mesmo titular);
5. `SavingsAccount` com `apply_interest()` usando `super()`.


---

## Solução do Exercício (Parte 1)

```python
class Account:
    def __init__(self, owner, balance=0):
        self.owner, self._balance, self.history = owner, balance, []

    @property
    def balance(self):
        return self._balance

```

---

## Solução do Exercício (Parte 2)

```python
    def withdraw(self, value):
        if value > self._balance:
            raise ValueError("saldo insuficiente")
        self._balance -= value
        self.history.append(f"saque de R$ {value:.2f}")
        return self._balance
```

---

## Resumo da Aula (Parte 1)

- A classe é o molde; a instância guarda os dados próprios em `self`.
- Atributos de classe são compartilhados — inicialize coleções em `__init__`.
- `@property` adiciona validação e cálculo sem mudar a interface pública.

---

## Resumo da Aula (Parte 2)

- `__str__` é para quem lê a saída; `__repr__`, para quem desenvolve.
- `super()` reaproveita a superclasse; prefira **composição** a hierarquias profundas.
- `@dataclass` elimina o código repetitivo das classes de dados.