import { Match, Show, Switch, createSignal } from "solid-js";
import { clearLogs, vars } from "../state/runner";
import { code } from "../state/workspace";
import { Console } from "./console";
import { VarList } from "./inspect";
import { Button } from "./ui/button";
import { Panel } from "./ui/panel";
import { Tabs, type TabItem } from "./ui/tabs";

type Tab = "console" | "code" | "vars";

const TABS: TabItem<Tab>[] = [
  { id: "console", label: "Console" },
  { id: "code", label: "Code" },
  { id: "vars", label: "Variables" },
];

export function Output() {
  const [tab, setTab] = createSignal<Tab>("console");

  return (
    <div class="output">
      <Tabs
        items={TABS}
        value={tab()}
        onChange={setTab}
        end={
          <Show when={tab() === "console"}>
            <Button variant="ghost" onClick={clearLogs}>
              Clear
            </Button>
          </Show>
        }
      />
      <Switch>
        <Match when={tab() === "console"}>
          <Console />
        </Match>
        <Match when={tab() === "code"}>
          <Panel>{code() || "// Drag blocks into the workspace"}</Panel>
        </Match>
        <Match when={tab() === "vars"}>
          <Panel>
            <VarList vars={vars} />
          </Panel>
        </Match>
      </Switch>
    </div>
  );
}
