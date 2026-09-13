/// <reference lib="webworker" />
import type { HostToWorker, WorkerToHost } from "../messages";

export const post = (e: WorkerToHost) => self.postMessage(e);

export const fmt = (v: unknown): string =>
  typeof v === "string" ? v : v === undefined ? "undefined" : typeof v === "object" ? JSON.stringify(v) : String(v);

export const log = (text: string, level: "info" | "error" = "info") => post({ type: "log", level, text });

// ---- RPC to host ----
let nextId = 1;
const pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();

export function rpc<T = unknown>(method: string, ...args: unknown[]): Promise<T> {
  const id = nextId++;
  post({ type: "rpc", id, method, args });
  return new Promise<T>((resolve, reject) => pending.set(id, { resolve: resolve as (v: unknown) => void, reject }));
}

export function resolveRpc(m: Extract<HostToWorker, { type: "rpcResult" }>) {
  const p = pending.get(m.id);
  if (!p) return;
  pending.delete(m.id);
  m.error ? p.reject(new Error(m.error)) : p.resolve(m.value);
}

// ---- yield to the event loop without setTimeout clamping ----
const ch = new MessageChannel();
const yieldWaiters: (() => void)[] = [];
ch.port1.onmessage = () => yieldWaiters.splice(0).forEach((r) => r());

export const yieldNow = () =>
  new Promise<void>((r) => {
    if (yieldWaiters.push(r) === 1) ch.port2.postMessage(0);
  });

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
