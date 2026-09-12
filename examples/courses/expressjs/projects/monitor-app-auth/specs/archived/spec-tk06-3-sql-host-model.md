# Spec TK06.3: Model de Hosts com Consultas SQL Parametrizadas

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK06.3
- **Branch**: feat/tk06-3-model-sql
- **História de Usuário**: US06 (Não perder o inventário ao fechar o sistema)
- **Requisitos Atendidos**: RF01, RNF03

## 1. Contexto e Objetivos

Reescrever back/src/models/Host.ts com consultas SQL parametrizadas preservando contratos dos controllers.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/models/Host.ts` | Modificar | Model sobre SQL parametrizado |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Model SQL**:
   - Substituir array por queries SQL e preservar contratos existentes.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA06.2 - Persistência do Inventário
  Dado que hosts são cadastrados pela API
  Quando o servidor é reiniciado
  Então os dados devem permanecer salvos no banco SQLite
```

## 5. Plano de Verificação

- **Persistência**: Cadastrar host e reiniciar servidor.
