---
title: 'HTML: Imagens e Tabelas'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Imagens e Tabelas

## 1. Imagens (`<img>`)
- **`src`**: Caminho ou URL do arquivo de mídia.
- **`alt`**: Descrição textual obrigatória (a11y/SEO).
- **`width` / `height`**: Evita salto de layout (CLS).
- **Decorativa**: `alt=""` vazio.

## 2. Legendas (`<figure>`)
- **`<figure>`**: Contêiner da mídia.
- **`<figcaption>`**: Legenda vinculada.

## 3. Tabelas (`<table>`)
- **Estrutura**: `<table>`, `<thead>`, `<tbody>`.
- **Linhas & Células**:
  - **`<tr>`**: Linha (*Table Row*).
  - **`<th>`**: Cabeçalho (*Table Header*).
  - **`<td>`**: Célula de dado (*Table Data*).
- **Regra**: Usar apenas para dados tabulares (não para layout).
