export type Insp =
  | { kind: "prim"; text: string; cls?: "str" | "num" | "bool" | "null" | "undef" }
  | { kind: "list"; length: number; items: Insp[] }
  | { kind: "dict"; size: number; entries: [string, Insp][] };

const MAX_DEPTH = 6;
const MAX_ITEMS = 40;

export function inspect(v: unknown, depth = 0, seen = new WeakSet<object>()): Insp {
  if (v === undefined) return { kind: "prim", text: "undefined", cls: "undef" };
  if (v === null) return { kind: "prim", text: "null", cls: "null" };
  const t = typeof v;
  if (t === "string") return { kind: "prim", text: JSON.stringify(v), cls: "str" };
  if (t === "number") return { kind: "prim", text: String(v), cls: "num" };
  if (t === "boolean") return { kind: "prim", text: String(v), cls: "bool" };
  if (t !== "object") return { kind: "prim", text: String(v) };
  if (seen.has(v)) return { kind: "prim", text: "…" };
  if (depth >= MAX_DEPTH) {
    return { kind: "prim", text: Array.isArray(v) ? `list(${v.length})` : "dict" };
  }
  seen.add(v);
  if (Array.isArray(v)) {
    const items = v.slice(0, MAX_ITEMS).map((x) => inspect(x, depth + 1, seen));
    if (v.length > MAX_ITEMS) items.push({ kind: "prim", text: `+${v.length - MAX_ITEMS} more` });
    return { kind: "list", length: v.length, items };
  }
  const keys = Object.keys(v as object);
  const entries: [string, Insp][] = keys.slice(0, MAX_ITEMS).map((k) => [
    k,
    inspect((v as Record<string, unknown>)[k], depth + 1, seen),
  ]);
  if (keys.length > MAX_ITEMS) entries.push(["…", { kind: "prim", text: `+${keys.length - MAX_ITEMS} more` }]);
  return { kind: "dict", size: keys.length, entries };
}
