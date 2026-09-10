---
title: 'Web APIs: MediaDevices e Captura de Mídia'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: MediaDevices e Captura de Mídia

## Ideia Central
- **Papel**: Captura de vídeo e áudio do usuário com navigator.mediaDevices.getUserMedia, MediaStream, restrições de hardware, captura com Canvas e encerramento de faixas
- **Contexto**: Acesso a sensores multimídia físicos (câmeras, microfones) diretamente no navegador para processamento em tempo real sob contexto seguro
- **Ambiente**: Navegador, HTTPS/localhost, controle explícito de permissões

## O Modelo de Fluxos de Mídia (MediaStream)
- **MediaStream**: Objeto contêiner que agrupa os canais de mídia transmitidos
- **MediaStreamTrack**: Faixa individual de vídeo ou de áudio
- **Exibição**: Vinculação direta com `video.srcObject = stream`
- **Atributos do vídeo**: `autoplay`, `playsinline` e `muted` para compatibilidade móvel

## Solicitando Permissões e Restrições (Constraints)
- **Método**: `navigator.mediaDevices.getUserMedia(constraints)`
- **Constraints de vídeo**: `width`, `height`, `frameRate`, `facingMode` (`user` ou `environment`)
- **Constraints de áudio**: `audio: true` ou configurações de cancelamento de eco
- **Contexto seguro**: Obrigatório HTTPS ou `localhost`

## Tratamento de Erros e Exceções
- **NotAllowedError**: Usuário negou acesso ou SO bloqueou a câmera
- **NotFoundError**: Nenhum dispositivo físico compatível conectado
- **NotReadableError**: Câmera ocupada por outro aplicativo
- **OverconstrainedError**: Resolução ou restrição incompatível com o sensor

## Captura de Fotos com Canvas
- **drawImage()**: Desenha o quadro atual de `<video>` no contexto 2D do `<canvas>`
- **Resolução nativa**: Ajustar `canvas.width = video.videoWidth` e `canvas.height = video.videoHeight`
- **Exportação**: `canvas.toDataURL('image/jpeg')` ou `canvas.toBlob()`

## Gerenciamento de Recursos
- **Encerramento de faixas**: `stream.getTracks().forEach(track => track.stop())`
- **Desativação física**: Desliga o LED da câmera e libera o sensor
- **Controle de mudo**: `audioTrack.enabled = false` silencia sem fechar a conexão

## Quando usar, e quando não usar?
- **getUserMedia**: Leitura de QR Code, filtros de imagem, streaming e videoconferência
- **input file com capture**: Foto simples de perfil ou upload avulso em celulares
- **MediaRecorder**: Gravação de áudio e vídeo local
- **getDisplayMedia**: Compartilhamento de tela do computador

## Boas Práticas
- **Gesto do usuário**: Solicitar permissão apenas após clique explícito
- **Limpeza no desmonte**: Sempre executar `track.stop()`
- **Fallback**: Tratar navegadores sem suporte ou permissões negadas
