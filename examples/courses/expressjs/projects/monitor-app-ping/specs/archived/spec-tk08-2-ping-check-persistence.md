# Spec TK08.2: Método Ping.check e Persistência de Resultados

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK08.2
- **Branch**: feat/tk08-2-ping-check
- **História de Usuário**: US08 (Saber se o host está no ar sem abrir o terminal)
- **Requisitos Atendidos**: RF04

## 1. Contexto e Objetivos

Implementar Ping.check no model persistindo latência e status (success: true/false).

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/models/Ping.ts` | Modificar | Persistência de medições |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Persistência de Ping**:
   - Executar ping e salvar latência e timestamp no banco.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA08.2 - Gravação de Medição com Sucesso
  Dado um host acessível na rede
  Quando a medição manual POST /api/hosts/:id/pings é executada
  Então deve responder 201 com success: true e latência em milissegundos
```

## 5. Plano de Verificação

- **Medição Manual**: Executar POST /api/hosts/:id/pings.
