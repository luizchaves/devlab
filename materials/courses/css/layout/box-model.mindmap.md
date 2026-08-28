---
title: 'CSS: Modelo de Caixa (Box Model) e Display'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Box Model e Display

## 1. As 4 Camadas
- **Content**: O conteúdo real (texto, imagem).
- **Padding**: Espaçamento interno (dentro da borda).
- **Border**: Borda do elemento.
- **Margin**: Espaçamento externo (afasta vizinhos).

## 2. Cálculo de Dimensões (`box-sizing`)
- **`content-box`**: `width` aplica-se apenas ao conteúdo (soma padding + border).
- **`border-box`**: `width` inclui padding e border (padrão moderno).

## 3. Propriedade `display`
- **`block`**: Quebra linha, ocupa 100% da largura.
- **`inline`**: Mantém na linha, ignora width/height.
- **`inline-block`**: Mantém na linha E aceita width/height.
- **`none`**: Remove o elemento do fluxo visual.
