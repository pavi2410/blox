import { block, cat, define, num, stmt, val } from "../util";

const HUE = 40;

export const KEYS: [string, string][] = [
  ["any", "any"],
  ["space", "space"],
  ["↑", "arrowup"],
  ["↓", "arrowdown"],
  ["←", "arrowleft"],
  ["→", "arrowright"],
  ["enter", "enter"],
  ...[..."abcdefghijklmnopqrstuvwxyz0123456789"].map((c): [string, string] => [c, c]),
];

const handler = (kind: string, body: string, arg?: string) =>
  `__on(${JSON.stringify(kind)}, async () => {\n${body}}${arg ? `, ${arg}` : ""});\n`;

define([
  {
    hat: true,
    json: {
      type: "events_start",
      message0: "when program starts %1 %2",
      args0: [{ type: "input_dummy" }, { type: "input_statement", name: "DO" }],
      colour: HUE,
    },
    js: (b, g) => handler("start", stmt(b, g)),
  },
  {
    hat: true,
    json: {
      type: "events_key",
      message0: "when key %1 pressed %2 %3",
      args0: [
        { type: "field_dropdown", name: "KEY", options: KEYS },
        { type: "input_dummy" },
        { type: "input_statement", name: "DO" },
      ],
      colour: HUE,
    },
    js: (b, g) => handler("key", stmt(b, g), JSON.stringify(b.getFieldValue("KEY"))),
  },
  {
    hat: true,
    json: {
      type: "events_click",
      message0: "when stage clicked %1 %2",
      args0: [{ type: "input_dummy" }, { type: "input_statement", name: "DO" }],
      colour: HUE,
    },
    js: (b, g) => handler("click", stmt(b, g)),
  },
  {
    hat: true,
    json: {
      type: "events_frame",
      message0: "every frame %1 %2",
      args0: [{ type: "input_dummy" }, { type: "input_statement", name: "DO" }],
      colour: HUE,
      tooltip: "Runs ~60 times per second while the program is running",
    },
    js: (b, g) => handler("frame", stmt(b, g)),
  },
  {
    hat: true,
    json: {
      type: "events_interval",
      message0: "every %1 ms %2 %3",
      args0: [
        { type: "input_value", name: "MS", check: "Number" },
        { type: "input_dummy" },
        { type: "input_statement", name: "DO" },
      ],
      colour: HUE,
    },
    js: (b, g) => handler("interval", stmt(b, g), val(b, g, "MS", "1000")),
  },
]);

export const reserved = ["__on"];

export const category = cat("Events", HUE, [
  block("events_start"),
  block("events_key"),
  block("events_click"),
  block("events_frame"),
  block("events_interval", { MS: num(1000) }),
]);
