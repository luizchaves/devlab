import json
import os
import random
import time

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
        "strokeColor": kwargs.get("strokeColor", "#ffffff"),
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
        element["fontFamily"] = kwargs.get("fontFamily", 1)
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

    def add_frame(self, frame_id, name, col=0, row=0, width=1200, height=675):
        x = col * 1300
        y = row * 775
        frame = create_element("frame", frame_id, x, y, width, height, name=name, strokeColor="#333333", backgroundColor=self.bg_color)
        self.elements.append(frame)
        self.frames[frame_id] = (x, y)
        return frame

    def add_rect(self, fid, eid, rel_x, rel_y, w, h, stroke="#ffffff", bg="transparent", roughness=1, strokeWidth=2, strokeStyle="solid"):
        fx, fy = self.frames[fid]
        e = create_element("rectangle", eid, fx + rel_x, fy + rel_y, w, h,
                           frameId=fid, strokeColor=stroke, backgroundColor=bg, roughness=roughness, strokeWidth=strokeWidth, strokeStyle=strokeStyle)
        self.elements.append(e)
        return e

    def add_text(self, fid, eid, rel_x, rel_y, text, size=20, font=1, stroke="#ffffff", align="left", lineHeight=1.35):
        fx, fy = self.frames[fid]
        lines = text.split("\n")
        max_len = max(len(l) for l in lines) if lines else 1
        char_mult = 0.72 if font == 1 else 0.65
        w = max_len * (size * char_mult) + 40
        h = len(lines) * (size * lineHeight) + 10
        e = create_element("text", eid, fx + rel_x, fy + rel_y, w, h,
                           frameId=fid, text=text, fontSize=size, fontFamily=font, strokeColor=stroke, textAlign=align, lineHeight=lineHeight)
        self.elements.append(e)
        return e

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
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Excalidraw salvo com sucesso: {out_path} ({len(self.elements)} elementos)")
