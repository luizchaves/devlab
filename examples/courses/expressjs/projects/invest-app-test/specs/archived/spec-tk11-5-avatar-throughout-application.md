# Spec TK11.5: Exibição do Avatar do Investidor na Barra de Navegação

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK11.5
- **Branch**: feat/tk11-5-nav-avatar
- **História de Usuário**: US12 (Personalizar foto do perfil)
- **Requisitos Atendidos**: RF06

## 1. Contexto e Objetivos

Exibir avatar do usuário logado no cabeçalho em todas as páginas do InvestApp.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `front/js/lib/auth.js` | Modificar | Renderização do avatar global |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Avatar Global**:
   - Carregar foto de perfil na barra superior de todas as telas.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA12.3 - Avatar na Navegação
  Dado um usuário logado com foto cadastrada
  Quando navega entre as páginas da aplicação
  Então seu avatar deve ser exibido no cabeçalho
```

## 5. Plano de Verificação

- **Checagem Visual**: Navegar entre telas e conferir avatar no topo.
