import { Show } from "solid-js";
import { examples } from "../examples";
import { changeSpeed, pause, paused, resume, run, running, speed, step, stop } from "../state/runner";
import { clearWorkspace, exportJson, importJson, loadState } from "../state/workspace";

export function Toolbar() {
  return (
    <header class="toolbar">
      <span class="brand">Blox</span>

      <Show when={running()} fallback={<button class="primary" onClick={run}>▶ Run</button>}>
        <button class="danger" onClick={stop}>■ Stop</button>
        <Show when={paused()} fallback={<button onClick={pause}>❚❚ Pause</button>}>
          <button class="primary" onClick={resume}>▶ Resume</button>
        </Show>
        <button onClick={step} title="Run one block, then pause">⤼ Step</button>
      </Show>

      <label class="speed" title="Delay per block">
        <span>Speed</span>
        <input
          type="range"
          min="0"
          max="500"
          step="10"
          value={500 - speed()}
          onInput={(e) => changeSpeed(500 - Number(e.currentTarget.value))}
        />
      </label>

      <span class="spacer" />

      <select
        value=""
        onChange={(e) => {
          const ex = examples[Number(e.currentTarget.value)];
          if (ex && confirm(`Load "${ex.name}"? This replaces the current workspace.`)) loadState(ex.state);
          e.currentTarget.value = "";
        }}
      >
        <option value="" disabled>Examples…</option>
        {examples.map((ex, i) => <option value={i}>{ex.name}</option>)}
      </select>
      <button onClick={importJson}>Import</button>
      <button onClick={exportJson}>Export</button>
      <button onClick={() => confirm("Clear workspace?") && clearWorkspace()}>Clear</button>
    </header>
  );
}
