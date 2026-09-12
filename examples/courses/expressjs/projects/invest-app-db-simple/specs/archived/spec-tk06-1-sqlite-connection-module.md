# Spec TK06.1: Conexão Singleton com SQLite Nativo

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK06.1
- **Branch**: feat/tk06-1-sqlite-connection
- **História de Usuário**: US06 (Não perder carteira ao fechar sistema)
- **Requisitos Atendidos**: RF01, RNF03

## 1. Contexto e Objetivos

Criar back/src/database/database.ts encapsulando node:sqlite com consultas assíncronas.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/database/database.ts` | Criar | Invólucro SQLite nativo |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Conexão SQLite**:
   - Criar singleton sobre DatabaseSync com run, get e all.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA06.3 - SQL Parametrizado
  Dado o módulo de banco de dados
  Quando operações SQL são executadas
  Então devem usar parâmetros posicionais "?" prevenindo injeções
```

## 5. Plano de Verificação

- **Teste de Banco**: Executar consultas sobre SQLite local.
