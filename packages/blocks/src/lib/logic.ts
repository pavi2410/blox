import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";
import { define, val } from "../util";

/** n-ary and/or, same mutator pattern as text_join. First two slots stay A/B. */

const slot = (i: number) => String.fromCharCode(65 + i);

interface LogicOp extends Blockly.Block {
  itemCount_: number;
  updateShape_(): void;
  decompose(workspace: Blockly.Workspace): Blockly.Block;
  compose(container: Blockly.Block): void;
  saveConnections(container: Blockly.Block): void;
  saveExtraState(): { itemCount: number } | null;
}

interface ItemBlock extends Blockly.Block {
  valueConnection_?: Blockly.Connection | null;
}

const opText = (op: string) =>
  Blockly.Msg[op === "OR" ? "LOGIC_OPERATION_OR" : "LOGIC_OPERATION_AND"];

const opField = () =>
  new Blockly.FieldDropdown([
    [opText("AND"), "AND"],
    [opText("OR"), "OR"],
  ]);

Blockly.Blocks["logic_operation_container"] = {
  init() {
    this.appendDummyInput().appendField(new Blockly.FieldLabel(opText("AND")), "OP");
    this.appendStatementInput("STACK");
    this.setStyle("logic_blocks");
    this.setTooltip("Add, remove, or reorder conditions");
    this.contextMenu = false;
  },
};

Blockly.Blocks["logic_operation_item"] = {
  init() {
    this.appendDummyInput().appendField("condition");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setStyle("logic_blocks");
    this.setTooltip("A condition");
    this.contextMenu = false;
  },
};

Blockly.Blocks["logic_operation"] = {
  itemCount_: 2,

  init(this: LogicOp) {
    this.itemCount_ = 2;
    this.setHelpUrl(Blockly.Msg["LOGIC_OPERATION_HELPURL"]);
    this.setStyle("logic_blocks");
    this.setOutput(true, "Boolean");
    this.setInputsInline(false);
    this.setTooltip(() =>
      Blockly.Msg[this.getFieldValue("OP") === "OR" ? "LOGIC_OPERATION_TOOLTIP_OR" : "LOGIC_OPERATION_TOOLTIP_AND"],
    );
    this.updateShape_();
    this.setMutator(new Blockly.icons.MutatorIcon(["logic_operation_item"], this as unknown as Blockly.BlockSvg));
  },

  saveExtraState(this: LogicOp) {
    return this.itemCount_ === 2 ? null : { itemCount: this.itemCount_ };
  },

  loadExtraState(this: LogicOp, state: unknown) {
    const n = state && typeof state === "object" && "itemCount" in state ? Number((state as { itemCount: number }).itemCount) : 2;
    this.itemCount_ = Math.max(0, n || 0);
    this.updateShape_();
  },

  decompose(this: LogicOp, workspace: Blockly.Workspace) {
    const container = workspace.newBlock("logic_operation_container") as Blockly.BlockSvg;
    container.initSvg();
    container.setFieldValue(opText(this.getFieldValue("OP") || "AND"), "OP");
    let conn = container.getInput("STACK")?.connection;
    for (let i = 0; i < this.itemCount_; i++) {
      const item = workspace.newBlock("logic_operation_item") as Blockly.BlockSvg;
      item.initSvg();
      conn?.connect(item.previousConnection!);
      conn = item.nextConnection;
    }
    return container;
  },

  compose(this: LogicOp, container: Blockly.Block) {
    const connections: (Blockly.Connection | null)[] = [];
    for (let item = container.getInputTargetBlock("STACK") as ItemBlock | null; item; item = item.getNextBlock() as ItemBlock | null) {
      if (!item.isInsertionMarker()) connections.push(item.valueConnection_ ?? null);
    }
    for (let i = 0; i < this.itemCount_; i++) {
      const conn = this.getInput(slot(i))?.connection?.targetConnection;
      if (conn && !connections.includes(conn)) conn.disconnect();
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    for (let i = 0; i < this.itemCount_; i++) connections[i]?.reconnect(this, slot(i));
  },

  saveConnections(this: LogicOp, container: Blockly.Block) {
    let i = 0;
    for (let item = container.getInputTargetBlock("STACK") as ItemBlock | null; item; item = item.getNextBlock() as ItemBlock | null) {
      if (item.isInsertionMarker()) continue;
      item.valueConnection_ = this.getInput(slot(i))?.connection?.targetConnection ?? null;
      i++;
    }
  },

  updateShape_(this: LogicOp) {
    const op = this.getFieldValue("OP") || "AND";
    this.removeInput("EMPTY", true);
    for (let i = 0; i < this.itemCount_; i++) {
      if (this.getInput(slot(i))) continue;
      const input = this.appendValueInput(slot(i)).setCheck("Boolean").setAlign(Blockly.inputs.Align.RIGHT);
      if (i === 0) input.appendField(opField(), "OP");
    }
    for (let i = this.itemCount_; this.getInput(slot(i)); i++) this.removeInput(slot(i));
    if (this.itemCount_ === 0) this.appendDummyInput("EMPTY").appendField(opField(), "OP");
    this.getField("OP")?.setValue(op);
  },
};

javascriptGenerator.forBlock["logic_operation"] = (block, gen) => {
  const op = block.getFieldValue("OP") === "AND" ? "&&" : "||";
  const order = op === "&&" ? Order.LOGICAL_AND : Order.LOGICAL_OR;
  const parts: string[] = [];
  for (let i = 0; block.getInput(slot(i)); i++) {
    const code = gen.valueToCode(block, slot(i), order);
    if (code) parts.push(code);
  }
  if (!parts.length) return ["false", Order.ATOMIC];
  if (parts.length === 1) return [parts[0], order];
  return [parts.join(` ${op} `), order];
};

define([
  {
    json: {
      type: "logic_between",
      message0: "is %1 between %2 and %3",
      args0: [
        { type: "input_value", name: "VALUE", check: "Number" },
        { type: "input_value", name: "LOW", check: "Number" },
        { type: "input_value", name: "HIGH", check: "Number" },
      ],
      inputsInline: true,
      output: "Boolean",
      style: "logic_blocks",
      tooltip: "True if the value is inside the two bounds, inclusive either order.",
    },
    js: (b, g) => {
      const fn = g.provideFunction_("logicBetween", [
        `function ${g.FUNCTION_NAME_PLACEHOLDER_}(n, a, b) {`,
        "  return n >= Math.min(a, b) && n <= Math.max(a, b);",
        "}",
      ]);
      return [
        `${fn}(${val(b, g, "VALUE", "0")}, ${val(b, g, "LOW", "0")}, ${val(b, g, "HIGH", "0")})`,
        Order.FUNCTION_CALL,
      ];
    },
  },
]);

