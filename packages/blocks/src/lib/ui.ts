import type * as Blockly from "blockly/core";
import { Order, block, cat, define, txt, val, stmt, type Gen } from "../util";

const HUE = 190;
const input = (name: string, check?: string) => ({ type: "input_value", name, check });
const stack = (name: string) => ({ type: "input_statement", name, check: "Ui" });
const conn = { previousStatement: "Ui", nextStatement: "Ui" as const };

const kids = (b: Blockly.Block, g: Gen, name: string) =>
  `(() => { const __u = [];\n${stmt(b, g, name)}return __u; })()`;

const push = (node: string) => `__u.push(${node});\n`;
const root = (b: Blockly.Block, g: Gen) =>
  `await showUi((() => { const __u = [];\n${stmt(b, g, "TREE")}return __u.length > 1 ? { t: "col", kids: __u } : (__u[0] ?? null); })());\n`;

define([
  {
    json: {
      type: "ui_show",
      message0: "show UI %1 %2",
      args0: [{ type: "input_dummy" }, stack("TREE")],
      previousStatement: null,
      nextStatement: null,
      colour: HUE,
    },
    js: root,
  },
  {
    json: {
      type: "ui_column",
      message0: "column %1 %2",
      args0: [{ type: "input_dummy" }, stack("KIDS")],
      ...conn,
      colour: HUE,
      tooltip: "Stack widgets top to bottom",
    },
    js: (b, g) => push(`{ t: "col", kids: ${kids(b, g, "KIDS")} }`),
  },
  {
    json: {
      type: "ui_row",
      message0: "row %1 %2",
      args0: [{ type: "input_dummy" }, stack("KIDS")],
      ...conn,
      colour: HUE,
      tooltip: "Place widgets left to right",
    },
    js: (b, g) => push(`{ t: "row", kids: ${kids(b, g, "KIDS")} }`),
  },
  {
    json: {
      type: "ui_label",
      message0: "label %1",
      args0: [input("TEXT")],
      ...conn,
      colour: HUE,
    },
    js: (b, g) => push(`{ t: "label", text: ${val(b, g, "TEXT", "''")} }`),
  },
  {
    json: {
      type: "ui_button",
      message0: "button %1 sends %2",
      args0: [input("TEXT"), input("MSG")],
      inputsInline: true,
      ...conn,
      colour: HUE,
      tooltip: "Click sends this message to 'when UI message'",
    },
    js: (b, g) => push(`{ t: "btn", text: ${val(b, g, "TEXT", "''")}, msg: ${val(b, g, "MSG", "''")} }`),
  },
  {
    json: {
      type: "ui_input",
      message0: "input named %1",
      args0: [input("ID")],
      ...conn,
      colour: HUE,
    },
    js: (b, g) => push(`{ t: "input", id: ${val(b, g, "ID", "''")} }`),
  },
  {
    json: {
      type: "ui_value",
      message0: "UI input %1",
      args0: [input("ID")],
      output: "String",
      colour: HUE,
      tooltip: "Current text of an input with this name",
    },
    js: (b, g) => [`(await uiInput(${val(b, g, "ID", "''")}))`, Order.ATOMIC],
  },
  {
    hat: true,
    json: {
      type: "events_ui",
      message0: "when UI message %1 %2 %3",
      args0: [
        { type: "field_variable", name: "VAR", variable: "msg" },
        { type: "input_dummy" },
        { type: "input_statement", name: "DO" },
      ],
      colour: HUE,
      tooltip: "Runs when a button is clicked. The variable is the message that button sends.",
    },
    js: (b, g) =>
      `__on("ui", async (__m) => {\n  ${g.getVariableName(b.getFieldValue("VAR"))} = __m;\n${stmt(b, g)}});\n`,
  },
]);

export const reserved = ["showUi", "uiInput", "__u"];

export const category = cat("UI", HUE, [
  block("ui_show"),
  block("events_ui"),
  block("ui_column"),
  block("ui_row"),
  block("ui_label", { TEXT: txt("Hello") }),
  block("ui_button", { TEXT: txt("Go"), MSG: txt("go") }),
  block("ui_input", { ID: txt("name") }),
  block("ui_value", { ID: txt("name") }),
]);
