import { generate } from "@blox/blocks";
import * as Blockly from "blockly/core";
import { createSignal } from "solid-js";
import { clearBreakpoints } from "./breakpoints";

const KEY = "blox.workspace";

export let ws: Blockly.WorkspaceSvg | null = null;
export const [code, setCode] = createSignal("");
export const [canUndo, setCanUndo] = createSignal(false);
export const [canRedo, setCanRedo] = createSignal(false);

const sync = (w: Blockly.WorkspaceSvg) => {
  setCode(generate(w));
  setCanUndo(w.getUndoStack().length > 0);
  setCanRedo(w.getRedoStack().length > 0);
};

const save = (w: Blockly.WorkspaceSvg) =>
  localStorage.setItem(KEY, JSON.stringify(Blockly.serialization.workspaces.save(w)));

export const undo = () => ws?.undo(false);
export const redo = () => ws?.undo(true);

export const loadSaved = (): object | undefined => {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : undefined;
};

export const onReady = (w: Blockly.WorkspaceSvg) => {
  ws = w;
  sync(w);
};

export const onChange = (w: Blockly.WorkspaceSvg) => {
  sync(w);
  save(w);
};

export const loadState = (state: object) => {
  if (!ws) return;
  clearBreakpoints();
  Blockly.serialization.workspaces.load(state, ws);
  save(ws);
};

export const clearWorkspace = () => {
  clearBreakpoints();
  ws?.clear();
  localStorage.removeItem(KEY);
};

export const exportJson = () => {
  if (!ws) return;
  const blob = new Blob([JSON.stringify(Blockly.serialization.workspaces.save(ws), null, 2)], {
    type: "application/json",
  });
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(blob),
    download: "blox-program.json",
  });
  a.click();
  URL.revokeObjectURL(a.href);
};

export const importJson = () => {
  const input = Object.assign(document.createElement("input"), { type: "file", accept: ".json,application/json" });
  input.onchange = async () => {
    const file = input.files?.[0];
    if (file) loadState(JSON.parse(await file.text()));
  };
  input.click();
};
