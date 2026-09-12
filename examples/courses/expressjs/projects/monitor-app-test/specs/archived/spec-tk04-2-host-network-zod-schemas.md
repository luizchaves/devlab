# Spec TK04.2: Schemas Zod de Validação de Rede (IPs, Domínios, UUIDs)

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK04.2
- **Branch**: feat/tk04-2-network-schemas
- **História de Usuário**: US04 (Saber exatamente o que corrigir)
- **Requisitos Atendidos**: RNF01

## 1. Contexto e Objetivos

Criar back/src/schemas/host.schema.ts validando IPv4 válido ou domínio RFC 1035 e rejeitando protocolos HTTP.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/schemas/host.schema.ts` | Criar | Schemas Zod de validação de rede |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Validação de Rede**:
   - Declarar regex para IP e domínio e rejeitar URLs com protocolo (http://).

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA04.4 - Rejeição de URL com Protocolo
  Dado um endereço contendo protocolo ("http://192.168.1.1")
  Quando o schema de host avalia a entrada
  Então deve responder status 400 Bad Request
```

## 5. Plano de Verificação

- **Validação de Rede**: Testar IPs, domínios e URLs completas.
