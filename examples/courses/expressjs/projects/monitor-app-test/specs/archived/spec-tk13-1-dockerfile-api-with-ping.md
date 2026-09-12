# Spec TK13.1: Dockerfile Multi-Estágio da API com Binário Ping Instalado

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK13.1
- **Branch**: feat/tk13-1-dockerfile-api
- **História de Usuário**: US14 (Subir a aplicação em qualquer máquina)
- **Requisitos Atendidos**: RNF05, RNF09

## 1. Contexto e Objetivos

Criar Dockerfile da API com instalação do pacote nativo iputils/ping e usuário não-root (node).

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/Dockerfile` | Criar | Receita Docker da API com ping |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Dockerfile API**:
   - Instalar pacote ping e configurar usuário node.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA14.6 - Binário Ping na Imagem
  Dado a imagem Docker da API construída
  Quando o contêiner executa
  Então o binário nativo ping deve estar disponível no ambiente
```

## 5. Plano de Verificação

- **Docker Build API**: Construir imagem da API localmente.
