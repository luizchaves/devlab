# Spec TK07.1: Invólucro de Conexão Assíncrona com SQLite Nativo

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK07.1
- **Branch**: feat/tk07-1-sqlite-connection
- **História de Usuário**: US09 (Não perder tarefas ao reiniciar)
- **Requisitos Atendidos**: RNF03

## 1. Contexto e Objetivos

Criar src/database/database.ts com invólucro singleton assíncrono sobre node:sqlite (DatabaseSync) com run, get e all.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/database/database.ts` | Criar | Módulo de conexão SQLite nativo |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Conexão SQLite**:
   - Instanciar DatabaseSync e encapsular métodos run, get e all com Promises.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA09.3 - Consultas Parametrizadas
  Dado o módulo de conexão com o banco
  Quando consultas SQL são executadas
  Então devem utilizar parâmetros posicionais "?" prevenindo SQL injection
```

## 5. Plano de Verificação

- **Teste de Conexão**: Executar queries simples sobre SQLite.
