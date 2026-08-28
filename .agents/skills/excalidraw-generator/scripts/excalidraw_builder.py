"""Construtor de apresentações Excalidraw no estilo lousa (chalkboard) do DevLab.

Uso típico (ver SKILL.md para o guia visual completo):

    from excalidraw_builder import ExcalidrawBuilder, BLUE, AMBER, GREEN, WHITE

    b = ExcalidrawBuilder()
    b.add_frame("frame_1", "Slide 1: Capa & Visão Geral", col=0, row=0)
    b.add_slide_header("frame_1", "s1", "1) JAVASCRIPT: ECOSSISTEMA", "Objetivo: ...", BLUE)
    b.add_card("frame_1", "s1_c0", 0, "1. TRÍADE WEB", ["DOM & Eventos", "Visão Navegador"],
               "executa no navegador", AMBER)
    b.add_callout("frame_1", "s1_idea", "Dica do Professor", "• Regra de ouro da aula.")
    b.add_flow("frame_1", "s1_flow", "Origem  ➔  Padrão  ➔  Runtimes")
    b.save("excalidraw/courses/dw-cstrc-jp/javascript/ecmascript.excalidraw")

Todas as coordenadas passadas aos helpers são **relativas ao frame**; o builder soma a
origem do frame antes de gravar (o Excalidraw guarda coordenadas absolutas de canvas).
"""

import json
import os
import random
import time

# --- Paleta de giz (fundo #121212) -------------------------------------------------
BLUE = "#42a5f5"
AMBER = "#ffb74d"
GREEN = "#81c784"
PURPLE = "#ba68c8"
PINK = "#f48fb1"
WHITE = "#ffffff"
GRAY = "#b0bec5"
CODE_BG = "#000000"
CODE_TXT = "#4caf50"
FRAME_STROKE = "#333333"

ACCENTS = [AMBER, GREEN, PURPLE, BLUE]

# --- Grade do slide 16:9 (1200x675), medida nos slides existentes ------------------
SLIDE_W, SLIDE_H = 1200, 675
TITLE_Y = 25
TITLE_LINE_Y = 75
SUBTITLE_Y = 88
CARD_Y, CARD_H = 135, 305
CALLOUT_Y, CALLOUT_H = 475, 115
FLOW_Y = 620

FONT_HAND = 1  # Virgil — títulos, textos, bullets
FONT_CODE = 3  # Cascadia Code — terminal, comandos, snippets


def create_element(elem_type, id_str, x, y, width, height, **kwargs):
    seed = random.randint(100000, 99999999)
    element = {
        "id": id_str,
        "type": elem_type,
        "x": x,
        "y": y,
        "width": width,
        "height": height,
        "angle": 0,
        "strokeColor": kwargs.get("strokeColor", WHITE),
        "backgroundColor": kwargs.get("backgroundColor", "transparent"),
        "fillStyle": kwargs.get("fillStyle", "solid"),
        "strokeWidth": kwargs.get("strokeWidth", 2),
        "strokeStyle": kwargs.get("strokeStyle", "solid"),
        "roughness": kwargs.get("roughness", 1),
        "opacity": kwargs.get("opacity", 100),
        "groupIds": kwargs.get("groupIds", []),
        "frameId": kwargs.get("frameId", None),
        "roundness": kwargs.get("roundness", {"type": 3}),
        "seed": seed,
        "version": 1,
        "versionNonce": seed + 1,
        "isDeleted": False,
        "boundElements": kwargs.get("boundElements", None),
        "updated": int(time.time() * 1000),
        "link": None,
        "locked": kwargs.get("locked", False)
    }

    if elem_type == "frame":
        element["name"] = kwargs.get("name", "Frame")
        element["roundness"] = None

    elif elem_type == "text":
        text_val = kwargs.get("text", "")
        element["text"] = text_val
        element["fontSize"] = kwargs.get("fontSize", 20)
        element["fontFamily"] = kwargs.get("fontFamily", FONT_HAND)
        element["textAlign"] = kwargs.get("textAlign", "left")
        element["verticalAlign"] = kwargs.get("verticalAlign", "top")
        element["containerId"] = kwargs.get("containerId", None)
        element["originalText"] = text_val
        element["lineHeight"] = kwargs.get("lineHeight", 1.35)
        element["roundness"] = None

    elif elem_type in ["line", "arrow"]:
        element["points"] = kwargs.get("points", [[0, 0], [width, height]])
        element["startBinding"] = None
        element["endBinding"] = None
        element["startArrowhead"] = kwargs.get("startArrowhead", None)
        element["endArrowhead"] = kwargs.get("endArrowhead", "arrow" if elem_type == "arrow" else None)
        element["roundness"] = {"type": 2}

    elif elem_type == "ellipse":
        element["roundness"] = None

    return element


