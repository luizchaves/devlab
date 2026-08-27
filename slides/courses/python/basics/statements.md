---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Python: Decisão e Repetição"
description: "Slides da aula de estruturas de controle em Python: indentação, if/elif/else, match/case, for, while, break, continue e else de laço."
---

<!-- _class: lead -->

# Python: Decisão e Repetição

Indentação como sintaxe, `if`/`elif`/`else`, `match`/`case`, `for`, `while` e controle de fluxo.

---

## Objetivo

Escolher caminhos e repetir trabalho com clareza:

- Escrever blocos corretamente **indentados** (4 espaços).
- Encadear decisões com `if`/`elif`/`else`.
- Aplicar **casamento de padrões** com `match`/`case` (3.10+).
- Percorrer iteráveis com `for`, `range`, `enumerate` e `zip`.
- Repetir por condição com `while` e controlar o fluxo com `break`, `continue` e `else`.

---

## Blocos e Indentação

```python
temperature = 32

if temperature > 30:
    print("Está quente")     # dentro do bloco
    print("Beba água")
print("Fim da checagem")     # fora do bloco
```

- Recuo padrão: **4 espaços** (PEP 8); não misture tabs e espaços.
- Bloco vazio precisa de `pass`.
- Recuo errado não é estilo: é `IndentationError` ou mudança de comportamento.

---

## `if`, `elif`, `else`

```python
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "D"
```

- Apenas o **primeiro** bloco verdadeiro executa.
- A ordem importa: comece pela condição mais restritiva.

---

## Testes Idiomáticos

```python
if not items:          # lista vazia
    ...
if not name:           # string vazia
    ...
if user is None:       # explícito para ausência de valor
    ...
if 18 <= age < 65 and has_ticket:
    ...
```

*Cláusula de guarda: trate os casos de saída no início e retorne cedo, em vez de aninhar `if`.*

---

## `match` e `case`

```python
match command.split():
    case ["sair"] | ["quit"]:
        return "encerrando"
    case ["abrir", filename]:
        return f"abrindo {filename}"
    case ["mover", x, y]:
        return f"movendo para ({x}, {y})"
    case ["ajuda", *topics] if topics:
        return f"ajuda sobre: {', '.join(topics)}"
    case _:
        return "comando desconhecido"
```

---

## Padrões Disponíveis

| Padrão | Casa com |
| --- | --- |
| `case 404:` | Valor exato |
| `case "a" \| "b":` | Alternativas |
| `case [x, y]:` | Sequência de dois itens |
| `case [first, *rest]:` | Primeiro item e resto |
| `case {"id": id}:` | Dicionário com a chave |
| `case Point(x=0):` | Instância com atributo |
| `case x if x > 10:` | Padrão com guarda |
| `case _:` | Qualquer valor |

---

## Armadilha do `match`

```python
status = "ok"

match value:
    case status:        # CAPTURA o valor, sempre casa!
        ...
```

- `case NOME:` **captura**, não compara com a variável existente.
- Para comparar, use nome qualificado (`case Status.OK:`) ou guarda (`case v if v == status:`).

---

## Laço `for`

```python
for language in ["Python", "Go"]:
    print(language)

for char in "Py":
    print(char)

for key, value in {"id": 1, "name": "Ana"}.items():
    print(key, value)
```

*Não existe `for (i = 0; i < n; i++)`: o `for` percorre iteráveis.*

---

## `range`

```python
print(list(range(5)))          # [0, 1, 2, 3, 4]
print(list(range(2, 6)))       # [2, 3, 4, 5]
print(list(range(0, 10, 3)))   # [0, 3, 6, 9]
print(list(range(5, 0, -1)))   # [5, 4, 3, 2, 1]
```

- O limite superior é **exclusivo**.
- `range` gera os valores sob demanda, sem criar a lista inteira.

---

## `enumerate` e `zip`

```python
for index, language in enumerate(languages, start=1):
    print(f"{index}. {language}")

for language, year in zip(languages, years):
    print(f"{language} surgiu em {year}")
```

*Evite `for i in range(len(items))`: use `enumerate` quando precisar do índice.*

---

## Laço `while`

```python
total, number = 0, 1

while number <= 5:
    total += number
    number += 1

print(total)   # 15
```

- Indicado quando o número de repetições **não** é conhecido antes.
- Faltou atualizar a variável de controle? Laço infinito (<kbd>Ctrl</kbd>+<kbd>C</kbd> interrompe).

---

## `break`, `continue`, `pass`

```python
for number in range(1, 10):
    if number % 2 == 0:
        continue      # pula esta iteração
    if number > 7:
        break         # encerra o laço
    print(number, end=" ")
```

| Comando | Efeito |
| --- | --- |
| `break` | Encerra o laço |
| `continue` | Vai para a próxima iteração |
| `pass` | Não faz nada (bloco vazio) |

---

## `for ... else`

```python
for value in [1, 7, 13]:
    if value == 42:
        print("encontrado")
        break
else:
    print("não encontrado no conjunto")
```

- O `else` executa quando o laço termina **sem** `break`.
- Substitui o padrão de criar uma variável `found = False`.

---

## Laços Aninhados

```python
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i} x {j} = {i * j:<3}", end="")
    print()
```

- `break` interrompe apenas o laço **mais interno**.
- Para sair dos dois, extraia para uma função e use `return`.

---

## Exercício

Crie `menu.py`, um menu de terminal que roda até o usuário sair:

1. Opções: somar, listar, contar e sair;
2. Use `while True` com `break` na saída;
3. Trate a opção com `match` em vez de `if` encadeado;
4. Na opção "somar", leia números até a entrada vazia;
5. Na opção "listar", percorra uma lista com `enumerate`.

---

## Solução do Exercício

```python
while True:
    print("\n[1] Somar  [2] Listar  [3] Contar  [4] Sair")
    option = input("Opção: ").strip()

    match option:
        case "1":
            sum_numbers()
        case "2":
            list_items()
        case "3":
            countdown()
        case "4":
            print("Até logo!")
            break
        case _:
            print("Opção inválida.")
```

---

## Resumo da Aula

- A **indentação** delimita blocos: 4 espaços, sem misturar tabs.
- Em `if`/`elif`/`else`, apenas o primeiro bloco verdadeiro executa.
- `match`/`case` (3.10+) compara **e** desestrutura sequências, dicionários e objetos.
- `case NOME:` captura o valor — não compara com uma variável existente.
- `for` percorre iteráveis; `range` tem fim exclusivo e `enumerate` fornece o índice.
- `for ... else` executa o `else` quando **nenhum** `break` aconteceu.
