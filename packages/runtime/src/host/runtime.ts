import type { HostToWorker, RunOptions, WorkerToHost } from "../messages";
import { services, type RpcHandlers } from "./services";
import { Stage } from "./stage";
import { Ui } from "./ui";

export interface RuntimeOptions {
  /** Element that hosts the stage canvases and receives input. */
  stage: HTMLElement;
  /** Overlay on the stage for `show UI`. */
  ui: HTMLElement;
  onEvent: (e: WorkerToHost) => void;
  /** Extra / overriding RPC handlers (e.g. `ask`, `clearConsole`). */
  rpc?: RpcHandlers;
}

/** Runs generated programs in a disposable Web Worker, one at a time. */
export class Runtime {
  #worker: Worker | null = null;
  #stage: Stage;
  #ui: Ui;
  #rpc: RpcHandlers;
  #onEvent: (e: WorkerToHost) => void;

  constructor(opts: RuntimeOptions) {
    this.#onEvent = opts.onEvent;
    this.#stage = new Stage(opts.stage, (m) => this.#send(m));
    this.#ui = new Ui(opts.ui, (m) => this.#send(m));
    this.#rpc = {
      ...services,
      showUi: (tree: unknown) => this.#ui.show(tree),
      uiInput: (id: string) => this.#ui.input(id),
      ...opts.rpc,
    };
  }

  get running() {
    return this.#worker !== null;
  }

  run(code: string, opts: RunOptions) {
    this.stop();
    const w = new Worker(new URL("../worker/main.ts", import.meta.url), { type: "module" });
    w.onmessage = ({ data }: MessageEvent<WorkerToHost>) => {
      if (data.type === "rpc") return void this.#handleRpc(w, data);
      this.#onEvent(data);
      if (data.type === "done") {
        // give pending OffscreenCanvas frames a chance to land before killing the worker
        this.#worker = null;
        setTimeout(() => w.terminate(), 100);
      }
    };
    w.onerror = (e) => {
      this.#onEvent({ type: "log", level: "error", text: e.message });
      this.#onEvent({ type: "highlight", id: null });
      this.#onEvent({ type: "done", ok: false });
      this.stop();
    };
    this.#worker = w;
    const canvases = this.#stage.fresh();
    w.postMessage({ type: "run", code, canvases, ...opts } satisfies HostToWorker, [canvases.paint, canvases.sprite]);
    this.#stage.focus();
  }

  stop() {
    this.#ui.clear();
    this.#worker?.terminate();
    this.#worker = null;
  }

  pause = () => this.#send({ type: "pause" });
  resume = () => this.#send({ type: "resume" });
  step = () => this.#send({ type: "step" });
  setSpeed = (ms: number) => this.#send({ type: "speed", ms });
  setBreakpoints = (ids: string[]) => this.#send({ type: "breakpoints", ids });

  #send(m: HostToWorker) {
    this.#worker?.postMessage(m);
  }

  async #handleRpc(w: Worker, m: Extract<WorkerToHost, { type: "rpc" }>) {
    const reply = (r: Omit<Extract<HostToWorker, { type: "rpcResult" }>, "type" | "id">) => {
      if (this.#worker === w) w.postMessage({ type: "rpcResult", id: m.id, ...r } satisfies HostToWorker);
    };
    const fn = this.#rpc[m.method];
    if (!fn) return reply({ error: `Unknown host function: ${m.method}` });
    try {
      reply({ value: (await (fn as (...a: unknown[]) => unknown)(...m.args)) ?? null });
    } catch (e) {
      reply({ error: e instanceof Error ? e.message : String(e) });
    }
  }
}
