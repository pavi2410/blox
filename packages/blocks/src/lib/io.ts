import { Order, block, cat, define, txt, val } from "../util";

const HUE = 160;

define([
  {
    json: {
      type: "io_print",
      message0: "print %1",
      args0: [{ type: "input_value", name: "VALUE" }],
      previousStatement: null,
      nextStatement: null,
      colour: HUE,
      tooltip: "Print a value to the console",
    },
    js: (b, g) => `print(${val(b, g, "VALUE", "''")});\n`,
  },
  {
    json: {
      type: "io_ask",
      message0: "ask %1",
      args0: [{ type: "input_value", name: "PROMPT" }],
      output: "String",
      colour: HUE,
      tooltip: "Ask a question and wait for an answer",
    },
    js: (b, g) => [`(await ask(${val(b, g, "PROMPT", "''")}))`, Order.ATOMIC],
  },
  {
    json: {
      type: "io_clear",
      message0: "clear console",
      previousStatement: null,
      nextStatement: null,
      colour: HUE,
    },
    js: () => "clearConsole();\n",
  },
]);

export const reserved = ["print", "ask", "clearConsole"];

export const category = cat("Console", HUE, [
  block("io_print", { VALUE: txt("hello") }),
  block("io_ask", { PROMPT: txt("What is your name?") }),
  block("io_clear"),
]);
