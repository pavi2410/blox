import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

Blockly.defineBlocksWithJsonArray([
  {
    type: "io_print",
    message0: "print %1",
    args0: [{ type: "input_value", name: "VALUE" }],
    previousStatement: null,
    nextStatement: null,
    colour: 160,
    tooltip: "Print a value to the console",
  },
]);

javascriptGenerator.forBlock["io_print"] = (block, gen) => {
  const v = gen.valueToCode(block, "VALUE", Order.NONE) || "''";
  return `print(${v});\n`;
};
