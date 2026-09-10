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
title: "Web APIs: Gráficos 3D com WebGL e WebGPU"
description: "Slides completos do tópico Web APIs: Gráficos 3D com WebGL e WebGPU."
---

<!-- _class: lead -->

# Web APIs: Gráficos 3D com WebGL e WebGPU

Pipeline Gráfico · Shaders GLSL · WebGPU · Motores 3D

---

## Objetivo

- Compreender o pipeline gráfico acelerado por hardware na GPU.
- Escrever e compilar Vertex Shaders e Fragment Shaders em GLSL.
- Enviar dados de geometria via buffers de vértice (`Float32Array`).
- Aplicar matrizes de projeção, visão e modelo (MVP).
- Reconhecer os avanços da WebGPU com Compute Shaders e IA no cliente.
- Escolher entre código nativo de baixo nível e bibliotecas como Three.js.

---

## Mapa do Tópico

- **Do Canvas 2D ao Pipeline Gráfico na GPU**.
- **Anatomia de uma Cena: Shaders e Buffers**.
- **WebGPU: Nova Geração de Computação e Gráficos**.
- **Ecossistema e Motores 3D (Three.js)**.
- **Quando usar, e quando não usar?**.

---

## Motivação

- **Desempenho massivo**: processamento paralelo executado diretamente na GPU.
- **Experiências imersivas**: jogos, configuradores de produtos e tours virtuais.
- **Inteligência Artificial na web**: computação paralela direta no cliente com WebGPU.

*Regra de ouro: para cenas complexas, use Three.js; para shaders customizados, use WebGL/WebGPU.*

---

## O Pipeline Gráfico 3D

Transformação contínua de vértices geométricos em pixels na tela:

1. **Vertex Shader**: Transforma posições 3D no espaço da tela.
2. **Rasterização**: Converte triângulos em fragmentos (pixels candidatos).
3. **Fragment Shader**: Calcula cor, reflexos e iluminação de cada pixel.
4. **Framebuffer**: Renderização final exibida no elemento `<canvas>`.

---

## Anatomia de uma Cena WebGL

Código mínimo de shaders em linguagem GLSL:

```js
// Vertex Shader: projeta o ponto 3D na tela
const vsSource = `
  attribute vec3 aPosition;
  uniform mat4 uMVP;
  void main() {
    gl_Position = uMVP * vec4(aPosition, 1.0);
  }
`;

// Fragment Shader: define a cor RGB da face
const fsSource = `
  precision mediump float;
  uniform vec4 uColor;
  void main() {
    gl_FragColor = uColor;
  }
`;
```

---

## WebGPU: A Nova Geração

Evolução moderna desenhada para espelhar Vulkan, Metal e DirectX 12:

- **Menor sobrecarga de CPU**: pipelines pré-validados de alta performance.
- **Linguagem WGSL**: sintaxe moderna, tipada e segura.
- **Compute Shaders**: computação paralela de propósito geral (GPGPU).
- **IA no Navegador**: execução local de LLMs e redes neurais no cliente.

---

## Motores 3D: Three.js e Babylon.js

Por que abstrair o WebGL de baixo nível?

- **Three.js**: gerencia câmeras, luzes, materiais PBR e importação de modelos `.gltf`.
- **Economia de código**: reduz milhares de linhas de boilerplate de matrizes e buffers.
- **WebGL Puro**: ideal para pós-processamento, visualização científica e aprendizado.

---

## Quando usar, e quando não usar?

- **Canvas 2D**: Animações simples, jogos 2D e desenho em bitmap.
- **SVG**: Gráficos estáticos e diagramas que exigem acessibilidade para leitores de tela.
- **Three.js / WebGL**: Cenas 3D interativas, jogos e visualização de produtos.
- **WebGPU**: Computação paralela pesada, IA no cliente e simulação de fluidos.

---

## Cuidados Práticos

- **Perda de Contexto**: trate os eventos `webglcontextlost` e `webglcontextrestored`.
- **Limpeza de GPU**: destrua buffers e texturas antigos com `gl.deleteBuffer()`.
- **Retina e 4K**: limite `devicePixelRatio` a 2x em celulares para poupar a GPU.
- **Depth Test**: sempre habilite `gl.enable(gl.DEPTH_TEST)`.

---

## Exercício Prático

1. Altere a paleta de cores das faces do cubo no exemplo interativo.
2. Adicione oscilação na translação Z com `Math.sin(now)`.
3. Implemente iluminação difusa básica com o produto escalar do vetor normal.

---

## Perguntas de Revisão

1. Qual a diferença entre Vertex Shader e Fragment Shader?
2. Para que serve o teste de profundidade (`gl.DEPTH_TEST`)?
3. O que são Compute Shaders na WebGPU?
4. Em qual situação Three.js é preferível a WebGL puro?

---

## Resumo do Tópico

- **WebGL e WebGPU**: aceleração gráfica 3D de alta performance na GPU.
- **Shaders programáveis**: controle vértice a vértice e pixel a pixel com GLSL/WGSL.
- **WebGPU**: o futuro dos gráficos e da inferência de IA local no navegador.
- **Ecossistema maduro**: Three.js como padrão de produtividade para cenas 3D.
