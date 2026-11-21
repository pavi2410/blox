import { For, Show, createSignal } from "solid-js";
import { current, currentId, newProject, openProject, projects, removeProject, renameProject, shareUrl } from "../state/projects";
import { running, stop } from "../state/runner";
import { applyProject, exportJson, flushSave, importJson, workspaceState } from "../state/workspace";
import { confirmDialog, promptDialog, toast } from "../state/dialogs";
import { Button } from "./ui/button";
import { Card, CardGrid } from "./ui/card";
import { Icon } from "./ui/icon";
import { Modal } from "./ui/modal";
import { Preview } from "./preview";

const ago = (t: number) => {
  const s = (Date.now() - t) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(t).toLocaleDateString();
};

const switchTo = async (id: string) => {
  if (id === currentId()) return;
  flushSave();
  if (running()) stop();
  await openProject(id);
  applyProject(current()?.state);
};

export function Projects() {
  const [open, setOpen] = createSignal(false);

  const create = async () => {
    const name = await promptDialog("Project name", "Untitled");
    if (!name) return;
    flushSave();
    if (running()) stop();
    await newProject(name);
    applyProject({});
    setOpen(false);
  };

  return (
    <>
      <button class="projects-btn ghost" onClick={() => setOpen(true)} title="Projects">
        <span>{current()?.name ?? "Projects"}</span>
        <Icon name="chevronDown" size={14} />
      </button>
      <Show when={open()}>
        <Modal
          title="Projects"
          onClose={() => setOpen(false)}
          extra={
            <>
              <Button variant="ghost" onClick={importJson} title="Replace this project's blocks with a .json file">
                Import
              </Button>
              <Button variant="ghost" onClick={exportJson} title="Download this project as .json">
                Export
              </Button>
              <Button variant="primary" onClick={() => void create()}>
                New
              </Button>
            </>
          }
        >
          <CardGrid>
            <For each={projects()}>
              {(p) => {
                const state = () => (p.id === currentId() ? workspaceState() : p.state);
                return (
                  <Card
                    thumb={<Preview state={state()} />}
                    title={p.name}
                    meta={ago(p.updatedAt)}
                    current={p.id === currentId()}
                    onOpen={() => void switchTo(p.id).then(() => setOpen(false))}
                    actions={
                      <>
                        <Button
                          onClick={async () => {
                            const name = await promptDialog("Rename project", p.name);
                            if (name) void renameProject(p.id, name);
                          }}
                        >
                          Rename
                        </Button>
                        <Button
                          onClick={() => {
                            shareUrl(state());
                            toast("Share URL copied to clipboard");
                          }}
                        >
                          Share
                        </Button>
                        <Button
                          variant="danger"
                          onClick={async () => {
                            if (!(await confirmDialog(`Delete "${p.name}"?`, { okLabel: "Delete", danger: true }))) return;
                            const was = p.id === currentId();
                            void removeProject(p.id).then(() => {
                              if (was) applyProject(current()?.state);
                            });
                          }}
                        >
                          Delete
                        </Button>
                      </>
                    }
                  />
                );
              }}
            </For>
          </CardGrid>
        </Modal>
      </Show>
    </>
  );
}
