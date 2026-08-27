---
title: 'Python: Arquivos, JSON e CSV'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Python: Arquivos, JSON e CSV

## Ideia Central

- Dados em memória somem no fim do programa: arquivos dão persistência
- `with` garante o fechamento; `encoding` garante a portabilidade

## Abrindo Arquivos

### Modos
- `"r"`: leitura (padrão), falha se não existir
- `"w"`: escrita, **apaga o conteúdo** existente
- `"a"`: anexa ao final
- `"x"`: criação exclusiva, falha se já existir
- `"rb"` / `"wb"`: modo binário

### Codificação
- Sempre informe `encoding="utf-8"`
- O padrão varia por sistema operacional
- Codificação errada gera `UnicodeDecodeError`

## Leitura

- `read()`: tudo em uma string
- `readlines()`: lista de linhas com `\n`
- Iterar sobre o arquivo: uma linha por vez, memória constante
- O objeto arquivo é iterável e combina com geradores

## Escrita

- `write()` não adiciona quebra de linha
- `writelines()` grava uma sequência de strings
- `print(..., file=arquivo)` acrescenta `\n` automaticamente

## pathlib

- `Path("dados") / "vendas.csv"` monta o caminho
- `name`, `stem`, `suffix`, `parent`
- `exists()`, `is_file()`, `is_dir()`, `stat()`
- `mkdir(parents=True, exist_ok=True)`
- `read_text()` e `write_text()` para operações diretas
- `glob()` e `rglob()` buscam por padrão
- `unlink()` e `rename()` removem e renomeiam

## JSON

- Mapeamento: `dict`→objeto, `list`→array, `None`→`null`
- `dumps` / `loads`: string
- `dump` / `load`: arquivo
- `indent=2` formata; `ensure_ascii=False` preserva acentos
- Entrada malformada levanta `json.JSONDecodeError`

## CSV

- `newline=""` é obrigatório ao abrir
- `reader` / `writer`: listas por posição
- `DictReader` / `DictWriter`: dicionários por nome de coluna
- Trata aspas, separadores no texto e quebras dentro do campo
- Todo valor lido é `str`: converta com `int()` ou `float()`

## Boas Práticas

- **Sempre `with open(...)`**, nunca `open()` solto
- **Informe a codificação** em toda operação de texto
- **Itere linha a linha** em arquivos grandes
- **Prefira `pathlib`** a manipular caminhos como strings
