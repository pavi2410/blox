import { Order, block, cat, colour, define, num, txt, val } from "../util";
import { KEYS } from "./events";

const HUE = 280;
const MODE = { type: "field_dropdown", name: "MODE", options: [["filled", "fill"], ["outline", "stroke"]] };
const stmtJson = (type: string, message0: string, args0: object[], inputsInline = true) => ({
  type,
  message0,
  args0,
  inputsInline,
  previousStatement: null,
  nextStatement: null,
  colour: HUE,
});
const input = (name: string, check = "Number") => ({ type: "input_value", name, check });

define([
  {
    json: stmtJson("canvas_clear", "clear stage with colour %1", [input("COLOUR", "Colour")]),
    js: (b, g) => `clear(${val(b, g, "COLOUR", "'#ffffff'")});\n`,
  },
  {
    json: stmtJson("canvas_fill", "set fill colour %1", [input("COLOUR", "Colour")]),
    js: (b, g) => `fill(${val(b, g, "COLOUR", "'#000000'")});\n`,
  },
  {
    json: stmtJson("canvas_stroke", "set line colour %1 width %2", [input("COLOUR", "Colour"), input("WIDTH")]),
    js: (b, g) => `stroke(${val(b, g, "COLOUR", "'#000000'")}, ${val(b, g, "WIDTH", "1")});\n`,
  },
  {
    json: stmtJson("canvas_rect", "draw %1 rect x %2 y %3 w %4 h %5", [MODE, input("X"), input("Y"), input("W"), input("H")]),
    js: (b, g) =>
      `rect(${["X", "Y", "W", "H"].map((n) => val(b, g, n, "0")).join(", ")}, '${b.getFieldValue("MODE")}');\n`,
  },
  {
    json: stmtJson("canvas_circle", "draw %1 circle x %2 y %3 radius %4", [MODE, input("X"), input("Y"), input("R")]),
    js: (b, g) =>
      `circle(${["X", "Y", "R"].map((n) => val(b, g, n, "0")).join(", ")}, '${b.getFieldValue("MODE")}');\n`,
  },
  {
    json: stmtJson("canvas_line", "draw line from x %1 y %2 to x %3 y %4", [input("X1"), input("Y1"), input("X2"), input("Y2")]),
    js: (b, g) => `line(${["X1", "Y1", "X2", "Y2"].map((n) => val(b, g, n, "0")).join(", ")});\n`,
  },
  {
    json: stmtJson("canvas_text", "draw text %1 at x %2 y %3 size %4", [input("TEXT", "String"), input("X"), input("Y"), input("SIZE")]),
    js: (b, g) =>
      `text(${val(b, g, "TEXT", "''")}, ${["X", "Y"].map((n) => val(b, g, n, "0")).join(", ")}, ${val(b, g, "SIZE", "16")});\n`,
  },
  {
    json: {
      type: "canvas_size",
      message0: "stage %1",
      args0: [{ type: "field_dropdown", name: "DIM", options: [["width", "width"], ["height", "height"]] }],
      output: "Number",
      colour: HUE,
    },
    js: (b) => [`stageSize('${b.getFieldValue("DIM")}')`, Order.FUNCTION_CALL],
  },
  {
    json: {
      type: "input_mouse",
      message0: "mouse %1",
      args0: [{ type: "field_dropdown", name: "AXIS", options: [["x", "x"], ["y", "y"]] }],
      output: "Number",
      colour: HUE,
    },
    js: (b) => [`mouse('${b.getFieldValue("AXIS")}')`, Order.FUNCTION_CALL],
  },
  {
    json: { type: "input_mouse_down", message0: "mouse down?", output: "Boolean", colour: HUE },
    js: () => ["mouseDown()", Order.FUNCTION_CALL],
  },
  {
    json: {
      type: "input_key",
      message0: "key %1 pressed?",
      args0: [{ type: "field_dropdown", name: "KEY", options: KEYS }],
      output: "Boolean",
      colour: HUE,
    },
    js: (b) => [`keyDown(${JSON.stringify(b.getFieldValue("KEY"))})`, Order.FUNCTION_CALL],
  },
]);

export const reserved = ["clear", "fill", "stroke", "rect", "circle", "line", "text", "stageSize", "mouse", "mouseDown", "keyDown"];

export const category = cat("Canvas", HUE, [
  block("canvas_clear", { COLOUR: colour("#ffffff") }),
  block("canvas_fill", { COLOUR: colour("#ff6680") }),
  block("canvas_stroke", { COLOUR: colour("#333333"), WIDTH: num(2) }),
  block("canvas_rect", { X: num(20), Y: num(20), W: num(100), H: num(60) }),
  block("canvas_circle", { X: num(240), Y: num(180), R: num(40) }),
  block("canvas_line", { X1: num(0), Y1: num(0), X2: num(480), Y2: num(360) }),
  block("canvas_text", { TEXT: txt("hello"), X: num(20), Y: num(40), SIZE: num(24) }),
  block("canvas_size"),
  block("input_mouse"),
  block("input_mouse_down"),
  block("input_key"),
]);
