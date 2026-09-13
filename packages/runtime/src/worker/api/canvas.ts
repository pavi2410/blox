import type { Canvases } from "../../messages";
import { keys, mouse } from "../events";

export let paint: OffscreenCanvasRenderingContext2D;
export let sprite: OffscreenCanvasRenderingContext2D;
export let size = { width: 480, height: 360 };

export function initCanvas(c: Canvases) {
  paint = c.paint.getContext("2d")!;
  sprite = c.sprite.getContext("2d")!;
  size = { width: c.paint.width, height: c.paint.height };
  paint.lineCap = "round";
  paint.lineJoin = "round";
}

const n = (v: unknown) => Number(v) || 0;
const draw = (mode: string) => (mode === "stroke" ? paint.stroke() : paint.fill());

export const canvas = {
  clear: (colour?: unknown) => {
    paint.save();
    paint.setTransform(1, 0, 0, 1, 0, 0);
    if (colour) {
      paint.fillStyle = String(colour);
      paint.fillRect(0, 0, size.width, size.height);
    } else paint.clearRect(0, 0, size.width, size.height);
    paint.restore();
  },
  fill: (colour: unknown) => (paint.fillStyle = String(colour)),
  stroke: (colour: unknown, width: unknown) => {
    paint.strokeStyle = String(colour);
    paint.lineWidth = Math.max(0, n(width));
  },
  rect: (x: unknown, y: unknown, w: unknown, h: unknown, mode: string) => {
    paint.beginPath();
    paint.rect(n(x), n(y), n(w), n(h));
    draw(mode);
  },
  circle: (x: unknown, y: unknown, r: unknown, mode: string) => {
    paint.beginPath();
    paint.arc(n(x), n(y), Math.max(0, n(r)), 0, Math.PI * 2);
    draw(mode);
  },
  line: (x1: unknown, y1: unknown, x2: unknown, y2: unknown) => {
    paint.beginPath();
    paint.moveTo(n(x1), n(y1));
    paint.lineTo(n(x2), n(y2));
    paint.stroke();
  },
  text: (t: unknown, x: unknown, y: unknown, px: unknown) => {
    paint.font = `${Math.max(1, n(px) || 16)}px system-ui, sans-serif`;
    paint.textBaseline = "top";
    paint.fillText(String(t), n(x), n(y));
  },
  stageSize: (dim: "width" | "height") => size[dim],
  mouse: (axis: "x" | "y") => Math.round(mouse[axis]),
  mouseDown: () => mouse.down,
  keyDown: (key: string) => (key === "any" ? keys.size > 0 : keys.has(key)),
};
