import { generate } from "@blox/blocks";
import { Runtime, type RuntimeEvent } from "@blox/runtime";
import { createSignal, createStore } from "solid-js";
import { breakpointIds, onBreakpointsChange } from "./breakpoints";
import { ws } from "./workspace";

export interface LogLine {
  level: "info" | "error";
  text: string;
}
export interface Ask {
  prompt: string;
  resolve: (answer: string) => void;
}

export type Mode = "idle" | "run" | "debug";

export const [mode, setMode] = createSignal<Mode>("idle");
export const running = () => mode() !== "idle";
export const debugging = () => mode() === "debug";
export const [paused, setPaused] = createSignal(false);
export const [speed, setSpeed] = createSignal(0);
export const [ask, setAsk] = createSignal<Ask | null>(null);
export const [logs, setLogs] = createStore<LogLine[]>([]);
export const [vars, setVars] = createStore<Record<string, string>>({});

let runtime: Runtime | null = null;

const onEvent = (e: RuntimeEvent) => {
  switch (e.type) {
    case "log":
      return setLogs((l) => void l.push({ level: e.level, text: e.text }));
    case "highlight":
      return ws?.highlightBlock(e.id);
    case "paused":
      return setPaused(true);
    case "resumed":
      return setPaused(false);
    case "vars":
      return setVars(() => e.vars);
    case "done":
      setMode("idle");
      setPaused(false);
      setAsk(null);
  }
};

/** Call once the stage element exists. */
export function initRuntime(stage: HTMLElement) {
  runtime = new Runtime({
    stage,
    onEvent,
    rpc: {
      ask: (prompt: string) => new Promise<string>((resolve) => setAsk({ prompt, resolve })),
      clearConsole: () => setLogs(() => []),
    },
  });
  onBreakpointsChange((ids) => runtime?.setBreakpoints(ids));
}

const start = (debug: boolean) => {
  if (!ws || !runtime) return;
  setLogs(() => []);
  setVars(() => ({}));
  setMode(debug ? "debug" : "run");
  setPaused(false);
  runtime.run(generate(ws, debug ? "debug" : "run"), { debug, speed: speed(), breakpoints: breakpointIds() });
};

export const run = () => start(false);
export const debug = () => start(true);

export const stop = () => {
  runtime?.stop();
  ws?.highlightBlock(null);
  setMode("idle");
  setPaused(false);
  setAsk(null);
};

export const pause = () => runtime?.pause();
export const resume = () => runtime?.resume();
export const step = () => runtime?.step();

export const changeSpeed = (ms: number) => {
  setSpeed(ms);
  runtime?.setSpeed(ms);
};

export const answer = (text: string) => {
  ask()?.resolve(text);
  setAsk(null);
  setLogs((l) => void l.push({ level: "info", text: `> ${text}` }));
};

export const clearLogs = () => setLogs(() => []);
