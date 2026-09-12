# Spec TK03.4: Model Assíncrono Desacoplado de HTTP

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK03.4
- **Branch**: feat/tk03-4-async-model
- **História de Usuário**: US03 (Mudar o código sem medo)
- **Requisitos Atendidos**: RNF06

## 1. Contexto e Objetivos

Criar back/src/models/Investment.ts com funções assíncronas puras sem req ou res.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/models/Investment.ts` | Criar | Model assíncrono |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Model Puro**:
   - Implementar métodos find, findById, create, update e delete.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA03.4 - Desacoplamento de Camadas
  Dado o model back/src/models/Investment.ts
  Quando seus métodos são inspecionados
  Então nenhum método deve depender de objetos Request ou Response
```

## 5. Plano de Verificação

- **Checagem Arquitetural**: Garantir model sem HTTP.
