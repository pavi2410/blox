import * as Blockly from "blockly/core";
import { javascriptGenerator, Order, type JavascriptGenerator } from "blockly/javascript";

export { Order };
export type Gen = JavascriptGenerator;
type Emit = (block: Blockly.Block, gen: Gen) => string | [string, Order] | null;

export interface Def {
  json: { type: string } & Record<string, unknown>;
  js: Emit;
  /** Render as an event hat (no previous connection). */
  hat?: boolean;
}

/** Register block definitions and their JS generators. */
export function define(defs: Def[]) {
  for (const d of defs) {
    Blockly.Blocks[d.json.type] = {
      init(this: Blockly.Block) {
        this.jsonInit(d.json);
        if (d.hat) this.hat = "cap";
      },
    };
    javascriptGenerator.forBlock[d.json.type] = d.js;
  }
}

/** Value input as code, or fallback. */
export const val = (b: Blockly.Block, g: Gen, name: string, fallback: string) =>
  g.valueToCode(b, name, Order.NONE) || fallback;

export const stmt = (b: Blockly.Block, g: Gen, name = "DO") => g.statementToCode(b, name);

/** Enabled statement children of `name`, in order. */
export const chain = (b: Blockly.Block, name: string) => {
  const out: Blockly.Block[] = [];
  for (let p = b.getInputTargetBlock(name); p; p = p.getNextBlock()) {
    if (p.isEnabled() && !p.isInsertionMarker()) out.push(p);
  }
  return out;
};

// ---- toolbox helpers ----
export type Item = Blockly.utils.toolbox.ToolboxItemInfo;

export const cat = (name: string, colour: string | number, contents: Item[]): Item =>
  ({ kind: "category", name, colour: String(colour), contents }) as Item;

export const block = (type: string, inputs?: Record<string, object>, extra?: object): Item =>
  ({ kind: "block", type, inputs, ...extra }) as Item;

export const num = (n: number) => ({ shadow: { type: "math_number", fields: { NUM: n } } });
export const txt = (t: string) => ({ shadow: { type: "text", fields: { TEXT: t } } });
export const colour = (c: string) => ({ shadow: { type: "colour_picker", fields: { COLOUR: c } } });
