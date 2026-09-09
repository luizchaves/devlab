---
title: 'Projeto: InvestApp'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Projeto: InvestApp

## Ideia Central
- **Papel**: Aplicação prática de controle de investimentos consumindo uma API REST assíncrona com Fetch API
- **Contexto**: O InvestApp é um projeto prático de nível intermediário que demonstra como construir uma aplicação front-end completa conectada a um serviço de back-end remoto via Fetch API assíncrona
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## Objetivo do Projeto
- **Ideia**: Estudar o isolamento do acesso à rede em um módulo de serviço (`storage
- **Detalhe**: js`), consumindo endpoints RESTful para realizar operações de cadastro, listagem, edição e exclusão de investimentos em tempo real

## Estrutura de Arquivos
- **Ideia**: invest-app/ ├── css/ │ └── style
- **Detalhe**: css ├── js/ │ ├── components/ │ │ ├── InvestmentCard

## Configuração de Variáveis de Ambiente
- **Ideia**: As credenciais do serviço de API são isoladas em um arquivo `

## Código-Fonte do Serviço de API (`storage.js`)
- **Ideia**: O módulo `services/storage
- **Detalhe**: js` centraliza todas as chamadas de `fetch()`, configurando cabeçalhos de autorização e convertendo respostas em objetos JavaScript: Trecho de código real do projeto de exemplo, recortado na página do tópico

## Componentes Visuais
- **Ideia**: A interface da aplicação é dividida em módulos reutilizáveis que gerenciam a renderização dinâmica de elementos no DOM e o fluxo de eventos de formulários:
### Cartão de Investimento (`InvestmentCard.js`)
- **Ideia**: Componente responsável por construir dinamicamente o card de exibição com ações de editar e excluir: Trecho de código real do projeto de exemplo, recortado na página do tópico
### Controlador Principal (`main.js`)
- **Ideia**: O arquivo principal da aplicação orquestra a inicialização do painel, manipula a submissão de novos investimentos e escuta as ações do usuário: Trecho de código real do projeto de exemplo, recortado na página do tópico

## Como Executar o Projeto?
- **Ideia**: Navegue até a pasta do exemplo em `examples/courses/web-api/fetch-api/invest-app/`
- **Detalhe**: Instale as dependências: Duplique o arquivo `
- **Ponto**: Navegue até a pasta do exemplo em `examples/courses/web-api/fetch-api/invest-app/`
- **Ponto**: Instale as dependências:
- **Ponto**: Duplique o arquivo `.env.example` para `.env` e configure sua URL de API
- **Ponto**: Inicie o servidor de desenvolvimento Vite: `npm run dev`

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
