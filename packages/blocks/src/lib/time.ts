import { Order, block, cat, define, num, val } from "../util";

const HUE = 200;

define([
  {
    json: {
      type: "time_wait",
      message0: "wait %1 ms",
      args0: [{ type: "input_value", name: "MS", check: "Number" }],
      previousStatement: null,
      nextStatement: null,
      colour: HUE,
    },
    js: (b, g) => `await wait(${val(b, g, "MS", "0")});\n`,
  },
  {
    json: {
      type: "time_wait_until",
      message0: "wait until %1",
      args0: [{ type: "input_value", name: "COND", check: "Boolean" }],
      previousStatement: null,
      nextStatement: null,
      colour: HUE,
    },
    js: (b, g) => `await waitUntil(async () => ${val(b, g, "COND", "true")});\n`,
  },
  {
    json: { type: "time_now", message0: "current time (ms)", output: "Number", colour: HUE },
    js: () => ["Date.now()", Order.FUNCTION_CALL],
  },
  {
    json: { type: "time_elapsed", message0: "time since start (ms)", output: "Number", colour: HUE },
    js: () => ["elapsed()", Order.FUNCTION_CALL],
  },
]);

export const reserved = ["wait", "waitUntil", "elapsed"];

export const category = cat("Time", HUE, [
  block("time_wait", { MS: num(500) }),
  block("time_wait_until"),
  block("time_elapsed"),
  block("time_now"),
]);
