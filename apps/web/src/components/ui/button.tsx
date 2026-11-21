import type { JSX } from "@solidjs/web";
import { Show } from "solid-js";
import { Icon, type IconName } from "./icon";

type Variant = "primary" | "danger" | "ghost";

type Common = {
  onClick?: (e: MouseEvent) => void;
  disabled?: boolean;
  title?: string;
  type?: "button" | "submit";
  ref?: (el: HTMLButtonElement) => void;
  class?: string;
};

const cls = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ") || undefined;

/** Text button with an optional leading icon. */
export function Button(props: Common & { icon?: IconName; variant?: Variant; children: JSX.Element }) {
  return (
    <button
      ref={props.ref}
      type={props.type ?? "button"}
      class={cls(props.variant, props.class)}
      onClick={(e) => props.onClick?.(e)}
      disabled={props.disabled}
      title={props.title}
    >
      <Show when={props.icon}>{(name) => <Icon name={name()} />}</Show>
      {props.children}
    </button>
  );
}

/** Icon-only button; `label` names it for tooltips and screen readers. */
export function IconButton(props: Common & { icon: IconName; label: string; variant?: Variant; size?: number }) {
  return (
    <button
      ref={props.ref}
      type={props.type ?? "button"}
      class={cls("icon", props.variant, props.class)}
      onClick={(e) => props.onClick?.(e)}
      disabled={props.disabled}
      title={props.title ?? props.label}
      aria-label={props.label}
    >
      <Icon name={props.icon} size={props.size} />
    </button>
  );
}
