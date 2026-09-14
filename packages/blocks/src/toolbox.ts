import type * as Blockly from "blockly/core";
import { block, cat, colour, num, txt } from "./util";
import * as canvas from "./lib/canvas";
import * as data from "./lib/data";
import * as events from "./lib/events";
import { flyout as matchFlyout } from "./lib/match";
import * as io from "./lib/io";
import * as time from "./lib/time";
import * as store from "./lib/store";
import * as turtle from "./lib/turtle";
import * as ui from "./lib/ui";
import * as web from "./lib/web";

export const toolbox: Blockly.utils.toolbox.ToolboxDefinition = {
  kind: "categoryToolbox",
  contents: [
    cat("Logic", "%{BKY_LOGIC_HUE}", [
      block("controls_if"),
      block("controls_if", undefined, { extraState: { hasElse: true } }),
      ...matchFlyout,
      block("logic_compare"),
      block("logic_between", { VALUE: num(5), LOW: num(1), HIGH: num(10) }),
      block("logic_operation"),
      block("logic_negate"),
      block("logic_boolean"),
      block("logic_null"),
      block("logic_ternary"),
    ]),
    cat("Loops", "%{BKY_LOOPS_HUE}", [
      block("controls_repeat_ext", { TIMES: num(10) }),
      block("controls_whileUntil"),
      block("controls_for", { FROM: num(1), TO: num(10), BY: num(1) }),
      block("controls_forEach"),
      block("controls_flow_statements"),
    ]),
    cat("Math", "%{BKY_MATH_HUE}", [
      block("math_number"),
      block("math_arithmetic", { A: num(1), B: num(1) }),
      block("math_single", { NUM: num(9) }),
      block("math_trig", { NUM: num(45) }),
      block("math_constant"),
      block("math_number_property", { NUMBER_TO_CHECK: num(0) }),
      block("math_round", { NUM: num(3.1) }),
      block("math_on_list"),
      block("math_modulo", { DIVIDEND: num(64), DIVISOR: num(10) }),
      block("math_constrain", { VALUE: num(50), LOW: num(1), HIGH: num(100) }),
      block("math_random_int", { FROM: num(1), TO: num(100) }),
      block("math_random_float"),
      block("math_atan2", { X: num(1), Y: num(1) }),
    ]),
    cat("Text", "%{BKY_TEXTS_HUE}", [
      block("text"),
      block("text_multiline"),
      block("text_join"),
      block("text_append", { TEXT: txt("") }),
      block("text_length", { VALUE: txt("abc") }),
      block("text_isEmpty", { VALUE: txt("") }),
      block("text_indexOf", { VALUE: { block: { type: "variables_get" } }, FIND: txt("abc") }),
      block("text_charAt", { VALUE: { block: { type: "variables_get" } } }),
      block("text_getSubstring", { STRING: { block: { type: "variables_get" } } }),
      block("text_changeCase", { TEXT: txt("abc") }),
      block("text_trim", { TEXT: txt("abc") }),
      block("text_count", { SUB: txt(""), TEXT: txt("") }),
      block("text_replace", { FROM: txt(""), TO: txt(""), TEXT: txt("") }),
      block("text_reverse", { TEXT: txt("") }),
    ]),
    cat("Lists", "%{BKY_LISTS_HUE}", [
      block("lists_create_with", undefined, { extraState: { itemCount: 0 } }),
      block("lists_create_with"),
      block("lists_repeat", { NUM: num(5) }),
      block("lists_range", { FROM: num(1), TO: num(10), BY: num(1) }),
      block("lists_length"),
      block("lists_isEmpty"),
      block("lists_indexOf", { VALUE: { block: { type: "variables_get" } } }),
      block("lists_getIndex", { VALUE: { block: { type: "variables_get" } } }),
      block("lists_setIndex", { LIST: { block: { type: "variables_get" } } }),
      block("lists_getSublist", { LIST: { block: { type: "variables_get" } } }),
      block("lists_split", { DELIM: txt(",") }),
      block("lists_sort"),
      block("lists_reverse"),
    ]),
    cat("Colour", "%{BKY_COLOUR_HUE}", [
      block("colour_picker"),
      block("colour_random"),
      block("colour_rgb", { RED: num(100), GREEN: num(50), BLUE: num(0) }),
      block("colour_blend", { COLOUR1: colour("#ff0000"), COLOUR2: colour("#3333ff"), RATIO: num(0.5) }),
    ]),
    data.category,
    { kind: "category", name: "Variables", colour: "%{BKY_VARIABLES_HUE}", custom: "VARIABLE" },
    { kind: "category", name: "Functions", colour: "%{BKY_PROCEDURES_HUE}", custom: "PROCEDURE" },
    { kind: "sep" },
    events.category,
    ui.category,
    io.category,
    time.category,
    turtle.category,
    canvas.category,
    store.category,
    web.category,
  ],
};
