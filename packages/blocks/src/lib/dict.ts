import { Order, block, chain, define, txt, val } from "../util";

const HUE = 20;
const pair = { previousStatement: "Pair", nextStatement: "Pair" as const };

define([
  {
    json: {
      type: "dict_create_with",
      message0: "dictionary %1 %2",
      args0: [{ type: "input_dummy" }, { type: "input_statement", name: "PAIRS", check: "Pair" }],
      output: "Dict",
      colour: HUE,
      tooltip: "Create a dictionary from key/value pairs",
    },
    js: (b, g) => {
      const pairs = chain(b, "PAIRS")
        .filter((p) => p.type === "dict_pair")
        .map((p) => `[${val(p, g, "KEY", "''")}]: ${val(p, g, "VAL", "null")}`);
      return [`({${pairs.join(", ")}})`, Order.ATOMIC];
    },
  },
  {
    json: {
      type: "dict_pair",
      message0: "key %1 → %2",
      args0: [
        { type: "input_value", name: "KEY" },
        { type: "input_value", name: "VAL" },
      ],
      inputsInline: true,
      ...pair,
      colour: HUE,
      tooltip: "A key/value pair",
    },
    js: () => "",
  },
]);

const pairBlock = (next?: object) => ({
  type: "dict_pair",
  inputs: { KEY: txt("key"), VAL: txt("value") },
  ...(next ? { next: { block: next } } : {}),
});

export const factory = () =>
  block("dict_create_with", { PAIRS: { block: pairBlock(pairBlock()) } });
