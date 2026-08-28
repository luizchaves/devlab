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
title: "CSS: Flexible Box Layout (Flexbox)"
description: "Layouts unidimensionais flexíveis com Flexbox: eixos principal e cruzado, justify-content, align-items, flex-direction e gap."
---

<!-- _class: lead -->

# Flexible Box Layout (Flexbox)

Layouts unidimensionais flexíveis: eixos principal (*main axis*) e cruzado (*cross axis*), alinhamento, distribuição de espaço e ordenação.

---

## Objetivos

Dominar o modelo de layout unidimensional do CSS:

- Entender o conceito de **Flex Container** (`display: flex`) e **Flex Items**.
- Controlar a direção dos eixos com **`flex-direction`** (`row`, `column`).
- Alinhar itens no eixo principal com **`justify-content`**.
- Alinhar itens no eixo cruzado com **`align-items`**.
- Controlar crescimento e encolhimento com `flex-grow`, `flex-shrink` e `gap`.

---

## Eixos do Flexbox

```html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>
```

```css
.container {
  display: flex;
  flex-direction: row; /* Eixo Principal: Horizontal | Eixo Cruzado: Vertical */
}
```

- **Eixo Principal (*Main Axis*)**: Controlado por `justify-content`.
- **Eixo Cruzado (*Cross Axis*)**: Controlado por `align-items`.

---

## Propriedades do Contêiner (`justify-content` & `align-items`)

- **`justify-content`**:
  - `flex-start` | `center` | `flex-end`
  - `space-between` (espaço entre os itens)
  - `space-around` | `space-evenly`

- **`align-items`**:
  - `stretch` (estica itens) | `center` | `flex-start` | `flex-end`

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
```

---

## Propriedades dos Itens Flexíveis (`flex`)

- **`flex-grow`**: Determina quanto o item pode crescer para preencher o espaço sobrando.
- **`flex-shrink`**: Determina se o item pode encolher quando o espaço for menor.
- **`flex-basis`**: Tamanho inicial antes da distribuição de espaço.
- **Atalho `flex: 1`**: Faz o item expandir proporcionalmente ocupando todo o espaço restante.

```css
.sidebar { flex: 0 0 250px; } /* Largura fixa */
.content { flex: 1; }        /* Ocupa o restante */
```

---

## Exercício Prático & Desafio

- **Exercício**: Crie uma barra de navegação (`<nav>`) com o logo à esquerda e os links à direita usando `display: flex` e `justify-content: space-between`.
- **Desafio Extra**: Monte um layout de 3 cartões flexíveis onde o cartão central tem `flex: 2` e os dois laterais têm `flex: 1`.

---

## Resumo & Revisão

- Flexbox é ideal para **layouts 1D** (uma linha ou uma coluna).
- **`justify-content`** atua no eixo principal; **`align-items`** no eixo cruzado.
- Mudar `flex-direction: column` inverte o eixo principal para vertical.
- Use a propriedade **`gap`** para espaçamento consistente entre itens flexíveis.

---

## Referências & Links Úteis

- **MDN Web Docs**: [Basic Concepts of Flexbox](https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox)
- **CSS-Tricks**: [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
