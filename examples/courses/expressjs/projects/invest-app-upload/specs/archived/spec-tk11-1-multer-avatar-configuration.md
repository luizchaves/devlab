# Spec TK11.1: Configuração do Multer com Validação de Tipos e Limites

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK11.1
- **Branch**: feat/tk11-1-multer-config
- **História de Usuário**: US12 (Personalizar foto do perfil)
- **Requisitos Atendidos**: RF06

## 1. Contexto e Objetivos

Criar back/src/config/upload.ts configurando Multer com limite de 2 MB e tipos PNG/JPEG/WebP.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/config/upload.ts` | Criar | Configuração de upload de arquivos |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Configuração de Upload**:
   - Definir destino, nomes únicos por UUID e filtros de tipo MIME.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA12.4 - Rejeição por Limite de Tamanho
  Dado uma tentativa de upload com imagem superior a 2 MB
  Quando o Multer avalia o stream
  Então deve responder status 400 Bad Request
```

## 5. Plano de Verificação

- **Teste de Tamanho**: Enviar arquivo maior que 2 MB e checar 400.
