import { Show, createSignal } from "solid-js";
import { confirmDialog } from "../state/dialogs";
import { SPEEDS, changeSpeed, debug, debugging, pause, paused, resume, run, running, speed, step, stop } from "../state/runner";
import { canRedo, canUndo, clearWorkspace, loadState, redo, undo } from "../state/workspace";
import { Button, IconButton } from "./ui/button";
import { Dropdown } from "./ui/dropdown";
import { ButtonGroup, Separator, Spacer, Toolbar } from "./ui/layout";
import { Gallery } from "./gallery";
import { Projects } from "./projects";

export function AppHeader() {
  const [gallery, setGallery] = createSignal(false);

  const clear = async () => {
    if (await confirmDialog("Clear workspace?", { okLabel: "Clear", danger: true })) clearWorkspace();
  };

  return (
    <Toolbar>
      <ButtonGroup label="Project">
        <span class="brand">Blox</span>
        <Projects />
      </ButtonGroup>

      <Separator />

      <ButtonGroup label="Edit">
        <IconButton icon="undo" label="Undo" title="Undo (Ctrl+Z)" onClick={undo} disabled={!canUndo()} />
        <IconButton icon="redo" label="Redo" title="Redo (Ctrl+Shift+Z)" onClick={redo} disabled={!canRedo()} />
        <IconButton icon="trash" label="Clear workspace" onClick={() => void clear()} />
      </ButtonGroup>

      <Separator />

      <ButtonGroup label="Run">
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
            <Dropdown
              label="Debug speed"
              title="Debug speed: delay per block"
              items={SPEEDS.map((s) => ({ value: s.ms, label: s.label }))}
              value={speed()}
              onSelect={changeSpeed}
            />
          </Show>
        </Show>
      </ButtonGroup>

      <Spacer />

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
    </Toolbar>
  );
}
