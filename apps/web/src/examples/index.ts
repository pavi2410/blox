import { b, change, cmp, colour, hat, items, math, num, program, seq, set, txt, v, type In } from "./build";

const join = (...ins: In[]) => items("text_join", ...ins);

const hello = program(
  ["i", "name"],
  {
    ...seq(
      b("controls_for", { VAR: { id: "i" } }, {
        FROM: num(1),
        TO: num(5),
        BY: num(1),
        DO: { block: b("io_print", undefined, { VALUE: join(txt("Count: "), v("i")) }) },
      }),
      set("name", { block: b("io_ask", undefined, { PROMPT: txt("What is your name?") }) }),
      b("io_print", undefined, { VALUE: join(txt("Hello, "), v("name"), txt("!")) }),
      b("web_speak", undefined, { TEXT: join(txt("Hello "), v("name")) }),
    ),
    x: 20,
    y: 20,
  },
);

const spiral = program(
  ["i"],
  {
    ...seq(
      b("turtle_colour", undefined, { COLOUR: colour("#ff6680") }),
      b("turtle_width", undefined, { WIDTH: num(2) }),
      b("controls_for", { VAR: { id: "i" } }, {
        FROM: num(1),
        TO: num(90),
        BY: num(1),
        DO: {
          block: seq(
            b("turtle_move", { DIR: "1" }, { DIST: math("MULTIPLY", v("i"), num(3)) }),
            b("turtle_turn", { DIR: "1" }, { DEG: num(89) }),
          ),
        },
      }),
      b("turtle_show", { STATE: "false" }),
    ),
    x: 20,
    y: 20,
  },
);

const bounce = (axis: "x" | "y", d: "dx" | "dy", max: number) =>
  b("controls_if", undefined, {
    IF0: {
      block: b("logic_operation", { OP: "OR" }, {
        A: cmp("LT", v(axis), num(20)),
        B: cmp("GT", v(axis), num(max - 20)),
      }),
    },
    DO0: { block: set(d, { block: b("math_single", { OP: "NEG" }, { NUM: v(d) }) }) },
  });

const ball = program(
  ["x", "y", "dx", "dy"],
  { ...seq(set("x", num(240)), set("y", num(180)), set("dx", num(4)), set("dy", num(3))), x: 20, y: 20 },
  hat(
    "events_frame",
    seq(
      b("canvas_clear", undefined, { COLOUR: colour("#1e1e24") }),
      change("x", v("dx")),
      change("y", v("dy")),
      bounce("x", "dx", 480),
      bounce("y", "dy", 360),
      b("canvas_fill", undefined, { COLOUR: colour("#4f8cff") }),
      b("canvas_circle", { MODE: "fill" }, { X: v("x"), Y: v("y"), R: num(20) }),
    ),
    undefined,
    undefined,
    20,
    200,
  ),
);

const move = (key: string, axis: "x" | "y", by: number) =>
  b("controls_if", undefined, {
    IF0: { block: b("input_key", { KEY: key }) },
    DO0: { block: change(axis, by) },
  });

const keys = program(
  ["x", "y"],
  { ...seq(set("x", num(240)), set("y", num(180))), x: 20, y: 20 },
  hat(
    "events_frame",
    seq(
      b("canvas_clear", undefined, { COLOUR: colour("#ffffff") }),
      move("arrowleft", "x", -4),
      move("arrowright", "x", 4),
      move("arrowup", "y", -4),
      move("arrowdown", "y", 4),
      b("canvas_fill", undefined, { COLOUR: colour("#22aa66") }),
      b("canvas_rect", { MODE: "fill" }, { X: v("x"), Y: v("y"), W: num(30), H: num(30) }),
      b("canvas_text", undefined, { TEXT: txt("Arrow keys to move, space to beep"), X: num(10), Y: num(10), SIZE: num(14) }),
    ),
    undefined,
    undefined,
    20,
    140,
  ),
  hat("events_key", b("web_tone", undefined, { HZ: num(660), MS: num(120) }), { KEY: "space" }, undefined, 340, 20),
);

const melody = program(
  ["note"],
  {
    ...b("controls_forEach", { VAR: { id: "note" } }, {
      LIST: items("lists_create_with", ...[262, 294, 330, 349, 392].map(num)),
      DO: {
        block: seq(
          b("io_print", undefined, { VALUE: join(txt("Playing "), v("note")) }),
          b("web_tone", undefined, { HZ: v("note"), MS: num(250) }),
          b("time_wait", undefined, { MS: num(50) }),
        ),
      },
    }),
    x: 20,
    y: 20,
  },
);

export const examples: { name: string; state: object }[] = [
  { name: "Hello & ask", state: hello },
  { name: "Turtle spiral", state: spiral },
  { name: "Bouncing ball", state: ball },
  { name: "Keyboard move", state: keys },
  { name: "Melody", state: melody },
];