class ExcalidrawBuilder:
    def __init__(self, bg_color="#121212"):
        self.elements = []
        self.bg_color = bg_color
        self.frames = {}

    # --- Frames -------------------------------------------------------------------

    def add_frame(self, frame_id, name, col=0, row=0, width=SLIDE_W, height=SLIDE_H):
        """Cria um slide na grade (colunas de 1300px, linhas de 775px)."""
        x = col * 1300
        y = row * 775
        frame = create_element("frame", frame_id, x, y, width, height, name=name,
                               strokeColor=FRAME_STROKE, backgroundColor=self.bg_color)
        self.elements.append(frame)
        self.frames[frame_id] = (x, y)
        return frame

    # --- Primitivas (coordenadas relativas ao frame) --------------------------------

    def add_rect(self, fid, eid, rel_x, rel_y, w, h, stroke=WHITE, bg="transparent",
                 roughness=1, strokeWidth=2, strokeStyle="solid"):
        fx, fy = self.frames[fid]
        e = create_element("rectangle", eid, fx + rel_x, fy + rel_y, w, h,
                           frameId=fid, strokeColor=stroke, backgroundColor=bg,
                           roughness=roughness, strokeWidth=strokeWidth, strokeStyle=strokeStyle)
        self.elements.append(e)
        return e

    def add_text(self, fid, eid, rel_x, rel_y, text, size=20, font=FONT_HAND, stroke=WHITE,
                 align="left", lineHeight=1.35):
        fx, fy = self.frames[fid]
        lines = text.split("\n")
        max_len = max(len(l) for l in lines) if lines else 1
        char_mult = 0.72 if font == FONT_HAND else 0.65
        w = max_len * (size * char_mult) + 40
        h = len(lines) * (size * lineHeight) + 10
        e = create_element("text", eid, fx + rel_x, fy + rel_y, w, h,
                           frameId=fid, text=text, fontSize=size, fontFamily=font,
                           strokeColor=stroke, textAlign=align, lineHeight=lineHeight)
        self.elements.append(e)
        return e

    def add_ellipse(self, fid, eid, rel_x, rel_y, w, h, stroke=WHITE, bg="transparent",
                    roughness=1, strokeWidth=2):
        fx, fy = self.frames[fid]
        e = create_element("ellipse", eid, fx + rel_x, fy + rel_y, w, h,
                           frameId=fid, strokeColor=stroke, backgroundColor=bg,
                           roughness=roughness, strokeWidth=strokeWidth)
        self.elements.append(e)
        return e

    def add_line(self, fid, eid, rel_x, rel_y, dx, dy=0, stroke=WHITE, strokeWidth=2,
                 roughness=1, strokeStyle="solid"):
        """Traço reto de (rel_x, rel_y) até (rel_x + dx, rel_y + dy)."""
        fx, fy = self.frames[fid]
        e = create_element("line", eid, fx + rel_x, fy + rel_y, dx, dy,
                           frameId=fid, strokeColor=stroke, strokeWidth=strokeWidth,
                           roughness=roughness, strokeStyle=strokeStyle,
                           points=[[0, 0], [dx, dy]])
        self.elements.append(e)
        return e

    def add_arrow(self, fid, eid, rel_x, rel_y, dx, dy=0, stroke=WHITE, strokeWidth=2,
                  roughness=1, start_head=None, end_head="arrow"):
        fx, fy = self.frames[fid]
        e = create_element("arrow", eid, fx + rel_x, fy + rel_y, dx, dy,
                           frameId=fid, strokeColor=stroke, strokeWidth=strokeWidth,
                           roughness=roughness, points=[[0, 0], [dx, dy]],
                           startArrowhead=start_head, endArrowhead=end_head)
        self.elements.append(e)
        return e

    def add_polyline(self, fid, eid, rel_x, rel_y, points, stroke=WHITE, strokeWidth=2,
                     roughness=1, arrow=False, end_head="arrow"):
        """Linha/seta com vários vértices. `points` é relativo ao ponto inicial."""
        fx, fy = self.frames[fid]
        pts = [[0, 0]] + [list(p) for p in points]
        w = max(p[0] for p in pts) - min(p[0] for p in pts)
        h = max(p[1] for p in pts) - min(p[1] for p in pts)
        e = create_element("arrow" if arrow else "line", eid, fx + rel_x, fy + rel_y, w, h,
                           frameId=fid, strokeColor=stroke, strokeWidth=strokeWidth,
                           roughness=roughness, points=pts,
                           endArrowhead=end_head if arrow else None)
        self.elements.append(e)
        return e

    # --- Blocos de alto nível (a grade padrão do slide) -----------------------------

    def add_slide_header(self, fid, prefix, title, subtitle=None, accent=BLUE,
                         line_width=760):
        """Título em CAIXA ALTA + traço de destaque + subtítulo 'Objetivo: ...'."""
        self.add_text(fid, f"{prefix}_title", 50, TITLE_Y, title, size=36, stroke=accent,
                      align="center")
        self.add_line(fid, f"{prefix}_title_line", (SLIDE_W - line_width) / 2, TITLE_LINE_Y,
                      line_width, 0, stroke=accent, strokeWidth=3)
        if subtitle:
            self.add_text(fid, f"{prefix}_subtitle", 50, SUBTITLE_Y, subtitle, size=18,
                          stroke=GRAY, align="center")

    def card_geometry(self, col, columns=4):
        """(x, largura) da coluna `col` — 4 colunas de 255px ou 3 de 350px."""
        if columns == 4:
            return 35 + col * 280, 255
        if columns == 3:
            return 40 + col * 375, 350
        raise ValueError("layouts suportados: 3 ou 4 colunas")

    def add_card(self, fid, prefix, col, header, bullets, footnote=None, accent=AMBER,
                 columns=4, arrow_to_next=False):
        """Card padrão: moldura + cabeçalho + bullets + rótulo externo abaixo."""
        cx, cw = self.card_geometry(col, columns)
        self.add_rect(fid, f"{prefix}_card", cx, CARD_Y, cw, CARD_H, stroke=accent)
        self.add_text(fid, f"{prefix}_header", cx + 16, CARD_Y + 16, header, size=20,
                      stroke=accent)
        body = "\n".join(f"• {b}" for b in bullets)
        self.add_text(fid, f"{prefix}_bullets", cx + 16, CARD_Y + 50, body, size=16,
                      stroke=WHITE)
        if footnote:
            self.add_text(fid, f"{prefix}_foot", cx + 16, CARD_Y + CARD_H + 7, footnote,
                          size=13, stroke=GRAY)
        if arrow_to_next:
            self.add_arrow(fid, f"{prefix}_arrow", cx + cw + 2, CARD_Y + 150, 21, 0)
        return cx, cw

    def add_callout(self, fid, prefix, title, body, accent=PINK):
        """Caixa tracejada de regra de ouro, na faixa y=475..590."""
        self.add_rect(fid, f"{prefix}_box", 35, CALLOUT_Y, 1125, CALLOUT_H, stroke=accent,
                      strokeStyle="dashed")
        self.add_text(fid, f"{prefix}_title", 50, CALLOUT_Y + 13, title, size=22,
                      stroke=accent, align="center")
        self.add_text(fid, f"{prefix}_body", 55, CALLOUT_Y + 51, body, size=16, stroke=WHITE)

    def add_flow(self, fid, eid, text, stroke=GRAY):
        """Linha-resumo do rodapé: 'Etapa ➔ Etapa ➔ Objetivo'."""
        return self.add_text(fid, eid, 50, FLOW_Y, text, size=17, stroke=stroke,
                             align="center")

    def add_terminal(self, fid, prefix, rel_x, rel_y, w, h, lines, accent=CODE_TXT):
        """Caixa preta de terminal com texto monoespaçado verde."""
        self.add_rect(fid, f"{prefix}_bg", rel_x, rel_y, w, h, stroke=accent, bg=CODE_BG)
        self.add_text(fid, f"{prefix}_txt", rel_x + 12, rel_y + 10, "\n".join(lines),
                      size=14, font=FONT_CODE, stroke=accent)

    # --- Sketches (substituem emojis) ------------------------------------------------

    def sketch_browser(self, fid, prefix, x, y, w=70, h=55, stroke=WHITE):
        self.add_rect(fid, f"{prefix}_win", x, y, w, h, stroke=stroke)
        self.add_line(fid, f"{prefix}_bar", x, y + 15, w, 0, stroke=stroke)
        for i in range(3):
            self.add_ellipse(fid, f"{prefix}_dot{i}", x + 6 + i * 10, y + 4, 6, 6, stroke=stroke)
        self.add_rect(fid, f"{prefix}_url", x + w - 32, y + 3, 26, 9, stroke=stroke)

    def sketch_document(self, fid, prefix, x, y, w=60, h=65, stroke=WHITE):
        self.add_rect(fid, f"{prefix}_doc", x, y, w, h, stroke=stroke)
        for i, lw in enumerate((35, 35, 20)):
            self.add_line(fid, f"{prefix}_l{i}", x + 10, y + 18 + i * 14, lw, 0, stroke=stroke)
        self.add_line(fid, f"{prefix}_fold1", x + w - 28, y, 0, 15, stroke=stroke)
        self.add_line(fid, f"{prefix}_fold2", x + w - 28, y + 15, 18, 0, stroke=stroke)

    def sketch_server(self, fid, prefix, x, y, w=64, h=60, stroke=WHITE):
        unit = h // 3
        for i in range(3):
            self.add_rect(fid, f"{prefix}_u{i}", x, y + i * unit, w, unit - 4, stroke=stroke)
            self.add_ellipse(fid, f"{prefix}_led{i}", x + 8, y + i * unit + 6, 6, 6, stroke=stroke)

    def sketch_robot(self, fid, prefix, x, y, w=60, h=50, stroke=WHITE):
        self.add_ellipse(fid, f"{prefix}_ball", x + w / 2 - 5, y - 20, 10, 10, stroke=stroke)
        self.add_line(fid, f"{prefix}_ant", x + w / 2, y - 15, 0, 15, stroke=stroke)
        self.add_rect(fid, f"{prefix}_head", x, y, w, h, stroke=stroke)
        self.add_ellipse(fid, f"{prefix}_eye1", x + 10, y + 10, 12, 12, stroke=stroke)
        self.add_ellipse(fid, f"{prefix}_eye2", x + w - 22, y + 10, 12, 12, stroke=stroke)
        self.add_rect(fid, f"{prefix}_scr", x + 15, y + 30, 30, 14, stroke=stroke)
        self.add_text(fid, f"{prefix}_code", x + 18, y + 31, "</>", size=11, stroke=stroke)

    def sketch_gear(self, fid, prefix, x, y, d=48, stroke=WHITE):
        r = d / 2
        self.add_ellipse(fid, f"{prefix}_core", x, y, d, d, stroke=stroke)
        teeth = ((0, -1), (1, 0), (0, 1), (-1, 0))
        for i, (dx, dy) in enumerate(teeth):
            self.add_line(fid, f"{prefix}_t{i}", x + r + dx * r, y + r + dy * r,
                          dx * 10, dy * 10, stroke=stroke)

    # --- Saída -----------------------------------------------------------------------

    def save(self, out_path):
        data = {
            "type": "excalidraw",
            "version": 2,
            "source": "https://excalidraw.com",
            "elements": self.elements,
            "appState": {
                "gridSize": None,
                "viewBackgroundColor": self.bg_color
            },
            "files": {}
        }
        directory = os.path.dirname(out_path)
        if directory:
            os.makedirs(directory, exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Excalidraw salvo com sucesso: {out_path} ({len(self.elements)} elementos)")
