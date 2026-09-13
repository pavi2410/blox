import type { Canvases, HostToWorker } from "../messages";

export const STAGE = { width: 480, height: 360 };

const KEY_ALIASES: Record<string, string> = { " ": "space" };
export const normalizeKey = (k: string) => KEY_ALIASES[k] ?? k.toLowerCase();

/**
 * Owns the stage DOM: two stacked canvases (paint + turtle sprite) that are
 * re-created and transferred to the worker on every run, plus input capture.
 */
export class Stage {
  #el: HTMLElement;
  #send: (m: HostToWorker) => void;

  constructor(el: HTMLElement, send: (m: HostToWorker) => void) {
    this.#el = el;
    this.#send = send;
    el.tabIndex = 0;
    el.style.position = "relative";
    el.style.aspectRatio = `${STAGE.width} / ${STAGE.height}`;
    el.style.outline = "none";

    const pos = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return { x: ((e.clientX - r.left) * STAGE.width) / r.width, y: ((e.clientY - r.top) * STAGE.height) / r.height };
    };
    const pointer = (down: boolean, click = false) => (e: PointerEvent) =>
      this.#send({ type: "pointer", ...pos(e), down, click });

    el.addEventListener("pointermove", (e) => this.#send({ type: "pointer", ...pos(e), down: e.buttons > 0, click: false }));
    el.addEventListener("pointerdown", (e) => {
      el.focus();
      pointer(true, true)(e);
    });
    el.addEventListener("pointerup", pointer(false));
    el.addEventListener("pointerleave", pointer(false));
    el.addEventListener("keydown", (e) => {
      if (e.repeat) return;
      e.preventDefault();
      this.#send({ type: "key", key: normalizeKey(e.key), down: true });
    });
    el.addEventListener("keyup", (e) => this.#send({ type: "key", key: normalizeKey(e.key), down: false }));
  }

  /** Fresh canvases for a new run (OffscreenCanvas can only be transferred once). */
  fresh(): Canvases {
    const make = (z: number) => {
      const c = document.createElement("canvas");
      c.width = STAGE.width;
      c.height = STAGE.height;
      Object.assign(c.style, { position: "absolute", inset: "0", width: "100%", height: "100%", zIndex: String(z) });
      return c;
    };
    const paint = make(0);
    const sprite = make(1);
    this.#el.replaceChildren(paint, sprite);
    return { paint: paint.transferControlToOffscreen(), sprite: sprite.transferControlToOffscreen() };
  }

  focus() {
    this.#el.focus({ preventScroll: true });
  }
}
