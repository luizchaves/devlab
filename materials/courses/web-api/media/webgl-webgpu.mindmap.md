---
title: 'Web APIs: Gráficos 3D com WebGL e WebGPU'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Gráficos 3D com WebGL e WebGPU

## Ideia Central
- **Papel**: Renderização 3D acelerada por hardware no navegador com WebGL2, shaders GLSL/WGSL, matrizes de transformação, pipeline gráfico e computação com WebGPU
- **Contexto**: Acesso de baixo nível e alto paralelismo à GPU para jogos, visualizações científicas, e-commerce e inferência de IA
- **Ambiente**: Navegador, elemento `<canvas>`, OpenGL ES / WebGL2 e WebGPU nativas

## O Pipeline Gráfico 3D
- **Vertex Shader**: Transforma vértices 3D em coordenadas projetadas na tela
- **Rasterização**: Converte geometria em fragmentos (pixels)
- **Fragment Shader**: Calcula cor, textura e iluminação por pixel
- **Framebuffer**: Envia a imagem final desenhada para a tela

## Anatomia de uma Cena WebGL
- **Shaders GLSL**: Programas em linguagem C-like executados na GPU
- **Attributes / VBOs**: Dados densos por vértice (posições, normais, UVs)
- **Uniforms**: Constantes compartilhadas (matrizes MVP, luz, cor)
- **Z-Buffer**: `gl.DEPTH_TEST` para ordenar profundidade de faces

## WebGPU (Nova Geração)
- **Baixo Overhead**: Alinhada a APIs modernas (Vulkan, Metal, DirectX 12)
- **Linguagem WGSL**: Sintaxe tipada e padronizada para shaders
- **Compute Shaders**: Computação paralela GPGPU de propósito geral
- **IA no Navegador**: Execução de LLMs locais via Transformers.js e ONNX

## Ecossistema e Abstração
- **WebGL/WebGPU Puro**: Filtros de shader, visualização científica e aprendizado
- **Three.js / Babylon.js**: Câmeras, luzes, materiais PBR e arquivos `.gltf`
- **Decisão**: Abstrair para produtos/jogos, usar nativo para shaders específicos

## Boas Práticas
- **Descarte explícito**: `gl.deleteBuffer()` e `gl.deleteTexture()` para evitar vazamento
- **Perda de contexto**: Tratar eventos `webglcontextlost`
- **Resolução responsiva**: Limitar densidade de pixels em telas Retina móveis
