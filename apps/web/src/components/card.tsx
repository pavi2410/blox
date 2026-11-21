import type { JSX } from "@solidjs/web";
import { Show } from "solid-js";

export function CardGrid(props: { children: JSX.Element }) {
  return <div class="gallery">{props.children}</div>;
}

/** Thumbnail card: the thumb + title open it; optional actions sit underneath. */
export function Card(props: {
  thumb: JSX.Element;
  title: string;
  meta?: string;
  current?: boolean;
  onOpen: () => void;
  actions?: JSX.Element;
}) {
  return (
    <div class={{ "gallery-card": true, current: !!props.current }}>
      <button type="button" class="gallery-open" onClick={() => props.onOpen()}>
        <div class="gallery-thumb">{props.thumb}</div>
        <span>{props.title}</span>
        <Show when={props.meta}>
          <span class="gallery-when">{props.meta}</span>
        </Show>
      </button>
      <Show when={props.actions}>
        <div class="gallery-actions">{props.actions}</div>
      </Show>
    </div>
  );
}
