# Spec TK10.1: Validação de Variáveis de Ambiente no Arranque

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK10.1
- **Branch**: feat/tk10-1-config-validation
- **História de Usuário**: US14 (Saber como o serviço está)
- **Requisitos Atendidos**: RNF06

## 1. Contexto e Objetivos

Criar src/config.ts validando variáveis com schema Zod no arranque e abortando processo em caso de configuração inválida.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/config.ts` | Criar | Validação estrita de ambiente |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Validação de Config**:
   - Validar JWT_SECRET, PORT e NODE_ENV no arranque.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA14.1 - Recusa de Ambiente Inválido
  Dado que a variável obrigatória JWT_SECRET não está definida
  Quando o servidor tenta inicializar
  Então deve falhar o arranque e listar as variáveis ausentes
```

## 5. Plano de Verificação

- **Teste de Arranque**: Tentar subir sem JWT_SECRET e validar falha.
