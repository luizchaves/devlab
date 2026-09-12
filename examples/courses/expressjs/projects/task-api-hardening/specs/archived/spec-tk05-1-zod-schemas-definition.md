# Spec TK05.1: Definição de Schemas Zod de Validação

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK05.1
- **Branch**: feat/tk05-1-zod-schemas
- **História de Usuário**: US06 (Saber exatamente o que corrigir)
- **Requisitos Atendidos**: RNF01

## 1. Contexto e Objetivos

Criar src/schemas/task.ts com schemas Zod para body, params e query utilizando strictObject, coerce e defaults.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/schemas/task.ts` | Criar | Schemas Zod para tarefas |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Schemas Zod**:
   - Definir createTaskSchema, updateTaskSchema, taskParamsSchema e taskQuerySchema.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA06.3 - Rejeição de Campos Extras
  Dado que um corpo com campo não declarado é enviado no POST /tasks
  Quando o schema strictObject valida o payload
  Então deve responder 422 Unprocessable Entity indicando o erro
```

## 5. Plano de Verificação

- **Validação Zod**: Testar envio de campos inválidos e extras.
