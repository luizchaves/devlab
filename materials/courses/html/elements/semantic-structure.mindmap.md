---
title: 'HTML: Elementos Semânticos e Acessibilidade'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Elementos Semânticos e Acessibilidade

## 1. Conceito de Semântica
- **Significado NATIVO**: Dar sentido ao conteúdo em vez de apenas estilizar.
- **Substituição de DIVs**: `<header>` em vez de `<div id="header">`.

## 2. Principais Tags de Layout
- **`<main>`**: Conteúdo principal e exclusivo da página.
- **`<header>`**: Cabeçalho (logo, busca, navegação).
- **`<nav>`**: Bloco de links de navegação.
- **`<article>`**: Conteúdo autônomo e independente.
- **`<section>`**: Seção temática com cabeçalho.
- **`<aside>`**: Conteúdo lateral ou relacionado.
- **`<footer>`**: Rodapé (copyright, contatos).

## 3. Acessibilidade (a11y) & ARIA
- **Leitores de Tela**: Navegação por marcos (*landmarks*).
- **Hierarquia de Títulos**: `<h1>` a `<h6>` em sequência lógica.
- **Texto Alternativo**: Atributo `alt` em imagens.
- **Atributos ARIA**: `aria-label`, `role="navigation"`.
