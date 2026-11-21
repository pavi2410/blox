import { Show, createSignal } from "solid-js";
import { changeSpeed, debug, debugging, pause, paused, resume, run, running, speed, step, stop } from "../state/runner";
import { Gallery } from "./gallery";
import { Icon } from "./icon";
import { Projects } from "./projects";
import { confirmDialog } from "../state/dialogs";
import { canRedo, canUndo, clearWorkspace, exportJson, importJson, loadState, redo, undo } from "../state/workspace";

export function Toolbar() {
  const [gallery, setGallery] = createSignal(false);

  return (
    <header class="toolbar">
      <span class="brand">Blox</span>

      <button class="icon" onClick={undo} disabled={!canUndo()} title="Undo (Ctrl+Z)" aria-label="Undo"><Icon name="undo" /></button>
      <button class="icon" onClick={redo} disabled={!canRedo()} title="Redo (Ctrl+Shift+Z)" aria-label="Redo"><Icon name="redo" /></button>

      <Show
        when={running()}
        fallback={
          <>
            <button class="primary" onClick={run}><Icon name="play" /> Run</button>
            <button onClick={debug} title="Run with highlighting, pause/step, breakpoints and variable inspection">
              <Icon name="bug" /> Debug
            </button>
          </>
        }
      >
        <button class="danger" onClick={stop}><Icon name="stop" /> Stop</button>
        <Show when={debugging()}>
          <Show when={paused()} fallback={<button onClick={pause}><Icon name="pause" /> Pause</button>}>
            <button class="primary" onClick={resume}><Icon name="play" /> Resume</button>
          </Show>
          <button onClick={step} title="Run one block, then pause"><Icon name="step" /> Step</button>
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

      <button onClick={() => setGallery(true)}>Examples</button>
      <button onClick={importJson}>Import</button>
      <button onClick={exportJson}>Export</button>
      <button
        onClick={async () => {
          if (await confirmDialog("Clear workspace?", { okLabel: "Clear", danger: true })) clearWorkspace();
        }}
      >
        Clear
      </button>

      <Show when={gallery()}>
        <Gallery
          onClose={() => setGallery(false)}
          onPick={async (ex) => {
            if (!(await confirmDialog(`Load "${ex.name}"? This replaces the current workspace.`, { okLabel: "Load" }))) return;
            if (running()) stop();
            loadState(ex.state);
            setGallery(false);
          }}
        />
      </Show>
    </header>
  );
}
