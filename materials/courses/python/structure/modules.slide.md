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
title: "Python: Módulos e Pacotes"
description: "Slides da aula de módulos e pacotes em Python: formas de import, módulos próprios, __name__, resolução de caminhos, pacotes e biblioteca padrão."


---



<!-- _class: lead -->

# Python: Módulos e Pacotes

Importação, módulos próprios, `__name__`, resolução de caminhos, pacotes e biblioteca padrão.



---



## Objetivo

Dividir o programa em arquivos com responsabilidades claras:

- Importar módulos nas diferentes formas disponíveis.
- Criar módulos e pacotes próprios com `__init__.py`.
- Explicar o papel de `__name__` e do bloco de execução.
- Descrever como o interpretador **encontra** um módulo.
- Reconhecer os módulos mais úteis da **biblioteca padrão**.



---



## O Que É um Módulo?

```python
import math

print(math.pi)          # 3.141592653589793
print(type(math))       # <class 'module'>
print(math.__name__)    # math
```

- Qualquer arquivo `.py` é um módulo.
- Ao importar, o arquivo é executado **uma única vez** e guardado em `sys.modules`.



---



## Formas de Importar

| Forma | Quando usar |
| --- | --- |
| `import modulo` | Uso esporádico; origem visível |
| `import modulo as m` | Nome longo ou convenção da comunidade |
| `from modulo import nome` | Uso frequente de poucos nomes |
| `from modulo import *` | Praticamente nunca |

```python
import statistics as stats
from pathlib import Path
from datetime import datetime as dt
```



---



## Por Que Evitar `import *`?

- Despeja todos os nomes públicos no escopo atual.
- Esconde a origem de cada nome para quem lê o código.
- Pode **sobrescrever** nomes existentes silenciosamente.
- Ferramentas de lint sinalizam e a PEP 8 desaconselha.



---



## Ordem dos Imports (PEP 8)

```python
# 1. Biblioteca padrão
import json
from pathlib import Path

# 2. Bibliotecas de terceiros
import httpx

# 3. Módulos do projeto
from app.models import User
```

*Três blocos separados por linha em branco, em ordem alfabética dentro de cada um.*



---


## Módulo Próprio (Parte 1)

```python
# calculator.py
"""Operações aritméticas do programa."""

TAX_RATE = 0.1


def add(a, b):
    return a + b
```


---


## Módulo Próprio (Parte 2)

```python
# main.py
import calculator
from calculator import add

print(add(2, 3), calculator.TAX_RATE)
```


---



## `__name__` e Execução Direta

```python
def main():
    print("Testando:", add(2, 3))


if __name__ == "__main__":
    main()
```

| Situação | Valor de `__name__` |
| --- | --- |
| `uv run calculator.py` | `"__main__"` |
| `import calculator` | `"calculator"` |

*Todo módulo deve poder ser importado sem efeitos colaterais.*



---



## Resolução de Módulos

```txt
import calculator
      │
      ├─▶ já está em sys.modules?  ──sim──▶ reutiliza
      │
      └─▶ procura em sys.path:
            diretório do script ─▶ PYTHONPATH ─▶ site-packages
                                                     │
                                          não achou ─┴─▶ ModuleNotFoundError
```



---



## Armadilha do Nome

```python
# Não crie no projeto: json.py, random.py, email.py

import random   # importa o SEU arquivo, não a biblioteca padrão
```

- O diretório do script vem **antes** das bibliotecas em `sys.path`.
- Sintoma clássico: `AttributeError` inexplicável logo após um import.



---


## Pacotes (Parte 1)

```txt
app/
├── __init__.py
├── models/
│   ├── __init__.py
│   └── product.py
└── services/
    ├── __init__.py
    └── pricing.py
```


---


## Pacotes (Parte 2)

```python
# app/__init__.py
from app.models.product import Product

__all__ = ["Product"]
```


---



## Imports Absolutos x Relativos

| Estilo | Exemplo | Observação |
| --- | --- | --- |
| Absoluto | `from app.models.product import Product` | Recomendado pela PEP 8 |
| Relativo | `from ..models.product import Product` | Curto, frágil ao mover arquivos |

*Import relativo em arquivo executado direto levanta `ImportError`: rode com `uv run -m app.services.pricing`.*



---



## Biblioteca Padrão

| Módulo | Para quê |
| --- | --- |
| `pathlib` | Caminhos de arquivo |
| `json` / `csv` | Serialização e planilhas |
| `datetime` | Datas e horas |
| `re` | Expressões regulares |
| `collections` | `Counter`, `defaultdict`, `deque` |
| `itertools` / `functools` | Iteração e funções |
| `argparse` | CLI |
| `unittest` | Testes |



---



## Importações Circulares

```python
# user.py       from order import Order
# order.py      from user import User      ← ciclo
```

Três saídas:

1. Extrair o código comum para um **terceiro módulo**;
2. Mover o import para **dentro da função**;
3. Repensar as responsabilidades — o ciclo indica acoplamento excessivo.



---



## Exercício

Crie um pacote `finance/` com três módulos:

1. `interest.py` — juros simples e compostos;
2. `currency.py` — formatação em reais e conversão;
3. `report.py` — relatório usando os dois anteriores;
4. `__init__.py` — reexporte as funções e defina `__all__`;
5. `main.py` importa apenas do pacote.



---

## Solução do Exercício (Parte 1)

```python
# finance/__init__.py
from finance.currency import convert, to_brl
from finance.interest import compound, simple
from finance.report import build

__all__ = ["build", "compound", "convert", "simple", "to_brl"]
```

---

## Solução do Exercício (Parte 2)

```python
# main.py
from finance import build, to_brl

print(build(2500, 0.008, 24))
```

---


## Resumo da Aula (Parte 1)

- Todo arquivo `.py` é um módulo, executado **uma vez** e guardado em `sys.modules`.
- Prefira `import modulo` ou `from modulo import nome`; evite `import *`.
- `if __name__ == "__main__":` separa execução direta de importação.


---


## Resumo da Aula (Parte 2)

- O interpretador busca em `sys.path`: diretório do script, `PYTHONPATH`, `site-packages`.
- Nunca nomeie um arquivo como um módulo da biblioteca padrão.
- Pacotes agrupam módulos com `__init__.py`; prefira **imports absolutos**.