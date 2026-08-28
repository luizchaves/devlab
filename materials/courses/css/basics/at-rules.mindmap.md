---
title: 'CSS: At-Rules (@rules) e Diretivas'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# At-Rules e Diretivas

## 1. Carregamento e Fontes
- **`@import`**: Importa outros arquivos CSS.
- **`@font-face`**: Carrega fontes customizadas (woff2).
- **`font-display: swap`**: Evita texto invisível durante o load.

## 2. Condicionais & Organização
- **`@media`**: Adaptabilidade para telas e impressão.
- **`@supports`**: Validação de suporte a propriedades no browser.
- **`@layer`**: Camadas de especificidade CSS.

## 3. Animações
- **`@keyframes`**: Linha do tempo de quadros de animação (`from`/`to` ou `%`).

## 4. Custom Properties (Variáveis)
- **Declaração**: `--cor-principal: #0284c7;` (em `:root`).
- **Leitura**: `color: var(--cor-principal);`.
