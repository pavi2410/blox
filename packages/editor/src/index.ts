import * as Blockly from "blockly/core";
import * as En from "blockly/msg/en";

Blockly.setLocale(En as unknown as Record<string, string>);

export { BlocklyWorkspace, type WorkspaceProps } from "./workspace";
