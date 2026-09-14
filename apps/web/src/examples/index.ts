import { breakout } from "./breakout";
import { cafe } from "./cafe";
import { bubble } from "./sort";
import { b, between, change, colour, cmp, hat, iff, items, math, num, program, seq, set, stage, txt, v, type In } from "./build";

const join = (...ins: In[]) => items("text_join", ...ins);

const ui = (...kids: ReturnType<typeof b>[]): In => ({ block: seq(...kids) });

const hello = program(
  ["name", "msg"],
  hat(
    "events_start",
    b("ui_show", undefined, {
      TREE: ui(
        b("ui_column", undefined, {
          KIDS: ui(
            b("ui_label", undefined, { TEXT: txt("What is your name?") }),
            b("ui_input", undefined, { ID: txt("name") }),
            b("ui_button", undefined, { TEXT: txt("Go"), MSG: txt("go") }),
          ),
        }),
      ),
    }),
  ),
  hat(
    "events_ui",
    iff(
      cmp("EQ", v("msg"), txt("go")),
      seq(
        set("name", { block: b("ui_value", undefined, { ID: txt("name") }) }),
        b("io_print", undefined, { VALUE: join(txt("Hello, "), v("name"), txt("!")) }),
        b("web_speak", undefined, { TEXT: join(txt("Hello "), v("name")) }),
        b("ui_show", undefined, {
          TREE: ui(b("ui_label", undefined, { TEXT: join(txt("Hello, "), v("name"), txt("!")) })),
        }),
      ),
    ),
    { VAR: { id: "msg" } },
    undefined,
    380,
    20,
  ),
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

const not = (x: In): In => ({ block: b("logic_negate", undefined, { BOOL: x }) });

const bounce = (axis: "x" | "y", d: "dx" | "dy", dim: "width" | "height") =>
  iff(
    not(between(v(axis), num(20), math("MINUS", stage(dim), num(20)))),
    set(d, { block: b("math_single", { OP: "NEG" }, { NUM: v(d) }) }),
  );

const ball = program(
  ["x", "y", "dx", "dy"],
  {
    ...seq(
      set("x", math("DIVIDE", stage("width"), num(2))),
      set("y", math("DIVIDE", stage("height"), num(2))),
      set("dx", num(4)),
      set("dy", num(3)),
    ),
    x: 20,
    y: 20,
  },
  hat(
    "events_frame",
    seq(
      b("canvas_clear", undefined, { COLOUR: colour("#1e1e24") }),
      change("x", v("dx")),
      change("y", v("dy")),
      bounce("x", "dx", "width"),
      bounce("y", "dy", "height"),
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

export type Example = { id: string; name: string; state: object };

export const examples: Example[] = [
  { id: "hello", name: "Hello form", state: hello },
  { id: "cafe", name: "Blox Cafe", state: cafe },
  { id: "spiral", name: "Turtle spiral", state: spiral },
  { id: "ball", name: "Bouncing ball", state: ball },
  { id: "keys", name: "Keyboard move", state: keys },
  { id: "melody", name: "Melody", state: melody },
  { id: "breakout", name: "Breakout", state: breakout },
  { id: "sort", name: "Bubble sort", state: bubble },
];
