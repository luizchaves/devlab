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

O Panorama Estendido da Plataforma Web · Gráficos 3D e Computação Acelerada por GPU · Armazenamento Estruturado e Aplicações Offline (PWA) · Autenticação, Criptografia e Pagamentos

---

## Objetivo

- Categorizar as principais Web APIs avançadas por domínio de aplicação (gráficos, persistência, rede, mídia, segurança e periféricos).
- Diferenciar os casos de uso de APIs básicas e suas contrapartes avançadas (ex: Canvas 2D vs WebGL/WebGPU, Web Storage vs IndexedDB).
- Avaliar requisitos de segurança, permissões e suporte entre navegadores para recursos experimentais ou de baixo nível.
- Selecionar a especificação adequada para cenários de aplicações web progressivas (PWA), processamento de mídia.

---

## Mapa do Tópico

- **O Panorama Estendido da Plataforma Web**.
- **Gráficos 3D e Computação Acelerada por GPU**.
- **Armazenamento Estruturado e Aplicações Offline (PWA)**.
- **Autenticação, Criptografia e Pagamentos**.
- **Áudio Avançado, Câmera e Comunicação em Tempo Real**.
- **Interface Moderna, Animações e Compartilhamento**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## O Panorama Estendido da Plataforma Web

Além das interfaces fundamentais de manipulação do DOM, requisições HTTP e armazenamento básico abordadas nas seções principais deste guia.

- O mapa do tópico agrupa essas interfaces em domínios especializados.
- A seguir, analisamos cada uma dessas famílias, seus objetivos, interfaces principais e quando adotá-las.
- ---.

---

## Gráficos 3D e Computação Acelerada por GPU

Para renderização gráfica tridimensional, sombreamento de shaders e processamento massivo paralelo.

- **WebGL / WebGL 2**: Visualizações 3D, mapas interativos, jogos de navegador (via Three.js, Babylon.js).
- **WebGPU**: Modelos de IA e redes neurais no cliente.

---

## Armazenamento Estruturado e Aplicações Offline (PWA)

Aplicações que operam sem conexão de rede (*offline-first*) ou que lidam.

- **IndexedDB API**: Cache offline de grandes coleções de registros, editores de texto com histórico local.
- **Service Workers API**: Progressive Web Apps (PWAs), funcionamento offline completo, sincronização em segundo plano.
- **Cache API**: Cache de assets estáticos (HTML, CSS, JS, imagens) e respostas da API para navegação instantânea.
- **Storage Manager API**: Verificar quota de armazenamento disponível e evitar que o navegador limpe o cache automaticamente.

---

## Autenticação, Criptografia e Pagamentos

Para substituir senhas inseguras por autenticação biométrica nativa e realizar operações criptográficas de ponta a ponta.

- **Web Authentication API (WebAuthn / Passkeys)**: Login com biometria (Touch ID, Face ID, Windows Hello) ou chaves físicas de segurança (FIDO2 / YubiKey).
- **Web Cryptography API**: Geração de assinaturas digitais, hash SHA-256 no cliente, criptografia ponta a ponta (E2EE) em chats.
- **Payment Request API**: Formulários de pagamento simplificados integrados a Apple Pay, Google Pay e cartões salvos no navegador.
- **Credential Management API**: Login automático com 1 clique e sincronização de credenciais de login entre dispositivos do usuário.

---

## Áudio Avançado, Câmera e Comunicação em Tempo Real

A manipulação de áudio em nível de nó e a comunicação ponto a ponto dispensam plugins externos.

- **Web Audio API**: Sintetizadores musicais, equalizadores, jogos com áudio espacial 3D, analisadores de espectro sonoro.
- **MediaStreams / getUserMedia**: Gravação de voz, leitura de QR Codes por câmera, captura de tela para streaming.
- **WebRTC API**: Videoconferências em tempo real (como Google Meet e Discord Web), compartilhamento P2P de arquivos.
- **WebCodecs API**: Edição de vídeo no navegador com aceleração de hardware, streaming de jogos e renderização personalizada.

---

## Interface Moderna, Animações e Compartilhamento

