import { overrideOldBlockDefinitions } from "@blockly/block-dynamic-connection";
import type * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";

/** Replace if / text join / list-create with the dynamic-connection versions. */
overrideOldBlockDefinitions();

/** Those blocks store `itemCount`; the stock JS generators still read `itemCount_`. */
for (const type of ["text_join", "lists_create_with"]) {
  const orig = javascriptGenerator.forBlock[type];
  javascriptGenerator.forBlock[type] = (b, g) => {
    const d = b as Blockly.Block & { itemCount?: number; itemCount_?: number };
    d.itemCount_ ??= d.itemCount;
    return orig(b, g);
  };
}
