---
title: 'CSS: Flexible Box Layout (Flexbox)'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Flexible Box Layout (Flexbox)

## 1. Conceito Unidimensional (1D)
- **Container**: `display: flex;`.
- **Eixo Principal (Main Axis)**: Define a direção do fluxo.
- **Eixo Cruzado (Cross Axis)**: Perpendicular ao principal.

## 2. Propriedades do Container
- **`flex-direction`**: `row` (padrão) | `column`.
- **`justify-content`**: `flex-start`, `center`, `space-between`, `space-evenly`.
- **`align-items`**: `stretch`, `center`, `flex-start`, `flex-end`.
- **`flex-wrap`**: `nowrap` | `wrap`.
- **`gap`**: Espaçamento entre os elementos.

## 3. Propriedades dos Itens
- **`flex-grow`**: Fator de crescimento.
- **`flex-shrink`**: Fator de encolhimento.
- **`flex-basis`**: Tamanho inicial.
- **Atalho**: `flex: 1;` (expande dinamicamente).
