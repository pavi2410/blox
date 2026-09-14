import { log, sleep } from "./bridge";
import { idle } from "./control";

type Handler = (payload?: unknown) => Promise<void>;
type Kind = "start" | "key" | "click" | "frame" | "interval" | "ui";

const handlers: Record<Kind, { fn: Handler; arg?: unknown }[]> = {
  start: [],
  key: [],
  click: [],
  frame: [],
  interval: [],
  ui: [],
};

let uiOpen = false;
export const setUiOpen = (on: boolean) => {
  uiOpen = on;
};

export const keys = new Set<string>();
export const mouse = { x: 0, y: 0, down: false };

let onError: (e: unknown) => void = (e) => log(String(e), "error");
let alive = true;

export function on(kind: Kind, fn: Handler, arg?: unknown) {
  handlers[kind].push({ fn, arg });
}

const fire = (fn: Handler) => fn().catch(onError);

export function onKey(key: string, down: boolean) {
  if (down && !keys.has(key)) {
    for (const h of handlers.key) if (h.arg === "any" || h.arg === key) fire(h.fn);
  }
  down ? keys.add(key) : keys.delete(key);
}

export function onPointer(x: number, y: number, down: boolean, click: boolean) {
  mouse.x = x;
  mouse.y = y;
  mouse.down = down;
  if (click) for (const h of handlers.click) fire(h.fn);
}

export function onUi(msg: unknown) {
  for (const h of handlers.ui) fire(() => h.fn(msg));
}

export const nextFrame = () =>
  typeof requestAnimationFrame === "function"
    ? new Promise<void>((r) => requestAnimationFrame(() => r()))
    : sleep(16);

/** True if the program has reasons to stay alive after the main script ends. */
export const hasLoops = () =>
  uiOpen ||
  handlers.key.length + handlers.click.length + handlers.frame.length + handlers.interval.length + handlers.ui.length >
    0;

/** Run start handlers, then drive frame/interval loops until the worker is terminated or a handler throws. */
export async function runEvents(fail: (e: unknown) => void) {
  onError = (e) => {
    alive = false;
    fail(e);
  };

  await Promise.all(handlers.start.map((h) => h.fn()));

  for (const h of handlers.interval) {
    let busy = false;
    const ms = Math.max(1, Number(h.arg) || 1000);
    const id = setInterval(() => {
      if (!alive) return clearInterval(id);
      if (busy) return;
      busy = true;
      fire(h.fn).finally(() => (busy = false));
    }, ms);
  }

  while (alive && hasLoops()) {
    if (handlers.frame.length) await Promise.all(handlers.frame.map((h) => h.fn())).catch(onError);
    await idle();
    await nextFrame();
  }
}
