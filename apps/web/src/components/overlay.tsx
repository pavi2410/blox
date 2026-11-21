import type { JSX } from "@solidjs/web";
import { onSettled } from "solid-js";

/** Listen on `window` for the component's lifetime. */
export function useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  fn: (e: WindowEventMap[K]) => void,
  opts?: AddEventListenerOptions,
) {
  onSettled(() => {
    window.addEventListener(type, fn, opts);
    return () => window.removeEventListener(type, fn, opts);
  });
}

// Open overlays, oldest first. Escape closes only the topmost, so a dialog
// over a modal doesn't take the modal down with it.
const stack: (() => void)[] = [];
window.addEventListener(
  "keydown",
  (e) => {
    if (e.key !== "Escape" || !stack.length) return;
    e.stopPropagation();
    stack[stack.length - 1]();
  },
  true,
);

/** Dimmed full-screen backdrop; closes on Escape (topmost only) or a click outside its content. */
export function Overlay(props: { onClose: () => void; children: JSX.Element }) {
  onSettled(() => {
    const close = () => props.onClose();
    stack.push(close);
    return () => {
      const i = stack.lastIndexOf(close);
      if (i >= 0) stack.splice(i, 1);
    };
  });

  return (
    <div
      class="modal-back"
      onClick={(e) => {
        if (e.target === e.currentTarget) props.onClose();
      }}
    >
      {props.children}
    </div>
  );
}
