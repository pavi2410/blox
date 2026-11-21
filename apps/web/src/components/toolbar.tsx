import { For, Show, createSignal } from "solid-js";
import { confirmDialog } from "../state/dialogs";
import { SPEEDS, changeSpeed, debug, debugging, pause, paused, resume, run, running, speed, step, stop } from "../state/runner";
import { canRedo, canUndo, clearWorkspace, loadState, redo, undo } from "../state/workspace";
import { Gallery } from "./gallery";
import { Icon } from "./icon";
import { Projects } from "./projects";

export function Toolbar() {
  const [gallery, setGallery] = createSignal(false);

  const clear = async () => {
    if (await confirmDialog("Clear workspace?", { okLabel: "Clear", danger: true })) clearWorkspace();
  };

  return (
    <header class="toolbar">
      {/* identity */}
      <div class="tb-group">
        <span class="brand">Blox</span>
        <Projects />
      </div>

      <span class="tb-sep" />

      {/* editing */}
      <div class="tb-group">
        <button class="icon" onClick={undo} disabled={!canUndo()} title="Undo (Ctrl+Z)" aria-label="Undo">
          <Icon name="undo" />
        </button>
        <button class="icon" onClick={redo} disabled={!canRedo()} title="Redo (Ctrl+Shift+Z)" aria-label="Redo">
          <Icon name="redo" />
        </button>
        <button class="icon" onClick={() => void clear()} title="Clear workspace" aria-label="Clear workspace">
          <Icon name="trash" />
        </button>
      </div>

      <span class="tb-sep" />

      {/* running */}
      <div class="tb-group">
        <Show
          when={running()}
          fallback={
            <>
              <button class="primary" onClick={run}>
                <Icon name="play" /> Run
              </button>
              <button onClick={debug} title="Run with highlighting, pause/step, breakpoints and variable inspection">
                <Icon name="bug" /> Debug
              </button>
            </>
          }
        >
          <button class="danger" onClick={stop}>
            <Icon name="stop" /> Stop
          </button>
          <Show when={debugging()}>
            <Show
              when={paused()}
              fallback={
                <button onClick={pause}>
                  <Icon name="pause" /> Pause
                </button>
              }
            >
              <button class="primary" onClick={resume}>
                <Icon name="play" /> Resume
              </button>
            </Show>
            <button onClick={step} title="Run one block, then pause">
              <Icon name="step" /> Step
            </button>
            <select
              class="speed"
              title="Debug speed: delay per block"
              aria-label="Debug speed"
              onChange={(e) => changeSpeed(Number(e.currentTarget.value))}
            >
              <For each={SPEEDS}>
                {(s) => (
                  <option value={s.ms} selected={s.ms === speed()}>
                    {s.label}
                  </option>
                )}
              </For>
            </select>
          </Show>
        </Show>
      </div>

      <span class="spacer" />

      <button onClick={() => setGallery(true)}>Examples</button>

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
