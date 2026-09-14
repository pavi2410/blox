const DB = "blox";
const STORE = "projects";

export interface Project {
  id: string;
  name: string;
  state: object;
  updatedAt: number;
}

const open = () =>
  new Promise<IDBDatabase>((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: "id" });
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });

const req = <T>(r: IDBRequest<T>) =>
  new Promise<T>((res, rej) => {
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });

const tx = async (mode: IDBTransactionMode) => {
  const db = await open();
  return db.transaction(STORE, mode).objectStore(STORE);
};

export const listProjects = async (): Promise<Project[]> => {
  const all = await req((await tx("readonly")).getAll() as IDBRequest<Project[]>);
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
};

export const getProject = async (id: string) => req((await tx("readonly")).get(id) as IDBRequest<Project | undefined>);

export const putProject = async (p: Project) => {
  await req((await tx("readwrite")).put(p));
};

export const deleteProject = async (id: string) => {
  await req((await tx("readwrite")).delete(id));
};
