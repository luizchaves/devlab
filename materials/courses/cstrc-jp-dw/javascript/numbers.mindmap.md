---
title: 'JavaScript: Number e Math'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Number e Math

## Representação Numérica

- **Tipo Único**: `typeof 42 === "number"` (inteiros e decimais)
- **Padrão IEEE 754**: Ponto flutuante de 64 bits (dupla precisão)
- **Notações**:
  - Decimal (`42`, `3.14`)
  - Exponencial (`1.5e3`)
  - Bases alternativas: Hexadecimal (`0xFF`), Octal (`0o52`), Binária (`0b101010`)
  - Separadores Numéricos: `1_000_000` (ES2021)

## Limites e Precisão

- **Inteiros Seguros**: `Number.MIN_SAFE_INTEGER` a `Number.MAX_SAFE_INTEGER` (`2^53 - 1`)
- **Imprecisão Flutuante**: `0.1 + 0.2 === 0.30000000000000004`
- **Tolerância**: Comparação com `Number.EPSILON`

## Valores Numéricos Especiais

- **`NaN` (Not-a-Number)**: Operação inválida (`"abc" * 2`). Verificação com `Number.isNaN()`
- **`Infinity` / `-Infinity`**: Divisão por zero positivo/negativo

## Conversão Numérica

- **`Number(val)`**: Conversão estrita da string inteira (`NaN` se inválida)
- **`parseInt(str, radix)`**: Extração de inteiro do início da string
- **`parseFloat(str)`**: Extração de decimal do início da string

## Métodos do Protótipo Number

- **`.toFixed(digits)`**: Formata casas decimais (retorna string)
- **`.toPrecision(total)`**: Formata dígitos significativos totais
- **`.toString(radix)`**: Converte para string em bases alternativas (2 a 36)

## Objeto Estático Math

- **Constantes**: `Math.PI`, `Math.E`, `Math.SQRT2`
- **Arredondamento**:
  - `Math.floor()`: Para baixo
  - `Math.ceil()`: Para cima
  - `Math.round()`: Mais próximo
  - `Math.trunc()`: Descatar decimal
- **Operações**: `Math.pow()`, `Math.sqrt()`, `Math.abs()`, `Math.min()`, `Math.max()`
- **Aleatoriedade**: `Math.random()` (intervalo `[0, 1)`)

## Formatação Internacional (Intl.NumberFormat)

- **Moedas (`currency`)**: Real (`BRL`), Dólar (`USD`), Euro (`EUR`)
- **Porcentagem (`percent`)**: Formatação de taxas
- **Notação Compacta (`notation: 'compact'`)**: Exibição de grandes valores (`214 mi`)
