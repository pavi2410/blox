/// <reference lib="webworker" />
import type { HostToWorker } from "../messages";
import { api } from "./api";
import { initCanvas } from "./api/canvas";
import { resetTurtle } from "./api/turtle";
import { log, post, resolveRpc } from "./bridge";
import { pause, resume, setBreakpoints, setDebug, setSpeed, step } from "./control";
import { nextFrame, onKey, onPointer, runEvents } from "./events";

const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor as FunctionConstructor;

let finished = false;
const finish = async (ok: boolean, err?: unknown) => {
  if (finished) return;
  finished = true;
  if (err !== undefined) log(err instanceof Error ? err.message : String(err), "error");
  post({ type: "highlight", id: null });
  await nextFrame(); // let the last canvas frame commit before the host terminates us
  post({ type: "done", ok });
};

async function run(m: Extract<HostToWorker, { type: "run" }>) {
  setDebug(m.debug);
  setSpeed(m.speed);
  setBreakpoints(m.breakpoints);
  initCanvas(m.canvases);
  resetTurtle();
  try {
    const main = new AsyncFunction(...Object.keys(api), m.code);
    await main(...Object.values(api));
    await runEvents((e) => finish(false, e));
    finish(true);
  } catch (e) {
    finish(false, e);
  }
}

self.onmessage = ({ data: m }: MessageEvent<HostToWorker>) => {
  switch (m.type) {
    case "run":
      return void run(m);
    case "pause":
      return pause();
    case "resume":
      return resume();
    case "step":
      return step();
    case "speed":
      return setSpeed(m.ms);
    case "breakpoints":
      return setBreakpoints(m.ids);
    case "key":
      return onKey(m.key, m.down);
    case "pointer":
      return onPointer(m.x, m.y, m.down, m.click);
    case "rpcResult":
      return resolveRpc(m);
  }
};
