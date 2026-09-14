import type { HostToWorker } from "../messages";

type Node = Record<string, unknown>;

const kids = (v: unknown): unknown[] => (Array.isArray(v) ? v : v == null ? [] : [v]);
const text = (v: unknown) => (v == null ? "" : String(v));

/** Host DOM for `show UI`. Inputs with an id are reused across shows. */
export class Ui {
  #el: HTMLElement;
  #send: (m: HostToWorker) => void;
  #inputs = new Map<string, HTMLInputElement>();

  constructor(el: HTMLElement, send: (m: HostToWorker) => void) {
    this.#el = el;
    this.#send = send;
  }

  clear() {
    this.#inputs.clear();
    this.#el.replaceChildren();
    this.#el.hidden = true;
  }

  show(tree: unknown) {
    const prev = this.#inputs;
    this.#inputs = new Map();
    const node = this.#render(tree, prev);
    this.#el.replaceChildren();
    if (!node) {
      this.#el.hidden = true;
      return;
    }
    this.#el.append(node);
    this.#el.hidden = false;
  }

  input(id: string) {
    return this.#inputs.get(id)?.value ?? "";
  }

  #render(raw: unknown, prev: Map<string, HTMLInputElement>): HTMLElement | null {
    if (raw == null || typeof raw !== "object") return null;
    const n = raw as Node;
    switch (n.t) {
      case "col":
      case "row": {
        const el = document.createElement("div");
        el.className = n.t === "col" ? "ui-col" : "ui-row";
        for (const k of kids(n.kids)) {
          const child = this.#render(k, prev);
          if (child) el.append(child);
        }
        return el;
      }
      case "label": {
        const el = document.createElement("div");
        el.className = "ui-label";
        el.textContent = text(n.text);
        return el;
      }
      case "btn": {
        const el = document.createElement("button");
        el.type = "button";
        el.textContent = text(n.text);
        el.addEventListener("click", () => this.#send({ type: "ui", msg: n.msg }));
        return el;
      }
      case "input": {
        const id = text(n.id);
        let el = id ? prev.get(id) : undefined;
        if (el) prev.delete(id);
        else {
          el = document.createElement("input");
          el.type = "text";
          el.autocomplete = "off";
        }
        if (id) this.#inputs.set(id, el);
        return el;
      }
      default:
        return null;
    }
  }
}
