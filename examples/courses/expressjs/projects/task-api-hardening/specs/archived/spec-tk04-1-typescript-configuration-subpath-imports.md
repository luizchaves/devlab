# Spec TK04.1: Configuração TypeScript e Subpath Imports

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK04.1
- **Branch**: feat/tk04-1-typescript-config
- **História de Usuário**: US05 (Deixar o compilador apontar a quebra)
- **Requisitos Atendidos**: RNF04, RNF10

## 1. Contexto e Objetivos

Configurar tsconfig.json com noEmit, script typecheck e subpath imports (#*) no package.json para execução nativa sem build.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `tsconfig.json` | Criar | Configuração do compilador TypeScript |
| `package.json` | Modificar | Declaração de subpath imports e script typecheck |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Configuração TS**:
   - Criar tsconfig.json strict e subpath imports no package.json.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA05.1 - Typecheck Limpo
  Dado o projeto configurado com TypeScript
  Quando o comando "npm run typecheck" é executado
  Então deve finalizar com 0 erros
```

## 5. Plano de Verificação

- **Checagem de Tipos**: Executar pnpm check e typecheck.
