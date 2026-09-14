import { Order, define, val } from "../util";

/** Inclusive integer sequence, same direction rules as `count with`. Caps at 10k. */
define([
  {
    json: {
      type: "lists_range",
      message0: "numbers from %1 to %2 by %3",
      args0: [
        { type: "input_value", name: "FROM", check: "Number" },
        { type: "input_value", name: "TO", check: "Number" },
        { type: "input_value", name: "BY", check: "Number" },
      ],
      inputsInline: true,
      output: "Array",
      style: "list_blocks",
      tooltip: "Inclusive integers. Step sign follows from→to. Stops at 10,000 items.",
    },
    js: (b, g) => {
      const fn = g.provideFunction_("listsRange", [
        `function ${g.FUNCTION_NAME_PLACEHOLDER_}(from, to, by) {`,
        "  from = Math.trunc(+from) || 0;",
        "  to = Math.trunc(+to) || 0;",
        "  by = Math.abs(Math.trunc(+by)) || 1;",
        "  if (from > to) by = -by;",
        "  var list = [];",
        "  for (var i = from; by >= 0 ? i <= to : i >= to; i += by) {",
        "    list.push(i);",
        "    if (list.length >= 10000) break;",
        "  }",
        "  return list;",
        "}",
      ]);
      return [
        `${fn}(${val(b, g, "FROM", "1")}, ${val(b, g, "TO", "10")}, ${val(b, g, "BY", "1")})`,
        Order.FUNCTION_CALL,
      ];
    },
  },
]);
