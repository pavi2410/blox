import {
  and,
  append,
  b,
  bool,
  call,
  change,
  cmp,
  colour,
  constrain,
  defn,
  dget,
  dset,
  each,
  emptyDict,
  emptyList,
  forVar,
  getAt,
  hat,
  iff,
  items,
  keyDown,
  math,
  num,
  program,
  seq,
  set,
  txt,
  v,
  type In,
} from "./build";

const join = (...ins: In[]) => items("text_join", ...ins);
const not = (x: In): In => ({ block: b("logic_negate", undefined, { BOOL: x }) });
const neg = (x: In): In => ({ block: b("math_single", { OP: "NEG" }, { NUM: x }) });
const toNum = (x: In): In => ({ block: b("conv", { OP: "Number" }, { VALUE: x }) });
const randInt = (from: number, to: number): In => ({
  block: b("math_random_int", undefined, { FROM: num(from), TO: num(to) }),
});
const tone = (hz: number, ms: number) => b("web_tone", undefined, { HZ: num(hz), MS: num(ms) });
const speak = (t: string) => b("web_speak", undefined, { TEXT: txt(t) });
const save = (key: string, value: In) => b("web_store_save", undefined, { VALUE: value, KEY: txt(key) });
const load = (key: string): In => ({ block: b("web_store_load", undefined, { KEY: txt(key) }) });
const fill = (c: In) => b("canvas_fill", undefined, { COLOUR: c });
const rect = (x: In, y: In, w: In, h: In) => b("canvas_rect", { MODE: "fill" }, { X: x, Y: y, W: w, H: h });
const circle = (x: In, y: In, r: number) =>
  b("canvas_circle", { MODE: "fill" }, { X: x, Y: y, R: num(r) });
const label = (t: In, x: number, y: number, size = 16) =>
  b("canvas_text", undefined, { TEXT: t, X: num(x), Y: num(y), SIZE: num(size) });
const live = dget(v("brick"), "live");
const brickX = dget(v("brick"), "x");
const brickY = dget(v("brick"), "y");

const palette = items(
  "lists_create_with",
  colour("#ff6680"),
  colour("#ffaa44"),
  colour("#66dd88"),
  colour("#4f8cff"),
);

const setupBricks = defn(
  "setup bricks",
  seq(
    set("palette", palette),
    set("bricks", emptyList()),
    set("left", num(0)),
    forVar(
      "row",
      1,
      4,
      forVar(
        "col",
        1,
        6,
        seq(
          set("brick", emptyDict()),
          dset(v("brick"), "x", math("ADD", num(12), math("MULTIPLY", math("MINUS", v("col"), num(1)), num(78)))),
          dset(v("brick"), "y", math("ADD", num(40), math("MULTIPLY", math("MINUS", v("row"), num(1)), num(24)))),
          dset(v("brick"), "live", bool(true)),
          dset(v("brick"), "colour", getAt(v("palette"), v("row"))),
          append(v("bricks"), v("brick")),
          change("left", 1),
        ),
      ),
    ),
  ),
  520,
  20,
);

const resetBall = defn(
  "reset ball",
  seq(
    set("bx", num(240)),
    set("by", num(250)),
    set("dx", randInt(-4, 4)),
    iff(cmp("EQ", v("dx"), num(0)), set("dx", num(3))),
    set("dy", num(-4)),
  ),
  520,
  1100,
);

const movePaddle = defn(
  "move paddle",
  seq(
    iff(keyDown("arrowleft"), change("px", -7)),
    iff(keyDown("arrowright"), change("px", 7)),
    set("px", constrain(v("px"), 0, 400)),
  ),
  520,
  1380,
);

const hitPaddle = and(
  and(cmp("GTE", v("by"), num(316)), cmp("LTE", v("by"), num(340))),
  and(and(cmp("GTE", v("bx"), v("px")), cmp("LTE", v("bx"), math("ADD", v("px"), num(80)))), cmp("GT", v("dy"), num(0))),
);

const hitBrick = and(
  live,
  and(
    and(cmp("GTE", v("bx"), math("MINUS", brickX, num(8))), cmp("LTE", v("bx"), math("ADD", brickX, num(80)))),
    and(cmp("GTE", v("by"), math("MINUS", brickY, num(8))), cmp("LTE", v("by"), math("ADD", brickY, num(26)))),
  ),
);

