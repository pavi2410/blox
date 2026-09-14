import { For } from "solid-js";
import { current, currentId, newProject, openProject, projects, removeProject, renameProject, shareUrl } from "../state/projects";
import { applyProject, workspaceState } from "../state/workspace";

const switchTo = async (id: string) => {
  if (id === currentId()) return;
  await openProject(id);
  applyProject(current()?.state);
};

export function Projects() {
  return (
    <div class="projects">
      <select
        value={currentId()}
        onChange={(e) => void switchTo(e.currentTarget.value)}
        title="Projects"
      >
        <For each={projects()}>{(p) => <option value={p.id}>{p.name}</option>}</For>
      </select>
      <button
        onClick={() => {
          const name = prompt("Project name", "Untitled");
          if (name) void newProject(name).then(() => applyProject({}));
        }}
      >
        New
      </button>
      <button
        onClick={() => {
          const name = prompt("Rename project", current()?.name ?? "");
          if (name) void renameProject(name);
        }}
      >
        Rename
      </button>
      <button
        onClick={() => {
          shareUrl(workspaceState());
          alert("Share URL copied to clipboard");
        }}
        title="Copy a URL that opens this project"
      >
        Share
      </button>
      <button
        onClick={() => {
          if (confirm(`Delete "${current()?.name}"?`)) void removeProject().then(() => applyProject(current()?.state));
        }}
      >
        Delete
      </button>
    </div>
  );
}
