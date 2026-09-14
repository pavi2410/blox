import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { createSignal } from "solid-js";
import { deleteProject, getProject, listProjects, putProject, type Project } from "./idb";

const CURRENT = "blox.current";
const LEGACY = "blox.workspace";

export const [projects, setProjects] = createSignal<Project[]>([]);
export const [currentId, setCurrentId] = createSignal("");

export const current = () => projects().find((p) => p.id === currentId());

const refresh = async () => setProjects(await listProjects());

const persist = async (p: Project) => {
  await putProject(p);
  localStorage.setItem(CURRENT, p.id);
  setCurrentId(p.id);
  await refresh();
};

const fresh = (name: string, state: object = {}): Project => ({
  id: crypto.randomUUID(),
  name,
  state,
  updatedAt: Date.now(),
});

/** Boot: migrate localStorage, apply `#s=` share hash, ensure a current project. */
export async function initProjects() {
  let all = await listProjects();
  const legacy = localStorage.getItem(LEGACY);
  if (!all.length && legacy) {
    const p = fresh("Untitled", JSON.parse(legacy));
    await putProject(p);
    localStorage.removeItem(LEGACY);
    all = [p];
  }

  const hash = location.hash.match(/^#s=(.+)$/);
  if (hash) {
    const raw = decompressFromEncodedURIComponent(hash[1]);
    if (raw) {
      const p = fresh("Shared", JSON.parse(raw));
      await persist(p);
      history.replaceState(null, "", location.pathname + location.search);
      return;
    }
  }

  const saved = localStorage.getItem(CURRENT);
  const cur = all.find((p) => p.id === saved) ?? all[0] ?? fresh("Untitled");
  if (!all.length) await putProject(cur);
  localStorage.setItem(CURRENT, cur.id);
  setCurrentId(cur.id);
  await refresh();
}

export const currentState = (): object | undefined => {
  const s = current()?.state;
  return s && Object.keys(s).length ? s : undefined;
};

export const saveCurrent = (state: object) => {
  const p = current();
  if (!p) return;
  void persist({ ...p, state, updatedAt: Date.now() });
};

export const newProject = async (name = "Untitled") => persist(fresh(name));

export const openProject = async (id: string) => {
  const p = await getProject(id);
  if (!p) return;
  localStorage.setItem(CURRENT, id);
  setCurrentId(id);
};

export const renameProject = async (id: string, name: string) => {
  const p = await getProject(id);
  if (!p || !name.trim()) return;
  await putProject({ ...p, name: name.trim(), updatedAt: Date.now() });
  await refresh();
};

export const removeProject = async (id: string) => {
  await deleteProject(id);
  if (id === currentId()) {
    const rest = await listProjects();
    if (rest[0]) await openProject(rest[0].id);
    else await newProject();
  }
  await refresh();
};

export const shareUrl = (state: object) => {
  const url = `${location.origin}${location.pathname}#s=${compressToEncodedURIComponent(JSON.stringify(state))}`;
  void navigator.clipboard.writeText(url);
  return url;
};
