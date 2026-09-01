---
title: 'JavaScript: Numbers, BigInt e Math'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Numbers, BigInt e Math

## Ideia Central

- **Padrão IEEE 754**: ponto flutuante de 64 bits para inteiros e decimais no tipo `number`.
- **Precisão e Utilitários**: limites matemáticos, aritmética com `BigInt`, funções de `Math` e `Intl`.

## Representação e Literais

- **Literais e Bases**: decimal, exponencial (`314e-2`), binário (`0b`), octal (`0o`), hex (`0x`).
- **Separador Numérico**: `15_000` para melhor legibilidade no código (ES2021).
- **Primitivo vs Objeto**: evite `new Number()` para prevenir criação de objetos *wrapper*.

## Limites de Precisão e BigInt

- **Constantes de Limite**: `Number.MAX_SAFE_INTEGER` ($2^{53} - 1$) e `Number.MIN_SAFE_INTEGER`.
- **Imprecisão Decimal**: `0.1 + 0.2 !== 0.3` (use `Number.EPSILON` para tolerância).
- **Tipo Primitivo BigInt**: sufixo `n` (`123n`) para inteiros de precisão arbitrária.

## Valores Especiais e Checagens

- **`Infinity` / `-Infinity`**: resultados de estouro de escala e divisões por zero.
- **`NaN` (*Not-a-Number*)**: resultado de operações indefinidas (`0 / 0`, `Math.sqrt(-1)`).
- **Armadilha de Igualdade**: `NaN !== NaN` (use `Number.isNaN()` ou `Object.is()`).
- **Métodos Estáticos de Teste**: `Number.isNaN()`, `Number.isFinite()`, `Number.isSafeInteger()`.

## Conversão e Métodos do Protótipo

- **Conversão**: `Number()` (estrita), `parseInt(str, radix)` e `parseFloat(str)`.
- **Formatação de Instância**: `toFixed(casas)`, `toPrecision(dígitos)`, `toString(radix)`.

## O Objeto Estático Math

- **Constantes**: `Math.PI`, `Math.E`, `Math.SQRT2`.
- **Arredondamentos**: `Math.floor()` (baixo), `Math.ceil()` (cima), `Math.round()` (próximo), `Math.trunc()` (corta decimal).
- **Utilitários**: `Math.pow()`, `Math.sqrt()`, `Math.abs()`, `Math.min()`, `Math.max()`.
- **Números Aleatórios**: `Math.random()` para geração pseudo-aleatória em `[0, 1)`.

## Formatação Internacional (Intl.NumberFormat)

- **Moedas**: `{ style: 'currency', currency: 'BRL' }` para "R$ 1.250,50".
- **Porcentagens**: `{ style: 'percent', minimumFractionDigits: 1 }` para "15,5%".
- **Notação Compacta**: `{ notation: 'compact' }` para números abreviados ("214 mi").

## Boas Práticas

- **Sempre informe a base no `parseInt()`**: evite ambiguidades de interpretação.
- **Não use `=== NaN`**: verifique valores indefinidos com `Number.isNaN()`.
- **Trate valores monetários em centavos**: previna erros de ponto flutuante em regras fiscais.
- **Formate apenas na saída**: utilize `Intl.NumberFormat` na camada de visualização.
