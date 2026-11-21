import { For, Show, createSignal } from "solid-js";
import { confirmDialog } from "../state/dialogs";
import { SPEEDS, changeSpeed, debug, debugging, pause, paused, resume, run, running, speed, step, stop } from "../state/runner";
import { canRedo, canUndo, clearWorkspace, loadState, redo, undo } from "../state/workspace";
import { Button, IconButton } from "./button";
import { Gallery } from "./gallery";
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
        <IconButton icon="undo" label="Undo" title="Undo (Ctrl+Z)" onClick={undo} disabled={!canUndo()} />
        <IconButton icon="redo" label="Redo" title="Redo (Ctrl+Shift+Z)" onClick={redo} disabled={!canRedo()} />
        <IconButton icon="trash" label="Clear workspace" onClick={() => void clear()} />
      </div>

      <span class="tb-sep" />

      {/* running */}
      <div class="tb-group">
        <Show
          when={running()}
          fallback={
            <>
              <Button icon="play" variant="primary" onClick={run}>
                Run
              </Button>
              <Button icon="bug" onClick={debug} title="Run with highlighting, pause/step, breakpoints and variable inspection">
                Debug
              </Button>
            </>
          }
        >
          <Button icon="stop" variant="danger" onClick={stop}>
            Stop
          </Button>
          <Show when={debugging()}>
            <Show
              when={paused()}
              fallback={
                <Button icon="pause" onClick={pause}>
                  Pause
                </Button>
              }
            >
              <Button icon="play" variant="primary" onClick={resume}>
                Resume
              </Button>
            </Show>
            <Button icon="step" onClick={step} title="Run one block, then pause">
              Step
            </Button>
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

      <Button onClick={() => setGallery(true)}>Examples</Button>

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
