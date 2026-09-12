# Spec TK03.2: Migração do Entrypoint do Backend para TypeScript

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
| `back/src/index.ts` | Criar | Entrypoint de inicialização em TS |
| `back/src/app.ts` | Criar | Instância do Express em TS |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Entrypoint TS**:
   - Converter arquivos JS para TS e tipar middlewares.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA03.2 - Ausência de JS em src/
  Dado a migração concluída
  Quando a pasta back/src/ é inspecionada
  Então não deve conter arquivos .js
```

## 5. Plano de Verificação

- **Inspeção de Extensões**: Verificar arquivos .ts no backend.
