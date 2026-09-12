# Spec TK05.1: Gerador Automático OpenAPI 3 a partir de Schemas Zod

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK05.1
- **Branch**: feat/tk05-1-openapi-generator
- **História de Usuário**: US05 (Integrar sem ler o código)
- **Requisitos Atendidos**: RNF07

## 1. Contexto e Objetivos

Criar back/src/docs/openapi.ts gerando especificação OpenAPI 3 sincronizada a partir dos schemas Zod.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/docs/openapi.ts` | Criar | Gerador OpenAPI 3 |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Conversão OpenAPI**:
   - Mapear schemas Zod em documento OpenAPI 3.0 dinâmico.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA05.3 - Sincronia de Documentação
  Dado que os schemas Zod de host são atualizados
  Quando o documento OpenAPI é inspecionado
  Então deve refletir as restrições de formato automaticamente
```

## 5. Plano de Verificação

- **Conformidade OpenAPI**: Validar JSON OpenAPI gerado.
