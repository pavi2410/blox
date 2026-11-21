import type { JSX } from "@solidjs/web";
import { createSignal } from "solid-js";

const read = (key: string | undefined) => {
  if (!key) return NaN;
  try {
    return Number(localStorage.getItem(key));
  } catch {
    return NaN;
  }
};

/**
 * Two columns with a draggable divider. The end column has the fixed width
 * (clamped to min..max, remembered under `storageKey`); the start column fills the rest.
 */
export function SplitPane(props: {
  start: JSX.Element;
  end: JSX.Element;
  initial: number;
  min: number;
  max: number;
  storageKey?: string;
  class?: string;
}) {
  const clamp = (n: number) => Math.min(props.max, Math.max(props.min, n));
  const [size, setSize] = createSignal(clamp(read(props.storageKey) || props.initial));

  const resize = (n: number) => {
    setSize(n);
    if (!props.storageKey) return;
    try {
      localStorage.setItem(props.storageKey, String(n));
    } catch {
      // storage unavailable; the width just won't persist
    }
  };

  const down = (e: PointerEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    const startX = e.clientX;
    const start = size();
    const move = (ev: PointerEvent) => resize(Math.round(clamp(start - (ev.clientX - startX))));
    const up = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
  };

  const key = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 40 : 10;
    if (e.key === "ArrowLeft") resize(clamp(size() + step));
    else if (e.key === "ArrowRight") resize(clamp(size() - step));
    else return;
    e.preventDefault();
  };

  return (
    <main class={props.class ? `split ${props.class}` : "split"} style={{ "grid-template-columns": `1fr 6px ${size()}px` }}>
      {props.start}
      <div
        class="splitter"
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={size()}
        aria-valuemin={props.min}
        aria-valuemax={props.max}
        tabindex="0"
        title="Drag to resize"
        onPointerDown={down}
        onKeyDown={key}
      />
      {props.end}
    </main>
  );
}
