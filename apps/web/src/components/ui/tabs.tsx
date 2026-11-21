import type { JSX } from "@solidjs/web";
import { For } from "solid-js";
import { Spacer } from "./layout";

export type TabItem<T extends string> = { id: T; label: string };

/**
 * Tab strip. The caller owns the selected id and renders the matching panel;
 * `end` holds actions shown at the far right (e.g. a per-tab Clear).
 */
export function Tabs<T extends string>(props: {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  end?: JSX.Element;
}) {
  return (
    <nav class="tabs" role="tablist">
      <For each={props.items}>
        {(item) => (
          <button
            type="button"
            role="tab"
            aria-selected={props.value === item.id ? "true" : "false"}
            class={{ active: props.value === item.id }}
            onClick={() => props.onChange(item.id)}
          >
            {item.label}
          </button>
        )}
      </For>
      <Spacer />
      {props.end}
    </nav>
  );
}
