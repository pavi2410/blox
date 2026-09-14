import {
  b,
  bool,
  call,
  cmp,
  colour,
  defn,
  hat,
  iff,
  match,
  num,
  program,
  seq,
  set,
  txt,
  v,
  type In,
} from "./build";

const print = (t: In) => b("io_print", undefined, { VALUE: t });
const tone = (hz: number) => b("web_tone", undefined, { HZ: num(hz), MS: num(120) });
const fill = (c: In) => b("canvas_fill", undefined, { COLOUR: c });
const rect = (x: number, y: number, w: number, h: number) =>
  b("canvas_rect", { MODE: "fill" }, { X: num(x), Y: num(y), W: num(w), H: num(h) });
const circle = (y: number, c: In) =>
  seq(
    fill(c),
    b("canvas_circle", { MODE: "fill" }, { X: num(240), Y: num(y), R: num(32) }),
  );
const label = (t: In, x: number, y: number, size: number) =>
  b("canvas_text", undefined, { TEXT: t, X: num(x), Y: num(y), SIZE: num(size) });

const DIM_R = colour("#5a2020");
const DIM_Y = colour("#5a4a18");
const DIM_G = colour("#1a4a22");
const ON_R = colour("#ff3344");
const ON_Y = colour("#ffcc33");
const ON_G = colour("#33dd66");

const colors = (top: In, mid: In, bot: In) => seq(set("top", top), set("mid", mid), set("bot", bot));
const go = (state: string, hz: number) => seq(set("state", txt(state)), tone(hz));
const request = () => seq(set("pending", bool(true)), print(txt("walk requested")));

const tick = defn(
  "tick",
  seq(
    match(v("state"), [
      [
        txt("red"),
        iff(v("pending"), seq(set("pending", bool(false)), go("walk", 523)), go("green", 392)),
      ],
      [txt("green"), go("yellow", 330)],
      [txt("yellow"), go("red", 220)],
      [txt("walk"), go("red", 220)],
    ]),
    call("draw"),
    print(v("state")),
  ),
  400,
  20,
);

const draw = defn(
  "draw",
  seq(
    match(v("state"), [
      [txt("red"), colors(ON_R, DIM_Y, DIM_G)],
      [txt("yellow"), colors(DIM_R, ON_Y, DIM_G)],
      [txt("green"), colors(DIM_R, DIM_Y, ON_G)],
      [txt("walk"), colors(ON_R, DIM_Y, DIM_G)],
    ]),
    b("canvas_clear", undefined, { COLOUR: colour("#16161d") }),
    fill(colour("#2a2a32")),
    rect(195, 36, 90, 250),
    fill(colour("#3a3a45")),
    rect(232, 286, 16, 74),
    circle(90, v("top")),
    circle(160, v("mid")),
    circle(230, v("bot")),
    fill(colour("#e8e8ef")),
    label(v("state"), 20, 32, 22),
    label(txt("space or click: walk"), 20, 338, 14),
    iff(cmp("EQ", v("state"), txt("walk")), seq(fill(colour("#33dd66")), label(txt("WALK"), 320, 180, 36))),
  ),
  820,
  20,
);

export const light = program(
  ["state", "pending", "top", "mid", "bot"],
  hat(
    "events_start",
    seq(set("state", txt("red")), set("pending", bool(false)), call("draw")),
    undefined,
    undefined,
    20,
    20,
  ),
  hat("events_interval", call("tick"), undefined, { MS: num(1800) }, 20, 180),
  hat("events_key", request(), { KEY: "space" }, undefined, 20, 320),
  hat("events_click", request(), undefined, undefined, 20, 460),
  tick,
  draw,
);
