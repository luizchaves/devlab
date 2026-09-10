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
title: "Web APIs: Outras Web APIs do Navegador"
description: "Slides completos do tópico Web APIs: Outras Web APIs do Navegador."
---

<!-- _class: lead -->

# Web APIs: Outras Web APIs do Navegador

O Panorama Estendido da Plataforma Web · Gráficos Desacoplados · PWA Offline · Áudio Modular · Segurança Biométrica · Hardware

---

## Objetivo

- Categorizar as principais Web APIs avançadas por domínio de aplicação (gráficos, persistência, mídia, segurança, hardware e sistema).
- Diferenciar os casos de uso de APIs básicas e suas contrapartes avançadas (ex: Canvas tradicional vs OffscreenCanvas, Web Storage vs IndexedDB).
- Avaliar requisitos de segurança, permissões e suporte entre navegadores para recursos experimentais ou de baixo nível.
- Selecionar a especificação adequada para cenários de PWA, áudio profissional, autenticação moderna e integração física.

---

## Mapa do Tópico

- **O Panorama Estendido da Plataforma Web**.
- **Gráficos em Segundo Plano e Imersão (OffscreenCanvas, WebXR)**.
- **Armazenamento Estruturado e Offline (IndexedDB, Service Workers)**.
- **Autenticação, Criptografia e Permissões (WebAuthn, FedCM)**.
- **Áudio Modular, Codecs e Mídia (Web Audio, WebCodecs)**.
- **Streams, Compressão e Arquivos (Compression Streams)**.
- **Hardware, Periféricos e Janelas (Web NFC, Window Overlay)**.

---

## Motivação

- **Recurso nativo**: use o navegador como plataforma de aplicação completa.
- **Performance isolada**: processe gráficos e áudio fora da thread principal de UI.
- **Experiência moderna**: biometria sem senha, modo offline e conexão com periféricos.

*Regra de ouro: conheça o ecossistema estendido para não reinventar recursos nativos da plataforma.*

---

## Gráficos em Segundo Plano e Imersão

- **OffscreenCanvas API**: Renderização 2D/WebGL em Web Workers sem travar a interface.
- **WebXR Device API**: Experiências de Realidade Virtual (VR) e Realidade Aumentada (AR).
- **EyeDropper API**: Ferramenta nativa de conta-gotas para capturar cores na tela.

---

## Armazenamento Estruturado e Offline (PWA)

- **IndexedDB API**: Banco de dados orientado a objetos no cliente para grandes volumes.
- **Service Workers API**: Proxy de rede programável em segundo plano com suporte offline.
- **Cache API**: Armazenamento de pares Request/Response para carregamento instantâneo.
- **Storage Manager API**: Estimativa de uso de disco e garantia de persistência.

---

## Autenticação, Criptografia e Permissões

- **WebAuthn / Passkeys**: Login sem senha com biometria (Touch ID, Face ID, Windows Hello).
- **FedCM API**: Autenticação federada com Google/Apple preservando a privacidade do usuário.
- **Permissions API**: Consulta prévia do status de permissões da aplicação.
- **Credential Management API**: Armazenamento e preenchimento federado de credenciais.

---

## Áudio Modular, Codecs e Capacidades

- **Web Audio API**: Processamento e síntese de áudio modular em tempo real via grafo de nós.
- **WebCodecs API**: Acesso direto aos codificadores e decodificadores de mídia na GPU.
- **Media Capabilities API**: Consulta de fluidez e eficiência energética de codecs pelo hardware.
- **Remote Playback API**: Transmissão e controle de vídeo em smart TVs e Chromecast.

---

## Streams, Compressão e Manipulação de Arquivos

- **Streams API**: Encadeamento e consumo de fluxos de dados contínuos em blocos.
- **Compression Streams API**: Compactação e descompactação nativa em Gzip/Deflate.
- **File System Access API**: Leitura e gravação direta em arquivos do sistema operacional.

---

## Hardware, Periféricos e Conectividade Local

- **Web Bluetooth API**: Comunicação com sensores BLE via perfil GATT.
- **Web USB / Web Serial API**: Acesso direto a microcontroladores e impressoras térmicas.
- **Web NFC API**: Leitura e gravação de tags NFC sem contato no celular.
- **WebHID API**: Integração com controladores especiais, gamepads e mesas de som.

---

## Sensores, Janelas e Controle do Sistema

- **Screen Wake Lock API**: Impede que a tela do aparelho entre em descanso ou bloqueie.
- **Window Controls Overlay API**: Integra a barra de título em PWAs instaladas no desktop.
- **Picture-in-Picture API**: Vídeo flutuante sobreposto enquanto o usuário navega em outras abas.
- **Web Locks API**: Coordena acesso concorrente a recursos entre abas da mesma origem.

---

## Perguntas de Revisão

1. Qual a diferença fundamental entre Local Storage e IndexedDB?
2. Qual a vantagem do OffscreenCanvas em relação ao Canvas tradicional?
3. Como o WebAuthn melhora a segurança em relação a senhas tradicionais?
4. Por que APIs como Web Bluetooth e Web USB exigem HTTPS e gesto do usuário?
5. Para que serve a Screen Wake Lock API?

---

## Resumo do Tópico

- **Além do básico**: a plataforma web dispõe de dezenas de APIs especializadas.
- **Desempenho e isolamento**: use workers, OffscreenCanvas e Web Audio.
- **Segurança e biometria**: WebAuthn e FedCM como padrão moderno de autenticação.
- **Integração com o SO**: sensores, hardware e janelas PWA de primeira classe.
