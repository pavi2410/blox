import { idle } from "../control";
import { paint, size, sprite } from "./canvas";

// visible: null = hidden until the first turtle command (keeps pure-canvas programs clean)
const t = { x: 0, y: 0, heading: 0, pen: true, colour: "#3366ff", width: 2, visible: null as boolean | null };
const n = (v: unknown) => Number(v) || 0;
const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;

export function resetTurtle() {
  t.x = size.width / 2;
  t.y = size.height / 2;
  t.heading = 0;
}

function drawSprite() {
  t.visible ??= true;
  sprite.clearRect(0, 0, size.width, size.height);
  if (!t.visible) return;
  const a = rad(t.heading);
  const pt = (d: number, off: number) => [t.x + Math.cos(a + off) * d, t.y + Math.sin(a + off) * d] as const;
  const [nx, ny] = pt(12, 0);
  const [lx, ly] = pt(9, 2.5);
  const [rx, ry] = pt(9, -2.5);
  sprite.beginPath();
  sprite.moveTo(nx, ny);
  sprite.lineTo(lx, ly);
  sprite.lineTo(rx, ry);
  sprite.closePath();
  sprite.fillStyle = t.colour;
  sprite.globalAlpha = 0.85;
  sprite.fill();
  sprite.globalAlpha = 1;
  sprite.strokeStyle = "#fff";
  sprite.lineWidth = 1.5;
  sprite.stroke();
}

async function moveTo(x: number, y: number) {
  if (t.pen) {
    paint.save();
    paint.strokeStyle = t.colour;
    paint.lineWidth = t.width;
    paint.beginPath();
    paint.moveTo(t.x, t.y);
    paint.lineTo(x, y);
    paint.stroke();
    paint.restore();
  }
  t.x = x;
  t.y = y;
  drawSprite();
  await idle();
}

export const turtle = {
  fd: (d: unknown) => {
    const a = rad(t.heading);
    return moveTo(t.x + Math.cos(a) * n(d), t.y + Math.sin(a) * n(d));
  },
  turn: (deg: unknown) => {
    t.heading = (t.heading + n(deg)) % 360;
    drawSprite();
  },
  setHeading: (deg: unknown) => {
    t.heading = n(deg) % 360;
    drawSprite();
  },
  goto: (x: unknown, y: unknown) => moveTo(n(x), n(y)),
  home: () => moveTo(size.width / 2, size.height / 2).then(() => turtle.setHeading(0)),
  pen: (down: boolean) => {
    t.pen = !!down;
    drawSprite();
  },
  penColour: (c: unknown) => {
    t.colour = String(c);
    drawSprite();
  },
  penWidth: (w: unknown) => (t.width = Math.max(0, n(w))),
  turtleVisible: (v: boolean) => {
    t.visible = !!v;
    drawSprite();
  },
  turtleGet: (p: "x" | "y" | "heading") => Math.round(t[p] * 100) / 100,
};
