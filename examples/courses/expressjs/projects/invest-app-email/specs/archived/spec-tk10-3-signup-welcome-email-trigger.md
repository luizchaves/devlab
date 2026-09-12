# Spec TK10.3: Disparo Automático de E-mail no Cadastro

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK10.3
- **Branch**: feat/tk10-3-mail-trigger
- **História de Usuário**: US11 (Confirmar criação de conta)
- **Requisitos Atendidos**: RF05

## 1. Contexto e Objetivos

Acionar envio de boas-vindas no controller de usuários sem travar a resposta 201.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/controllers/users.controller.ts` | Modificar | Disparo de e-mail no cadastro |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Trigger de E-mail**:
   - Integrar envio assíncrono com tolerância a falhas do SMTP.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA11.5 - Resiliência a Falhas do SMTP
  Dado que o servidor SMTP está temporariamente indisponível
  Quando um novo cadastro é submetido
  Então a API deve responder 201 com sucesso e registrar a falha de envio no log
```

## 5. Plano de Verificação

- **Teste de Resiliência**: Testar cadastro com SMTP indisponível.
