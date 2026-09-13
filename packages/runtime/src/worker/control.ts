import { fmt, post, sleep, yieldNow } from "./bridge";

let speed = 0;
let paused = false;
let announced = false; // "paused" event sent to host for the current pause
let stepping = false;
let breakpoints = new Set<string>();
let resumeWaiters: (() => void)[] = [];
let varsGetter: (() => Record<string, unknown>) | null = null;

let lastYield = 0;
let lastHighlight = 0;
let lastVars = 0;

export const setSpeed = (ms: number) => (speed = ms);
export const setBreakpoints = (ids: string[]) => (breakpoints = new Set(ids));
export const setVarsGetter = (fn: () => Record<string, unknown>) => (varsGetter = fn);

export const pause = () => (paused = true);

export function resume() {
  paused = false;
  announced = false;
  post({ type: "resumed" });
  resumeWaiters.splice(0).forEach((r) => r());
}

export function step() {
  stepping = true;
  resume();
}

function postVars(force = false) {
  const now = performance.now();
  if (!varsGetter || (!force && now - lastVars < 200)) return;
  lastVars = now;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(varsGetter())) out[k] = fmt(v);
  post({ type: "vars", vars: out });
}

async function block(id: string | null) {
  if (!announced) {
    announced = true;
    post({ type: "paused", id });
  }
  postVars(true);
  await new Promise<void>((r) => resumeWaiters.push(r));
}

/** Cooperative scheduling point, injected before every statement and loop iteration. */
export async function tick(id?: string) {
  const now = performance.now();

  if (id !== undefined) {
    if (stepping || breakpoints.has(id)) {
      stepping = false;
      paused = true;
    }
    if (paused || speed > 0 || now - lastHighlight > 16) {
      lastHighlight = now;
      post({ type: "highlight", id });
    }
  }

  if (paused) await block(id ?? null);
  else if (speed > 0) await sleep(speed);
  else if (now - lastYield > 16) {
    lastYield = now;
    await yieldNow();
  }
  postVars();
}

/** Block while paused, otherwise yield once. */
export async function idle() {
  if (paused) await block(null);
  else await yieldNow();
}

/** Sleep in small slices so pause/step stay responsive. */
export async function wait(ms: number) {
  const end = performance.now() + ms;
  for (;;) {
    await idle();
    const left = end - performance.now();
    if (left <= 0) return;
    await sleep(Math.min(16, left));
  }
}
