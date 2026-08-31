---
title: 'JavaScript: Numbers, BigInt e Math'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Numbers, BigInt e Math

## Objetivo
- Compreender o tipo de dado Number em JavaScript, reconhecer limites de precisão e números especiais (`NaN`.

## Criação e Representação Numérica
- Notação: Prefixo / Sintaxe; Exemplo
- Decimal: Nenhuma; `42` / `3.14159`
- Exponencial (Científica): `e` / `E`; `1.5e3` (1.5 × 10³)
### Panorama de literais, limites e precisão
- Constante: Ideia principal
- `Number.MAX_SAFE_INTEGER`: Maior inteiro que pode ser representado com segurança
- `Number.MIN_SAFE_INTEGER`: Menor inteiro que pode ser representado com segurança
- `Number.MAX_VALUE`: Maior valor numérico positivo representável
- `Number.MIN_VALUE`: Menor valor positivo representável acima de zero

## Limites de Precisão e Valores Especiais
### Limites de Inteiros Seguros e Imprecisão Flutuante
- IEEE 754 só representa inteiros seguros entre `-(2^53 - 1)` e `2^53 - 1`.
- Esses limites são representados pelas constantes estáticas `Number.MIN_SAFE_INTEGER` e `Number.MAX_SAFE_INTEGER`.

## Representação Numérica, `NaN` e `Infinity`
- Cenário: Operação; Resultado
- Divisão Indefinida / Operações Indeterminadas com `Infinity`: `0 / 0`, `Infinity - Infinity`, `0 * Infinity`.
- Matemática Não-Real (Raízes de Negativos): `Math.sqrt(-1)`, `Math.log(-1)`, `Math.asin(2)`; `NaN`
### Métodos Estáticos de Verificação do Number
- `Number.isNaN(val)`: Testa estritamente se o valor é `NaN` (sem coerção de tipo).; `Number.isNaN("abc")` // `false`
- `Number.isFinite(val)`: Testa se o valor é um número finito válido (não `NaN` nem `Infinity`)..
- `Number.isInteger(val)`: Testa se o valor é um número inteiro sem casas decimais.; `Number.isInteger(4.2)` // `false`
- `Number.isSafeInteger(val)`: Testa se é um inteiro dentro do limite de precisão segura..

## Conversão Numérica e Métodos do Protótipo
### Conversão Explícita: `Number()`, `parseInt()` e `parseFloat()`
- `Number(val)`: Converte a string inteira. Se houver caracteres inválidos, retorna `NaN`.; `NaN`
- `parseInt(str, radix?)`: Converte o início da string até encontrar um caractere não numérico.
- `parseFloat(str)`: Converte o início da string permitindo ponto decimal.; `42.5`
- O JavaScript oferece três funções principais para converter textos ou outros tipos em números.
- Tabela: a seguir resume suas principais diferenças
### Métodos de Instância e Formatação do Protótipo Number
- `toFixed()`: `num.toFixed(digits?)`; `string`
- `toPrecision()`: `num.toPrecision(precision?)`; `string`
- `toExponential()`: `num.toExponential(digits?)`; `string`
- `toString()`: `num.toString(radix?)`; `string`
- Os métodos do protótipo `Number.prototype` permitem formatar números em strings com casas decimais fixas.

## O Objeto Estático Math
- Como é um objeto estático, ele não possui construtor e não pode ser instanciado com `new Math()`.
### Constantes Matemáticas
- O objeto `Math` disponibiliza constantes matemáticas fundamentais prontas para uso
### Funções de Arredondamento
- `Math.floor(x)`: Arredonda sempre para baixo (menor inteiro).; `3`
- `Math.ceil(x)`: Arredonda sempre para cima (maior inteiro).; `4`
- `Math.round(x)`: Arredonda para o inteiro mais próximo.; `4`
- `Math.trunc(x)`: Trunca o número, descartando a parte decimal.; `3`
- O `Math` oferece quatro formas distintas de arredondar valores numéricos.
### Funções Matemáticas Utilitárias
- Para realizar operações matemáticas comuns como potências, raízes, valores absolutos e identificação de extremos.
### Geração de Números Aleatórios (`Math.random()`)
- `Math.random()` retorna um número pseudo-aleatório no intervalo `[0, 1)` (inclui 0, mas exclui 1).
- A seguir está o padrão recomendado para gerar inteiros aleatórios dentro de um limite pré-definido

## Formatação de Números e Moedas (`Intl.NumberFormat`)
- Para formatar moedas, porcentagens e valores numéricos respeitando as convenções internacionais.
### 1. Formatação de Moedas (*Currency*)
- Para formatar valores Monetários (como Real Brasileiro `BRL`, Dólar Americano `USD` ou Euro `EUR`).
### 2. Formatação de Porcentagem (*Percent*)
- Para exibir taxas, descontos e porcentagens, utilizamos `style: 'percent'`.

## Síntese de Estudo
- **Página**: aprofunda conceitos, exemplos e exercícios
- **Slides**: organizam a exposição em sala
- **Mapa mental**: revisa relações entre tópicos
- **Prática**: execute os exemplos antes de memorizar regras
