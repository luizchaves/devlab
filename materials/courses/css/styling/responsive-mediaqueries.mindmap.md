---
title: 'CSS: Responsividade e Media Queries'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Responsividade e Media Queries

## 1. Fundamentos de RWD
- **Meta Viewport**: `width=device-width, initial-scale=1.0`.
- **Grids & Layouts Flexíveis**: Uso de porcentagens, `fr` e unidades relativas.
- **Imagens Fluidas**: `max-width: 100%; height: auto;`.

## 2. Estratégia Mobile-First
- **Abordagem**: CSS base para mobile ➔ `@media (min-width: ...)` para telas maiores.
- **Breakpoints Comuns**:
  - `640px` (Smartphones paisagem).
  - `768px` (Tablets).
  - `1024px` (Desktops).

## 3. Preferências do Usuário
- **`prefers-color-scheme: dark`**: Modo escuro nativo.
- **`prefers-reduced-motion: reduce`**: Acessibilidade para vertigem/movimento.
