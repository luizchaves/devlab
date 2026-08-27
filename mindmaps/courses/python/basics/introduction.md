---
title: 'Python: Introdução'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Python: Introdução

## Ideia Central

- Linguagem interpretada, de tipagem dinâmica e forte, criada em 1991
- **CPython** é a implementação de referência; a evolução acontece por **PEPs**

## Origem e Evolução

- **1991**: Guido van Rossum publica a versão 0.9.0 no CWI
- **Nome**: homenagem ao grupo *Monty Python's Flying Circus*
- **2008**: Python 3.0 quebra a compatibilidade (`print()` vira função)
- **2020**: fim do suporte ao Python 2.7
- **2025**: Python 3.14, versão de referência do guia

## PEPs Essenciais

- **PEP 8**: guia de estilo (4 espaços, `snake_case`, imports)
- **PEP 20**: Zen do Python (`import this`)
- **PEP 257**: convenções de docstring
- **PEP 484**: anotações de tipo
- **PEP 634**: `match`/`case`

## Implementações

### CPython
- Escrita em C, padrão de qualquer instalação
- Compila para bytecode (`.pyc` em `__pycache__/`)

### Alternativas
- **PyPy**: JIT, execução mais rápida
- **MicroPython**: microcontroladores (ESP32, Pico)
- **Jython / IronPython**: JVM e .NET

## Características

- **Interpretada**: sem passo manual de compilação
- **Tipagem dinâmica**: o tipo pertence ao valor
- **Tipagem forte**: `"1" + 1` levanta `TypeError`
- **Indentação significativa**: blocos por recuo, não por chaves
- **Multiparadigma**: imperativo, funcional e orientado a objetos
- **Baterias inclusas**: JSON, HTTP, CSV, datas e testes embutidos

## Ambiente e Execução

### Instalação com uv
- `curl -LsSf https://astral.sh/uv/install.sh | sh`
- `uv python install 3.14` instala o interpretador

### Formas de executar
- `uv run arquivo.py`: script completo
- `uv run python`: REPL interativo
- `uv run python -c "código"`: trecho isolado

## Estrutura de um Programa

- **Docstring de módulo**: primeira string do arquivo
- **Constantes**: `UPPER_SNAKE_CASE` no topo
- **Funções**: lógica isolada e testável
- `if __name__ == "__main__":` separa execução direta de importação

## Boas Práticas

- **Configure o editor**: 4 espaços, nunca tabs
- **Ignore `__pycache__/`**: é conteúdo derivado
- **Desconfie de tutoriais antigos**: `print "texto"` é Python 2
- **Nunca nomeie arquivos** como módulos padrão (`random.py`, `json.py`)
