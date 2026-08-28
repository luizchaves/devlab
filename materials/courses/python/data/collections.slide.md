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
title: "Python: Coleções"
description: "Slides da aula de coleções em Python: listas, tuplas, dicionários e conjuntos, métodos, ordenação, cópia e critérios de escolha."

---


<!-- _class: lead -->

# Python: Coleções

Listas, tuplas, dicionários e conjuntos: características, métodos e critérios de escolha.


---


## Objetivo

Escolher e manipular a estrutura certa para cada problema:

- Diferenciar `list`, `tuple`, `dict` e `set` por ordem, mutabilidade e duplicatas.
- Aplicar métodos **mutadores** e **acessores** sem perder dados.
- Ordenar com `sorted()` e `key`.
- Entender **cópia rasa** e **profunda**.
- Usar operações de conjunto para união, interseção e diferença.


---


## Panorama

| Coleção | Literal | Ordenada | Mutável | Duplicatas | Busca por |
| --- | --- | --- | --- | --- | --- |
| `list` | `[1, 2]` | Sim | Sim | Sim | Índice |
| `tuple` | `(1, 2)` | Sim | Não | Sim | Índice |
| `dict` | `{"id": 1}` | Sim (inserção) | Sim | Chaves únicas | Chave |
| `set` | `{1, 2}` | Não | Sim | Não | Pertencimento |

*Dicionários preservam a ordem de inserção desde o Python 3.7; conjuntos não têm ordem.*


---


## Listas: Acesso

```python
numbers = [10, 20, 30, 40, 50]

print(numbers[0], numbers[-1])   # 10 50
print(numbers[1:4])              # [20, 30, 40]
print(numbers[::-1])             # invertida

numbers[0] = 99                  # mutável
print(len(numbers), 30 in numbers, numbers.index(30))
```


---


## Listas: Métodos Mutadores

| Método | Efeito |
| --- | --- |
| `append(x)` | Adiciona ao final |
| `extend(iterável)` | Adiciona todos os itens |
| `insert(i, x)` | Insere na posição |
| `remove(x)` | Remove a primeira ocorrência |
| `pop([i])` | Remove e **devolve** |
| `sort()` / `reverse()` | Ordena / inverte no lugar |

*Todos devolvem `None`: `lista = lista.sort()` destrói a lista.*


---


## Ordenação

```python
print(sorted(words))                  # nova lista
print(sorted(words, key=len))         # por comprimento
print(sorted(people, key=lambda p: p[1]))   # por idade
print(sorted(words, reverse=True))

numbers.sort()                        # no lugar, devolve None
```

| Forma | Altera original | Devolve |
| --- | --- | --- |
| `lista.sort()` | Sim | `None` |
| `sorted(lista)` | Não | Nova lista |


---


## Cópia Rasa e Profunda

```python
import copy

original = [1, 2, [3, 4]]
reference = original            # mesmo objeto
shallow = original.copy()       # copia o nível 1
deep = copy.deepcopy(original)  # copia tudo

original[2].append(5)
print(shallow)   # [1, 2, [3, 4, 5]] — aninhado compartilhado
print(deep)      # [1, 2, [3, 4]]
```


---


## Tuplas

```python
point = (10, 20)
single = (42,)        # a vírgula é obrigatória
not_a_tuple = (42)    # apenas o número

x, y = point                  # desempacotamento
first, *rest = (1, 2, 3, 4)
```

- É a **vírgula** que define a tupla, não os parênteses.
- Imutável: `point[0] = 99` levanta `TypeError`.


---


## Quando Usar Tupla

```python
def min_max(values):
    return min(values), max(values)       # retorno múltiplo

distances = {("joao-pessoa", "recife"): 120}   # chave composta

rgb = (255, 128, 0)                       # registro de tamanho fixo
```

*Tupla com lista dentro deixa de ser hasheável: `(1, [2])` não serve como chave.*


---


## Dicionários: Leitura

```python
user = {"id": 1, "name": "Ana"}

print(user["name"])
print(user.get("email"))                  # None
print(user.get("email", "não informado"))
print("id" in user)

user.setdefault("tags", []).append("admin")
```

*Colchetes levantam `KeyError`; `get()` devolve um padrão.*


---


## Dicionários: Escrita

```python
config = {"host": "localhost", "port": 5432}

config["debug"] = True                  # cria
config["port"] = 3306                   # atualiza
config.update({"timeout": 30})
removed = config.pop("debug")
del config["timeout"]

merged = defaults | config              # união (3.9+)
```


---


## Dicionários: Iteração

```python
scores = {"ana": 9.5, "bia": 8.0}

for name, score in scores.items():
    print(f"{name:<6}{score:>5.1f}")

print(max(scores, key=scores.get))          # maior nota
print(sum(scores.values()) / len(scores))   # média
```

| Método | Produz |
| --- | --- |
| `keys()` | Chaves (padrão) |
| `values()` | Valores |
| `items()` | Pares `(chave, valor)` |


---


## Conjuntos

| Operação | Operador |
| --- | --- |
| União | `a \| b` |
| Interseção | `a & b` |
| Diferença | `a - b` |
| Diferença simétrica | `a ^ b` |
| Subconjunto | `a <= b` |

```python
empty = set()      # {} cria um DICIONÁRIO vazio
```


---


## Removendo Duplicatas

```python
visits = ["ana", "bia", "ana", "caio"]

print(set(visits))                     # únicos, sem ordem
print(sorted(set(visits)))             # únicos, ordenados
print(list(dict.fromkeys(visits)))     # únicos, ordem preservada

print("bot" in banned)                 # busca muito rápida
```

*Elementos precisam ser hasheáveis: `{[1, 2]}` levanta `TypeError`.*


---

## Escolhendo a Coleção (Parte 1)

```txt
Tem rótulo/identificador?  ──sim──▶  dict
        │não
        ▼
Quero apenas únicos?       ──sim──▶  set
        │não
```

---

## Escolhendo a Coleção (Parte 2)

```txt
        ▼
O conteúdo muda depois?    ──sim──▶  list
        │não
        ▼
                                     tuple
```

---


## Exercício

Crie `agenda.py` gerenciando contatos em memória:

1. Dicionário de contatos, cada valor com `nome`, `telefone` e `tags`;
2. Funções para adicionar, remover e buscar por identificador;
3. Use `get()` para evitar `KeyError` na busca;
4. Liste os contatos ordenados por nome, em colunas;
5. Reúna todas as tags em um conjunto e mostre-as ordenadas.


---


## Solução do Exercício

```python
contacts = {}


def add(identifier, name, phone, tags=None):
    contacts[identifier] = {"name": name, "phone": phone, "tags": set(tags or [])}


def find(identifier):
    return contacts.get(identifier, {"name": "não encontrado"})


for contact in sorted(contacts.values(), key=lambda item: item["name"]):
    print(f"{contact['name']:<14}{contact['phone']:<18}{', '.join(sorted(contact['tags']))}")
```


---

## Resumo da Aula (Parte 1)

- `list` é a coleção de uso geral; `tuple` é a versão imutável e hasheável.
- Métodos mutadores devolvem `None`: `sorted()` copia, `sort()` altera no lugar.
- Cópia rasa duplica só o primeiro nível; use `deepcopy` para estruturas aninhadas.

---

## Resumo da Aula (Parte 2)

- `dict` associa chaves únicas a valores; `get()` evita `KeyError`.
- `set` elimina duplicatas e oferece união, interseção e diferença.
- `set()` cria conjunto vazio — `{}` cria dicionário.