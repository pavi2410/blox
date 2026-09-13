import { Order, block, cat, define, txt, val } from "../util";

const HUE = 20;

define([
  {
    json: { type: "dict_create", message0: "empty dictionary", output: "Dict", colour: HUE },
    js: () => ["({})", Order.ATOMIC],
  },
  {
    json: {
      type: "dict_get",
      message0: "get %1 from %2",
      args0: [
        { type: "input_value", name: "KEY" },
        { type: "input_value", name: "DICT" },
      ],
      inputsInline: true,
      output: null,
      colour: HUE,
    },
    js: (b, g) => [`${val(b, g, "DICT", "({})")}[${val(b, g, "KEY", "''")}]`, Order.MEMBER],
  },
  {
    json: {
      type: "dict_set",
      message0: "set %1 in %2 to %3",
      args0: [
        { type: "input_value", name: "KEY" },
        { type: "input_value", name: "DICT" },
        { type: "input_value", name: "VALUE" },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: HUE,
    },
    js: (b, g) =>
      `${val(b, g, "DICT", "({})")}[${val(b, g, "KEY", "''")}] = ${val(b, g, "VALUE", "null")};\n`,
  },
  {
    json: {
      type: "dict_remove",
      message0: "remove %1 from %2",
      args0: [
        { type: "input_value", name: "KEY" },
        { type: "input_value", name: "DICT" },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: HUE,
    },
    js: (b, g) => `delete ${val(b, g, "DICT", "({})")}[${val(b, g, "KEY", "''")}];\n`,
  },
  {
    json: {
      type: "dict_has",
      message0: "%1 has key %2",
      args0: [
        { type: "input_value", name: "DICT" },
        { type: "input_value", name: "KEY" },
      ],
      inputsInline: true,
      output: "Boolean",
      colour: HUE,
    },
    js: (b, g) => [`(${val(b, g, "KEY", "''")} in ${val(b, g, "DICT", "({})")})`, Order.ATOMIC],
  },
  {
    json: {
      type: "dict_keys",
      message0: "keys of %1",
      args0: [{ type: "input_value", name: "DICT" }],
      output: "Array",
      colour: HUE,
    },
    js: (b, g) => [`Object.keys(${val(b, g, "DICT", "({})")})`, Order.FUNCTION_CALL],
  },
  {
    json: {
      type: "conv",
      message0: "%1 %2",
      args0: [
        {
          type: "field_dropdown",
          name: "OP",
          options: [
            ["to number", "Number"],
            ["to text", "String"],
            ["type of", "typeOf"],
            ["JSON parse", "JSON.parse"],
            ["JSON stringify", "JSON.stringify"],
          ],
        },
        { type: "input_value", name: "VALUE" },
      ],
      output: null,
      colour: HUE,
    },
    js: (b, g) => {
      const op = b.getFieldValue("OP");
      const fn =
        op === "typeOf"
          ? g.provideFunction_("typeOf", [
              `function ${g.FUNCTION_NAME_PLACEHOLDER_}(v) {`,
              "  if (v === null || v === undefined) return 'null';",
              "  if (Array.isArray(v)) return 'list';",
              "  if (typeof v === 'string') return 'text';",
              "  if (typeof v === 'object') return 'dictionary';",
              "  return typeof v;",
              "}",
            ])
          : op;
      return [`${fn}(${val(b, g, "VALUE", "null")})`, Order.FUNCTION_CALL];
    },
  },
]);

export const category = cat("Data", HUE, [
  block("dict_create"),
  block("dict_get", { KEY: txt("key") }),
  block("dict_set", { KEY: txt("key") }),
  block("dict_remove", { KEY: txt("key") }),
  block("dict_has", { KEY: txt("key") }),
  block("dict_keys"),
  block("conv"),
]);
