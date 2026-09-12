# Spec TK11.1: Configuração de Upload Multipart Seguro com Multer

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK11.1
- **Branch**: feat/tk11-1-upload-config
- **História de Usuário**: US17 (Ter uma foto de perfil)
- **Requisitos Atendidos**: RF08

## 1. Contexto e Objetivos

Criar src/config/upload.ts com Multer configurado para arquivos de até 2 MB, tipos PNG/JPEG/WebP e nomes por UUID.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/config/upload.ts` | Criar | Configuração de upload e validação de arquivos |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Configuração de Upload**:
   - Definir destino, nomes por UUID e filtros de tipo MIME.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA17.3 - Rejeição de Tipo MIME Não Autorizado
  Dado uma tentativa de upload de arquivo executável ou PDF
  Quando o Multer processa o multipart
  Então deve responder 415 Unsupported Media Type e não salvar nada em disco
```

## 5. Plano de Verificação

- **Teste de Upload**: Enviar arquivo fora da lista permitida e checar 415.
