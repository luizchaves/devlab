---
title: 'Web APIs: Streaming de Vídeo na Web'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Streaming de Vídeo na Web

## Ideia Central
- **Papel**: Transmissão de vídeo na web com WebRTC (RTCPeerConnection), streaming adaptativo com Media Source Extensions (MSE), WebCodecs e captura de tela
- **Contexto**: Suporte nativo do navegador para regimes de latência ultra-baixa em tempo real até distribuição em massa de vídeo sob demanda
- **Ambiente**: Navegador, protocolos UDP/SRTP e HTTP adaptativo, acelerado por hardware

## Os Três Paradigmas de Streaming
- **WebRTC**: Latência ultra-baixa (< 500 ms) bidirecional para videoconferências
- **Media Source Extensions (MSE)**: Streaming adaptativo com buffer (2 s a 10 s) para transmissões ao vivo e VOD
- **WebCodecs**: Decodificação e codificação direta na GPU (< 50 ms) para jogos em nuvem e WebGPU

## WebRTC (RTCPeerConnection)
- **Candidatos ICE**: Descoberta de rotas de rede (`pc.onicecandidate` / `addIceCandidate`)
- **Negociação SDP**: Oferta (`createOffer`) e resposta (`createAnswer`) com codecs e endereços
- **Recepção**: Evento `pc.ontrack` para associar o stream remoto a `video.srcObject`
- **Infraestrutura**: Servidores STUN (descoberta de IP) e TURN (relé em bloqueios de NAT/firewall)

## Media Source Extensions (MSE)
- **MediaSource**: Objeto que substitui URLs de arquivos estáticos por buffers dinâmicos
- **SourceBuffer**: Injeção contínua de pedaços binários via `appendBuffer()`
- **Pipelines adaptativos**: HLS (`.m3u8`) e MPEG-DASH (`.mpd`) com bibliotecas como `hls.js`

## Captura de Tela (Screen Capture)
- **getDisplayMedia()**: Captura de abas, janelas ou telas inteiras do sistema
- **Detecção de encerramento**: Evento `ended` na faixa de vídeo
- **Casos de uso**: Apresentações remotas, suporte técnico e streaming de jogos

## Quando usar, e quando não usar?
- **WebRTC**: Chamadas de vídeo 1:1, reuniões em grupo, salas virtuais
- **MSE / HLS / DASH**: Lives para milhares de pessoas com cache de CDN
- **video src direto**: Vídeos institucionais e clipes curtos sem segmentação
- **WebCodecs**: Cloud gaming e edição gráfica avançada

## Boas Práticas
- **Sinalização separada**: Usar WebSockets ou SSE para trocar SDP e ICE
- **Limpeza de buffer**: Evitar vazamento de memória em transmissões longas no MSE
- **Segurança**: Contexto seguro (HTTPS) obrigatório para WebRTC e captura de tela
