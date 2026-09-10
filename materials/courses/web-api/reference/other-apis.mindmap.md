---
title: 'Web APIs: Outras Web APIs do Navegador'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Outras Web APIs do Navegador

## Ideia Central
- **Papel**: Panorama e guia de referência das Web APIs avançadas e especializadas que complementam a plataforma web: IndexedDB, Service Workers, Web Audio, OffscreenCanvas, WebXR, WebAuthn, WebCodecs e acesso a hardware
- **Contexto**: Este tópico cataloga interfaces de alto desempenho, áudio modular, decodificação acelerada, realidade estendida, autenticação biométrica, armazenamento estruturado offline e integração com periféricos físicos que expandem a plataforma web
- **Ambiente**: Navegador web moderno, especificações W3C e WHATWG

## O Panorama Estendido da Plataforma Web
- **Contexto**: Dezenas de especificações W3C e WHATWG para casos avançados além do DOM básico e Fetch
- **Estrutura**: Gráficos Desacoplados, Armazenamento PWA, Autenticação, Áudio Modular, Streams, Hardware e Sensores

## Gráficos em Segundo Plano e Imersão
- **OffscreenCanvas**: Renderização gráfica 2D/WebGL em Web Workers desacoplada da thread de UI
- **WebXR Device API**: Experiências imersivas de Realidade Virtual (VR) e Realidade Aumentada (AR)
- **EyeDropper API**: Conta-gotas nativo para captura de cores da tela

## Armazenamento Estruturado e Offline (PWA)
- **IndexedDB**: Banco orientado a objetos, transacional e assíncrono para grandes volumes
- **Service Workers**: Proxy de rede em background para funcionamento offline e push
- **Cache API**: Persistência de pares Request/Response para carregamento instantâneo
- **Storage Manager**: Estimativa de quota e persistência garantida

## Autenticação, Criptografia e Permissões
- **WebAuthn / Passkeys**: Autenticação biométrica forte e sem senha baseada em criptografia assimétrica
- **FedCM API**: Login federado com provedores (Google/Apple) preservando privacidade
- **Permissions API**: Consulta programática do status de permissões da origem
- **Credential Management**: Armazenamento e sincronização segura de credenciais

## Áudio Modular, Codecs e Mídia
- **Web Audio API**: Nós modulares de áudio (`AudioContext`, `GainNode`, `AnalyserNode`)
- **WebCodecs API**: Acesso direto a encoders/decoders de vídeo e áudio na GPU
- **Media Capabilities API**: Consulta de fluidez e eficiência de reprodução de codecs pelo hardware
- **Remote Playback API**: Transmissão e controle em smart TVs e Chromecast

## Streams, Compressão e Arquivos
- **Streams API**: Encadeamento e consumo de fluxos de dados contínuos em blocos
- **Compression Streams API**: Compactação e descompactação nativa em Gzip/Deflate
- **File System Access API**: Leitura e gravação direta em arquivos do sistema operacional

## Interface Moderna, Transições e Compartilhamento
- **View Transitions API**: Transições animadas suaves entre páginas (MPA/SPA)
- **Web Animations API**: Controle programático do motor de animação CSS
- **Web Share API**: Abertura da folha nativa de compartilhamento do sistema
- **Badging API**: Notificação visual numérica no ícone da aplicação

## Hardware e Periféricos
- **Web Bluetooth**: Conexão com dispositivos BLE via perfil GATT
- **Web USB / Web Serial**: Comunicação direta com microcontroladores e impressoras
- **Web NFC API**: Leitura e gravação de tags NFC sem contato no celular
- **WebHID API**: Suporte a controladores, gamepads e mesas de som
- **Requisitos**: Contexto Seguro (HTTPS) e Gesto Explícito do Usuário

## Sensores, Janelas e Controle do Sistema
- **Screen Wake Lock**: Impede que a tela entre em descanso
- **Window Controls Overlay**: Integra a barra de título em PWAs instaladas no desktop
- **Picture-in-Picture**: Vídeo flutuante sobreposto a outras abas
- **Web Locks API**: Coordena concorrência entre múltiplas abas da mesma origem
- **Broadcast Channel**: Troca de mensagens entre abas da mesma origem

## Perguntas de Revisão
- **Local Storage vs IndexedDB**: volume de dados, persistência e assincronismo
- **OffscreenCanvas vs Canvas 2D**: desenho em worker sem travar a thread de interface
- **View Transitions**: animações nativas de tela no motor do browser
- **WebAuthn**: autenticação criptográfica por chave pública resistente a phishing
- **APIs de Hardware**: segurança, isolamento, permissões explícitas e HTTPS
- **Screen Wake Lock**: controle de descanso e economia de tela em uso ativo

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
