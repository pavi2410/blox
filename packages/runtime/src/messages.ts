export type RuntimeEvent =
  | { type: "log"; level: "info" | "error"; text: string }
  | { type: "highlight"; id: string | null }
  | { type: "done"; ok: boolean };

export type RuntimeCommand = { type: "run"; code: string };
