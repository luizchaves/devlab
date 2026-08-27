---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Python: Erros e Exceções"
description: "Slides da aula de tratamento de erros em Python: try/except/else/finally, exceções embutidas, raise, exceções próprias e gerenciadores de contexto."


---



<!-- _class: lead -->

# Python: Erros e Exceções

`try`/`except`/`else`/`finally`, hierarquia de exceções, `raise`, exceções próprias e `with`.



---



## Objetivo

Decidir o que fazer quando o esperado não acontece:

- Diferenciar **erro de sintaxe** de **exceção** em tempo de execução.
- Capturar exceções **específicas** com `try`/`except`.
- Usar `else` e `finally` com propósito claro.
- Levantar exceções com `raise` e encadear com `from`.
- Criar exceções próprias e usar gerenciadores de contexto.



---



## Sintaxe x Execução

```python
# Erro de sintaxe: nenhuma linha executa
# print("faltou fechar"

numbers = [1, 2, 3]
print("antes")
print(numbers[10])   # IndexError em tempo de execução
```

- Erro de sintaxe: detectado na compilação do arquivo.
- Exceção: acontece durante a execução e **pode ser tratada**.



---



## Lendo o Traceback

```txt
Traceback (most recent call last):
  File "main.py", line 6, in <module>
    print(numbers[10])
          ~~~~~~~^^^^
IndexError: list index out of range
```

*Leia de **baixo para cima**: a última linha traz o tipo e a mensagem.*



---



## Exceções Embutidas

| Exceção | Situação |
| --- | --- |
| `ValueError` | Tipo certo, valor inadequado (`int("abc")`) |
| `TypeError` | Tipos incompatíveis (`"1" + 1`) |
| `KeyError` / `IndexError` | Chave ou índice inexistente |
| `AttributeError` | Atributo inexistente |
| `FileNotFoundError` | Arquivo não encontrado |
| `ZeroDivisionError` | Divisão por zero |



---

## Hierarquia (Parte 1)

```txt
BaseException
├── SystemExit
├── KeyboardInterrupt
└── Exception
```

---

## Hierarquia (Parte 2)

```txt
    ├── ArithmeticError ── ZeroDivisionError
    ├── LookupError ────── KeyError, IndexError
    ├── OSError ────────── FileNotFoundError
    ├── ValueError
    └── TypeError
```

*Capture `Exception`, nunca `BaseException` — esta última engole `Ctrl+C`.*

---


## `try` / `except` (Parte 1)

```python
def to_int(raw):
    try:
        return int(raw)
    except ValueError:
        print(f"'{raw}' não é um número")
        return None
```


---


## `try` / `except` (Parte 2)

```python
except (KeyError, IndexError) as error:      # vários tipos
    print(f"{type(error).__name__}: {error}")
```

*`except:` genérico esconde bugs e captura `KeyboardInterrupt`.*


---



## `else` e `finally`

| Bloco | Executa quando |
| --- | --- |
| `try` | Sempre; só o trecho arriscado |
| `except` | Houve exceção correspondente |
| `else` | O `try` terminou **sem** exceção |
| `finally` | **Sempre** — limpeza garantida |

*Mantenha o `try` curto: mova o caso feliz para o `else`.*



---


## Estrutura Completa (Parte 1)

```python
try:
    file = open(path, encoding="utf-8")
    content = file.read()
except FileNotFoundError:
    return {"debug": False}
```


---


## Estrutura Completa (Parte 2)

```python
else:
    return {"debug": "debug=true" in content}
finally:
    if file is not None:
        file.close()
```


---



## `raise`

```python
def withdraw(balance, amount):
    if amount <= 0:
        raise ValueError("o valor deve ser positivo")
    if amount > balance:
        raise ValueError(f"saldo insuficiente: R$ {balance:.2f}")
    return balance - amount
```

*Sinalize condições inválidas com exceção, não com valor de retorno especial.*



---



## Encadeamento

```python
try:
    return int(raw)
except ValueError as error:
    raise ValueError(f"porta inválida: {raw!r}") from error
```

```python
except Exception:
    print("[auditoria] falha registrada")
    raise            # relança preservando o traceback
```



---



## Exceções Próprias

```python
class StoreError(Exception):
    """Erro base da loja."""


class OutOfStockError(StoreError):
    def __init__(self, product, available):
        super().__init__(f"{product} indisponível (restam {available})")
        self.product = product
```

*Uma exceção base por domínio permite capturar tudo de uma vez ou tratar casos específicos.*



---


## Gerenciadores de Contexto (Parte 1)

```python
with open("dados.txt", encoding="utf-8") as file:
    print(file.read())
# arquivo fechado aqui, com ou sem exceção
```


---


## Gerenciadores de Contexto (Parte 2)

```python
from contextlib import contextmanager

@contextmanager
def timed(label):
    started = time.perf_counter()
    try:
        yield
    finally:
        print(f"{label}: {(time.perf_counter()-started)*1000:.2f} ms")
```


---



## EAFP

```python
# EAFP — "é mais fácil pedir perdão que permissão" (idiomático)
try:
    value = data["chave"]
except KeyError:
    value = padrao

# LBYL — verificar antes
value = data["chave"] if "chave" in data else padrao
```

*O limite é a legibilidade: condições esperadas e frequentes ficam melhores com `if`.*



---



## Exercício

Crie `safe_calculator.py`, uma calculadora que não quebra:

1. Trate `ValueError` na conversão, pedindo nova entrada;
2. Trate `ZeroDivisionError` na divisão;
3. Busque a operação em um dicionário e trate `KeyError`;
4. Use `else` para exibir o resultado e `finally` para registrar no histórico;
5. Trate `KeyboardInterrupt` encerrando com mensagem amigável.



---


## Solução do Exercício (Parte 1)

```python
try:
    operation = OPERATIONS[symbol]
    result = operation(first, second)
except KeyError:
    print(f"operação {symbol!r} não suportada")
```


---


## Solução do Exercício (Parte 2)

```python
except ZeroDivisionError:
    print("divisão por zero não é permitida")
else:
    print(f"{first} {symbol} {second} = {result}")
finally:
    history.append(f"{first} {symbol} {second}")
```


---


## Resumo da Aula (Parte 1)

- Erro de sintaxe impede a execução; exceção acontece durante e pode ser tratada.
- Leia o traceback **de baixo para cima**: tipo e mensagem primeiro.
- Capture o tipo **específico**; `except:` genérico esconde bugs.


---


## Resumo da Aula (Parte 2)

- `else` guarda o caso feliz; `finally` garante a limpeza.
- `raise ... from` preserva a causa; `raise` sozinho relança sem perder o traceback.
- `with` é o `try`/`finally` embutido no objeto — use sempre com arquivos.