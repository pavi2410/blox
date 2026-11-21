import { For, Show, createSignal } from "solid-js";
import { current, currentId, newProject, openProject, projects, removeProject, renameProject, shareUrl } from "../state/projects";
import { running, stop } from "../state/runner";
import { applyProject, flushSave, workspaceState } from "../state/workspace";
import { confirmDialog, promptDialog, toast } from "../state/dialogs";
import { Modal } from "./modal";
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
      <button class="projects-btn" onClick={() => setOpen(true)} title="Projects">
        {current()?.name ?? "Projects"}
      </button>
      <Show when={open()}>
        <Modal
          title="Projects"
          onClose={() => setOpen(false)}
          extra={<button onClick={() => void create()}>New</button>}
        >
          <div class="gallery">
            <For each={projects()}>
              {(p) => (
                <div class={{ "gallery-card": true, current: p.id === currentId() }}>
                  <button class="gallery-open" onClick={() => void switchTo(p.id).then(() => setOpen(false))}>
                    <div class="gallery-thumb">
                      <Preview state={p.id === currentId() ? workspaceState() : p.state} />
                    </div>
                    <span>{p.name}</span>
                    <span class="gallery-when">{ago(p.updatedAt)}</span>
                  </button>
                  <div class="gallery-actions">
                    <button
                      onClick={async () => {
                        const name = await promptDialog("Rename project", p.name);
                        if (name) void renameProject(p.id, name);
                      }}
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => {
                        shareUrl(p.id === currentId() ? workspaceState() : p.state);
                        toast("Share URL copied to clipboard");
                      }}
                    >
                      Share
                    </button>
                    <button
                      class="danger"
                      onClick={async () => {
                        if (!(await confirmDialog(`Delete "${p.name}"?`, { okLabel: "Delete", danger: true }))) return;
                        const was = p.id === currentId();
                        void removeProject(p.id).then(() => {
                          if (was) applyProject(current()?.state);
                        });
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Modal>
      </Show>
    </>
  );
}
