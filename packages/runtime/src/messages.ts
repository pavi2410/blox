export interface RunOptions {
  /** Debug mode: block highlighting, pause/step, breakpoints, variable snapshots, speed delay. */
  debug: boolean;
  speed: number; // ms delay per tick, 0 = full speed
  breakpoints: string[];
}

export interface Canvases {
  paint: OffscreenCanvas;
  sprite: OffscreenCanvas;
}

export type HostToWorker =
  | ({ type: "run"; code: string; canvases: Canvases } & RunOptions)
  | { type: "pause" }
  | { type: "resume" }
  | { type: "step" }
  | { type: "speed"; ms: number }
  | { type: "breakpoints"; ids: string[] }
  | { type: "key"; key: string; down: boolean }
  | { type: "pointer"; x: number; y: number; down: boolean; click: boolean }
  | { type: "rpcResult"; id: number; value?: unknown; error?: string };

export type WorkerToHost =
  | { type: "log"; level: "info" | "error"; text: string }
  | { type: "highlight"; id: string | null }
  | { type: "paused"; id: string | null }
  | { type: "resumed" }
  | { type: "vars"; vars: Record<string, string> }
  | { type: "rpc"; id: number; method: string; args: unknown[] }
  | { type: "done"; ok: boolean };

export type RuntimeEvent = WorkerToHost;
