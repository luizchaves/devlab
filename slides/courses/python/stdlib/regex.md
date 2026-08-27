---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Python: Expressões Regulares"
description: "Slides da aula de expressões regulares em Python: módulo re, classes, quantificadores, âncoras, grupos nomeados, substituição e flags."
---

<!-- _class: lead -->

# Python: Expressões Regulares

Módulo `re`, sintaxe de padrões, grupos nomeados, substituição, flags e quantificadores.

---

## Objetivo

Descrever padrões de texto que os métodos de `str` não alcançam:

- Escrever padrões com **classes**, **quantificadores** e **âncoras**.
- Aplicar `search`, `match`, `fullmatch`, `findall`, `finditer`, `sub` e `split`.
- Extrair partes do texto com **grupos nomeados**.
- Controlar o comportamento com **flags**.
- Diferenciar quantificadores **gulosos** de **preguiçosos**.

---

## Funções do Módulo

| Função | Devolve |
| --- | --- |
| `re.search(p, t)` | Primeiro `Match` ou `None` |
| `re.match(p, t)` | Casa no **início** |
| `re.fullmatch(p, t)` | Casa o texto **inteiro** (validação) |
| `re.findall(p, t)` | Lista de strings |
| `re.finditer(p, t)` | Iterador de `Match` |
| `re.sub(p, r, t)` | Nova string |
| `re.split(p, t)` | Lista |

---

## Sempre String Crua

```python
import re

print(re.search(r"\w+@\w+\.\w+", text))
print(re.findall(r"\d+", "a1b22c333"))     # ['1', '22', '333']
```

- Sem o prefixo `r`, o Python interpreta a barra invertida **antes** do módulo `re`.
- Convenção universal: todo padrão em `r"..."`.

---

## O Objeto `Match`

```python
found = re.search(r"(\d{2})/(\d{2})/(\d{4})", "Vence em 27/08/2026")

print(found.group())     # '27/08/2026'
print(found.group(1))    # '27'
print(found.groups())    # ('27', '08', '2026')
print(found.span())      # (9, 19)
```

*`re.search` devolve `None` quando não encontra: teste antes de usar `.group()`.*

---

## Classes de Caracteres

| Classe | Casa com |
| --- | --- |
| `.` | Qualquer caractere (exceto quebra) |
| `\d` / `\D` | Dígito / não-dígito |
| `\w` / `\W` | Letra, dígito ou `_` |
| `\s` / `\S` | Espaço em branco |
| `[abc]` | Um entre os listados |
| `[^abc]` | Qualquer um **exceto** |
| `[a-z0-9]` | Intervalos |

---

## Quantificadores

| Símbolo | Repetições |
| --- | --- |
| `*` | Zero ou mais |
| `+` | Uma ou mais |
| `?` | Zero ou uma |
| `{n}` | Exatamente `n` |
| `{n,}` | Pelo menos `n` |
| `{n,m}` | Entre `n` e `m` |

```python
print(re.findall(r"\d{5}-?\d{3}", "CEP 58000-000"))
```

---

## Âncoras

```python
print(re.findall(r"^Erro", log, re.MULTILINE))
print(re.findall(r"\bpy\w*", "python pypi copy"))   # ['python', 'pypi']
print(re.search(r"\.csv$", "relatorio.csv"))
```

| Âncora | Significado |
| --- | --- |
| `^` / `$` | Início / fim (do texto ou da linha) |
| `\b` / `\B` | Limite / não-limite de palavra |

---

## Grupos Nomeados

```python
PATTERN = r"(?P<dia>\d{2})/(?P<mes>\d{2})/(?P<ano>\d{4})"

found = re.search(PATTERN, "Entrega até 15/09/2026")
print(found.group("dia"), found.groupdict())

for match in re.finditer(PATTERN, texto):
    data = match.groupdict()
    print(f"{data['ano']}-{data['mes']}-{data['dia']}")
```

---

## `findall` e Grupos

```python
re.findall(r"https?://[\w.]+", texto)          # trechos completos
re.findall(r"(https?)://([\w.]+)", texto)      # tuplas de grupos
re.findall(r"(?:https?)://([\w.]+)", texto)    # só o domínio
```

- Sem grupos: correspondências inteiras.
- Um grupo: só o conteúdo dele. Vários: tuplas.
- `(?:...)` agrupa **sem** capturar.

---

## Substituição e Divisão

```python
print(re.sub(r"\d", "#", text))
print(re.sub(r"\((\d{2})\) (\d{5})-(\d{4})", r"+55\1\2\3", text))
print(re.sub(r"\s+", " ", "muitos     espaços"))
print(re.split(r"[;,]\s*", "ana, bia; caio"))


def mask(match):
    return match.group()[:3] + "*" * 6

print(re.sub(r"\d{5}-\d{4}", mask, text))   # substituição por função
```

---

## Flags

| Flag | Efeito |
| --- | --- |
| `re.IGNORECASE` | Ignora maiúsculas/minúsculas |
| `re.MULTILINE` | `^` e `$` casam em cada linha |
| `re.DOTALL` | `.` casa quebra de linha |
| `re.VERBOSE` | Permite espaços e comentários no padrão |

```python
re.findall(r"erro", "Erro ERRO erro", re.IGNORECASE)
```

---

## Guloso x Preguiçoso

```python
html = "<b>negrito</b> e <i>itálico</i>"

print(re.findall(r"<.+>", html))     # ['<b>negrito</b> e <i>itálico</i>']
print(re.findall(r"<.+?>", html))    # ['<b>', '</b>', '<i>', '</i>']
print(re.findall(r"<[^>]+>", html))  # mesma coisa, mais eficiente
```

*Nunca use regex para analisar HTML ou JSON: use um parser.*

---

## Compilando Padrões

```python
EMAIL = re.compile(r"^[\w.+-]+@[\w-]+\.[\w.]+$")

for candidate in candidates:
    status = "válido" if EMAIL.fullmatch(candidate) else "inválido"
```

- Prepara o padrão uma vez e deixa a intenção explícita no módulo.
- Validação de e-mail por regex é sempre **aproximada**: confirme enviando mensagem.

---

## Exercício

Crie `validators.py` com validações por regex:

1. `is_email(value)`;
2. `is_phone(value)` — aceita `(83) 90000-0000` e `83900000000`;
3. `is_cpf_format(value)` — apenas o formato `000.000.000-00`;
4. `is_strong_password(value)` — 8+ caracteres com maiúscula, minúscula, dígito e símbolo;
5. Compile os padrões no módulo e use `fullmatch`.

---

## Solução do Exercício

```python
PASSWORD = re.compile(
    r"""
    (?=.*[a-z])      # minúscula
    (?=.*[A-Z])      # maiúscula
    (?=.*\d)         # dígito
    (?=.*[^\w\s])    # símbolo
    .{8,}            # comprimento
    """,
    re.VERBOSE,
)

def is_strong_password(value):
    return PASSWORD.fullmatch(value) is not None
```

*`(?=...)` é lookahead: verifica sem consumir caracteres.*

---

## Resumo da Aula

- `search` procura em qualquer posição, `match` no início, `fullmatch` no texto inteiro.
- Escreva padrões sempre como **string crua** (`r"\d+"`).
- `\d`, `\w` e `\s` cobrem dígitos, caracteres de palavra e espaços.
- Grupos nomeados `(?P<nome>...)` deixam a extração legível via `groupdict()`.
- Quantificadores são **gulosos** por padrão; `?` os torna preguiçosos.
- `re.compile` para padrões reutilizados; nunca regex para HTML ou JSON.
