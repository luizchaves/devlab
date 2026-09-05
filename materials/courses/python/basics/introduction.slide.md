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
title: "Python: Introdução"
description: "Slides da aula de introdução ao Python: origem, PEPs, implementações, características, instalação com uv, REPL e execução de scripts."

---


<!-- _class: lead -->

# Python: Introdução

Origem, PEPs, CPython, características da linguagem, instalação com uv, REPL e execução de scripts.


---


## Objetivo

Preparar o ambiente e entender o que é Python antes de escrever código:

- Conhecer a **origem** da linguagem e o processo de evolução por **PEPs**.
- Diferenciar a **linguagem** das suas **implementações** (CPython, PyPy, MicroPython).
- Reconhecer as características fundamentais: interpretada, dinâmica, forte, multiparadigma.
- Instalar o interpretador com **uv** e verificar a versão.
- Usar o **REPL** e executar o primeiro script `.py`.


---

## Por Que Python Importa? (Parte 1)

- **Automação**: scripts de terminal, manipulação de arquivos, integração de sistemas.
- **Dados e IA**: `pandas`, `NumPy`, PyTorch e scikit-learn expõem API em Python.
- **Web**: Django, Flask e FastAPI para APIs e aplicações completas.

---

## Por Que Python Importa? (Parte 2)

- **Infraestrutura**: Ansible, AWS CLI e automação de nuvem.
- **Ensino**: sintaxe próxima do pseudocódigo, com pouco ruído sintático.

*Filosofia da linguagem (PEP 20): "legibilidade conta" e "explícito é melhor que implícito".*

---

## Origem e Evolução (Parte 1)

- **1991**: Guido van Rossum publica a versão 0.9.0 no CWI (Holanda).
- **Nome**: homenagem ao grupo de humor *Monty Python's Flying Circus*.
- **2008**: Python 3.0 quebra a compatibilidade — `print()` vira função, texto é Unicode.

---

## Origem e Evolução (Parte 2)

- **2020**: fim do suporte ao Python 2.7; hoje só existe Python 3.
- **2021**: Python 3.10 traz `match`/`case`.
- **2025**: Python 3.14, versão de referência deste guia.

---


## O Processo de PEPs

| PEP | Assunto | Por que importa |
| --- | --- | --- |
| **PEP 8** | Guia de estilo | 4 espaços, `snake_case`, organização de imports |
| **PEP 20** | Zen do Python | Princípios de projeto da linguagem |
| **PEP 257** | Docstrings | Convenção de documentação no código |
| **PEP 484** | Anotações de tipo | Base do `typing` e da checagem estática |
| **PEP 634** | `match`/`case` | Casamento de padrões estruturais |

Rode `import this` no REPL para ver a PEP 20 impressa.


---


## Linguagem x Implementação

| Implementação | Escrita em | Uso típico |
| --- | --- | --- |
| **CPython** | C | Padrão de qualquer instalação |
| **PyPy** | RPython | Execução mais rápida via JIT |
| **MicroPython** | C | Microcontroladores (ESP32, Pico) |
| **Jython / IronPython** | Java / C# | Integração com JVM e .NET |


---


## Do Arquivo à Execução

```txt
main.py  ──▶  Compilação  ──▶  Bytecode (.pyc)  ──▶  Máquina Virtual  ──▶  Saída
              (automática)      __pycache__/          (CPython)
```

- A compilação é automática: não existe passo manual de build.
- O `.pyc` é cache de bytecode, **não** um binário nativo.
- `__pycache__/` é conteúdo derivado e deve entrar no `.gitignore`.


---


## Características da Linguagem

| Característica | Na prática |
| --- | --- |
| **Interpretada** | `uv run main.py` executa direto |
| **Tipagem dinâmica** | O tipo pertence ao valor, não à variável |
| **Tipagem forte** | `"1" + 1` levanta `TypeError` |
| **Indentação significativa** | Blocos por recuo, sem chaves |
| **Multiparadigma** | Imperativo, funcional e orientado a objetos |
| **Tudo é objeto** | Números, funções e módulos têm atributos |
| **Baterias inclusas** | JSON, HTTP, CSV, datas e testes na biblioteca padrão |


