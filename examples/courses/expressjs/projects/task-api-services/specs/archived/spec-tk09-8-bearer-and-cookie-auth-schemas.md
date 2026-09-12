# Spec TK09.8: Schemas de Autenticação Bearer e Cookie Session

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK09.8
- **Branch**: feat/tk09-8-auth-schemas
- **História de Usuário**: US12 (Entrar e me identificar)
- **Requisitos Atendidos**: RF05, RNF05

## 1. Contexto e Objetivos

Declarar bearerSchema e cookieSessionSchema em src/schemas/auth.ts documentando contratos no OpenAPI.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/schemas/auth.ts` | Modificar | Schemas de cabeçalhos de auth |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Schemas de Token**:
   - Declarar formatos esperados de Authorization e cookies.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA12.7 - Validação do Formato Bearer
  Dado um cabeçalho Authorization malformado ("Token abc")
  Quando o middleware valida a forma
  Então deve responder 401 com a mensagem descrita no schema
```

## 5. Plano de Verificação

- **Validação de Formato**: Testar token malformado e checar 401.
