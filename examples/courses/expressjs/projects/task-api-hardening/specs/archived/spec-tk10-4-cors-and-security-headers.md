# Spec TK10.4: Controle de Origem CORS e Cabeçalhos de Segurança

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK10.4
- **Branch**: feat/tk10-4-security-headers
- **História de Usuário**: US15 (Proteger a borda da API)
- **Requisitos Atendidos**: RNF07

## 1. Contexto e Objetivos

Criar src/middlewares/cors.ts e security-headers.ts aplicando CSP, HSTS, no-sniff, frame-guard e validação de origens permitidas.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/middlewares/cors.ts` | Criar | Tratamento de CORS e preflight 204 |
| `src/middlewares/security-headers.ts` | Criar | Cabeçalhos de proteção HTTP |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Segurança HTTP**:
   - Injetar headers de proteção e validar lista de origens.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA15.3 - Cabeçalhos de Segurança em Respostas
  Dado qualquer resposta emitida pela API
  Quando os headers são inspecionados
  Então devem conter nosniff, X-Frame-Options: DENY, CSP e HSTS
```

## 5. Plano de Verificação

- **Inspeção de Cabeçalhos**: Verificar presença de headers em requests.http.
