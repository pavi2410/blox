import { For, Show, createSignal, onSettled } from "solid-js";
import { Icon } from "./icon";
import { useEscapeLayer, useWindowEvent } from "./overlay";

export type DropdownItem<T> = { value: T; label: string };

/**
 * Button that opens a single-choice menu. Arrow keys / Home / End move focus,
 * Enter or click picks, Escape or an outside click closes (focus returns to the trigger).
 */
export function Dropdown<T>(props: {
  items: readonly DropdownItem<T>[];
  value: T;
  onSelect: (value: T) => void;
  label: string;
  title?: string;
}) {
  let root!: HTMLDivElement;
  let trigger!: HTMLButtonElement;
  const [open, setOpen] = createSignal(false);
  const current = () => props.items.find((i) => i.value === props.value)?.label ?? props.label;

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) trigger.focus();
  };

  return (
    <div ref={root} class="dropdown">
      <button
        ref={trigger}
        type="button"
        class="dropdown-trigger"
        aria-haspopup="menu"
        aria-expanded={open() ? "true" : "false"}
        aria-label={`${props.label}: ${current()}`}
        title={props.title ?? props.label}
        onClick={() => void setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span>{current()}</span>
        <Icon name="chevronDown" size={14} />
      </button>
      <Show when={open()}>
        <Menu
          root={root}
          items={props.items}
          value={props.value}
          label={props.label}
          onPick={(v) => {
            props.onSelect(v);
            close();
          }}
          onClose={close}
        />
      </Show>
    </div>
  );
}

function Menu<T>(props: {
  root: HTMLElement;
  items: readonly DropdownItem<T>[];
  value: T;
  label: string;
  onPick: (value: T) => void;
  onClose: (refocus?: boolean) => void;
}) {
  let list!: HTMLDivElement;
  const buttons = () => [...list.querySelectorAll<HTMLButtonElement>("[role=menuitemradio]")];

  useEscapeLayer(() => props.onClose());
  useWindowEvent("pointerdown", (e) => {
    if (!props.root.contains(e.target as Node)) props.onClose(false);
  });

  onSettled(() => {
    const items = buttons();
    (items.find((b) => b.getAttribute("aria-checked") === "true") ?? items[0])?.focus();
  });

  const move = (e: KeyboardEvent) => {
    const items = buttons();
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    const to =
      e.key === "ArrowDown" ? (i + 1) % items.length
      : e.key === "ArrowUp" ? (i - 1 + items.length) % items.length
      : e.key === "Home" ? 0
      : e.key === "End" ? items.length - 1
      : -1;
    if (e.key === "Tab") return props.onClose(false);
    if (to < 0) return;
    e.preventDefault();
    items[to]?.focus();
  };

  return (
    <div ref={list} class="dropdown-menu" role="menu" aria-label={props.label} onKeyDown={move}>
      <For each={props.items}>
        {(item) => (
          <button
            type="button"
            role="menuitemradio"
            aria-checked={item.value === props.value ? "true" : "false"}
            tabindex="-1"
            onClick={() => props.onPick(item.value)}
          >
            <span class="dropdown-check">
              <Show when={item.value === props.value}>
                <Icon name="check" size={14} />
              </Show>
            </span>
            {item.label}
          </button>
        )}
      </For>
    </div>
  );
}
