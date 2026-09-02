---
title: 'JavaScript: Expressões Regulares (RegExp)'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Expressões Regulares (RegExp)

## Objetivo
- Compreender o conceito e a sintaxe de Expressões Regulares em JavaScript.

## Criação e Flags de Expressões Regulares
- Forma de Criação: Sintaxe; Uso Recomendado
- Notação Literal: `/padrão/flags`; Padrões estáticos conhecidos em tempo de desenvolvimento
- Construtor: `new RegExp("padrão", "flags")`; Padrões dinâmicos construídos a partir de variáveis
- Em JavaScript, uma Expressão Regular é representada por um objeto do tipo `RegExp`.

## Flags (Modificadores de Comportamento)
- `i`: Ignore Case; Busca sem diferenciar letras maiúsculas de minúsculas
- `g`: Global; Busca todas as correspondências no texto, não apenas a primeira
- `m`: Multiline; Faz as âncoras `^` e `$` corresponderem ao início e fim de cada linha
- `u`: Unicode; Ativa o suporte completo a caracteres Unicode de 32-bit
- `s`: Dot All; Faz o caractere ponto (`.`) corresponder também a quebras de linha (`\n`)
- `y`: Sticky; Busca apenas a partir da posição exata de `lastIndex`

## Sintaxe Fundamental de RegExp
### 1. Classes de Caracteres
- Metacaractere: Correspondência; Equivalente
- `.`: Qualquer caractere (exceto quebra de linha); Qual caractere único
- `\d`: Qualquer dígito numérico; `[0-9]`
- `\D`: Qualquer caractere que NÃO seja dígito; `[^0-9]`
- `\w`: Caractere alfanumérico ou sublinhado; `[a-zA-Z0-9_]`
### 2. Conjuntos e Intervalos (`[...]`)
- `[abc]`: Qualquer um dos caracteres: `a`, `b` ou `c`; `/[aeiou]/` (vogais)
- `[^abc]`: Qualquer caractere EXCETO `a`, `b` ou `c` (negação); `/[^0-9]/` (não dígitos)
- `[a-z]`: Intervalo de letras minúsculas de `a` a `z`; `/[a-z]/`
- `[0-9]`: Intervalo de dígitos de `0` a `9`; `/[0-9]/`
- `[a-zA-Z0-9]`: Combinação de intervalos alfanuméricos; `/[a-zA-Z0-9]/`
### 3. Âncoras e Fronteiras
- Metacaractere: Descrição; Exemplo
- `^`: Início do texto (ou início da linha com flag `m`); `/^http/` (deve começar com http)
- `$`: Fim do texto (ou fim da linha com flag `m`); `/\.pdf$/` (deve terminar em .pdf)
- `\b`: Fronteira de palavra (limite entre `\w` e `\W`); `/\bweb\b/i`
- As âncoras não correspondem a caracteres visíveis; elas especificam posições no texto.
### 4. Quantificadores
- Quantificador: Significado; Exemplo
- `*`: 0 ou mais vezes (equivalente a `{0,}`); `/a*/`
- `+`: 1 ou mais vezes (equivalente a `{1,}`); `/\d+/`
- `?`: 0 ou 1 vez (opcional, equivalente a `{0,1}`); `/https?/` (aceita http ou https)
- `{n}`: Exatamente `n` vezes; `/\d{4}/` (exatamente 4 dígitos)
### Quantificadores Gulosos (*Greedy*) vs. Não Gulosos (*Lazy / Non-greedy*)
- Guloso (Greedy): `*`, `+`, `?`, `{n,m}`; Captura o máximo de texto
- Não Guloso (Lazy): `*?`, `+?`, `??`, `{n,m}?`; Captura o mínimo de texto
### 5. Grupos e Alternância
- Grupos Padrão: `(...)`; captura em índices numéricos (`result[1]`)
- Grupos Nomeados: `(?<nome>...)`; acessíveis via `result.groups.nome`
- Não-Captura: `(?:...)`; agrupa sem capturar no resultado
- Alternância: `|`; operador OU
### 6. Asserções (Lookaround)
- Lookahead Positivo: `(?=padrão)`; exige padrão à frente sem consumi-lo
- Lookahead Negativo: `(?!padrão)`; exige ausência de padrão à frente
- Lookbehind Positivo: `(?<=padrão)`; exige padrão atrás sem consumi-lo
- Lookbehind Negativo: `(?<!padrão)`; exige ausência de padrão atrás

## Métodos de RegExp e String
### 1. Métodos do Objeto RegExp
- `regexp.test(str)`: Testa se o padrão existe na string; `boolean` (`true` ou `false`)
- `regexp.exec(str)`: Executa a busca e retorna informações de grupos; Array de correspondência ou `null`
### 2. Métodos de String que Utilizam RegExp
- `str.search(regexp)`: Retorna o índice da primeira ocorrência ou `-1`
- `str.match(regexp)`: Retorna as correspondências encontradas; Array de correspondências ou `null`
- `str.matchAll(regexp)`: Retorna um iterador com todas as correspondências e grupos (exige flag `g`)
- `str.replace(regexp, newText)`: Substitui o padrão por novo texto, `$1`, `$<nome>` ou callback
- `str.split(regexp)`: Divide a string utilizando a RegExp como separador; Novo `Array`

## Resumo e Boas Práticas
- Teste seus padrões com casos positivos e negativos usando ferramentas como regex101.com.
- Prefira notação literal `/padrão/` para regex estáticas.
- Evite reutilizar regex com flag `g` em chamadas repetidas de `test()`.
- Use metacaracteres como `\d` (dígitos), `\w` (alfanumérico) e `\s` (espaços) para manter a expressão concisa.
- Para dividir textos por múltiplos delimitadores ou espaços irregulares, prefira `string.split(/\s+/)`.

## Síntese de Estudo
- **Página**: aprofunda conceitos, exemplos e exercícios
- **Slides**: organizam a exposição em sala
- **Mapa mental**: revisa relações entre tópicos
- **Prática**: execute os exemplos antes de memorizar regras
