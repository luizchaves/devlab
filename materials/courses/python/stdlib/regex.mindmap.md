---
title: 'Python: Expressões Regulares'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Python: Expressões Regulares

## Ideia Central

- Regex é uma linguagem para descrever **padrões de texto**
- Em Python vive no módulo `re`, e todo padrão se escreve como string crua

## Funções do Módulo

- `search()`: primeira ocorrência em qualquer posição
- `match()`: casa no **início** do texto
- `fullmatch()`: casa o texto **inteiro** (validação)
- `findall()`: lista de correspondências
- `finditer()`: iterador de `Match`, com posições
- `sub()`: substituição
- `split()`: divisão por padrão
- `compile()`: prepara o padrão para reuso

## O Objeto Match

- `group()` trecho completo, `group(n)` grupo por posição
- `groups()` tupla de grupos, `groupdict()` grupos nomeados
- `span()`, `start()`, `end()` para posições
- Devolve `None` quando não encontra: teste antes de usar

## Classes de Caracteres

- `.` qualquer caractere, exceto quebra de linha
- `\d` dígito, `\w` letra/dígito/`_`, `\s` espaço
- Maiúsculas invertem: `\D`, `\W`, `\S`
- `[abc]` conjunto, `[^abc]` negação, `[a-z0-9]` intervalos

## Quantificadores

- `*` zero ou mais, `+` uma ou mais, `?` opcional
- `{n}`, `{n,}`, `{n,m}` para contagens exatas
- **Gulosos** por padrão; `?` os torna **preguiçosos**
- `<[^>]+>` costuma ser melhor que `<.+?>`

## Âncoras

- `^` início e `$` fim (do texto ou da linha com `MULTILINE`)
- `\b` limite de palavra, `\B` o oposto
- `fullmatch` dispensa `^` e `$` em validações

## Grupos

- `(...)` captura, `(?:...)` agrupa sem capturar
- `(?P<nome>...)` grupo nomeado, lido por `groupdict()`
- `|` oferece alternativas
- `findall` muda o retorno conforme a quantidade de grupos

## Substituição

- `sub(padrão, substituto, texto)`
- Referências `\1`, `\2` usam os grupos capturados
- O substituto pode ser uma **função** que recebe o `Match`
- `split` aceita padrão como separador

## Flags

- `IGNORECASE`: ignora caixa
- `MULTILINE`: `^` e `$` por linha
- `DOTALL`: `.` casa quebra de linha
- `VERBOSE`: padrão em várias linhas com comentários

## Boas Práticas

- **Sempre string crua**: `r"\d+"`
- **Compile** padrões reutilizados
- **Nunca use regex** para HTML, XML ou JSON: use um parser
- **Validação de e-mail é aproximada**: confirme enviando mensagem
