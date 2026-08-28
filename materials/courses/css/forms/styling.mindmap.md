---
title: 'CSS: Estilização de Formulários e Estados'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Estilização de Formulários

## 1. Reset de Inputs
- **Herança**: `font-family: inherit; font-size: 1rem;`.
- **Caixa de Entrada**: `width: 100%; padding; border-radius;`.

## 2. Estados de Foco & Acessibilidade
- **`:focus-visible`**: Anel de foco exclusivo para navegação via teclado (<kbd>Tab</kbd>).
- **`outline-offset`**: Afastamento do anel de foco.

## 3. Pseudo-classes de Validação
- **`:required`**: Campos com preenchimento obrigatório.
- **`:invalid`**: Valor que não atende ao tipo/padrão.
- **`:valid`**: Valor válido.
- **`:disabled`**: Controle inativo.
