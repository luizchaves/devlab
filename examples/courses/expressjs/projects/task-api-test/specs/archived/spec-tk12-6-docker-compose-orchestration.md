# Spec TK12.6: Orquestração de Serviços com Docker Compose

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK12.6
- **Branch**: feat/tk12-6-compose
- **História de Usuário**: US21 (Subir a API em qualquer máquina)
- **Requisitos Atendidos**: RNF09

## 1. Contexto e Objetivos

Criar compose.yaml com comando de migração prévia, injeção de JWT_SECRET e volumes persistentes para SQLite e uploads.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `compose.yaml` | Criar | Orquestração multi-serviço |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Compose Config**:
   - Configurar migração automática, checagem de variáveis e volumes nomeados.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA21.1 - Inicialização Unificada via Compose
  Dado um ambiente com Docker Compose
  Quando o comando "docker compose up --build" é executado
  Então a API deve migrar o banco, inicializar e responder em http://localhost:3000
```

## 5. Plano de Verificação

- **Teste Compose**: Subir compose e validar funcionamento.
