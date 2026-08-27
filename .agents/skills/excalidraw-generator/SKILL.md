---
name: excalidraw-generator
description: >-
  Gera apresentações e diagramas educacionais em formato Excalidraw (`.excalidraw` JSON)
  no estilo lousa (chalkboard) 16:9 do DevLab, via o builder Python que acompanha a skill.
  Use sempre que o usuário pedir slides Excalidraw, diagramas de arquitetura desenhados à
  mão, quadros visuais de aula ou esboços vetoriais.
---

# DevLab — Gerador de Apresentações e Diagramas Excalidraw

Guia para gerar arquivos `.excalidraw` no estilo lousa do DevLab. As medidas abaixo foram
extraídas do arquivo de referência
`excalidraw/courses/cstrc-jp-dw/javascript/ecmascript.excalidraw` (8 slides, 313 elementos).

---

## 📁 Localização e escopo

```
excalidraw/courses/<course-id>/<categoria>/<topico>.excalidraw
```

O arquivo é **fonte editável** (abre em excalidraw.com ou na extensão do VS Code).
Ele **não é compilado nem publicado** pelo site: `excalidraw/` fica fora de `public/`,
então **não linke o `.excalidraw` nas aulas** — o `pnpm check:links` falharia. Para
publicar, exporte PNG/SVG à mão e trate como asset estático.

---

## 🐍 Fluxo de trabalho: o builder Python

A skill acompanha `scripts/excalidraw_builder.py`. **Use-o** em vez de montar JSON na mão:
ele preenche os campos obrigatórios (`seed`, `versionNonce`, `roundness`, `points`,
`originalText`…), converte coordenadas relativas ao frame em absolutas e valida a grade.

```python
import sys
sys.path.insert(0, ".agents/skills/excalidraw-generator/scripts")
from excalidraw_builder import ExcalidrawBuilder, BLUE, AMBER, GREEN, PURPLE, ACCENTS

b = ExcalidrawBuilder()
b.add_frame("frame_1", "Slide 1: Capa & Visão Geral", col=0, row=0)
b.add_slide_header("frame_1", "s1", "1) JAVASCRIPT: ECOSSISTEMA", "Objetivo: entender o núcleo da linguagem", BLUE)

for i, (titulo, bullets, nota) in enumerate(cards):
    b.add_card("frame_1", f"s1_c{i}", i, titulo, bullets, nota, ACCENTS[i], arrow_to_next=i < 3)

b.sketch_browser("frame_1", "s1_br", 200, 183, stroke=AMBER)
b.add_callout("frame_1", "s1_idea", "Dica do Professor", "• Regra de ouro da aula.")
b.add_flow("frame_1", "s1_flow", "Mocha (1995)   ➔   ECMAScript   ➔   Runtimes")

b.save("excalidraw/courses/cstrc-jp-dw/javascript/ecmascript.excalidraw")
```

Escreva o script gerador em `scripts/` do scratchpad da sessão (ou em um arquivo temporário)
e rode com `python3`. Guarde o script junto do conteúdo apenas se o usuário pedir.

### API do builder

| Método | Para quê |
| ------ | -------- |
| `add_frame(id, nome, col, row)` | um slide na grade (colunas de 1300px, linhas de 775px) |
| `add_slide_header(fid, prefixo, titulo, subtitulo, accent)` | título + traço + subtítulo |
| `add_card(fid, prefixo, col, header, bullets, rodape, accent, columns=4, arrow_to_next=False)` | card completo da fileira superior |
| `add_callout(fid, prefixo, titulo, corpo)` | caixa tracejada da regra de ouro |
| `add_flow(fid, id, texto)` | linha-resumo do rodapé |
| `add_terminal(fid, prefixo, x, y, w, h, linhas)` | caixa preta com texto monoespaçado |
| `add_rect / add_text / add_ellipse / add_line / add_arrow / add_polyline` | primitivas |
| `sketch_browser / sketch_document / sketch_server / sketch_robot / sketch_gear` | ícones desenhados à mão |
| `save(caminho)` | grava o JSON e informa a contagem de elementos |

Todas as coordenadas dos helpers são **relativas ao frame**; o builder soma a origem
(`frame.x`, `frame.y`) ao gravar, porque o Excalidraw armazena coordenadas absolutas.

---

## 🎨 Estilo visual (lousa)

### Paleta (`viewBackgroundColor: "#121212"`)

| Constante | Hex | Uso |
| --------- | --- | --- |
| `BLUE` | `#42a5f5` | acento primário, títulos |
| `AMBER` | `#ffb74d` | acento 1 |
| `GREEN` | `#81c784` | acento 2 |
| `PURPLE` | `#ba68c8` | acento 3 |
| `PINK` | `#f48fb1` | caixa tracejada de destaque |
| `WHITE` | `#ffffff` | corpo de texto e bullets |
| `GRAY` | `#b0bec5` | subtítulos, rótulos externos, rodapé |
| `CODE_BG` / `CODE_TXT` | `#000000` / `#4caf50` | terminal |

