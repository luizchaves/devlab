---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Projeto: BMI API (Cálculo de IMC)"
description: "API de cálculo de IMC e validação numérica de parâmetros"
---

<!-- _class: lead -->

# BMI API (Calculadora de IMC)

API RESTful para processamento de métricas de saúde e cálculo de Índice de Massa Corporal.

---

## Objetivos e Regras de Negócio

- **Fórmula**: $IMC = \frac{peso}{altura^2}$
- **Parâmetros**:
  - `weight` (Peso em quilogramas, numérico positivo).
  - `height` (Altura em metros, numérico positivo).
- **Classificações**:
  - $< 18.5$: Abaixo do peso
  - $18.5 - 24.9$: Peso normal
  - $25.0 - 29.9$: Sobrepeso
  - $\ge 30.0$: Obesidade

---

## Tratamento de Validação e Erros

```typescript
app.post('/api/bmi', (req, res) => {
  const { weight, height } = req.body;

  if (!weight || !height || weight <= 0 || height <= 0) {
    return res.status(400).json({ error: 'Peso e altura válidos são obrigatórios.' });
  }

  const bmi = Number((weight / (height * height)).toFixed(2));
  const category = getBmiCategory(bmi);

  return res.json({ weight, height, bmi, category });
});
```

---

## Resumo e Práticas

- Rejeite dados de requisições malformadas com o código HTTP **400 Bad Request**.
- Separe lógicas de cálculo matemáticos em funções utilitárias puras.
- Teste limites de fronteira (ex: valores negativos, zero ou strings não numéricas).
