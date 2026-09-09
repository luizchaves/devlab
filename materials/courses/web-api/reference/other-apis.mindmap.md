---
title: 'Web APIs: Outras Web APIs do Navegador'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Outras Web APIs do Navegador

## Ideia Central
- **Papel**: Panorama e guia de referência das Web APIs avançadas e especializadas que complementam a plataforma web: WebGL, WebGPU, IndexedDB, Service Workers, Web Audio, WebRTC, WebAuthn e acesso a hardware
- **Contexto**: Este tópico apresenta um panorama exaustivo das Web APIs avançadas e especializadas que compõem o ecossistema moderno dos navegadores. Ele cataloga interfaces de alto desempenho, computação gráfica, multimídia, autenticação biométrica, fluxos em tempo real, armazenamento estruturado e integração com dispositivos periféricos que complementam os tópicos fundamentais do guia
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## O Panorama Estendido da Plataforma Web
- **Ideia**: Além das interfaces fundamentais de manipulação do DOM, requisições HTTP e armazenamento básico abordadas nas seções principais deste guia, a plataforma web padronizada pela W3C e WHATWG conta com dezenas de especificações voltadas para cenários específicos, jogos, ferramentas criativas, segurança de ponta e aplicações offline de alta escala
- **Detalhe**: O mapa abaixo agrupa essas interfaces em domínios especializados: Diagrama conceitual da página com fluxo, responsabilidades e pontos de decisão

## Gráficos 3D e Computação Acelerada por GPU
- **Ideia**: Para renderização gráfica tridimensional, sombreamento de shaders e processamento massivo paralelo, o navegador oferece interfaces de acesso direto à placa de vídeo (GPU): Use a Canvas API 2D para desenhos simples, diagramas, gráficos de pizza e pequenos jogos casuais
- **Detalhe**: Adote WebGL quando precisar de modelos 3D com texturas e iluminação complexa

## Armazenamento Estruturado e Aplicações Offline (PWA)
- **Ideia**: Aplicações que operam sem conexão de rede (*offline-first*) ou que lidam com grandes volumes de dados no cliente utilizam interfaces além do `localStorage`: ---

## Autenticação, Criptografia e Pagamentos
- **Ideia**: Para substituir senhas inseguras por autenticação biométrica nativa e realizar operações criptográficas de ponta a ponta: ---

## Áudio Avançado, Câmera e Comunicação em Tempo Real
- **Ideia**: A manipulação de áudio em nível de nó e a comunicação ponto a ponto dispensam plugins externos: ---

## Interface Moderna, Animações e Compartilhamento
- **Ideia**: Interfaces modernas que aproximam a experiência de aplicações web da experiência de aplicativos móveis nativos: ---

## Streams e Manipulação de Arquivos
- **Ideia**: Para processamento eficiente de fluxos contínuos de dados sem carregar arquivos gigantescos inteiramente na memória RAM: ---

## Redes de Próxima Geração e Métricas de Performance
- **Ideia**: Ferramentas para transporte de dados em alta velocidade e monitoramento de desempenho da aplicação em produção: ---

## Hardware, Periféricos e Conectividade Local
- **Ideia**: Ambientes restritos e sistemas operacionais desktop/mobile permitem conectar dispositivos físicos via navegador sob permissões explícitas: As APIs de acesso a hardware (Web Bluetooth, Web USB, Web Serial, WebHID) são padronizadas principalmente para o ecossistema Chromium e exigem estritamente Contexto Seguro (HTTPS) e Gesto Explícito do Usuário
- **Detalhe**: Elas possuem suporte restrito ou ausente em navegadores como Mozilla Firefox e Apple Safari por políticas de privacidade e segurança do sistema

## Sensores, Janelas e Controle do Sistema
- **Ideia**: Interfaces que controlam o comportamento da aba e reagem ao estado físico do dispositivo: ---

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre o panorama estendido de Web APIs do navegador:
- **Ponto**: Qual a diferença fundamental de aplicação entre Local Storage e IndexedDB?
- **Ponto**: Por que WebGL e WebGPU operam de forma diferente da Canvas 2D API?
- **Ponto**: Qual é a vantagem da View Transitions API em relação a bibliotecas JS de animação?
- **Ponto**: Como o WebAuthn melhora a segurança em relação a senhas tradicionais?
### Escolha e Cenários de Aplicação
- **Ideia**: Qual a diferença fundamental de aplicação entre Local Storage e IndexedDB?
- **Ponto**: Qual a diferença fundamental de aplicação entre Local Storage e IndexedDB?
- **Ponto**: Por que WebGL e WebGPU operam de forma diferente da Canvas 2D API?
### Requisitos e Segurança
- **Ideia**: Por que APIs como Web Bluetooth e Web USB exigem gesto do usuário e HTTPS?
- **Ponto**: Por que APIs como Web Bluetooth e Web USB exigem gesto do usuário e HTTPS?
- **Ponto**: Como a Screen Wake Lock API melhora a experiência do usuário em aplicações específicas?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
