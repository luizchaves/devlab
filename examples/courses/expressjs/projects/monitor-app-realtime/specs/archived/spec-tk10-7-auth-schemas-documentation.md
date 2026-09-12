# Spec TK10.7: Declaração dos Schemas de Autenticação no OpenAPI

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK10.7
- **Branch**: feat/tk10-7-auth-schemas
- **História de Usuário**: US10 (Entrar no sistema)
- **Requisitos Atendidos**: RF06, RNF07

## 1. Contexto e Objetivos

Declarar bearerSchema e cookieSessionSchema em schemas/auth.schema.ts.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/schemas/auth.schema.ts` | Criar | Schemas de autenticação |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Schemas de Auth**:
   - Declarar formatos no Zod e refletir no Swagger UI.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA10.6 - Contrato de Autenticação no Swagger
  Dado o contrato OpenAPI do MonitorApp
  Quando a documentação é inspecionada
  Então deve conter o bearerAuth documentado
```

## 5. Plano de Verificação

- **Checagem Swagger**: Verificar segurança no Swagger UI.
