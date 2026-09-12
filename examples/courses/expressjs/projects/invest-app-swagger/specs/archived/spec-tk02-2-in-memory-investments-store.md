# Spec TK02.2: Armazenamento em Memória de Investimentos

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK02.2
- **Branch**: feat/tk02-2-memory-store
- **História de Usuário**: US02 (Manter a carteira pela aplicação)
- **Requisitos Atendidos**: RF01

## 1. Contexto e Objetivos

Criar back/src/data/investments.js contendo array em memória com registros iniciais de investimentos.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/data/investments.js` | Criar | Repositório de dados em memória |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Armazenamento em Memória**:
   - Declarar array com investimentos iniciais e IDs únicos.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA02.8 - Reset no Reinício
  Dado que investimentos foram criados na execução atual
  Quando o processo do servidor é reiniciado
  Então os dados em memória devem retornar ao estado inicial
```

## 5. Plano de Verificação

- **Checagem de Memória**: Verificar array inicial.
