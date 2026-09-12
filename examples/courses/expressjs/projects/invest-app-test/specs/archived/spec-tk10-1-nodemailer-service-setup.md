# Spec TK10.1: Configuração do Serviço de E-mails com Nodemailer

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK10.1
- **Branch**: feat/tk10-1-mail-service
- **História de Usuário**: US11 (Confirmar criação de conta)
- **Requisitos Atendidos**: RF05

## 1. Contexto e Objetivos

Criar back/src/services/mail.ts configurando transporte Nodemailer assíncrono.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/services/mail.ts` | Criar | Serviço de disparo de e-mails |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Serviço de E-mail**:
   - Configurar transporte e envio não-bloqueante.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA11.1 - Disparo de E-mail de Boas-Vindas
  Dado um novo cadastro de investidor realizado
  Quando o processo é concluído
  Então o e-mail de boas-vindas deve ser disparado assincronamente
```

## 5. Plano de Verificação

- **Teste de E-mail**: Verificar log de envio de e-mail.
