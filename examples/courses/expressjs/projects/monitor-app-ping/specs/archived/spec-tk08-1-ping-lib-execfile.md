# Spec TK08.1: Utilitário de Ping Seguro com execFile sem Shell

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK08.1
- **Branch**: feat/tk08-1-ping-lib
- **História de Usuário**: US08 (Saber se o host está no ar sem abrir o terminal)
- **Requisitos Atendidos**: RF04, RNF04

## 1. Contexto e Objetivos

Criar back/src/lib/ping.ts executando comando ping via execFile com argumentos em array e parser de latência.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/lib/ping.ts` | Criar | Execução de ping isolada do sistema |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Ping Seguro**:
   - Configurar parâmetros por sistema operacional e parser de latência em ms.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA08.4 - Execução Isolada de Shell
  Dado um endereço contendo comandos injetados
  Quando o utilitário ping executa
  Então o execFile deve falhar sem invocar nenhum shell do sistema
```

## 5. Plano de Verificação

- **Teste de Execução**: Testar ping em 8.8.8.8 e endereço inválido.
