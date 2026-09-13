import { generate } from "@blox/blocks";
import { Runtime, type RuntimeEvent } from "@blox/runtime";
import * as Blockly from "blockly/core";
import { createSignal, createStore } from "solid-js";

export interface LogLine {
  level: "info" | "error";
  text: string;
}

const STORAGE_KEY = "blox.workspace";

let ws: Blockly.WorkspaceSvg | null = null;

export const [code, setCode] = createSignal("");
export const [running, setRunning] = createSignal(false);
export const [logs, setLogs] = createStore<LogLine[]>([]);

const runtime = new Runtime((e: RuntimeEvent) => {
  switch (e.type) {
    case "log":
      setLogs((l) => {
        l.push({ level: e.level, text: e.text });
      });
      break;
    case "highlight":
      ws?.highlightBlock(e.id);
      break;
    case "done":
      setRunning(false);
      break;
  }
});

export const loadSaved = (): object | undefined => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : undefined;
};

export const onWorkspaceReady = (w: Blockly.WorkspaceSvg) => {
  ws = w;
  setCode(generate(w));
};

export const onWorkspaceChange = (w: Blockly.WorkspaceSvg) => {
  setCode(generate(w));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Blockly.serialization.workspaces.save(w)));
};

export const run = () => {
  if (!ws) return;
  setLogs(() => []);
  setRunning(true);
  runtime.run(generate(ws, true));
};

export const stop = () => {
  runtime.stop();
  ws?.highlightBlock(null);
  setRunning(false);
};

export const clearLogs = () => setLogs(() => []);

export const clearWorkspace = () => {
  ws?.clear();
  localStorage.removeItem(STORAGE_KEY);
};
