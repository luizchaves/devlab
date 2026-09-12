# Spec TK02.5: Catálogo de Requisições HTTP Executáveis

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK02.5
- **Branch**: feat/tk02-5-http-catalog
- **História de Usuário**: US02 (Manter a carteira pela aplicação)
- **Requisitos Atendidos**: RF01

## 1. Contexto e Objetivos

Criar back/requests.http com requisições documentadas e executáveis para todas as rotas de investimentos.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/requests.http` | Criar | Catálogo executável de requisições |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Catálogo HTTP**:
   - Documentar GET, POST, PUT e DELETE com exemplos de payloads.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA02.3 - Criação com ID Gerado
  Dado um payload com name e value
  Quando um POST /api/investments é executado
  Então deve responder 201 com ID único gerado
```

## 5. Plano de Verificação

- **Execução REST**: Disparar requisições em requests.http.
