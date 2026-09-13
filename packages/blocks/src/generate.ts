import type * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";

javascriptGenerator.addReservedWords("highlightBlock,print");

/** Generate JS for a workspace. `trace` prefixes each statement with `highlightBlock(id)`. */
export function generate(ws: Blockly.Workspace, trace = false): string {
  javascriptGenerator.STATEMENT_PREFIX = trace ? "highlightBlock(%1);\n" : null;
  return javascriptGenerator.workspaceToCode(ws);
}
