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
title: "Python: Arquivos, JSON e CSV"
description: "Slides da aula de arquivos em Python: modos de abertura, codificação, leitura e escrita, pathlib, serialização JSON e planilhas CSV."

---


<!-- _class: lead -->

# Python: Arquivos, JSON e CSV

Persistência em disco: `open`, `with`, `pathlib`, serialização JSON e leitura de planilhas.


---


## Objetivo

Ler e gravar dados fora da memória:

- Abrir arquivos com o **modo** e a **codificação** corretos.
- Ler inteiro ou linha a linha, e escrever ou anexar.
- Manipular caminhos com **`pathlib`**.
- Serializar e desserializar estruturas com **JSON**.
- Ler e gravar planilhas com o módulo **`csv`**.


---


## Abrindo com `with`

```python
with open("notas.txt", "w", encoding="utf-8") as file:
    file.write("Ana;9.5\n")

with open("notas.txt", encoding="utf-8") as file:
    print(file.read())

print(file.closed)   # True
```

*O `with` fecha o arquivo mesmo se ocorrer exceção.*


---


## Modos de Abertura

| Modo | Se existe | Se não existe |
| --- | --- | --- |
| `"r"` | Lê | `FileNotFoundError` |
| `"w"` | **Apaga o conteúdo** | Cria |
| `"a"` | Escreve no final | Cria |
| `"x"` | `FileExistsError` | Cria |
| `"rb"` / `"wb"` | Modo binário | — |

*`"w"` trunca o arquivo antes da primeira escrita.*


---


## Codificação

```python
Path("acentos.txt").write_text("Ação e coração\n", encoding="utf-8")

try:
    Path("acentos.txt").read_text(encoding="ascii")
except UnicodeDecodeError as error:
    print("falhou:", error.reason)
```

*Sempre informe `encoding`: o padrão varia por sistema operacional.*


---


## Leitura

```python
with open("times.txt", encoding="utf-8") as file:
    content = file.read()        # tudo em uma string

with open("times.txt", encoding="utf-8") as file:
    lines = file.readlines()     # lista de linhas

with open("times.txt", encoding="utf-8") as file:
    for number, line in enumerate(file, start=1):   # sob demanda
        print(number, line.strip())
```

*Arquivos grandes: itere sobre o objeto arquivo, memória constante.*


---


## Escrita

```python
with open("boletim.csv", "w", encoding="utf-8") as file:
    file.write("nome;nota\n")
    for line in lines:
        file.write(f"{line}\n")

with open("boletim.csv", "a", encoding="utf-8") as file:
    file.write("Duda;10.0\n")     # anexa
```

*`write()` não adiciona `\n`: inclua explicitamente.*


---


## `pathlib`

```python
from pathlib import Path

report = Path("dados") / "vendas" / "2026.csv"
report.parent.mkdir(parents=True, exist_ok=True)
report.write_text("produto;valor\n", encoding="utf-8")

print(report.name, report.stem, report.suffix)
print(report.exists(), report.stat().st_size)
```

*O operador `/` monta caminhos de forma portável.*


---


## Busca de Arquivos

```python
for path in sorted(Path("dados").rglob("*.csv")):
    print(path, path.stat().st_size)

print([p.name for p in Path(".").glob("*.py")])

target.unlink(missing_ok=True)   # remove
```

| Método | Faz |
| --- | --- |
| `glob` / `rglob` | Busca por padrão (recursiva) |
| `mkdir(parents=True)` | Cria diretórios |
| `read_text` / `write_text` | Leitura e escrita diretas |


---


## JSON: Tipos

| Python | JSON |
| --- | --- |
| `dict` | objeto |
| `list`, `tuple` | array |
| `str` | string |
| `int`, `float` | number |
| `True` / `False` | `true` / `false` |
| `None` | `null` |


---


## JSON: Escrita e Leitura

```python
import json

text = json.dumps(course, indent=2, ensure_ascii=False)   # para string
with open("curso.json", "w", encoding="utf-8") as file:
    json.dump(course, file, indent=2, ensure_ascii=False) # para arquivo

data = json.loads(text)                                   # de string
with open("curso.json", encoding="utf-8") as file:
    data = json.load(file)                                # de arquivo
```

*`ensure_ascii=False` preserva acentos legíveis no arquivo.*


---


## CSV: `reader` e `writer`

```python
import csv

with open("estoque.csv", "w", encoding="utf-8", newline="") as file:
    csv.writer(file).writerows(rows)

with open("estoque.csv", encoding="utf-8", newline="") as file:
    reader = csv.reader(file)
    header = next(reader)
    for row in reader:
        print(row[0], float(row[1]))
```

*`newline=""` é obrigatório: evita linhas em branco no Windows.*


---


## CSV: `DictReader` e `DictWriter`

```python
with open("estoque.csv", "w", encoding="utf-8", newline="") as file:
    writer = csv.DictWriter(file, fieldnames=["produto", "preco"])
    writer.writeheader()
    writer.writerows(products)

with open("estoque.csv", encoding="utf-8", newline="") as file:
    for row in csv.DictReader(file):
        print(row["produto"], float(row["preco"]))
```

*Todo valor lido de CSV é `str`: a conversão é responsabilidade do seu código.*


---


## Exercício

Crie `notes.py` mantendo anotações em JSON:

1. Guarde uma lista de dicionários (`id`, `texto`, `feito`) em `notas.json`;
2. Funções `load()` e `save()` tratando arquivo inexistente;
3. `add(texto)`, `done(id)` e `remove(id)`;
4. Trate `json.JSONDecodeError` quando o arquivo estiver corrompido;
5. Exiba as anotações em tabela, marcando as concluídas.


---

## Solução do Exercício (Parte 1)

```python
def load():
    if not DATABASE.exists():
        return []
    try:
        return json.loads(DATABASE.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        print("arquivo corrompido; recomeçando")
        return []

```

---

## Solução do Exercício (Parte 2)

```python

def save(notes):
    DATABASE.write_text(json.dumps(notes, indent=2, ensure_ascii=False), encoding="utf-8")
```

---

## Resumo da Aula (Parte 1)

- `with open(...)` garante o fechamento do arquivo, mesmo com exceção.
- `"w"` apaga o conteúdo; `"a"` anexa; `"x"` falha se o arquivo já existir.
- Informe **sempre** `encoding="utf-8"`.

---

## Resumo da Aula (Parte 2)

- Iterar sobre o arquivo lê linha a linha com memória constante.
- `pathlib` monta caminhos com `/` e traz `glob`, `mkdir`, `read_text` e `write_text`.
- `json.dump`/`load` para arquivos, `dumps`/`loads` para strings; CSV pede `newline=""`.