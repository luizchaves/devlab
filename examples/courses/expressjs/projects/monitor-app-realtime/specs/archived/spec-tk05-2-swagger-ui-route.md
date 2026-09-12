# Spec TK05.2: Rotas de Documentação Swagger UI e OpenAPI JSON

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK05.2
- **Branch**: feat/tk05-2-swagger-routes
- **História de Usuário**: US05 (Integrar sem ler o código)
- **Requisitos Atendidos**: RNF07

## 1. Contexto e Objetivos

Criar rotas /api/docs com Swagger UI e /api/openapi.json com o contrato bruto.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/routes/docs.routes.ts` | Criar | Rotas de documentação Swagger |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Interface Swagger**:
   - Integrar swagger-ui-express e servir documentação.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA05.1 - Swagger UI Navegável
  Dado que o backend está ativo
  Quando o cliente acessa GET /api/docs
  Então deve exibir a interface interativa do Swagger
```

## 5. Plano de Verificação

- **Acesso Visual**: Acessar /api/docs no navegador.
