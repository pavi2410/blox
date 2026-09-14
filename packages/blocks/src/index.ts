import "blockly/blocks";
import { installAllBlocks as installColourBlocks } from "@blockly/field-colour";
import { javascriptGenerator } from "blockly/javascript";
import "./lib/dynamic";
import "./lib/logic";
import "./lib/lists";
import "./lib/ui";

installColourBlocks({ javascript: javascriptGenerator });

export { toolbox } from "./toolbox";
export { generate, type GenMode } from "./generate";
