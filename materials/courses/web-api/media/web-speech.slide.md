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
title: "Web APIs: Web Speech API"
description: "Slides completos do tópico Web APIs: Web Speech API."
---

<!-- _class: lead -->

# Web APIs: Web Speech API

Duas metades independentes · Modelo da API · Exemplo com preview e código · Cuidados práticos

---

## Objetivo

- Falar um texto com `speechSynthesis.speak()` e um `SpeechSynthesisUtterance`.
- Configurar voz, idioma, velocidade (`rate`) e tom (`pitch`) do enunciado.
- Explicar por que a lista de vozes pode chegar vazia na primeira consulta e como esperar por ela.
- Diferenciar a síntese, amplamente suportada, do reconhecimento, ainda dependente de prefixo e de serviço remoto.
- Decidir quando a fala é acessibilidade legítima e quando ela substitui indevidamente um recurso nativo do sistema.

---

## Mapa do Tópico

- **Duas metades independentes**.
- **Modelo da API**.
- **Exemplo com preview e código**.
- **Cuidados práticos**.
- **Quando usar, e quando não usar?**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## Duas metades independentes

O nome "Web Speech API" cobre duas especificações que só têm em comum o assunto.

- **Síntese (*text to speech*)**: Amplo e estável.
- **Reconhecimento (*speech to text*)**: Parcial, ainda com prefixo `webkit`.

---

## Duas metades independentes: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
const utterance = new SpeechSynthesisUtterance('Investimento cadastrado com sucesso.');
utterance.lang = 'pt-BR';
utterance.rate = 1;

speechSynthesis.speak(utterance);
```

---

## Modelo da API

O exemplo deste tópico usa síntese de fala, que é a parte mais direta para demonstrar em sala.

- **`speechSynthesis`**: Controlador global da síntese de fala.
- **`SpeechSynthesisUtterance`**: Objeto que representa uma fala a ser reproduzida.
- **`utterance.text`**: Texto que será falado.
- **`utterance.voice`**: Voz escolhida quando disponível.
- **`utterance.rate`**: Velocidade da fala.

---

## Exemplo com preview e código

O exemplo importado permite digitar um texto, escolher parâmetros de voz e acionar a síntese.

- <HtmlPreview path="examples/courses/web-api/browser-web-apis/speech.
- html" height="24rem" label="speech.
- <SourceCode path="examples/courses/web-api/browser-web-apis/speech.

---

## Cuidados práticos

Fala pode ser recurso de acessibilidade, feedback ou experiência multimodal, mas não deve substituir texto visível.

- **Feedback falado**: Mantenha também feedback visual.
- **Voz específica**: Ofereça fallback quando ela não existir.
- **Texto longo**: Permita pausar ou cancelar.
- **Reconhecimento de fala**: Trate permissão de microfone e falta de suporte.

---

## Quando usar, e quando não usar?

Som é um canal invasivo: ele não pode ser ignorado com o canto do olho e atrapalha quem está em ambiente compartilhado.

- **Modo de leitura em voz alta, ativado pelo usuári**: Foi pedido explicitamente e pode ser interrompido.
- **Instrução durante uma tarefa com as mãos ocupada**: O usuário não pode olhar para a tela.
- **Acessibilidade geral da página**: O leitor de tela do usuário já faz isso, com a voz que ele escolheu.
- **Ler mensagens de erro para todos os usuários**: Falar por padrão incomoda a maioria.
- **Ditado no lugar de digitação**: O `SpeechRecognition` tem suporte irregular e pode enviar áudio a terceiros.

---

## Executando

1. Abra o exemplo `speech.html`.
2. Digite uma frase curta.
3. Altere velocidade e tom.
4. Teste cancelar a fala enquanto ela está em execução.

---

## Exercício Prático

1. Adicione um botão para preencher uma frase de exemplo.
2. Mostre quantas vozes foram carregadas.
3. Impeça `speak()` quando o texto estiver vazio.

---

## Perguntas de revisão

1. Qual o papel do objeto `SpeechSynthesisUtterance`?
2. Por que alterar `rate` depois de `speak()` não muda a fala em andamento?
3. Por que `speechSynthesis.getVoices()` pode devolver um array vazio na primeira chamada?
4. Como interromper uma fala em andamento?
5. Por que o suporte ao reconhecimento é muito menor que o da síntese?

---

## Resumo do Tópico

- **Duas metades independentes**: revise o papel desse eixo no uso da API.
- **Modelo da API**: revise o papel desse eixo no uso da API.
- **Exemplo com preview e código**: revise o papel desse eixo no uso da API.
- **Cuidados práticos**: revise o papel desse eixo no uso da API.
- **Quando usar, e quando não usar?**: revise o papel desse eixo no uso da API.
