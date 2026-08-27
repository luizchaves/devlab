---
title: 'Python: Módulos e Pacotes'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Python: Módulos e Pacotes

## Ideia Central

- Todo arquivo `.py` é um **módulo**; diretórios com `__init__.py` são **pacotes**
- O módulo é executado uma única vez e guardado em `sys.modules`

## Formas de Importar

- `import modulo`: acesso qualificado, origem visível
- `import modulo as m`: alias para nomes longos
- `from modulo import nome`: uso frequente de poucos nomes
- `from modulo import *`: **evitar** — esconde origem e sobrescreve nomes
- Ordem PEP 8: padrão → terceiros → projeto

## Módulos Próprios

### Estrutura
- Docstring do módulo no topo
- Constantes, funções e classes públicas
- Prefixo `_` marca uso interno

### Execução direta
- `__name__` vale `"__main__"` ao rodar o arquivo
- Vale o nome do módulo ao importar
- Todo módulo deve ser importável **sem efeitos colaterais**

## Resolução de Módulos

- Primeiro `sys.modules` (já carregados)
- Depois `sys.path`: diretório do script → `PYTHONPATH` → `site-packages`
- Não encontrado: `ModuleNotFoundError`
- Armadilha: arquivo com nome de módulo padrão (`random.py`) tem prioridade

## Pacotes

- `__init__.py` marca o diretório como pacote e reexporta nomes
- `__all__` define a interface pública
- **Absoluto**: `from app.models.product import Product` (recomendado)
- **Relativo**: `from ..models.product import Product` (frágil ao mover)
- Import relativo em arquivo executado direto levanta `ImportError`

## Biblioteca Padrão

- **Arquivos e dados**: `pathlib`, `json`, `csv`, `sqlite3`
- **Tempo e texto**: `datetime`, `re`, `string`
- **Estruturas**: `collections`, `itertools`, `functools`
- **Aplicação**: `argparse`, `logging`, `unittest`, `urllib.request`

## Importações Circulares

- Dois módulos que dependem um do outro geram `ImportError`
- Saídas: extrair código comum, importar dentro da função, redesenhar responsabilidades
- O ciclo costuma indicar acoplamento excessivo

## Boas Práticas

- **Imports no topo** do arquivo, em três blocos
- **Prefira imports absolutos** dentro de pacotes
- **Um módulo, uma responsabilidade**
- **Nunca use nomes de módulos padrão** para arquivos do projeto
