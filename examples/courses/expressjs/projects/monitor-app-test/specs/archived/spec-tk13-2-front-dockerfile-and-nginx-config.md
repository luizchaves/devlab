# Spec TK13.2: Dockerfile e Configuração Nginx para o Front-end

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK13.2
- **Branch**: feat/tk13-2-dockerfile-front
- **História de Usuário**: US14 (Subir a aplicação em qualquer máquina)
- **Requisitos Atendidos**: RNF05, RNF09

## 1. Contexto e Objetivos

Criar front/Dockerfile e front/nginx.conf servindo a SPA estática com proxy reverso para /api.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `front/Dockerfile` | Criar | Receita Docker do front |
| `front/nginx.conf` | Criar | Configuração do Nginx com proxy reverso |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Dockerfile Front**:
   - Compilar front com Vite e servir com Nginx configurado com proxy /api.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA14.7 - Nginx com Proxy Reverso
  Dado o contêiner do front-end em execução com Nginx
  Quando requisições para /api são recebidas
  Então o Nginx deve repassar as chamadas para o serviço da API
```

## 5. Plano de Verificação

- **Docker Build Front**: Construir imagem do front com Nginx.
