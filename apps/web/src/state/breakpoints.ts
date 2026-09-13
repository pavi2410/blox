import * as Blockly from "blockly/core";

const CLASS = "blox-bp";
const ids = new Set<string>();
let onChange: (ids: string[]) => void = () => {};

export const breakpointIds = () => [...ids];
export const onBreakpointsChange = (fn: (ids: string[]) => void) => (onChange = fn);

const mark = (block: Blockly.BlockSvg, on: boolean) =>
  block.getSvgRoot().classList.toggle(CLASS, on);

export function toggleBreakpoint(block: Blockly.BlockSvg) {
  const on = !ids.has(block.id);
  on ? ids.add(block.id) : ids.delete(block.id);
  mark(block, on);
  onChange(breakpointIds());
}

export function clearBreakpoints() {
  const w = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg | null;
  for (const id of ids) {
    const b = w?.getBlockById(id);
    if (b) mark(b, false);
  }
  ids.clear();
  onChange([]);
}

Blockly.ContextMenuRegistry.registry.register({
  id: "blox_breakpoint",
  scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
  weight: 50,
  displayText: ({ block }) => (block && ids.has(block.id) ? "Remove breakpoint" : "Add breakpoint"),
  preconditionFn: ({ block }) => (block && !block.outputConnection && !block.isInFlyout ? "enabled" : "hidden"),
  callback: ({ block }) => block && toggleBreakpoint(block),
});
