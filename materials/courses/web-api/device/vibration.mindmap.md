---
title: 'Web APIs: Vibration API'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Vibration API

## Ideia Central
- **Papel**: Feedback tátil e resposta tátil em dispositivos móveis com navigator.vibrate e padrões de pulsos
- **Contexto**: A Vibration API permite que aplicações Web forneçam feedback tátil (*haptic feedback*) ativando o motor de vibração físico de dispositivos móveis (smartphones e tablets). Ela é amplamente utilizada em jogos web, confirmações de ações importantes ou alertas de erro
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## O Método `navigator.vibrate`
- **Ideia**: O acesso à Vibration API é feito diretamente através do método `navigator
- **Detalhe**: vibrate()`

## Exemplos Práticos
- **Ideia**: A aplicação da Vibration API varia desde pulsos rápidos de confirmação de interface até sequências complexas de alerta e jogos
- **Ponto**: Por motivos de segurança e prevenção de abusos, os navegadores modernos só permitem acionar `navigator.vibrate()` como resposta a um gesto explícito do usuário (ex: clique ou toque)
- **Ponto**: Computadores de mesa (desktops) sem motor de vibração ignoram a chamada silenciosamente retornando `false`
### Feedback ao Clicar em um Botão (Pulso Curto)
- **Ideia**: A confirmação de toque é o uso mais comum da API
### Padrão de Erro ou Alerta (Múltiplos Pulsos)
- **Ideia**: Para sinalizar erro, a repetição comunica mais do que a duração
- **Ponto**: Por motivos de segurança e prevenção de abusos, os navegadores modernos só permitem acionar `navigator.vibrate()` como resposta a um gesto explícito do usuário (ex: clique ou toque)
- **Ponto**: Computadores de mesa (desktops) sem motor de vibração ignoram a chamada silenciosamente retornando `false`

## Quando usar, e quando não usar?
- **Ideia**: A vibração é o único canal deste catálogo que o usuário sente sem ver e sem ouvir
- **Detalhe**: Ela funciona bem como confirmação discreta de algo que já aconteceu, e mal como forma de chamar atenção para algo novo

## Executando
- **Ideia**: Siga os passos abaixo para testar a Vibration API em um smartphone ou emulando no navegador: Acesse sua página web a partir de um smartphone com suporte a vibração
- **Detalhe**: Abra o console das ferramentas de desenvolvedor (F12)
- **Ponto**: Acesse sua página web a partir de um smartphone com suporte a vibração
- **Ponto**: Abra o console das ferramentas de desenvolvedor (F12)
- **Ponto**: Execute o comando: `document.body.addEventListener('click', () => navigator.vibrate([200, 100, 200]));`
- **Ponto**: Toque em qualquer lugar da tela e sinta os dois pulsos de vibração

## Exercício
- **Ideia**: Os itens abaixo exercitam padrões, cancelamento e detecção de suporte: Escreva uma função `cancelarVibracao()` que interrompa imediatamente qualquer padrão de vibração em andamento no dispositivo
- **Detalhe**: Como verificar se o navegador do usuário possui suporte nativo à Vibration API antes de chamá-la?
- **Ponto**: Escreva uma função `cancelarVibracao()` que interrompa imediatamente qualquer padrão de vibração em andamento no dispositivo
- **Ponto**: Como verificar se o navegador do usuário possui suporte nativo à Vibration API antes de chamá-la?
- **Ponto**: O que acontece ao passar o array `[500, 200, 500]` para `navigator.vibrate()`?
- **Ponto**: Função de cancelamento:

## Desafio
- **Ideia**: Crie uma função `vibrarCodigoMorse(texto)` que converta a letra "S" (`
- **Detalhe**: ` três pulsos curtos de 50ms) e a letra "O" (`---` três pulsos longos de 200ms) em um array de vibrações executáveis pelo `navigator

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre suporte a hardware, padrões de vibração e restrições de interação do usuário: O método `navigator
- **Detalhe**: vibrate()` exige HTTPS ou contexto seguro?
- **Ponto**: O método `navigator.vibrate()` exige HTTPS ou contexto seguro?
- **Ponto**: Como cancelar imediatamente uma sequência de vibração longa que ainda está em execução?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
