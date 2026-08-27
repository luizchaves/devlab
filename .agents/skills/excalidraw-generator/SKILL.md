---
name: excalidraw-generator
description: >-
  Generates educational widescreen 16:9 chalkboard presentation slides and architectural diagrams
  in Excalidraw format (.excalidraw JSON). Use whenever the user requests creating Excalidraw slides,
  diagrams, chalkboard presentations, vector sketches, or visual course materials.
---

# Excalidraw Presentation & Diagram Generator

This skill guides the agent in designing and programmatically generating high-quality, widescreen 16:9 chalkboard presentation slides and architectural diagrams in Excalidraw format (`.excalidraw` JSON).

---

## 🎨 Masterclass Chalkboard Visual Style Guide

All generated Excalidraw presentation files **MUST** follow these visual aesthetic and layout guidelines:

### 1. Canvas Background & Color Tokens
- **Canvas Background**: Dark mode chalkboard background (`appState.viewBackgroundColor: "#121212"`).
- **Chalk Palette**:
  - `BLUE`: `#42a5f5` (Cyan / Primary Accent)
  - `AMBER`: `#ffb74d` (Yellow / Orange Accent)
  - `GREEN`: `#81c784` (Green Accent)
  - `PURPLE`: `#ba68c8` (Purple / Violet Accent)
  - `PINK`: `#f48fb1` (Pink / Callout Accent)
  - `WHITE`: `#ffffff` (Pure White Body Text)
  - `GRAY`: `#b0bec5` (Muted Subtitles and Labels)
  - `CODE_BG`: `#000000` (Terminal / Code Box Background)
  - `CODE_TXT`: `#4caf50` (Green Monospace Code Text)

---

### 2. Typography & Font Rules
Excalidraw supports three native font families:
- `fontFamily: 1` (**Virgil** - Hand-drawn / Chalkboard font): Use for ALL slide titles, subtitles, card headers, bullet points, and callouts.
- `fontFamily: 3` (**Cascadia Code** - Monospace code font): Use ONLY for terminal commands (`$ node main.js`), REPL prompts (`>_`), and code blocks.

#### Text Casing & Sizing Hierarchy:
| Element | Font Family | Size | Case / Alignment | Color |
| :--- | :--- | :--- | :--- | :--- |
| **Slide Title** | `fontFamily: 1` | `36px` | `1) ALL CAPS` (Centered) | Accent Color |
| **Slide Subtitle** | `fontFamily: 1` | `18px` | `Objetivo: ...` (Centered) | `#b0bec5` (Gray) |
| **Card Header** | `fontFamily: 1` | `20px - 22px` | `1. ALL CAPS` (Left) | Card Accent Color |
| **Body Bullets** | `fontFamily: 1` | `16px` | Concise (2-3 words per bullet) | `#ffffff` (White) |
| **Outer Sub-label** | `fontFamily: 1` | `13px` | Lowercase (Below card bottom) | `#b0bec5` (Gray) |
| **Dashed Box Title** | `fontFamily: 1` | `22px` | Title Case (Centered) | `#f48fb1` (Pink) |
| **Dashed Box Body** | `fontFamily: 1` | `15px - 16px` | Concise 1-2 sentence rule | `#ffffff` (White) |
| **Terminal / Code** | `fontFamily: 3` | `14px - 15px` | Code syntax | `#4caf50` (Green) |
| **Bottom Flow Line** | `fontFamily: 1` | `17px` | `Step ➔ Step ➔ Goal` (Centered) | `#b0bec5` (Gray) |

---

### 3. Layout Grid & Frame Spacing (16:9 Widescreen)

- **Frame Dimensions**: Each slide frame has `width: 1200`, `height: 675`, `roundness: null`.
- **Multi-Slide Layout Grid**:
  - Arranged in 4 columns x N rows.
  - Frame horizontal spacing: `x_offset = col * 1300` (100px gap between frames).
  - Frame vertical spacing: `y_offset = row * 775` (100px gap between rows).

#### Vertical Layout Hierarchy (Inside 1200x675 Frame):
```
y = 25   : Slide Title (Centered)
y = 75   : Title Underline Line (Width ~700px, strokeWidth = 3)
y = 88   : Subtitle ("Objetivo: ...")
y = 130  : Top Cards Row (Height: 305px)
y = 475  : Dashed Callout Highlight Box (Height: 115px, strokeStyle: "dashed")
y = 620  : Bottom Pipeline Summary Flow Line (Centered)
```

#### Card Layout Specs:
- **4-Column Slide Layout**:
  - Card width: `255px`, height: `305px`, gap: `25px`.
  - Positions: `cx = 35 + col * 280`.
- **3-Column Slide Layout**:
  - Card width: `350px`, height: `305px`, gap: `25px`.
  - Positions: `cx = 40 + col * 375`.

---

### 4. Zero Text Clipping & Bounding Box Rules
To ensure Virgil hand-drawn text never gets truncated or cut off at the right edge:
- **Width Bounding Box Formula**:
  `w = max_line_length * (fontSize * 0.72) + 40`
- **Centered Text Width**:
  Set `rel_x = 50`, `w = 1100`, `align = "center"` for titles, subtitles, and bottom pipelines.

---

### 5. Vector Sketch Drawing Helpers (Roughness = 1)
Replace unicode emojis with hand-drawn vector sketch drawings created from basic primitive elements (`rectangle`, `ellipse`, `line`, `arrow` with `roughness: 1`):

1. **Browser Window**: Top title bar, dots, URL bar, main viewport rectangle.
2. **Folded Document**: Rectangle with top-right folded corner lines.
3. **Server Stack**: 3 stacked horizontal rectangles with LED indicator dots.
4. **Coffee Cup**: Mug body, handle arc/lines, and steam lines.
5. **Terminal Window**: Black background rectangle with `>_` green prompt text.
6. **Layout Grid**: Page border, header block, sidebar block, and main content area.
7. **Robot Head**: Square head box, top antenna ball, eye circles, and screen mouth `</>`.
8. **Gear**: Central circle with outer teeth lines.

---

## 🛠️ Python Script Generator Workflow

When creating or modifying an Excalidraw presentation, write a Python generator script using standard Python `json` and `random` libraries.

### Script Execution Pattern:
```bash
uv run python3 scripts/generate_excalidraw.py
```

### JSON Schema Output Structure:
```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [ ... ],
  "appState": {
    "gridSize": null,
    "viewBackgroundColor": "#121212"
  },
  "files": {}
}
```

---

## ⚠️ Common Pitfalls to Avoid

1. **Never use Unicode Emojis**: Always use hand-drawn vector sketch shapes.
2. **Never allow Element Overlaps**: Keep at least 40px margin between bullet points and terminal code boxes (`y = cy + 225`).
3. **Always set `frameId` on child elements**: Every element inside a slide frame must have `"frameId": "frame_X"`.
4. **Strict Font Assignment**: Use `fontFamily: 1` for text and `fontFamily: 3` for code/commands.
