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
title: "CSS: Grid Layout"
description: "Layouts bidimensionais complexos com CSS Grid: linhas, colunas, unidades fr, grid-template-areas e minmax."
---

<!-- _class: lead -->

# Grid Layout

Layouts bidimensionais bidirecionais (linhas e colunas): `grid-template-columns`, `grid-template-rows`, `fr`, `grid-template-areas` e `auto-fit`.

---

## Objetivos

Dominar o sistema de grid bidimensional do CSS:

- Criar contêineres grid com **`display: grid`**.
- Definir colunas e linhas flexíveis usando a unidade **`fr`** e `repeat()`.
- Mapear layouts visuais semânticos com **`grid-template-areas`**.
- Criar galerias responsivas sem media queries usando `auto-fit` e `minmax()`.

---

## Estrutura Básica de CSS Grid

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 colunas de fração igual */
  gap: 1.5rem;                           /* Espaçamento entre células */
}
```

- **Unidade `fr` (Fraction)**: Representa uma fração do espaço livre no contêiner grid.
- **`repeat(3, 1fr)`**: Equivalente a `1fr 1fr 1fr`.

---

## Mapeamento Semântico com `grid-template-areas`

```css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}

header { grid-area: header; }
aside  { grid-area: sidebar; }
main   { grid-area: main; }
footer { grid-area: footer; }
```

---

## Grids Responsivos sem Media Queries (`auto-fit` + `minmax`)

Cria colunas dinâmicas que se adaptam automaticamente ao tamanho da janela:

```css
.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

- **`minmax(250px, 1fr)`**: Célula tem no mínimo 250px de largura, mas pode crescer até preencher 1fr do espaço sobrando.
- **`auto-fit`**: Ajusta o número de colunas automaticamente.

---

## Exercício Prático & Desafio

- **Exercício**: Crie uma galeria de imagens com `display: grid` e `repeat(4, 1fr)` com um espaçamento `gap: 1rem`.
- **Desafio Extra**: Monte um layout de página completo (header, nav, main, footer) utilizando `grid-template-areas`.

---

## Resumo & Revisão

- Use **Flexbox** para layouts 1D (uma direção); use **Grid** para layouts 2D (linhas e colunas simultâneas).
- A unidade **`fr`** distribui o espaço livre proporcionalmente.
- **`grid-template-areas`** torna a estrutura visual do CSS fácil de ler e manter.
- **`repeat(auto-fit, minmax(...))`** cria galerias responsivas fluidas.

---

## Referências & Links Úteis

- **MDN Web Docs**: [Grids - CSS Cascading Style Sheets](https://developer.mozilla.org/pt-BR/docs/Learn/CSS/CSS_layout/Grids)
- **CSS-Tricks**: [A Complete Guide to CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
