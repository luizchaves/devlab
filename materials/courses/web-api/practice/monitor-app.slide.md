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
title: "Projeto: MonitorApp"
description: "Slides completos do tópico Projeto: MonitorApp."
---

<!-- _class: lead -->

# Projeto: MonitorApp

Objetivo do Projeto · Estrutura de Arquivos · Código-Fonte e Componentes · Como Executar o Projeto?

---

## Objetivo

- Aplicação prática de monitoramento de hosts com manipulação dinâmica do DOM.
- Entender o papel da API no navegador.
- Aplicar o recurso em uma interface real.

---

## Mapa do Tópico

- **Objetivo do Projeto**.
- **Estrutura de Arquivos**.
- **Código-Fonte e Componentes**.
- **Como Executar o Projeto?**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## Objetivo do Projeto

Analisar a arquitetura de uma aplicação JavaScript moderna desacoplada em módulos.

- ---.
- Trate estados de sucesso, erro e ausência de suporte.

---

## Estrutura de Arquivos

A aplicação é organizada seguindo a separação de responsabilidades em camadas.

- css ├── js/ │ ├── components/ │ │ ├── HostForm.
- js │ │ ├── HostTableRow.

---

## Código-Fonte e Componentes

A aplicação organiza o estado em módulos JavaScript com responsabilidades bem delineadas entre interface.

- **Interface Principal (HTML)**: O arquivo HTML define a estrutura da tabela e o container do modal de cadastro/edição.
- **Serviço de Armazenamento Local (`storage.js`)**: Módulo responsável por ler, gravar e atualizar a chave no `localStorage` serializando objetos para JSON.
- **Componentes de Interface**: Linha da Tabela de Hosts.
- **Ponto de Entrada da Aplicação (`main.js`)**: Orquestrador que conecta a leitura do storage, o envio dos dados e o evento de re-renderização da tabela.

---

## Código-Fonte e Componentes: Casos

- **Interface Principal (HTML)**: O arquivo HTML define a estrutura da tabela e o container do modal de cadastro/edição.
- **Serviço de Armazenamento Local (`storage.js`)**: Módulo responsável por ler, gravar e atualizar a chave no `localStorage` serializando objetos para JSON.
- **Componentes de Interface**: Linha da Tabela de Hosts.
- **Ponto de Entrada da Aplicação (`main.js`)**: Orquestrador que conecta a leitura do storage, o envio dos dados e o evento de re-renderização da tabela.

---

## Como Executar o Projeto?

1.

- Acesse o diretório do exemplo em `examples/courses/web-api/local-storage/monitor-app/`.
- Instale as dependências executando no terminal.
- Inicie o servidor de desenvolvimento: `npm run dev`.
- Abra o endereço `http://localhost:5173` no seu navegador.

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
- **Código-Fonte e Componentes**: revise o papel desse eixo no uso da API.
- **Como Executar o Projeto?**: revise o papel desse eixo no uso da API.
