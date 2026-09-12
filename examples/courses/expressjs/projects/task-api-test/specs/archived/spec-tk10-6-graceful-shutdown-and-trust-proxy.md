# Spec TK10.6: Encerramento Gracioso e Configuração de Proxy Reverso

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK10.6
- **Branch**: feat/tk10-6-shutdown-proxy
- **História de Usuário**: US14 (Saber como o serviço está)
- **Requisitos Atendidos**: RNF06, RNF07

## 1. Contexto e Objetivos

Configurar trust proxy em src/app.ts e encerramento gracioso (SIGTERM/SIGINT) em src/server.ts fechando conexões ativas.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/app.ts` | Modificar | Configuração de trust proxy |
| `src/server.ts` | Modificar | Captura de sinais de encerramento |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Encerramento Gracioso**:
   - Tratar SIGTERM fechando servidor e conexões com banco.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA14.6 - Encerramento sem Queda Abrupta
  Dado que o processo recebe o sinal SIGTERM
  Quando o encerramento gracioso é acionado
  Então deve parar de receber conexões, concluir as em andamento e sair com código 0
```

## 5. Plano de Verificação

- **Teste de Sinal**: Enviar SIGTERM e checar encerramento limpo.
