# Spec TK11.8: Controller de Ping e Rota com Limitação Dedicada

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK11.8
- **Branch**: feat/tk11-8-ping-route
- **História de Usuário**: US19 (Medir a latência até um host)
- **Requisitos Atendidos**: RF10

## 1. Contexto e Objetivos

Criar src/controllers/ping-controller.ts e rota GET /ping com autenticação, validação e rate limit próprio.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/controllers/ping-controller.ts` | Criar | Handler de medição |
| `src/routes/ping-router.ts` | Criar | Rota GET /ping |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Rota de Ping**:
   - Proteger com autenticação e responder 200 com latência medida.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA19.1 - Medição de Latência com Sucesso
  Dado um usuário autenticado consultando GET /ping?host=8.8.8.8
  Quando o comando é executado
  Então deve responder 200 com a latência medida em milissegundos
```

## 5. Plano de Verificação

- **Medição Real**: Testar GET /ping com host válido.
