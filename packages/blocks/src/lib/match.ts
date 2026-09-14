import { Order, block, chain, define, stmt, txt } from "../util";

const conn = { previousStatement: "Case", nextStatement: "Case" as const };

define([
  {
    json: {
      type: "controls_match",
      message0: "match %1 %2",
      args0: [
        { type: "input_value", name: "VALUE" },
        { type: "input_statement", name: "CASES", check: "Case" },
      ],
      previousStatement: null,
      nextStatement: null,
      style: "logic_blocks",
      tooltip: "Run the first case that equals the value",
    },
    js: (b, g) => {
      const value = g.valueToCode(b, "VALUE", Order.NONE) || "null";
      const cases: string[] = [];
      let els: string | undefined;
      for (const p of chain(b, "CASES")) {
        if (p.type === "controls_match_else") {
          els ??= stmt(p, g);
          continue;
        }
        if (p.type !== "controls_match_case") continue;
        const c = g.valueToCode(p, "IF", Order.EQUALITY) || "undefined";
        cases.push(`${cases.length ? " else if" : "if"} (${value} == ${c}) {\n${stmt(p, g)}}`);
      }
      if (els !== undefined) cases.push(` else {\n${els}}`);
      return cases.length ? `${cases.join("")}\n` : "";
    },
  },
  {
    json: {
      type: "controls_match_case",
      message0: "case %1 %2",
      args0: [
        { type: "input_value", name: "IF" },
        { type: "input_statement", name: "DO" },
      ],
      ...conn,
      style: "logic_blocks",
      tooltip: "Run if the match value equals this",
    },
    js: () => "",
  },
  {
    json: {
      type: "controls_match_else",
      message0: "else %1",
      args0: [{ type: "input_statement", name: "DO" }],
      ...conn,
      style: "logic_blocks",
      tooltip: "Run if no case matches",
    },
    js: () => "",
  },
]);

const cas = (next?: object) => ({
  type: "controls_match_case",
  inputs: { IF: txt("") },
  ...(next ? { next: { block: next } } : {}),
});

export const flyout = [
  block("controls_match", { CASES: { block: cas() } }),
  block("controls_match", { CASES: { block: cas(cas({ type: "controls_match_else" })) } }),
  block("controls_match_case", { IF: txt("") }),
  block("controls_match_else"),
];
