import { Order, block, cat, define, txt, val } from "../util";

const HUE = 305;
const input = (name: string, check?: string) => ({ type: "input_value", name, check });

define([
  {
    json: {
      type: "web_store_save",
      message0: "save %1 as %2",
      args0: [input("VALUE"), input("KEY", "String")],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: HUE,
      tooltip: "Persist a value across runs and reloads",
    },
    js: (b, g) => `await store(${val(b, g, "KEY", "''")}, ${val(b, g, "VALUE", "null")});\n`,
  },
  {
    json: {
      type: "web_store_load",
      message0: "load %1",
      args0: [input("KEY", "String")],
      output: null,
      colour: HUE,
    },
    js: (b, g) => [`(await load(${val(b, g, "KEY", "''")}))`, Order.ATOMIC],
  },
]);

export const reserved = ["store", "load"];

export const category = cat("Storage", HUE, [
  block("web_store_save", { KEY: txt("score") }),
  block("web_store_load", { KEY: txt("score") }),
]);
