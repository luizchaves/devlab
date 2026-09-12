# Spec TK13.4: Volumes Persistentes para Banco e Uploads

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK13.4
- **Branch**: feat/tk13-4-named-volumes
- **História de Usuário**: US14 (Subir aplicação em qualquer máquina)
- **Requisitos Atendidos**: RNF05

## 1. Contexto e Objetivos

Configurar volumes Docker nomeados para preservação do banco SQLite e fotos de perfil.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `compose.yaml` | Modificar | Configuração de volumes persistentes |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Volumes Nomeados**:
   - Mapear volumes para persistência de dados após restart.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA14.5 - Persistência após Down/Up
  Dado que dados foram gravados na aplicação
  Quando docker compose down seguido de docker compose up é executado
  Então os dados do banco e uploads devem permanecer intactos
```

## 5. Plano de Verificação

- **Teste de Volumes**: Reiniciar compose e validar dados preservados.
