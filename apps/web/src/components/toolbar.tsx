import { Show } from "solid-js";
import { clearWorkspace, run, running, stop } from "../state/editor";

export function Toolbar() {
  return (
    <header class="toolbar">
      <span class="brand">Blox</span>
      <Show when={running()} fallback={<button class="primary" onClick={run}>▶ Run</button>}>
        <button class="danger" onClick={stop}>■ Stop</button>
      </Show>
      <button onClick={() => confirm("Clear workspace?") && clearWorkspace()}>Clear</button>
    </header>
  );
}
