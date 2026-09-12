# Spec TK02.2: Repositório de Hosts em Memória

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK02.2
- **Branch**: feat/tk02-2-hosts-store
- **História de Usuário**: US02 (Manter o inventário de hosts)
- **Requisitos Atendidos**: RF01

## 1. Contexto e Objetivos

Criar back/src/data/hosts.js contendo array em memória com servidores iniciais e campos name, address e status.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/data/hosts.js` | Criar | Armazenamento em memória de hosts |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Estado de Hosts**:
   - Declarar array com servidores e IPs de teste.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA02.9 - Reset no Reinício
  Dado que novos hosts foram criados na sessão
  Quando o backend é reiniciado
  Então o inventário em memória deve retornar ao estado inicial
```

## 5. Plano de Verificação

- **Checagem de Memória**: Verificar array em memória.
