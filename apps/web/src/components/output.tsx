import { For, Match, Show, Switch, createSignal } from "solid-js";
import { clearLogs, vars } from "../state/runner";
import { code } from "../state/workspace";
import { Button } from "./button";
import { Console } from "./console";
import { VarList } from "./inspect";

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
        <Show when={tab() === "console"}>
          <Button variant="ghost" onClick={clearLogs}>
            Clear
          </Button>
        </Show>
      </nav>
      <Switch>
        <Match when={tab() === "console"}><Console /></Match>
        <Match when={tab() === "code"}>
          <pre class="panel">{code() || "// Drag blocks into the workspace"}</pre>
        </Match>
        <Match when={tab() === "vars"}>
          <div class="panel">
            <VarList vars={vars} />
          </div>
        </Match>
      </Switch>
    </div>
  );
}
