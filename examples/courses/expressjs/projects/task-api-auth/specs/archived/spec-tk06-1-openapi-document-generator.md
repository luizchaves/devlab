# Spec TK06.1: Gerador Automático de Documento OpenAPI 3

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK06.1
- **Branch**: feat/tk06-1-openapi-generator
- **História de Usuário**: US08 (Integrar sem ler o código)
- **Requisitos Atendidos**: RNF05

## 1. Contexto e Objetivos

Criar src/docs/openapi.ts gerando especificação OpenAPI 3 sincronizada a partir dos schemas Zod via z.toJSONSchema().

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/docs/openapi.ts` | Criar | Gerador de especificação OpenAPI 3 |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Conversão OpenAPI**:
   - Mapear schemas Zod em definições OpenAPI 3.0 dinâmicas.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA08.3 - Sincronia com Schemas
  Dado que os schemas Zod definem regras de validação
  Quando o documento OpenAPI é inspecionado
  Então deve espelhar minLength, enums e required diretamente dos schemas
```

## 5. Plano de Verificação

- **Validação OpenAPI**: Checar conformidade do JSON OpenAPI gerado.