const bounce = defn(
  "bounce",
  seq(
    change("bx", v("dx")),
    change("by", v("dy")),
    iff(
      cmp("LT", v("bx"), num(8)),
      seq(set("bx", num(8)), set("dx", neg(v("dx"))), tone(220, 40)),
    ),
    iff(
      cmp("GT", v("bx"), num(472)),
      seq(set("bx", num(472)), set("dx", neg(v("dx"))), tone(220, 40)),
    ),
    iff(
      cmp("LT", v("by"), num(8)),
      seq(set("by", num(8)), set("dy", neg(v("dy"))), tone(330, 40)),
    ),
    iff(
      hitPaddle,
      seq(
        set("by", num(316)),
        set("dy", neg(v("dy"))),
        set("off", math("MINUS", v("bx"), math("ADD", v("px"), num(40)))),
        set("dx", constrain(math("ADD", v("dx"), math("DIVIDE", v("off"), num(12))), -6, 6)),
        tone(520, 50),
      ),
    ),
    iff(
      cmp("GT", v("by"), num(360)),
      seq(
        change("lives", -1),
        set("playing", bool(false)),
        call("reset ball"),
        tone(110, 280),
        iff(cmp("EQ", v("lives"), num(0)), speak("game over")),
      ),
    ),
  ),
  1020,
  20,
);

const hitBricks = defn(
  "hit bricks",
  each(
    "brick",
    v("bricks"),
    iff(
      hitBrick,
      seq(
        dset(v("brick"), "live", bool(false)),
        change("left", -1),
        change("score", 10),
        set("dy", neg(v("dy"))),
        tone(880, 40),
        iff(
          cmp("GT", v("score"), v("high")),
          seq(set("high", v("score")), save("breakout.high", v("high"))),
        ),
        iff(
          cmp("EQ", v("left"), num(0)),
          seq(set("playing", bool(false)), speak("you win")),
        ),
        b("controls_flow_statements", { FLOW: "BREAK" }),
      ),
    ),
  ),
  1020,
  1180,
);

const draw = defn(
  "draw",
  seq(
    b("canvas_clear", undefined, { COLOUR: colour("#16161d") }),
    each(
      "brick",
      v("bricks"),
      iff(
        live,
        seq(
          fill(dget(v("brick"), "colour")),
          rect(brickX, brickY, num(72), num(18)),
        ),
      ),
    ),
    fill(colour("#e8e8ef")),
    rect(v("px"), num(328), num(80), num(12)),
    fill(colour("#ffe066")),
    circle(v("bx"), v("by"), 8),
    fill(colour("#ffffff")),
    label(join(txt("score "), v("score"), txt("   lives "), v("lives"), txt("   best "), v("high")), 12, 8),
    iff(
      not(v("playing")),
      iff(
        cmp("EQ", v("lives"), num(0)),
        label(txt("game over  ·  space to restart"), 110, 200, 18),
        label(txt("press space to serve"), 140, 200, 18),
      ),
    ),
  ),
  20,
  1320,
);

export const breakout = program(
  ["px", "bx", "by", "dx", "dy", "off", "bricks", "brick", "palette", "score", "lives", "high", "playing", "left", "row", "col"],
  hat(
    "events_start",
    seq(
      set("px", num(200)),
      set("score", num(0)),
      set("lives", num(3)),
      set("playing", bool(false)),
      set("high", toNum(load("breakout.high"))),
      call("setup bricks"),
      call("reset ball"),
    ),
    undefined,
    undefined,
    20,
    20,
  ),
  hat(
    "events_key",
    iff(
      not(v("playing")),
      seq(
        iff(cmp("EQ", v("lives"), num(0)), seq(set("score", num(0)), set("lives", num(3)), call("setup bricks"))),
        iff(cmp("EQ", v("left"), num(0)), call("setup bricks")),
        call("reset ball"),
        set("playing", bool(true)),
      ),
    ),
    { KEY: "space" },
    undefined,
    20,
    480,
  ),
  hat(
    "events_frame",
    seq(
      call("move paddle"),
      iff(v("playing"), seq(call("bounce"), call("hit bricks"))),
      call("draw"),
    ),
    undefined,
    undefined,
    20,
    980,
  ),
  setupBricks,
  resetBall,
  movePaddle,
  bounce,
  hitBricks,
  draw,
);
