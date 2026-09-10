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
title: "Web APIs: Streaming de Vídeo na Web"
description: "Slides completos do tópico Web APIs: Streaming de Vídeo na Web."
---

<!-- _class: lead -->

# Web APIs: Streaming de Vídeo na Web

WebRTC · Media Source Extensions · WebCodecs · Screen Capture

---

## Objetivo

- Diferenciar os modelos de streaming na web (WebRTC, MSE e WebCodecs).
- Estabelecer sessões WebRTC com `RTCPeerConnection`, SDP e ICE.
- Exibir fluxos remotos em elementos `<video>` com o evento `track`.
- Explicar o funcionamento de streaming adaptativo (HLS/DASH) com `MediaSource`.
- Capturar tela do sistema com `navigator.mediaDevices.getDisplayMedia()`.
- Escolher a arquitetura correta conforme latência e público-alvo.

---

## Mapa do Tópico

- **Os Três Paradigmas de Streaming na Web**.
- **WebRTC: Tempo Real e Baixa Latência**.
- **Media Source Extensions (MSE) e Streaming Adaptativo**.
- **Captura de Tela (Screen Capture API)**.
- **Quando usar, e quando não usar?**.

---

## Motivação

- **Comunicação moderna**: videoconferências e transmissões interativas no navegador.
- **Eficiência de infraestrutura**: streaming adaptativo via CDNs convencionais.
- **Aceleração por hardware**: decodificação fluida sem travar o processador.

*Regra de ouro: para chamadas interativas, use WebRTC; para lives de massa, use MSE.*

---

## Os Três Paradigmas de Streaming

A escolha da API depende da relação entre **latência** e **escala**:

- **WebRTC (`RTCPeerConnection`)**: Latência ultra-baixa (< 500 ms), P2P ou SFU.
- **Media Source Extensions (`MediaSource`)**: Streaming adaptativo com buffer (2 s a 10 s).
- **WebCodecs**: Acesso direto aos codificadores de hardware da GPU (< 50 ms).

---

## WebRTC: Conexão Peer-to-Peer

Quatro etapas fundamentais para estabelecer a transmissão:

1. **Adição de faixas**: `pc.addTrack(track, stream)`.
2. **Candidatos ICE**: descoberta de rotas de rede (`pc.onicecandidate`).
3. **Negociação SDP**: troca de oferta (`createOffer`) e resposta (`createAnswer`).
4. **Recepção de mídia**: escuta de stream remoto (`pc.ontrack`).

---

## Negociação WebRTC: Exemplo

Exemplo de conexão direta entre dois pares na mesma página:

```js
const pcLocal = new RTCPeerConnection();
const pcRemote = new RTCPeerConnection();

pcLocal.onicecandidate = (e) => e.candidate && pcRemote.addIceCandidate(e.candidate);
pcRemote.onicecandidate = (e) => e.candidate && pcLocal.addIceCandidate(e.candidate);

pcRemote.ontrack = (e) => {
  remoteVideo.srcObject = e.streams[0];
};

localStream.getTracks().forEach((t) => pcLocal.addTrack(t, localStream));

const offer = await pcLocal.createOffer();
await pcLocal.setLocalDescription(offer);
await pcRemote.setRemoteDescription(offer);

const answer = await pcRemote.createAnswer();
await pcRemote.setLocalDescription(answer);
await pcLocal.setRemoteDescription(answer);
```

---

## Media Source Extensions (MSE)

Streaming adaptativo com injeção dinâmica de fragmentos de vídeo:

```js
const mediaSource = new MediaSource();
video.src = URL.createObjectURL(mediaSource);

mediaSource.addEventListener('sourceopen', async () => {
  const mime = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
  const sourceBuffer = mediaSource.addSourceBuffer(mime);

  const res = await fetch('/video/segmento_01.mp4');
  const buffer = await res.arrayBuffer();
  sourceBuffer.appendBuffer(buffer);
});
```

---

## Captura de Tela (Screen Capture)

Compartilhamento de abas, janelas ou monitores inteiros:

```js
const displayStream = await navigator.mediaDevices.getDisplayMedia({
  video: { cursor: 'always' },
  audio: true,
});

video.srcObject = displayStream;

displayStream.getVideoTracks()[0].addEventListener('ended', () => {
  console.log('Compartilhamento finalizado.');
});
```

---

## Quando usar, e quando não usar?

- **WebRTC**: Chamadas 1:1, reuniões em grupo, salas virtuais e streaming interativo.
- **MSE / HLS / DASH**: Lives para milhares de espectadores e vídeo sob demanda (VOD).
- **`<video src="arquivo.mp4">`**: Vídeos institucionais curtos ou clipes estáticos.
- **WebCodecs**: Cloud gaming e processamento de frames em tempo real na GPU.

---

## Cuidados Práticos

- **STUN/TURN**: Obrigatórios em produção para contornar roteadores NAT e firewalls.
- **Limpeza de buffer**: Execute `sourceBuffer.remove()` em transmissões contínuas.
- **Cabeçalhos CORS**: Segmentos baixados por `fetch()` exigem autorização do servidor.

---

## Exercício Prático

1. Altere o exemplo para transmitir a tela com `getDisplayMedia()`.
2. Monitore o estado da conexão via `pc.addEventListener('connectionstatechange')`.
3. Crie um canal de dados com `pc.createDataChannel('chat')`.

---

## Perguntas de Revisão

1. Por que o WebRTC não é ideal para transmitir para milhares de pessoas?
2. Qual o papel dos servidores STUN e TURN?
3. O que é o protocolo SDP?
4. Como a API MediaSource (MSE) viabiliza taxas de bits adaptativas?

---

## Resumo do Tópico

- **WebRTC**: protocolo padrão para comunicação de áudio/vídeo em tempo real.
- **MediaSource Extensions**: injeção de buffers binários para HLS e DASH.
- **Screen Capture**: compartilhamento nativo de telas do sistema operacional.
- **WebCodecs**: controle granular e acelerado por GPU sobre frames de vídeo.
