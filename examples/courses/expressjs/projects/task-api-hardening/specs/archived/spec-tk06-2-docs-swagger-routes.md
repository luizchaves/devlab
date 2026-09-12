# Spec TK06.2: Rotas Swagger UI e OpenAPI JSON

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK06.2
- **Branch**: feat/tk06-2-swagger-routes
- **História de Usuário**: US08 (Integrar sem ler o código)
- **Requisitos Atendidos**: RNF05

## 1. Contexto e Objetivos

Criar src/routes/docs-router.ts servindo interface interativa Swagger UI em /docs e JSON bruto em /openapi.json.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/routes/docs-router.ts` | Criar | Rotas de documentação |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Rotas de Documentação**:
   - Integrar swagger-ui-express e servir JSON bruto.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA08.1 - Swagger UI Navegável
  Dado que o servidor está rodando
  Quando o navegador acessa GET /docs
  Então deve renderizar a interface interativa do Swagger UI
```

## 5. Plano de Verificação

- **Acesso Swagger**: Acessar /docs no navegador.
