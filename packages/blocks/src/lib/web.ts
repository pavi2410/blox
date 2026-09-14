import { Order, block, cat, define, num, txt, val } from "../util";

const HUE = 330;
const input = (name: string, check?: string) => ({ type: "input_value", name, check });

define([
  {
    json: {
      type: "web_fetch",
      message0: "fetch JSON from %1",
      args0: [input("URL", "String")],
      output: null,
      colour: HUE,
      tooltip: "Download and parse JSON from a URL",
    },
    js: (b, g) => [`(await fetchJson(${val(b, g, "URL", "''")}))`, Order.ATOMIC],
  },
  {
    json: {
      type: "web_speak",
      message0: "say %1",
      args0: [input("TEXT", "String")],
      previousStatement: null,
      nextStatement: null,
      colour: HUE,
    },
    js: (b, g) => `await speak(${val(b, g, "TEXT", "''")});\n`,
  },
  {
    json: {
      type: "web_tone",
      message0: "play tone %1 Hz for %2 ms",
      args0: [input("HZ", "Number"), input("MS", "Number")],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: HUE,
    },
    js: (b, g) => `await tone(${val(b, g, "HZ", "440")}, ${val(b, g, "MS", "200")});\n`,
  },
]);

export const reserved = ["fetchJson", "speak", "tone"];

export const category = cat("Web", HUE, [
  block("web_fetch", { URL: txt("https://api.github.com/repos/google/blockly") }),
  block("web_speak", { TEXT: txt("hello world") }),
  block("web_tone", { HZ: num(440), MS: num(200) }),
]);
