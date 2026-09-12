# Spec TK01.5: Tela Estática de Perfil do Investidor e Avatar Padrão

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK01.5
- **Branch**: feat/tk01-5-profile-view
- **História de Usuário**: US01 (Conhecer o sistema antes de usá-lo)
- **Requisitos Atendidos**: RF06, RNF05, RNF06

## 1. Contexto e Objetivos

Criar profile.html com painel de dados cadastrais do investidor, avatar padrão e formulário estático de upload de imagem.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `profile.html` | Criar | Tela estática de perfil do investidor |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Tela de Perfil**:
   - Construir visualização de perfil com avatar e formulário multipart estático.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA01.4 - Ausência de Scripts no HTML
  Dado o arquivo profile.html
  Quando a estrutura é inspecionada
  Então não deve conter tags script de aplicação JavaScript
```

## 5. Plano de Verificação

- **Validação Semântica**: Inspecionar ausência de scripts.
