---
marp: true
theme: default
paginate: true
style: |
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 70px;
    font-size: 1.5rem;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    position: absolute;
    bottom: 24px;
    right: 32px;
    padding: 0;
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "Projeto: InvestApp"
description: "Slides completos do tópico Projeto: InvestApp."
---

<!-- _class: lead -->

# Projeto: InvestApp

Objetivo do Projeto · Estrutura de Arquivos · Configuração de Variáveis de Ambiente · Código-Fonte do Serviço de API (`storage.js`)

---

## Objetivo

- Aplicação prática de controle de investimentos consumindo uma API REST assíncrona com Fetch API.
- Entender o papel da API no navegador.
- Aplicar o recurso em uma interface real.

---

## Mapa do Tópico

- **Objetivo do Projeto**.
- **Estrutura de Arquivos**.
- **Configuração de Variáveis de Ambiente**.
- **Código-Fonte do Serviço de API (`storage.js`)**.
- **Componentes Visuais**.
- **Como Executar o Projeto?**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## Objetivo do Projeto

Estudar o isolamento do acesso à rede em um módulo de serviço.

- js.
- ---.

---

## Estrutura de Arquivos


- css ├── js/ │ ├── components/ │ │ ├── InvestmentCard.
- js │ │ ├── InvestmentForm.
- js │ │ └── Modal.

---

## Configuração de Variáveis de Ambiente

As credenciais do serviço de API são isoladas em um arquivo.

- ---.
- Trate estados de sucesso, erro e ausência de suporte.

---

## Código-Fonte do Serviço de API (`storage.js`)

O módulo.

- <SourceCode path="examples/courses/web-api/fetch-api/invest-app/js/services/storage.
- js" lang="js" title="js/services/storage.
- ---.

---

## Componentes Visuais

A interface da aplicação é dividida em módulos reutilizáveis que gerenciam a renderização dinâmica de elementos no DOM.

- **Cartão de Investimento (`InvestmentCard.js`)**: Componente responsável por construir dinamicamente o card de exibição com ações de editar e excluir.
- **Controlador Principal (`main.js`)**: O arquivo principal da aplicação orquestra a inicialização do painel.

---

## Como Executar o Projeto?

<Steps> 1.

- Navegue até a pasta do exemplo em `examples/courses/web-api/fetch-api/invest-app/`.
- Instale as dependências.
- Duplique o arquivo `.env.example` para `.env` e configure sua URL de API.
- Inicie o servidor de desenvolvimento Vite: `npm run dev`.

---

## Perguntas de revisão

1. Qual problema esta API resolve?
2. Quando ela deve ser evitada?
3. Quais estados de erro precisam aparecer na interface?
4. Como validar o comportamento no navegador?

---

## Resumo do Tópico

- **Objetivo do Projeto**: revise o papel desse eixo no uso da API.
- **Estrutura de Arquivos**: revise o papel desse eixo no uso da API.
- **Configuração de Variáveis de Ambiente**: revise o papel desse eixo no uso da API.
- **Código-Fonte do Serviço de API (`storage.js`)**: revise o papel desse eixo no uso da API.
- **Componentes Visuais**: revise o papel desse eixo no uso da API.
