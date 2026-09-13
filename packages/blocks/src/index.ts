import "blockly/blocks";
import { installAllBlocks as installColourBlocks } from "@blockly/field-colour";
import { javascriptGenerator } from "blockly/javascript";

installColourBlocks({ javascript: javascriptGenerator });

export { toolbox } from "./toolbox";
export { generate } from "./generate";
