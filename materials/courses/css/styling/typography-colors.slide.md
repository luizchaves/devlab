---
marp: true
theme: default
paginate: true
style: |
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 70px;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "CSS: Tipografia, Cores e Estilização de Texto"
description: "Propriedades de tipografia (font-family, font-size, rem/em), modelos de cores (HEX, RGB, HSL, color-mix) e sombras."
---

<!-- _class: lead -->

# Tipografia e Cores

Modelos de cor (HEX, RGB, HSL, alpha), propriedades de tipografia (`font-family`, `font-weight`, `line-height`), unidades relativas (`rem`/`em`) e sombras.

---

## Objetivos

Dominar a estilização de texto e paletas visuais:

- Entender os formatos de cor no CSS (**HEX**, **RGB/RGBA**, **HSL/HSLA**, **CSS Color Module 4**).
- Configurar famílias de fontes e font stacks seguras (`font-family`).
- Usar unidades relativas **`rem`** e **`em`** para tipografia escalável.
- Ajustar legibilidade com **`line-height`** e **`letter-spacing`**.

---

## Modelos de Cores no CSS

- **Hexadecimal**: `#2563eb` ou `#2563eb80` (com transparência).
- **RGB / RGBA**: `rgb(37 99 235)` ou `rgb(37 99 235 / 50%)`.
- **HSL**: `hsl(220 83% 53%)` (Hue, Saturation, Lightness - muito intuitivo).
- **Modern Color Syntax**: `color-mix(in srgb, blue 50%, white 50%)`.

```css
:root {
  --text-main: hsl(215 28% 17%);
  --bg-primary: #ffffff;
}
```

---

## Unidades Tipográficas: `rem` vs `em` vs `px`

- **`px` (Pixels)**: Unidade absoluta fixa. Ignora configurações de acessibilidade do sistema do usuário.
- **`rem` (Root EM)**: Relativo ao tamanho da fonte da raiz `<html>` (padrão `1rem = 16px`). **Recomendado para tamanhos de fonte e espaçamentos**.
- **`em`**: Relativo ao `font-size` do elemento pai direto.

```css
html {
  font-size: 16px; /* 1rem = 16px */
}
h1 {
  font-size: 2rem; /* 32px */
  line-height: 1.2;
}
```

---

## Propriedades Tipográficas

```css
p {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 1rem;
  font-weight: 400;     /* 400 = Normal, 700 = Bold */
  line-height: 1.6;     /* Altura de linha (sem unidade) */
  letter-spacing: 0.02em;
  text-transform: capitalize;
}
```

- **`font-family`**: Lista de fontes com *fallback* genérico final.
- **`line-height: 1.6`**: Proporção recomendada para boa legibilidade de parágrafos.

---

## Exercício Prático & Desafio

- **Exercício**: Defina o `font-size` do `h1` em `2.5rem` e o `line-height` de parágrafos em `1.6`.
- **Desafio Extra**: Use `hsl()` para criar uma paleta de 3 variações de tom da mesma cor (clara, média e escura).

---

## Resumo & Revisão

- Prefira unidades relativas **`rem`** para tipografia responsiva.
- Sempre inclua uma fonte genérica de *fallback* ao final de `font-family` (`sans-serif`, `serif`, `monospace`).
- **`line-height`** sem unidade (ex: `1.5`) evita bugs de herança em elementos filhos.

---

## Referências & Links Úteis

- **MDN Web Docs**: [Fundamental Text and Font Styling](https://developer.mozilla.org/pt-BR/docs/Learn/CSS/Styling_text/Fundamentals)
- **MDN Web Docs**: [CSS Colors](https://developer.mozilla.org/pt-BR/docs/Web/CSS/color_value)
