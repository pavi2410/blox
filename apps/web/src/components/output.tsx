import { For, createSignal } from "solid-js";
import { clearLogs, code, logs } from "../state/editor";

export function Output() {
  const [tab, setTab] = createSignal<"console" | "code">("console");

  return (
    <aside class="output">
      <nav class="tabs">
        <button class={{ active: tab() === "console" }} onClick={() => setTab("console")}>
          Console
        </button>
        <button class={{ active: tab() === "code" }} onClick={() => setTab("code")}>
          Code
        </button>
        <span class="spacer" />
        <button onClick={clearLogs}>Clear</button>
      </nav>
      <pre class="panel">
        {tab() === "code" ? (
          code() || "// Drag blocks into the workspace"
        ) : (
          <For each={logs} fallback={<span class="muted">Press Run to see output</span>}>
            {(line) => <div class={line.level}>{line.text}</div>}
          </For>
        )}
      </pre>
    </aside>
  );
}
