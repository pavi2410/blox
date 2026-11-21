import { For, Show, createStore } from "solid-js";
import type { Insp } from "@blox/runtime";
import { Icon } from "./icon";

const summary = (v: Insp) => (v.kind === "prim" ? v.text : v.kind === "list" ? `list(${v.length})` : `dict(${v.size})`);

const kids = (v: Insp): [string, Insp][] =>
  v.kind === "list" ? v.items.map((item, i) => [String(i), item]) : v.kind === "dict" ? v.entries : [];

export function VarList(props: { vars: Record<string, Insp> }) {
  const [open, setOpen] = createStore<Record<string, boolean>>({});
  const shown = (path: string) => open[path] ?? false;
  const toggle = (path: string) => setOpen((s) => { s[path] = !s[path]; });

  return (
    <div class="insp">
      <For each={Object.keys(props.vars)} fallback={<span class="muted">Variables appear while running in Debug mode</span>}>
        {(name) => <Row name={name} value={props.vars[name]!} path={name} shown={shown} toggle={toggle} />}
      </For>
    </div>
  );
}

function Row(props: {
  name: string;
  value: Insp;
  path: string;
  shown: (path: string) => boolean;
  toggle: (path: string) => void;
}) {
  const nest = () => kids(props.value);
  const branch = () => nest().length > 0;
  const prim = () => (props.value.kind === "prim" ? props.value : undefined);

  return (
    <div>
      <div class="insp-row">
        <Show when={branch()} fallback={<span class="insp-twist" />}>
          <button class="insp-twist" aria-label="Toggle" onClick={() => props.toggle(props.path)}>
            <Icon name={props.shown(props.path) ? "chevronDown" : "chevronRight"} size={12} />
          </button>
        </Show>
        <span class="insp-key">{props.name}</span>
        <Show when={prim()} fallback={<span class="insp-sum">{summary(props.value)}</span>}>
          {(p) => <span class={`insp-prim ${p().cls ?? ""}`}>{p().text}</span>}
        </Show>
      </div>
      <Show when={branch() && props.shown(props.path)}>
        <div class="insp-kids">
          <For each={nest()}>
            {([k, v]) => <Row name={k} value={v} path={`${props.path}.${k}`} shown={props.shown} toggle={props.toggle} />}
          </For>
        </div>
      </Show>
    </div>
  );
}
