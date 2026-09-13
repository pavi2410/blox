import { Order, block, cat, colour, define, num, val } from "../util";

const HUE = 120;
const stmtJson = (type: string, message0: string, args0: object[] = []) => ({
  type,
  message0,
  args0,
  inputsInline: true,
  previousStatement: null,
  nextStatement: null,
  colour: HUE,
});
const input = (name: string, check = "Number") => ({ type: "input_value", name, check });

define([
  {
    json: stmtJson("turtle_move", "move %1 %2", [
      { type: "field_dropdown", name: "DIR", options: [["forward", "1"], ["backward", "-1"]] },
      input("DIST"),
    ]),
    js: (b, g) => `await fd(${b.getFieldValue("DIR")} * ${val(b, g, "DIST", "0")});\n`,
  },
  {
    json: stmtJson("turtle_turn", "turn %1 %2 °", [
      { type: "field_dropdown", name: "DIR", options: [["right ↻", "1"], ["left ↺", "-1"]] },
      input("DEG"),
    ]),
    js: (b, g) => `turn(${b.getFieldValue("DIR")} * ${val(b, g, "DEG", "0")});\n`,
  },
  {
    json: stmtJson("turtle_heading", "point in direction %1 °", [input("DEG")]),
    js: (b, g) => `setHeading(${val(b, g, "DEG", "0")});\n`,
  },
  {
    json: stmtJson("turtle_goto", "go to x %1 y %2", [input("X"), input("Y")]),
    js: (b, g) => `await goto(${val(b, g, "X", "0")}, ${val(b, g, "Y", "0")});\n`,
  },
  {
    json: stmtJson("turtle_home", "go home"),
    js: () => "await home();\n",
  },
  {
    json: stmtJson("turtle_pen", "pen %1", [
      { type: "field_dropdown", name: "STATE", options: [["down", "true"], ["up", "false"]] },
    ]),
    js: (b) => `pen(${b.getFieldValue("STATE")});\n`,
  },
  {
    json: stmtJson("turtle_colour", "set pen colour %1", [input("COLOUR", "Colour")]),
    js: (b, g) => `penColour(${val(b, g, "COLOUR", "'#000000'")});\n`,
  },
  {
    json: stmtJson("turtle_width", "set pen width %1", [input("WIDTH")]),
    js: (b, g) => `penWidth(${val(b, g, "WIDTH", "1")});\n`,
  },
  {
    json: stmtJson("turtle_show", "%1 turtle", [
      { type: "field_dropdown", name: "STATE", options: [["show", "true"], ["hide", "false"]] },
    ]),
    js: (b) => `turtleVisible(${b.getFieldValue("STATE")});\n`,
  },
  {
    json: {
      type: "turtle_get",
      message0: "turtle %1",
      args0: [
        { type: "field_dropdown", name: "PROP", options: [["x", "x"], ["y", "y"], ["heading", "heading"]] },
      ],
      output: "Number",
      colour: HUE,
    },
    js: (b) => [`turtleGet('${b.getFieldValue("PROP")}')`, Order.FUNCTION_CALL],
  },
]);

export const reserved = ["fd", "turn", "setHeading", "goto", "home", "pen", "penColour", "penWidth", "turtleVisible", "turtleGet"];

export const category = cat("Turtle", HUE, [
  block("turtle_move", { DIST: num(100) }),
  block("turtle_turn", { DEG: num(90) }),
  block("turtle_heading", { DEG: num(0) }),
  block("turtle_goto", { X: num(240), Y: num(180) }),
  block("turtle_home"),
  block("turtle_pen"),
  block("turtle_colour", { COLOUR: colour("#3366ff") }),
  block("turtle_width", { WIDTH: num(2) }),
  block("turtle_show"),
  block("turtle_get"),
]);
