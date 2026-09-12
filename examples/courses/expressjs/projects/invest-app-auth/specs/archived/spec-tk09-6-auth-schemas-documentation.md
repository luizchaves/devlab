# Spec TK09.6: Declaração dos Schemas de Autenticação no OpenAPI

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK09.6
- **Branch**: feat/tk09-6-auth-schemas
- **História de Usuário**: US09 (Entrar no sistema)
- **Requisitos Atendidos**: RF03, RNF07

## 1. Contexto e Objetivos

Declarar bearerSchema e cookieSessionSchema em schemas/auth.schema.ts e documentar securitySchemes no Swagger.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/schemas/auth.schema.ts` | Criar | Schemas de cabeçalhos de autenticação |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Schemas de Auth**:
   - Declarar formatos no Zod e refletir no Swagger UI.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA09.6 - Contrato de Segurança no OpenAPI
  Dado o contrato OpenAPI do InvestApp
  Quando a especificação é inspecionada
  Então deve conter o securitySchemes bearerAuth documentado
```

## 5. Plano de Verificação

- **Checagem Swagger**: Verificar botão Authorize no Swagger UI.
