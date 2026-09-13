import { For, Switch, Match, createSignal } from "solid-js";
import { clearLogs, vars } from "../state/runner";
import { code } from "../state/workspace";
import { Console } from "./console";

type Tab = "console" | "code" | "vars";

export function Output() {
  const [tab, setTab] = createSignal<Tab>("console");
  const tabs: [Tab, string][] = [
    ["console", "Console"],
    ["code", "Code"],
    ["vars", "Variables"],
  ];

  return (
    <div class="output">
      <nav class="tabs">
        <For each={tabs}>
          {([id, label]) => (
            <button class={{ active: tab() === id }} onClick={() => setTab(id)}>
              {label}
            </button>
          )}
        </For>
        <span class="spacer" />
        <button onClick={clearLogs}>Clear</button>
      </nav>
      <Switch>
        <Match when={tab() === "console"}><Console /></Match>
        <Match when={tab() === "code"}>
          <pre class="panel">{code() || "// Drag blocks into the workspace"}</pre>
        </Match>
        <Match when={tab() === "vars"}>
          <div class="panel">
            <For each={Object.entries(vars)} fallback={<span class="muted">Variables appear while running in Debug mode</span>}>
              {([name, value]) => (
                <div class="var">
                  <span class="name">{name}</span>
                  <span class="value">{value}</span>
                </div>
              )}
            </For>
          </div>
        </Match>
      </Switch>
    </div>
  );
}
