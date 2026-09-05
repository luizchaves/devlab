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
    font-size: 1.5rem;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    position: absolute;
    bottom: 24px;
    right: 32px;
    padding: 0;
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "HTML: Elementos Semânticos e Acessibilidade"
description: "Estruturação semântica do HTML5, marcação de layout, acessibilidade (a11y) e boas práticas."
---

<!-- _class: lead -->

# Elementos Semânticos e Acessibilidade

Substituindo `<div>` por tags com significado: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>` e princípios de a11y.

---

## Objetivos

Compreender o papel da semântica na Web moderna:

- Dominar o uso das **Tags Semânticas do HTML5** para layout.
- Entender a diferença entre tags de bloco com significado e contêineres genéricos (`<div>`).
- Aplicar princípios de **Acessibilidade (a11y)** e atributos ARIA.

---

## Por Que a Semântica Importa?

- **SEO & Buscadores**: Motores de busca compreendem a hierarquia da página e indexam conteúdos com maior precisão.
- **Acessibilidade (a11y)**: Leitores de tela anunciam marcos de navegação (*landmarks*) para usuários com deficiência visual.
- **Manutenibilidade**: Código limpo e autodocumentado para equipes de desenvolvimento.

---

## Estrutura do Layout Semântico

<div style="display: flex; flex-direction: column; align-items: center; gap: 8px; margin-top: 10px; font-size: 0.85em;">

<div style="border: 2px solid #0284c7; border-radius: 6px; padding: 8px 16px; text-align: center; background: #f0f9ff; width: 90%;">
  <strong style="color: #0369a1;">header</strong> (Cabeçalho) + <strong style="color: #0369a1;">nav</strong> (Navegação)
</div>

<div style="display: flex; gap: 10px; width: 90%;">
  <div style="flex: 2; border: 2px solid #16a34a; border-radius: 6px; padding: 12px; background: #f0fdf4;">
    <strong style="color: #15803d;">main</strong> (Conteúdo Principal)<br>
    <small>article / section</small>
  </div>
  <div style="flex: 1; border: 2px solid #d97706; border-radius: 6px; padding: 12px; background: #fffbeb;">
    <strong style="color: #b45309;">aside</strong> (Barra Lateral)
  </div>
</div>

<div style="border: 2px solid #4b5563; border-radius: 6px; padding: 8px 16px; text-align: center; background: #f3f4f6; width: 90%;">
  <strong style="color: #374151;">footer</strong> (Rodapé)
</div>

</div>

---

## Principais Elementos Semânticos

| Elemento | Função e Uso Recomendado |
| --- | --- |
| **`<main>`** | Conteúdo único e central da página (apenas 1 por documento). |
| **`<header>` / `<footer>`** | Cabeçalho e rodapé da página ou de seções específicas. |
| **`<nav>`** | Conjunto principal de links de navegação. |
| **`<article>`** | Conteúdo independente e reutilizável (posts, notícias). |
| **`<section>`** | Agrupamento temático com título próprio. |
| **`<aside>`** | Conteúdo relacionado de apoio (sidebar, links úteis). |

---

## Exemplo de Código Semântico

```html
<header>
  <h1>DevLab Blog</h1>
  <nav><a href="/">Início</a> | <a href="/html/">HTML</a></nav>
</header>

<main>
  <article>
    <h2>Semântica na Web</h2>
    <p>Tags semânticas melhoram SEO e acessibilidade...</p>
  </article>
</main>

<footer><p>&copy; 2026 DevLab</p></footer>
```

---

## Princípios de Acessibilidade (a11y)

- **Texto Alternativo (`alt`)**: Toda imagem informativa deve possuir atributo `alt` descritivo.
- **Hierarquia de Títulos**: Use apenas um `<h1>` por página, seguido por `<h2>`, `<h3>` sem pular níveis.
- **Contraste de Cor**: Texto e fundo devem possuir contraste suficiente.
- **Atributos ARIA**: Use `aria-label` e `role` para enriquecer elementos quando a semântica nativa não bastar.

---

## Exercício Prático & Desafio

- **Exercício**: Substitua uma estrutura baseada em `<div id="menu">` e `<div id="rodape">` por tags semânticas do HTML5.
- **Desafio Extra**: Adicione um atributo `aria-label` no elemento `<nav>` para identificar a navegação primária da página.

---

## Resumo & Revisão

- Use **`<main>`** para o conteúdo central e **`<nav>`** para links de navegação.
- Prefira elementos nativos a `<div>` genéricas sempre que houver significado.
- **Acessibilidade** é requisito: garanta textos `alt`, títulos em ordem e suporte a leitores de tela.

---

## Referências & Links Úteis

- **MDN Web Docs**: [HTML Semantic Elements](https://developer.mozilla.org/pt-BR/docs/Glossary/Semantics)
- **W3C**: [WAI-ARIA Overview](https://www.w3.org/WAI/standards-guidelines/aria/)
- **WebAIM**: [Web Accessibility Checklist](https://webaim.org/standards/wcag/checklist)
