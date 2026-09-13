/// <reference lib="webworker" />
import type { RuntimeCommand, RuntimeEvent } from "./messages";

const post = (e: RuntimeEvent) => self.postMessage(e);

const fmt = (v: unknown) =>
  typeof v === "string" ? v : typeof v === "object" ? JSON.stringify(v) : String(v);

let lastHighlight = 0;

const api = {
  print: (...args: unknown[]) => post({ type: "log", level: "info", text: args.map(fmt).join(" ") }),
  highlightBlock: (id: string) => {
    const now = performance.now();
    if (now - lastHighlight < 16) return; // throttle hot loops
    lastHighlight = now;
    post({ type: "highlight", id });
  },
};

self.onmessage = ({ data }: MessageEvent<RuntimeCommand>) => {
  if (data.type !== "run") return;
  try {
    new Function(...Object.keys(api), data.code)(...Object.values(api));
    post({ type: "highlight", id: null });
    post({ type: "done", ok: true });
  } catch (err) {
    post({ type: "log", level: "error", text: err instanceof Error ? err.message : String(err) });
    post({ type: "done", ok: false });
  }
};
