# Spec TK02.1: Servidor Express em back/src/index.js com CORS e Morgan

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK02.1
- **Branch**: feat/tk02-1-express-server
- **História de Usuário**: US02 (Manter o inventário de hosts)
- **Requisitos Atendidos**: RF01, RNF05

## 1. Contexto e Objetivos

Criar servidor Express em back/src/index.js com Morgan, CORS e express.json().

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/index.js` | Criar | Entrypoint do backend Express |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Servidor Express**:
   - Instanciar Express e configurar middlewares básicos.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA02.1 - Listagem de Hosts (200)
  Dado que o servidor Express está ativo
  Quando uma requisição GET /api/hosts é enviada
  Então deve responder 200 com array de hosts cadastrados
```

## 5. Plano de Verificação

- **Teste de Servidor**: Subir backend e testar GET /api/hosts.