Interfaces modernas que aproximam a experiência de aplicações web da experiência de aplicativos móveis nativos.

- **View Transitions API**: Navegação cinematográfica com animação contínua de elementos compartilhados (SPA e MPA nativo).
- **Web Animations API (WAAPI)**: Animações dinâmicas dirigidas por código JS, controle de reprodução (`pause`, `reverse`, `playbackRate`).
- **Web Share API**: Botão de "Compartilhar" que abre a folha nativa do celular/desktop para WhatsApp, Telegram ou e-mail.
- **Badging API**: Exibir a contagem de mensagens não lidas no ícone do PWA na barra de tarefas ou na tela inicial do celular.

---

## Streams e Manipulação de Arquivos

Para processamento eficiente de fluxos contínuos de dados sem carregar arquivos gigantescos inteiramente na memória RAM.

- **Streams API**: Descompactação em tempo real de downloads, processamento de vídeo em streaming.
- **File System Access API**: IDEs web (como VS Code for Web), editores de imagem, ferramentas de edição de código local no navegador.

---

## Redes de Próxima Geração e Métricas de Performance

Ferramentas para transporte de dados em alta velocidade e monitoramento de desempenho da aplicação em produção.

- **WebTransport API**: Jogos multiplayer online em tempo real, streaming de baixa latência e alternativas flexíveis a WebSockets.
- **Performance Timeline API**: Medição em tempo real de LCP (*Largest Contentful Paint*), FID/INP e requisições lentas de rede.
- **Network Information API**: Adaptar a qualidade das imagens e vídeos automaticamente quando o usuário estiver em redes 3G ou modo.

---

## Hardware, Periféricos e Conectividade Local

Ambientes restritos e sistemas operacionais desktop/mobile permitem conectar dispositivos físicos via navegador sob permissões explícitas.

- **Web Bluetooth API**: Monitoramento de frequência cardíaca, leitura de sensores IoT, controle de drones e robôs educacionais.
- **Web USB API**: Configuração de teclados customizados, placas microcontroladoras (Arduino, ESP32) e leitores fiscais.
- **Web Serial API**: Gravação de firmware em microcontroladores, conexão com impressoras térmicas e equipamentos industriais.
- **WebHID API**: Gamepads especiais, pedais de controle, mesas de som e controladores de voo.

---

## Sensores, Janelas e Controle do Sistema

Interfaces que controlam o comportamento da aba e reagem ao estado físico do dispositivo.

- **Screen Wake Lock API**: Receitas culinárias na tela, aplicativos de apresentação de slides, teleprompters.
- **Picture-in-Picture API**: Reprodutores de vídeo e chamadas de videoconferência enquanto o usuário navega em outras abas.
- **Web Locks API**: Evitar que duas abas abertas sincronizem ou gravem dados conflitantes no IndexedDB simultaneamente.
- **Broadcast Channel API**: Deslogar o usuário em todas as abas abertas quando ele clicar em "Sair" em uma delas.
- **Sensor APIs**: Jogos baseados em inclinação do celular, ajuste dinâmico de brilho e bússolas digitais.

---

## Perguntas de revisão

1. Qual a diferença fundamental de aplicação entre Local Storage e IndexedDB?
2. Por que WebGL e WebGPU operam de forma diferente da Canvas 2D API?
3. Qual é a vantagem da View Transitions API em relação a bibliotecas JS de animação?
4. Como o WebAuthn melhora a segurança em relação a senhas tradicionais?
5. Por que APIs como Web Bluetooth e Web USB exigem gesto do usuário e HTTPS?

---

## Resumo do Tópico

- **O Panorama Estendido da Plataforma Web**: revise o papel desse eixo no uso da API.
- **Gráficos 3D e Computação Acelerada por GPU**: revise o papel desse eixo no uso da API.
- **Armazenamento Estruturado e Aplicações Offline (PWA)**: revise o papel desse eixo no uso da API.
- **Autenticação, Criptografia e Pagamentos**: revise o papel desse eixo no uso da API.
- **Áudio Avançado, Câmera e Comunicação em Tempo Real**: revise o papel desse eixo no uso da API.
