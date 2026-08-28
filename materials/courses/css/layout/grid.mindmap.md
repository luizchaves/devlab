---
title: 'CSS: Grid Layout'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# CSS Grid Layout

## 1. Conceito Bidimensional (2D)
- **Container**: `display: grid;`.
- **Eixos**: Linhas (*rows*) e Colunas (*columns*) simultâneas.

## 2. Definindo a Grade
- **`grid-template-columns`**: Define largura das colunas.
- **`grid-template-rows`**: Define altura das linhas.
- **Unidade `fr`**: Fração do espaço livre.
- **`repeat(n, tamanho)`**: Repetição de colunas/linhas.

## 3. Layout por Áreas
- **`grid-template-areas`**: Mapeamento nomeado ("header header", "main sidebar").
- **`grid-area`**: Atribuição do item à área nomeada.

## 4. Grids Auto-Responsivas
- **`repeat(auto-fit, minmax(250px, 1fr))`**: Redimensionamento automático sem media queries.