Cards do mesmo slide alternam acentos na ordem `ACCENTS = [AMBER, GREEN, PURPLE, BLUE]`.

### Tipografia

`fontFamily: 1` (Virgil, mão livre) para **tudo** que é texto; `fontFamily: 3`
(Cascadia Code) **apenas** para terminal, comandos e snippets.

| Elemento | Tamanho | Caixa / alinhamento | Cor |
| -------- | ------- | ------------------- | --- |
| Título do slide | 36 | `N) TÍTULO EM CAIXA ALTA`, centralizado | acento |
| Subtítulo | 18 | `Objetivo: ...`, centralizado | `GRAY` |
| Cabeçalho do card | 20 | `1. RÓTULO` em caixa alta, à esquerda | acento do card |
| Bullets | 16 | `• 2–4 palavras` por linha | `WHITE` |
| Rótulo externo (abaixo do card) | 13 | minúsculas | `GRAY` |
| Título da caixa tracejada | 22 | Title Case, centralizado | `PINK` |
| Corpo da caixa tracejada | 15–16 | 1–2 frases de regra | `WHITE` |
| Terminal / código | 14–15 | sintaxe real | `CODE_TXT` |
| Linha de fluxo do rodapé | 17 | `Etapa ➔ Etapa ➔ Objetivo` | `GRAY` |

### Grade do slide (1200 × 675, `roundness: null`)

```
y =  25  Título (centralizado, largura 1100 a partir de x=50)
y =  75  Traço sob o título (760px, centralizado, strokeWidth 3)
y =  88  Subtítulo
y = 135  Fileira de cards (altura 305)
y = 447  Rótulo externo de cada card (cy + 312)
y = 475  Caixa tracejada de destaque (altura 115, x=35, largura 1125)
y = 620  Linha de fluxo do rodapé
```

Colunas: 4 cards de `255px` em `cx = 35 + col * 280`, ou 3 cards de `350px` em
`cx = 40 + col * 375`. Dentro do card: cabeçalho em `+16, +16`, bullets em `+16, +50`,
sketch no canto superior direito, setas de ligação em `cx + cw + 2, y = 285` (21px).

Slides na grade: `x = col * 1300`, `y = row * 775` (4 colunas × N linhas), com o frame
nomeado `Slide N: <assunto>`.

### Largura do texto (evita corte à direita)

`w = maior_linha * (fontSize * 0.72) + 40` para Virgil (`* 0.65` para monoespaçado).
Textos centralizados usam `x = 50`, `w = 1100`, `align = "center"`. O builder já aplica
essa fórmula em `add_text`.

---

## ✍️ Conteúdo dos slides

- 6 a 10 frames por apresentação, um assunto por frame, título numerado (`1)`, `2)` …).
- Cada frame: 3–4 cards + caixa tracejada com a regra de ouro + linha de fluxo do rodapé.
- Bullets telegráficos (2–4 palavras). O texto longo fica na aula `.mdx`, não aqui.
- Nada de emojis Unicode: use os `sketch_*` (navegador, documento, servidor, robô,
  engrenagem, terminal) ou componha primitivas com `roughness: 1`.
- Português, termos técnicos preservados (`Runtime`, `Web APIs`).

---

## ✅ Verificação

Depois de gerar, confira programaticamente antes de entregar:

```bash
python3 -c "import json,sys; d=json.load(open(sys.argv[1])); els=d['elements']; frames=[e for e in els if e['type']=='frame']; orfaos=[e['id'] for e in els if e['type']!='frame' and not e.get('frameId')]; print(len(frames),'frames,',len(els),'elementos, órfãos:',orfaos)" excalidraw/courses/cstrc-jp-dw/javascript/ecmascript.excalidraw
```

Abra o arquivo no Excalidraw e verifique: nenhum texto cortado, nenhum elemento fora do
frame, e a ordem de leitura dos frames coerente com a numeração dos títulos.

---

## ⚠️ Armadilhas

1. **Emojis Unicode**: quebram o estilo lousa — sempre sketches vetoriais.
2. **`frameId` ausente**: o elemento vira órfão no canvas e não acompanha o frame ao mover.
3. **Coordenada relativa gravada como absoluta**: use sempre os helpers do builder; JSON
   escrito à mão precisa somar `frame.x` / `frame.y`.
4. **Sobreposição**: mantenha ≥ 40px entre bullets e caixas de código; a fileira de cards
   termina em `y = 440` e a caixa tracejada começa em `475`.
5. **Fonte errada**: `fontFamily: 3` só para código/terminal.
6. **Linkar o `.excalidraw` na aula**: o arquivo não é publicado — o `check:links` quebra.
7. **`roundness` no frame**: frames e textos usam `null`; retângulos usam `{"type": 3}`;
   linhas e setas, `{"type": 2}` (o builder cuida disso).
