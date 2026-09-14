import {
  and,
  b,
  bool,
  call,
  cmp,
  colour,
  defn,
  forVar,
  getAt,
  hat,
  iff,
  len,
  math,
  num,
  nums,
  or,
  program,
  seq,
  set,
  setAt,
  txt,
  v,
  type In,
} from "./build";

const not = (x: In): In => ({ block: b("logic_negate", undefined, { BOOL: x }) });
const toTxt = (x: In): In => ({ block: b("conv", { OP: "String" }, { VALUE: x }) });
const randInt = (from: In, to: In): In => ({
  block: b("math_random_int", undefined, { FROM: from, TO: to }),
});
const wait = (ms: number) => b("time_wait", undefined, { MS: num(ms) });
const fill = (c: string) => b("canvas_fill", undefined, { COLOUR: colour(c) });
const rect = (x: In, y: In, w: number, h: In) =>
  b("canvas_rect", { MODE: "fill" }, { X: x, Y: y, W: num(w), H: h });
const label = (t: In, x: number | In, y: number, size = 14) =>
  b("canvas_text", undefined, {
    TEXT: t,
    X: typeof x === "number" ? num(x) : x,
    Y: num(y),
    SIZE: num(size),
  });

const item = (at: In) => getAt(v("data"), at);
const plus1 = (x: In) => math("ADD", x, num(1));
const comparing = and(
  cmp("GT", v("look"), num(0)),
  or(cmp("EQ", v("k"), v("look")), cmp("EQ", v("k"), math("ADD", v("look"), num(1)))),
);

const shuffle = defn(
  "shuffle",
  forVar(
    "i",
    1,
    v("n"),
    seq(
      set("j", randInt(num(1), v("n"))),
      set("temp", item(v("i"))),
      setAt(v("data"), v("i"), item(v("j"))),
      setAt(v("data"), v("j"), v("temp")),
    ),
  ),
  520,
  20,
);

const draw = defn(
  "draw",
  seq(
    b("canvas_clear", undefined, { COLOUR: colour("#16161d") }),
    label(txt("bubble sort"), 12, 8, 16),
    forVar(
      "k",
      1,
      v("n"),
      seq(
        set("val", item(v("k"))),
        set("h", math("MULTIPLY", v("val"), num(22))),
        set("x", math("ADD", num(16), math("MULTIPLY", math("MINUS", v("k"), num(1)), num(38)))),
        iff(comparing, fill("#ffe066"), fill("#4f8cff")),
        rect(v("x"), math("MINUS", num(320), v("h")), 30, v("h")),
        label(toTxt(v("val")), math("ADD", v("x"), num(6)), 328, 12),
      ),
    ),
  ),
  520,
  280,
);

const swap = seq(
  set("temp", item(v("i"))),
  setAt(v("data"), v("i"), item(plus1(v("i")))),
  setAt(v("data"), plus1(v("i")), v("temp")),
  set("swapped", bool(true)),
  b("web_tone", undefined, { HZ: math("ADD", num(200), math("MULTIPLY", v("temp"), num(40))), MS: num(40) }),
);

const sort = defn(
  "sort",
  forVar(
    "pass",
    1,
    math("MINUS", v("n"), num(1)),
    seq(
      set("swapped", bool(false)),
      forVar(
        "i",
        1,
        math("MINUS", v("n"), v("pass")),
        seq(
          set("look", v("i")),
          call("draw"),
          wait(80),
          iff(cmp("GT", item(v("i")), item(plus1(v("i")))), seq(swap, call("draw"), wait(80))),
        ),
      ),
      iff(not(v("swapped")), b("controls_flow_statements", { FLOW: "BREAK" })),
    ),
  ),
  20,
  280,
);

export const bubble = program(
  ["data", "n", "i", "j", "k", "pass", "temp", "look", "val", "h", "x", "swapped"],
  hat(
    "events_start",
    seq(
      set("data", nums(1, 12)),
      set("n", len(v("data"))),
      set("look", num(0)),
      call("shuffle"),
      call("draw"),
      wait(400),
      call("sort"),
      set("look", num(0)),
      call("draw"),
      b("io_print", undefined, { VALUE: v("data") }),
    ),
    undefined,
    undefined,
    20,
    20,
  ),
  shuffle,
  draw,
  sort,
);
