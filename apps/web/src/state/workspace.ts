import { generate } from "@blox/blocks";
import * as Blockly from "blockly/core";
import { createSignal } from "solid-js";
import { clearBreakpoints } from "./breakpoints";
import { currentState, saveCurrent } from "./projects";

export let ws: Blockly.WorkspaceSvg | null = null;
export const [code, setCode] = createSignal("");
export const [canUndo, setCanUndo] = createSignal(false);
export const [canRedo, setCanRedo] = createSignal(false);

const sync = (w: Blockly.WorkspaceSvg) => {
  setCode(generate(w));
  setCanUndo(w.getUndoStack().length > 0);
  setCanRedo(w.getRedoStack().length > 0);
};

const snapshot = (w: Blockly.WorkspaceSvg) => Blockly.serialization.workspaces.save(w);

let saveTimer = 0;
const persist = (w: Blockly.WorkspaceSvg) => {
  clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => saveCurrent(snapshot(w)), 200);
};

export const flushSave = () => {
  if (!ws) return;
  clearTimeout(saveTimer);
  saveCurrent(snapshot(ws));
};

export const undo = () => ws?.undo(false);
export const redo = () => ws?.undo(true);

export const initialState = (): object | undefined => currentState();

export const onReady = (w: Blockly.WorkspaceSvg) => {
  ws = w;
  sync(w);
};

export const onChange = (w: Blockly.WorkspaceSvg) => {
  sync(w);
  persist(w);
};

export const loadState = (state: object) => {
  if (!ws) return;
  clearBreakpoints();
  Blockly.serialization.workspaces.load(state, ws);
  saveCurrent(state);
};

export const applyProject = (state: object | undefined) => {
  if (!ws) return;
  clearBreakpoints();
  if (state && Object.keys(state).length) Blockly.serialization.workspaces.load(state, ws);
  else ws.clear();
  sync(ws);
};

export const clearWorkspace = () => {
  clearBreakpoints();
  ws?.clear();
  saveCurrent({});
};

export const workspaceState = () => (ws ? snapshot(ws) : currentState() ?? {});

export const exportJson = () => {
  const blob = new Blob([JSON.stringify(workspaceState(), null, 2)], { type: "application/json" });
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "blox-program.json" });
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
