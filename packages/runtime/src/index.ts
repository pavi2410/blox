import type { RuntimeCommand, RuntimeEvent } from "./messages";

export type { RuntimeEvent };

/** Runs generated JS in a disposable Web Worker. One program at a time. */
export class Runtime {
  #worker: Worker | null = null;

  constructor(private onEvent: (e: RuntimeEvent) => void) {}

  get running() {
    return this.#worker !== null;
  }

  run(code: string) {
    this.stop();
    const w = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
    w.onmessage = ({ data }: MessageEvent<RuntimeEvent>) => {
      this.onEvent(data);
      if (data.type === "done") this.stop();
    };
    w.onerror = (e) => {
      this.onEvent({ type: "log", level: "error", text: e.message });
      this.onEvent({ type: "done", ok: false });
      this.stop();
    };
    this.#worker = w;
    w.postMessage({ type: "run", code } satisfies RuntimeCommand);
  }

  stop() {
    this.#worker?.terminate();
    this.#worker = null;
  }
}
