# Spec TK03.3: Definição de Tipos e Interfaces de Hosts

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK03.3
- **Branch**: feat/tk03-3-domain-types
- **História de Usuário**: US03 (Mudar o código sem medo)
- **Requisitos Atendidos**: RNF06

## 1. Contexto e Objetivos

Declarar interfaces Host e HostInput em back/src/types/host.ts.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/types/host.ts` | Criar | Tipos de domínio de hosts |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Tipos de Domínio**:
   - Declarar Host com id, name, address, status e HostInput.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA03.6 - Compatibilidade de Tipos
  Dado as interfaces de host
  Quando models e controllers realizam operações
  Então devem obedecer estritamente aos tipos declarados
```

## 5. Plano de Verificação

- **Validação de Tipos**: Checar tipagem em models e controllers.
