import type { JSX } from "@solidjs/web";

/** Horizontal bar of controls (app header, tab strips). */
export function Toolbar(props: { class?: string; children: JSX.Element }) {
  return <header class={props.class ? `toolbar ${props.class}` : "toolbar"}>{props.children}</header>;
}

/** Tight cluster of related buttons. */
export function ButtonGroup(props: { label?: string; children: JSX.Element }) {
  return (
    <div class="btn-group" role="group" aria-label={props.label}>
      {props.children}
    </div>
  );
}

/** Thin vertical rule between groups. */
export function Separator() {
  return <span class="separator" role="separator" aria-orientation="vertical" />;
}

/** Pushes what follows to the far end. */
export function Spacer() {
  return <span class="spacer" />;
}
