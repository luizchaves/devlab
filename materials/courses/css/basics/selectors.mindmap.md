---
title: 'CSS: Seletores, Pseudo-classes e Pseudo-elementos'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Seletores e Pseudo-elementos

## 1. Seletores Básicos
- **Tag**: `p { ... }`.
- **Classe**: `.card { ... }` (reutilizável).
- **ID**: `#main { ... }` (único, alta especificidade).
- **Atributo**: `input[type="text"]`.

## 2. Combinadores
- **Descendente**: `div p`.
- **Filho Direto**: `div > p`.
- **Irmão Adjacente**: `h2 + p`.
- **Irmão Geral**: `h2 ~ p`.

## 3. Pseudo-classes (Estados)
- **`:hover`**: Mouse sobre o elemento.
- **`:focus`**: Foco de navegação/teclado.
- **`:nth-child(n)`**: Posição na lista DOM.
- **`:not(seletor)`**: Exclusão condicional.

## 4. Pseudo-elementos (Cosméticos)
- **`::before`**: Conteúdo antes do texto.
- **`::after`**: Conteúdo depois do texto.
- **Exigência**: Propriedade `content: ""`.
