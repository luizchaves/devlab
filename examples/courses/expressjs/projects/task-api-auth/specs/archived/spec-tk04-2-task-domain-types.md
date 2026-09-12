# Spec TK04.2: Definição de Tipos de Domínio de Tarefas

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK04.2
- **Branch**: feat/tk04-2-task-types
- **História de Usuário**: US05 (Deixar o compilador apontar a quebra)
- **Requisitos Atendidos**: RNF04, RNF10

## 1. Contexto e Objetivos

Declarar tipos de domínio Task e TaskInput em src/types/task.ts.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/types/task.ts` | Criar | Interfaces e tipos de domínio |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Tipagem de Domínio**:
   - Declarar Task com id, title, done e TaskInput.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA05.6 - Tipos Task e TaskInput
  Dado o arquivo src/types/task.ts
  Quando os tipos são inspecionados
  Então Task deve exigir id, title, done e TaskInput deve ter campos opcionais
```

## 5. Plano de Verificação

- **Validação de Tipos**: Checar compatibilidade nos models e controllers.
