import type { JSX } from "@solidjs/web";

/** Scrollable, monospace content area that fills the remaining height. */
export function Panel(props: { ref?: (el: HTMLDivElement) => void; children: JSX.Element }) {
  return (
    <div ref={props.ref} class="panel">
      {props.children}
    </div>
  );
}
