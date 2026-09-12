# Spec TK11.3: Serviço de Envio de E-mails Transacionais com Nodemailer

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK11.3
- **Branch**: feat/tk11-3-mail-service
- **História de Usuário**: US16 (Confirmar que o e-mail é meu)
- **Requisitos Atendidos**: RF07

## 1. Contexto e Objetivos

Criar src/services/mail-service.ts com transporte assíncrono Nodemailer por ambiente sem bloquear a resposta do cadastro.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/services/mail-service.ts` | Criar | Serviço de e-mail transacional |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Serviço de E-mail**:
   - Configurar transporte e envio não-bloqueante com fallback para logs em dev.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA16.1 - Disparo Não-Bloqueante de E-mail
  Dado um cadastro de usuário concluído com sucesso
  Quando o e-mail de boas-vindas é disparado
  Então a resposta 201 não deve aguardar a conclusão do envio SMTP
```

## 5. Plano de Verificação

- **Teste de E-mail**: Checar log de mail_sent em desenvolvimento.
