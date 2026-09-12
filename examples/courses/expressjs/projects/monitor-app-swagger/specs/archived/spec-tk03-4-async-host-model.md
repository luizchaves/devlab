# Spec TK03.4: Model Assíncrono de Hosts Desacoplado de HTTP

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK03.4
- **Branch**: feat/tk03-4-async-model
- **História de Usuário**: US03 (Mudar o código sem medo)
- **Requisitos Atendidos**: RNF06

## 1. Contexto e Objetivos

Criar back/src/models/Host.ts com métodos assíncronos desacoplados de req/res.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/models/Host.ts` | Criar | Model assíncrono de hosts |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Model Puro**:
   - Implementar find, findById, create, update e delete.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA03.4 - Desacoplamento do Model
  Dado o model de hosts
  Quando seus métodos são inspecionados
  Então nenhum método deve receber req ou res como parâmetro
```

## 5. Plano de Verificação

- **Checagem de Camadas**: Garantir model sem HTTP.
