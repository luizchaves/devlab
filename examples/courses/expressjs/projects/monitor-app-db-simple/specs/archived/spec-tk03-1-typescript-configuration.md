# Spec TK03.1: Configuração do TypeScript Strict e Path Aliases

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK03.1
- **Branch**: feat/tk03-1-ts-config
- **História de Usuário**: US03 (Mudar o código sem medo)
- **Requisitos Atendidos**: RNF06

## 1. Contexto e Objetivos

Configurar back/tsconfig.json com strict e alias @/* e script npm run typecheck.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/tsconfig.json` | Criar | Configuração TypeScript |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Setup TS**:
   - Definir regras estritas de tipagem e path aliases.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA03.1 - Typecheck Limpo
  Dado o backend configurado com TypeScript
  Quando o comando npm run typecheck é executado
  Então deve finalizar com 0 erros
```

## 5. Plano de Verificação

- **Checagem TS**: Executar npm run typecheck.
