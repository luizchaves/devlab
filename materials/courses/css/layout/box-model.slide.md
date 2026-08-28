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
title: "CSS: Modelo de Caixa (Box Model) e Display"
description: "Estrutura do Box Model: content, padding, border, margin, box-sizing: border-box e a propriedade display."
---

<!-- _class: lead -->

# Modelo de Caixa (Box Model) e Display

Entendendo como o navegador calcula dimensões de elementos: `content`, `padding`, `border`, `margin`, `box-sizing` e modos de exibição `display`.

---

## Objetivos

Dominar o cálculo de dimensões e comportamento de bloco:

- Compreender as 4 camadas do **Box Model**.
- Entender a diferença entre `content-box` e **`border-box`**.
- Controlar o comportamento de fluxo com a propriedade **`display`** (`block`, `inline`, `inline-block`, `none`).

---

## As 4 Camadas do Box Model

<div style="display: flex; flex-direction: column; align-items: center; gap: 6px; margin-top: 10px; font-size: 0.85em;">

<div style="border: 2px dashed #f59e0b; border-radius: 8px; padding: 8px 16px; text-align: center; background: #fffbeb; width: 90%;">
  <strong style="color: #b45309;">Margin</strong> (Espaçamento Externo - Transparente)
  <div style="border: 2px solid #ef4444; border-radius: 6px; padding: 8px 16px; background: #fef2f2; margin-top: 6px;">
    <strong style="color: #b91c1c;">Border</strong> (Borda do Elemento)
    <div style="border: 2px solid #3b82f6; border-radius: 4px; padding: 8px 16px; background: #eff6ff; margin-top: 6px;">
      <strong style="color: #1d4ed8;">Padding</strong> (Espaçamento Interno)
      <div style="border: 2px solid #10b981; border-radius: 4px; padding: 8px; background: #ecfdf5; margin-top: 6px;">
        <strong style="color: #047857;">Content</strong> (Conteúdo: Texto / Imagem / Filhos)
      </div>
    </div>
  </div>
</div>

</div>

---

## O Problema do `content-box` vs `border-box`

- **`content-box` (Padrão Antigo)**:
  `largura_total = width + padding + border`.
  *Causa estouro visual quando adicionamos padding.*

- **`border-box` (Padrão Moderno)**:
  `largura_total = width`.
  *O padding e a borda são consumidos **dentro** da largura declarada.*

```css
* {
  box-sizing: border-box;
}
```

---

## Modos de Exibição (`display`)

- **`display: block`**: Ocupa 100% da largura disponível e força nova linha (ex: `<div>`, `<p>`, `<h1>`). Respeita `width`, `height`, `margin` e `padding`.
- **`display: inline`**: Ocupa apenas a largura do conteúdo na mesma linha (ex: `<span>`, `<a>`, `<strong>`). **Não respeita** `width` e `height`.
- **`display: inline-block`**: Flui na mesma linha mas **respeita** `width`, `height`, `margin` e `padding`.
- **`display: none`**: Remove o elemento totalmente da árvore de renderização.

---

## Exercício Prático & Desafio

- **Exercício**: Crie um card com `width: 300px`, `padding: 20px`, `border: 2px solid #ccc` e aplique `box-sizing: border-box` para que sua largura continue sendo exatos 300px.
- **Desafio Extra**: Use `display: inline-block` para alinhar três cartões de produtos lado a lado na tela.

---

## Resumo & Revisão

- Sempre aplique `box-sizing: border-box` no reset global (`*`).
- **`margin`** empurra outros elementos para fora; **`padding`** afasta o conteúdo interno.
- Elementos **`inline`** não aceitam `width` nem `height`.

---

## Referências & Links Úteis

- **MDN Web Docs**: [The CSS Box Model](https://developer.mozilla.org/pt-BR/docs/Learn/CSS/Building_blocks/The_box_model)
- **MDN Web Docs**: [CSS Display Property](https://developer.mozilla.org/pt-BR/docs/Web/CSS/display)
