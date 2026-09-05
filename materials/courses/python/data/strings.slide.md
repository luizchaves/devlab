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
title: "Python: Strings"
description: "Slides da aula de strings em Python: criação, imutabilidade, fatiamento, métodos, f-strings, mini-linguagem de formatação e Unicode."

---


<!-- _class: lead -->

# Python: Strings

Criação, imutabilidade, índices e fatiamento, métodos de texto, f-strings e Unicode.


---


## Objetivo

Dominar o tipo mais manipulado em qualquer programa:

- Criar strings com diferentes delimitadores e escapes.
- Explicar a **imutabilidade** e suas consequências práticas.
- Acessar caracteres por índice e produzir **fatias**.
- Aplicar métodos de busca, limpeza, divisão e junção.
- Formatar valores com **f-strings** e a mini-linguagem de formato.


---


## Criação

```python
single = 'Python'
double = "Python"
with_quote = "Ela disse 'olá'"

multiline = """Primeira linha
Segunda linha"""

print(str(42), str([1, 2]))   # conversão para texto
```

- Aspas simples e duplas são equivalentes.
- Três aspas preservam quebras de linha.


---


## Escapes e Strings Cruas

| Escape | Significado |
| --- | --- |
| `\n` | Quebra de linha |
| `\t` | Tabulação |
| `\\` | Barra invertida |
| `\u00e9` | Caractere Unicode (`é`) |

```python
print("Caminho: C:\\Users\\ana")
print(r"Caminho: C:\Users\ana")    # string crua: nada é interpretado
```

*Padrões de regex sempre em string crua: `r"\d+"`.*


---


## Imutabilidade

```python
text = "python"
print(text.upper(), text)    # PYTHON python

# text[0] = "P"              # TypeError
changed = "P" + text[1:]     # cria nova string
```

- Nenhum método altera a string original: todos devolvem **novo objeto**.
- Por isso strings servem como chave de dicionário e elemento de conjunto.


---


## Concatenação Eficiente

```python
parts = ["nome", "email", "idade"]
print(", ".join(parts))       # forma eficiente

text = ""
for part in parts:
    text += part              # cria um novo objeto por iteração
```

*Muitos pedaços? Acumule em lista e finalize com `"".join(lista)`.*


---


## Índices e Fatiamento

```python
text = "Guia de Python"

print(text[0], text[-1])   # G n
print(text[0:4])           # 'Guia'
print(text[8:])            # 'Python'
print(text[::2])           # 'ud ePto'
print(text[::-1])          # invertido
print(text[100:])          # '' — fatia fora do limite não dá erro
```

*`texto[10]` levanta `IndexError`; `texto[10:20]` devolve `""`.*


---


## Fatias Úteis

| Fatia | Uso |
| --- | --- |
| `s[:n]` | Prefixo, truncar texto |
| `s[n:]` | Remover prefixo |
| `s[-n:]` | Sufixo, extensão de arquivo |
| `s[::-1]` | Inverter (palíndromos) |
| `s[::n]` | Amostragem |


---


## Caixa e Limpeza

```python
raw = "   Guia DE Python   "

print(raw.strip())            # 'Guia DE Python'
print(raw.strip().lower())    # 'guia de python'
print(raw.strip().title())    # 'Guia De Python'
print("Straße".casefold())    # 'strasse' — comparação ciente de Unicode
```

*Normalize a entrada antes de comparar: evita a maioria dos bugs de validação.*


---


## Busca e Verificação

| Método | Devolve |
| --- | --- |
| `in` | `bool` — forma idiomática |
| `find(sub)` | Índice ou `-1` |
| `index(sub)` | Índice ou `ValueError` |
| `count(sub)` | Quantidade |
| `startswith` / `endswith` | `bool` (aceita tupla) |
| `isdigit` / `isalpha` | `bool` |

```python
print(path.endswith((".csv", ".tsv")))
```


---


## Divisão e Junção

```python
print("ana;bia;caio".split(";"))    # ['ana', 'bia', 'caio']
print("um dois  três".split())      # colapsa espaços
print("a:b:c".split(":", 1))        # ['a', 'b:c']
print("chave=valor".partition("="))
print(" | ".join(["ana", "bia"]))
```

*`split()` sem argumento é diferente de `split(" ")`.*


---


## Substituição e Preenchimento

```python
print("Guia de Java".replace("Java", "Python"))
print("7".zfill(3))                   # '007'
print("total".ljust(12, "."))
print(" menu ".center(20, "="))
print("arquivo.txt".removesuffix(".txt"))
```


---


## f-strings

```python
print(f"{name} levou {items} itens")
print(f"Total: R$ {price:.2f}")
print(f"Dobro: {items * 2}")
print(f"{'centralizado':^24}|")
print(f"{width=}")             # depuração: width=3
```

- Avalia expressões dentro do literal (PEP 498, Python 3.6+).
- Mais rápida e mais curta que `%` e `.format()`.


---


## Mini-linguagem de Formato

| Formato | Efeito |
| --- | --- |
| `:.2f` | Duas casas decimais |
| `:,.2f` | Separador de milhar |
| `:>10` `:<10` `:^10` | Alinhamento |
| `:08.2f` | Preenche com zeros |
| `:.1%` | Percentual |
| `:b` `:o` `:x` | Binário, octal, hexadecimal |

```python
print(f"{name:<12}{price:>12,.2f}")
```


---


## Texto e Bytes

```python
text = "Café"
encoded = text.encode("utf-8")

print(encoded)                   # b'Caf\xc3\xa9'
print(len(text), len(encoded))   # 4 5
print(encoded.decode("utf-8"))   # 'Café'
```

- `str`: caracteres Unicode. `bytes`: octetos.
- A conversão é sempre explícita e exige uma codificação.


---


## Exercício

Crie `slug.py` que transforme títulos em identificadores de URL:

1. Leia um título e normalize (bordas e minúsculas);
2. Substitua espaços por hífens e remova pontuação;
3. Troque acentos pelos equivalentes sem acento;
4. Elimine hífens duplicados e das bordas;
5. Mostre original e slug com os comprimentos alinhados.


---


## Solução do Exercício

```python
ACCENTS = str.maketrans("áàâãéêíóôõúüç", "aaaaeeiooouuc")

title = input("Título: ").strip()
slug = title.lower().translate(ACCENTS)

for character in ".,!?:;":
    slug = slug.replace(character, "")

slug = "-".join(slug.split())
while "--" in slug:
    slug = slug.replace("--", "-")

print(f"{'Slug:':<12}{slug.strip('-'):<40}{len(slug):>4}")
```


---

## Resumo da Aula (Parte 1)

- Strings são **imutáveis**: todo método devolve um novo objeto.
- Concatenar em laço é caro; use `"".join(lista)`.
- Índice inválido levanta `IndexError`, mas fatia fora do limite devolve `""`.

---

## Resumo da Aula (Parte 2)

- `strip`, `lower` e `casefold` normalizam a entrada antes de comparar.
- `split()` e `join()` fazem a ponte entre texto e lista.
- **f-strings** interpolam expressões e formatam com `:.2f`, `:>10`, `:%` e `=`.