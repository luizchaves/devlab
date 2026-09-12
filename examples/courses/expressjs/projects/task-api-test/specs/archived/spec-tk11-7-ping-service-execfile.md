# Spec TK11.7: Serviço Seguro de Ping com execFile e Parser Puro

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK11.7
- **Branch**: feat/tk11-7-ping-service
- **História de Usuário**: US19 (Medir a latência até um host)
- **Requisitos Atendidos**: RF10

## 1. Contexto e Objetivos

Criar src/services/ping-service.ts e src/schemas/ping.ts executando ping via execFile com parser de latência puro.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/services/ping-service.ts` | Criar | Execução de ping isolada |
| `src/schemas/ping.ts` | Criar | Validação de hostname |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Ping Seguro**:
   - Executar execFile sem shell e extrair latência com função pura testável.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA19.2 - Bloqueio de Injeção de Comandos no Ping
  Dado um parâmetro host contendo caracteres maliciosos ("; rm -rf")
  Quando o schema de validação avalia a entrada
  Então deve responder 422 antes de invocar qualquer comando de sistema
```

## 5. Plano de Verificação

- **Teste de Segurança**: Tentar caracteres especiais e validar 422.
