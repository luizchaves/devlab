---
title: 'JavaScript: Strings e Template Literals'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Strings e Template Literals

## Objetivo
- Compreender o tipo de dado String em JavaScript, reconhecer a imutabilidade das strings.

## Criação e Literais de String
- Delimitador: Nome; Uso Principal
- `'...'`: Aspas Simples; Literal de texto simples
- `"..."`: Aspas Duplas; Literal de texto simples
- `` `...` ``: Template Literal; Interpolação e textos multilinhas
- Em JavaScript, uma String é uma sequência de caracteres imutável usada para representar texto.
- As strings podem ser criadas utilizando três tipos de delimitadores: aspas simples (`'`).

## Conversão para String
- Função `String(valor)`: É a forma mais direta e segura de conversão explícita.
- Método `.toString()`: Método presente no protótipo da maioria dos tipos de dados (números, booleanos, arrays.
- Literais numéricos exigem cuidado ao chamar `.toString()` diretamente.
- `.toString(radix)` converte números para bases como binário, octal ou hexadecimal.
- Qualquer tipo de dado em JavaScript pode ser convertido para String de forma explícita ou implícita.

## Caracteres de Escape e Unicode
- Sequência: Descrição; Exemplo
- `\'`: Aspa simples literal; `'D\'água'`
- `\"`: Aspa dupla literal; `"Disse: \"Olá!\""`
- `\\`: Barra invertida literal; `"C:\\Arquivos"`
- `\n`: Nova linha (Line Feed); `"Linha 1\nLinha 2"`
- `\t`: Tabulação (Tab); `"Item:\tValor"`

## Imutabilidade e Acesso por Índice
- Strings em JavaScript são primitivos imutáveis.
- Isso significa que, uma vez criada, uma string não pode ter seus caracteres alterados individualmente.
### Notação de Colchetes e .at()
- Os caracteres de uma string podem ser lidos por índices inteiros a partir do zero (`0`), similar a um array.
### Inspeção de Códigos Unicode com `codePointAt()`
- Cada caractere possui um número inteiro correspondente na tabela Unicode (por exemplo.
- Dê preferência ao método `.codePointAt()` em relação ao antigo `.charCodeAt()`.
- Para realizar o caminho inverso (converter um número de código Unicode em caractere).

## Concatenação e Template Literals
### Concatenação com o Operador `+`
- O operador `+` realiza a junção de strings.
- Se um dos operandos for uma string, o outro será convertido para string automaticamente (coerção).
### Template Literals (Interpolação de Expressões)
- Elas também suportam textos multilinhas sem a necessidade de `\n`.

## Métodos do Objeto String
- O objeto `String` oferece um rico conjunto de métodos para buscar, fatiar, transformar e formatar textos.
### 1. Busca e Inspeção
- `includes(search)`: Verifica se a string contém o trecho informado; `boolean`
- `startsWith(search)`: Verifica se a string começa com o trecho informado; `boolean`
- `indexOf(search)`: Retorna o primeiro índice onde o trecho foi encontrado; Índice ou `-1`
- `lastIndexOf(search)`: Retorna o último índice onde o trecho foi encontrado; Índice ou `-1`
- Métodos usados para verificar a existência de padrões ou localizar posições de caracteres em uma string.
### 2. Extração e Fatiamento
- `split(separator)`: Divide a string em um array utilizando o separador informado; Novo `Array`
- Métodos usados para extrair partes de uma string ou dividi-la em um array de pedaços.
### 3. Transformação e Ajustes de Formato
- `toUpperCase()`: Converte todos os caracteres para maiúsculas; Nova `string`
- `toLowerCase()`: Converte todos os caracteres para minúsculas; Nova `string`
- `trim()`: Remove espaços em branco do início e do final; Nova `string`
- `trimStart()` / `trimEnd()`: Remove espaços apenas do início ou apenas do final; Nova `string`
- `padStart(targetLength, pad)`: Preenche o início até atingir o tamanho alvo; Nova `string`
### 4. Comparação de Strings e `localeCompare()`
- Tipo de Comparação: Sintaxe / Exemplo; Resultado
- Operador `>`: `"á" > "b"`; `true`
- `localeCompare()`: `"á".localeCompare("b", "pt-BR")`; `-1` (negativo)
- Ignorando case e acentos: `"á".localeCompare("A", "pt-BR", { sensitivity: 'base' })`; `0`
- Comparação por Unicode (Operadores ``)
### 5. Métodos que Aceitam Expressões Regulares (Regex)
- `match(regex)`: Sim; Busca correspondências do padrão regex na string
- `matchAll(regex)`: Sim (requer flag `/g`); Retorna um iterador com todas as correspondências e grupos de captura
- `search(regex)`: Sim; Retorna a posição do primeiro caractere que casa com a regex
- `replace(regex, sub)`: Sim; Substitui o padrão encontrado pela string de substituição
- `replaceAll(regex, sub)`: Sim (requer flag `/g`); Substitui todas as ocorrências do padrão regex
### 6. Normalização de Unicode com `normalize()`
- Forma Composta (NFC): Um único ponto de código Unicode (ex: `"é"` como `"\u00E9"`).
- Forma Decomposta (NFD): O caractere base acompanhado do caractere combinador de acento (ex: `"e"` + `"\u0301"`).
- Em Unicode, um mesmo caractere acentuado pode ser representado de duas formas diferentes na memória
- O método `str.normalize(form)` padroniza a string em uma das formas normais Unicode (`"NFC"` ou `"NFD"`).

## O Tipo Primitivo Symbol
- Diferente de strings ou números, cada valor criado por `Symbol()` é único na memória.
### 1. Propriedades de Objetos e Não-Enumerabilidade
- Não Enumerabilidade: Propriedades com chave `Symbol` não aparecem em loops `for...in`.
- Acesso Direto e Reflexão: Para listar as chaves de símbolos de um objeto.
### 2. Registro Global de Símbolos (`Symbol.for` e `Symbol.keyFor`)
- `Symbol.for(chave)`: Procura um símbolo no registro global com o nome fornecido. Se existir, ele é retornado.
- Quando é necessário reutilizar o mesmo símbolo em diferentes arquivos, módulos ou escopos da aplicação.
### 3. Símbolos Conhecidos (*Well-Known Symbols*)
- Símbolo Nativo: Propósito / Aplicação
- `Symbol.iterator`: Define o método de iteração padrão para loops `for...of` e espalhamento `...`.
- `Symbol.toPrimitive`: Customiza a coerção de tipo quando o objeto é convertido para `string` ou `number`.
- `Symbol.toStringTag`: Personaliza o rótulo retornado por `Object.prototype.toString.call(obj)`.
- `Symbol.hasInstance`: Personaliza o resultado do operador `instanceof`.

## Resumo e Boas Práticas
- Lembre-se de que strings são imutáveis; métodos sempre retornam novas strings.
- Utilize `slice()` em vez do obsoleto `substr()`.
- Lembre-se de que `.length` mede unidades de código de 16 bits.
- Dê preferência a Template Literals (crases) para concatenar variáveis ou criar HTML multilinha.
- Sanitize dados de entrada de formulários usando `.trim()` e `.toLowerCase()`.
- Prefira aspas simples (`'`) ou duplas (`"`) de forma consistente no seu projeto.

## Síntese de Estudo
- **Página**: aprofunda conceitos, exemplos e exercícios
- **Slides**: organizam a exposição em sala
- **Mapa mental**: revisa relações entre tópicos
- **Prática**: execute os exemplos antes de memorizar regras
