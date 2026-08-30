---
title: 'Projeto: BMI API'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# BMI API

## Lógica de Negócio

- Cálculo matemático: $IMC = peso / altura^2$
- Classificação em faixas de IMC

## Validação de Entrada

- Verificação de campos obrigatórios
- Garantia de números positivos
- HTTP 400 Bad Request para dados inválidos

## Estrutura da Resposta

- Retorno em JSON contendo parâmetros originais, IMC calculado e categoria
