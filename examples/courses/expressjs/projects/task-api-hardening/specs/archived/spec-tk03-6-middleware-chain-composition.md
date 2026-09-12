# Spec TK03.6: Cadeia de Middlewares em Ordem Estrita

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK03.6
- **Branch**: feat/tk03-6-middleware-chain
- **História de Usuário**: US04 (Cada responsabilidade no seu lugar)
- **Requisitos Atendidos**: RNF04

## 1. Contexto e Objetivos

Organizar montagem dos middlewares em src/app.js na ordem: logger -> express.json() -> rotas -> notFound -> errorHandler.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/app.js` | Modificar | Orquestração da cadeia de middlewares |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Ordem da Cadeia**:
   - Organizar middlewares respeitando ordem de tratamento.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA04.4 - Posição do Error Handler
  Dado a cadeia de middlewares em app.js
  Quando a ordem é inspecionada
  Então o errorHandler deve ser o último middleware registrado
```

## 5. Plano de Verificação

- **Ordem de Execução**: Verificar captura correta de erros e 404.
