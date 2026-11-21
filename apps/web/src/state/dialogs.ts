import * as Blockly from "blockly/core";
import { createSignal } from "solid-js";

// Non-blocking replacements for window.alert / confirm / prompt.

export type Dialog =
  | { kind: "confirm"; message: string; okLabel: string; danger: boolean; resolve: (ok: boolean) => void }
  | { kind: "prompt"; message: string; value: string; resolve: (value: string | null) => void };

const [queue, setQueue] = createSignal<Dialog[]>([]);
export const dialog = () => queue()[0];

const push = (d: Dialog) => setQueue((q) => [...q, d]);
const settle = () => setQueue((q) => q.slice(1));

export const confirmDialog = (message: string, opts: { okLabel?: string; danger?: boolean } = {}) =>
  new Promise<boolean>((resolve) =>
    push({ kind: "confirm", message, okLabel: opts.okLabel ?? "OK", danger: opts.danger ?? false, resolve }),
  );

export const promptDialog = (message: string, value = "") =>
  new Promise<string | null>((resolve) => push({ kind: "prompt", message, value, resolve }));

/** Close the front dialog with a result (true/false for confirm, string/null for prompt). */
export const closeDialog = (result: boolean | string | null) => {
  const d = dialog();
  if (!d) return;
  settle();
  if (d.kind === "confirm") d.resolve(result === true);
  else d.resolve(typeof result === "string" ? result : null);
};

const [toastText, setToastText] = createSignal<string | null>(null);
export { toastText };
let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const toast = (message: string) => {
  setToastText(message);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => setToastText(null), 2500);
};

// Blockly's variable create/rename/delete flows call window.* by default.
Blockly.dialog.setAlert((message, callback) => {
  toast(message);
  callback?.();
});
Blockly.dialog.setConfirm((message, callback) => void confirmDialog(message).then(callback));
Blockly.dialog.setPrompt((message, value, callback) => void promptDialog(message, value).then(callback));
