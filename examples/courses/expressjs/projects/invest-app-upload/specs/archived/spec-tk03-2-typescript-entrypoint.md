# Spec TK03.2: Migração do Entrypoint para TypeScript

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK03.2
- **Branch**: feat/tk03-2-ts-entrypoint
- **História de Usuário**: US03 (Mudar o código sem medo)
- **Requisitos Atendidos**: RNF06

## 1. Contexto e Objetivos

Migrar entrypoint para back/src/index.ts e back/src/app.ts.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/index.ts` | Criar | Inicialização de porta em TS |
| `back/src/app.ts` | Criar | Montagem da aplicação Express em TS |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Entrypoint TS**:
   - Tipar middlewares e exportar app e server desacoplados.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA03.2 - Ausência de JavaScript em src/
  Dado o backend migrado
  Quando a pasta back/src/ é inspecionada
  Então não deve conter nenhum arquivo .js
```

## 5. Plano de Verificação

- **Checagem de Arquivos**: Verificar extensão .ts em todos os arquivos de src.
