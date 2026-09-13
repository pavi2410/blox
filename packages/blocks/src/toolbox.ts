import type * as Blockly from "blockly/core";

type Item = Blockly.utils.toolbox.ToolboxItemInfo;

const cat = (name: string, colour: string, contents: Item[]): Item =>
  ({ kind: "category", name, colour, contents }) as Item;

const block = (type: string, extra: object = {}): Item => ({ kind: "block", type, ...extra }) as Item;

const num = (n: number) => ({ shadow: { type: "math_number", fields: { NUM: n } } });
const txt = (t: string) => ({ shadow: { type: "text", fields: { TEXT: t } } });

export const toolbox: Blockly.utils.toolbox.ToolboxDefinition = {
  kind: "categoryToolbox",
  contents: [
    cat("Logic", "%{BKY_LOGIC_HUE}", [
      block("controls_if"),
      block("logic_compare"),
      block("logic_operation"),
      block("logic_negate"),
      block("logic_boolean"),
      block("logic_ternary"),
    ]),
    cat("Loops", "%{BKY_LOOPS_HUE}", [
      block("controls_repeat_ext", { inputs: { TIMES: num(10) } }),
      block("controls_whileUntil"),
      block("controls_for", { inputs: { FROM: num(1), TO: num(10), BY: num(1) } }),
      block("controls_forEach"),
      block("controls_flow_statements"),
    ]),
    cat("Math", "%{BKY_MATH_HUE}", [
      block("math_number"),
      block("math_arithmetic", { inputs: { A: num(1), B: num(1) } }),
      block("math_single", { inputs: { NUM: num(9) } }),
      block("math_modulo", { inputs: { DIVIDEND: num(64), DIVISOR: num(10) } }),
      block("math_random_int", { inputs: { FROM: num(1), TO: num(100) } }),
    ]),
    cat("Text", "%{BKY_TEXTS_HUE}", [
      block("text"),
      block("text_join"),
      block("text_length", { inputs: { VALUE: txt("abc") } }),
      block("text_append", { inputs: { TEXT: txt("") } }),
    ]),
    cat("Lists", "%{BKY_LISTS_HUE}", [
      block("lists_create_with"),
      block("lists_repeat", { inputs: { NUM: num(5) } }),
      block("lists_length"),
      block("lists_getIndex"),
      block("lists_setIndex"),
    ]),
    cat("I/O", "160", [block("io_print", { inputs: { VALUE: txt("hello") } })]),
    { kind: "sep" },
    { kind: "category", name: "Variables", colour: "%{BKY_VARIABLES_HUE}", custom: "VARIABLE" },
    { kind: "category", name: "Functions", colour: "%{BKY_PROCEDURES_HUE}", custom: "PROCEDURE" },
  ],
};