---


## Dinâmica e Forte

```python
value = 42          # int
value = "quarenta"  # a mesma variável passa a referenciar uma str

print(type(value))  # <class 'str'>

total = "1" + 1     # TypeError: can only concatenate str to str
total = int("1") + 1
print(total)        # 2
```

- **Dinâmica**: a variável muda de tipo livremente.
- **Forte**: nenhuma conversão acontece por conta própria.


---


## Instalação com uv

```bash
# macOS e Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

uv python install 3.14
uv run python --version
```

- O uv instala o próprio interpretador: não é preciso instalar Python antes.
- O comando fica **igual** nos três sistemas operacionais.


---


## O REPL

```txt
>>> 2 + 3 * 4
14
>>> name = "DevLab"
>>> f"Olá, {name}!"
'Olá, DevLab!'
>>> help(str.upper)
>>> exit()
```

- `_` guarda o último resultado; `dir(obj)` lista atributos; `type(obj)` mostra o tipo.
- No REPL a expressão já é impressa; em um arquivo `.py` é preciso `print()`.


---


## Estrutura de um Programa

```python
"""Relatório de vendas do dia."""

TAX_RATE = 0.1  # constante por convenção


def total_with_tax(amount):
    """Devolve o valor com imposto."""
    return amount * (1 + TAX_RATE)


def main():
    print(f"Total: R$ {total_with_tax(500):.2f}")


if __name__ == "__main__":
    main()
```


---


## `if __name__ == "__main__"`

- Executa **somente** quando o arquivo é rodado diretamente.
- Ao importar o módulo, `__name__` recebe o nome do módulo e o bloco é ignorado.
- Garante que importar um arquivo nunca dispare efeitos colaterais.

```bash
uv run main.py        # __name__ == "__main__"
uv run python -c "import main"   # __name__ == "main"
```


---


## Executando na Prática

```python
# hello.py
name = input("Qual é o seu nome? ")
print(f"Olá, {name}! Bem-vindo ao Python.")
```

```bash
uv run hello.py
uv run python -c "print(sum(range(1, 101)))"   # 5050
```

- `uv run <arquivo>` sincroniza o ambiente e executa.
- `python3 <arquivo>` faz o mesmo quando o ambiente já está pronto.


---


## Armadilhas Comuns

- **Tutorial de Python 2**: `print "texto"` sem parênteses não roda no Python 3.
- **Tabs misturados com espaços**: gera `TabError`; configure 4 espaços no editor.
- **Arquivo com nome de módulo padrão**: `random.py` no projeto quebra o `import random`.
- **Esquecer `print()`**: em arquivo, a expressão é avaliada e descartada.


---


## Exercício

Crie `profile.py` que se apresente e mostre dados do ambiente:

1. Peça nome, cidade e ano de nascimento com `input()`;
2. Calcule a idade aproximada e imprima uma frase com f-string;
3. Mostre a versão do Python e a plataforma usando o módulo `sys`;
4. Proteja a execução com `if __name__ == "__main__":`.


---

## Solução do Exercício (Parte 1)

```python
import sys

CURRENT_YEAR = 2026


def main():
    name = input("Nome: ")
    city = input("Cidade: ")
    birth_year = int(input("Ano de nascimento: "))

```

---

## Solução do Exercício (Parte 2)

```python
    print(f"{name}, de {city}, tem cerca de {CURRENT_YEAR - birth_year} anos.")
    print(f"Python {sys.version_info.major}.{sys.version_info.minor} em {sys.platform}")


if __name__ == "__main__":
    main()
```

---

## Resumo da Aula (Parte 1)

- Python nasceu em 1991 e evolui por **PEPs**; hoje a referência é o **Python 3.14**.
- **CPython** é a implementação padrão: compila para bytecode e executa em uma máquina virtual.
- A linguagem é **interpretada**, de tipagem **dinâmica e forte**, com **indentação significativa**.

---

## Resumo da Aula (Parte 2)

- `uv python install` e `uv run` resolvem instalação e execução nos três sistemas.
- O **REPL** serve para experimentar; o arquivo `.py` precisa de `print()` para exibir.
- `if __name__ == "__main__":` separa execução direta de importação.