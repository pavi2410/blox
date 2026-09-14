import { Show } from "solid-js";
import { examples } from "../examples";
import { changeSpeed, debug, debugging, pause, paused, resume, run, running, speed, step, stop } from "../state/runner";
import { Projects } from "./projects";
import { canRedo, canUndo, clearWorkspace, exportJson, importJson, loadState, redo, undo } from "../state/workspace";

export function Toolbar() {
  return (
    <header class="toolbar">
      <span class="brand">Blox</span>

      <button class="icon" onClick={undo} disabled={!canUndo()} title="Undo (Ctrl+Z)">↶</button>
      <button class="icon" onClick={redo} disabled={!canRedo()} title="Redo (Ctrl+Shift+Z)">↷</button>

      <Show
        when={running()}
        fallback={
          <>
            <button class="primary" onClick={run}>▶ Run</button>
            <button onClick={debug} title="Run with highlighting, pause/step, breakpoints and variable inspection">
              ⬢ Debug
            </button>
          </>
        }
      >
        <button class="danger" onClick={stop}>■ Stop</button>
        <Show when={debugging()}>
          <Show when={paused()} fallback={<button onClick={pause}>❚❚ Pause</button>}>
            <button class="primary" onClick={resume}>▶ Resume</button>
          </Show>
          <button onClick={step} title="Run one block, then pause">⤼ Step</button>
        </Show>
      </Show>

      <Show when={!running() || debugging()}>
        <label class="speed" title="Debug: delay per block">
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
      </Show>

      <span class="spacer" />
      <Projects />

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
