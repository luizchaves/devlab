---
title: 'Projeto: MonitorApp'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Projeto: MonitorApp

## Ideia Central
- **Papel**: Aplicação prática de monitoramento de hosts com manipulação dinâmica do DOM, modais e persistência com LocalStorage
- **Contexto**: O MonitorApp é um projeto prático que demonstra a integração de múltiplas Web APIs: manipulação dinâmica do DOM, captura de eventos em formulários e modais, e persistência de dados no cliente utilizando a `localStorage` API
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## Objetivo do Projeto
- **Ideia**: Analisar a arquitetura de uma aplicação JavaScript moderna desacoplada em módulos (serviços de armazenamento, utilitários DOM e componentes visuais de interface), praticando as quatro operações de um CRUD completo sem dependência de servidor back-end

## Estrutura de Arquivos
- **Ideia**: A aplicação é organizada seguindo a separação de responsabilidades em camadas: monitor-app/ ├── css/ │ └── style
- **Detalhe**: css ├── js/ │ ├── components/ │ │ ├── HostForm

## Código-Fonte e Componentes
- **Ideia**: A aplicação organiza o estado em módulos JavaScript com responsabilidades bem delineadas entre interface, regras de negócio e camada de armazenamento:
### Interface Principal (HTML)
- **Ideia**: O arquivo HTML define a estrutura da tabela e o container do modal de cadastro/edição: Trecho de código real do projeto de exemplo, recortado na página do tópico
### Serviço de Armazenamento Local (`storage.js`)
- **Ideia**: Módulo responsável por ler, gravar e atualizar a chave no `localStorage` serializando objetos para JSON: Trecho de código real do projeto de exemplo, recortado na página do tópico
### Componentes de Interface
- **Ideia**: Linha da Tabela de Hosts (`HostTableRow
### Ponto de Entrada da Aplicação (`main.js`)
- **Ideia**: Orquestrador que conecta a leitura do storage, o envio dos dados e o evento de re-renderização da tabela: Trecho de código real do projeto de exemplo, recortado na página do tópico

## Como Executar o Projeto?
- **Ideia**: Acesse o diretório do exemplo em `examples/courses/web-api/local-storage/monitor-app/`
- **Detalhe**: Instale as dependências executando no terminal: Inicie o servidor de desenvolvimento: `npm run dev`
- **Ponto**: Acesse o diretório do exemplo em `examples/courses/web-api/local-storage/monitor-app/`
- **Ponto**: Instale as dependências executando no terminal:
- **Ponto**: Inicie o servidor de desenvolvimento: `npm run dev`
- **Ponto**: Abra o endereço `http://localhost:5173` no seu navegador

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
