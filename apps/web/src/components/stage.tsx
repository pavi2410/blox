import { Show, createSignal, onSettled } from "solid-js";
import { toast } from "../state/dialogs";
import { initRuntime } from "../state/runner";
import { Button, IconButton } from "./button";
import { useWindowEvent } from "./overlay";

type Target = "window" | "tab";

/**
 * The stage can be moved into a separate window or tab. The runtime binds all
 * input to the stage element itself, so moving the DOM node keeps everything
 * (pointer, keys, UI panel, worker canvases) working; it moves back on close.
 */
export function Stage() {
  let col!: HTMLDivElement;
  let slot!: HTMLDivElement;
  let stage!: HTMLDivElement;
  let ui!: HTMLDivElement;
  let popup: Window | null = null;
  const [popped, setPopped] = createSignal(false);

  const restore = () => {
    if (!col.isConnected || col.ownerDocument !== document) slot.append(col);
    popup = null;
    setPopped(false);
  };

  const popOut = (target: Target) => {
    if (popup && !popup.closed) return void popup.focus();
    const { width, height } = col.getBoundingClientRect();
    const win =
      target === "window"
        ? window.open("", "blox-preview", `popup,width=${Math.round(Math.max(width, 480))},height=${Math.round(Math.max(height, 360))}`)
        : window.open("", "_blank");
    if (!win) return toast("Pop-up blocked: allow pop-ups for this site to open the preview");

    const doc = win.document;
    doc.title = "Blox preview";
    // carry the app's styles over (Vite injects <style> in dev, <link> in prod)
    doc.head.replaceChildren(
      ...[...document.querySelectorAll('style, link[rel="stylesheet"]')].map((n) => doc.importNode(n, true)),
    );
    doc.body.className = "popout";
    doc.body.replaceChildren(col);
    popup = win;
    setPopped(true);
    // pagehide fires when the user closes the window/tab
    win.addEventListener("pagehide", restore, { once: true });
    stage.focus({ preventScroll: true });
  };

  const bringBack = () => {
    const win = popup;
    restore();
    win?.close();
  };

  onSettled(() => initRuntime(stage, ui));
  // don't leave an orphaned preview behind when the editor goes away
  useWindowEvent("pagehide", () => popup?.close());

  return (
    <>
      <div ref={slot} class="stage-slot">
        <div ref={col} class="stage-col">
          <div ref={stage} class="stage" />
          <div ref={ui} class="ui-panel" hidden />
          <div class="stage-tools">
            <Show when={!popped()}>
              <IconButton icon="popout" label="Open preview in a new window" onClick={() => popOut("window")} />
              <IconButton icon="newTab" label="Open preview in a new tab" onClick={() => popOut("tab")} />
            </Show>
          </div>
        </div>
      </div>
      <Show when={popped()}>
        <div class="stage-away">
          <span>Preview is open in another window</span>
          <span class="spacer" />
          <Button variant="ghost" onClick={() => popup?.focus()}>
            Show
          </Button>
          <Button onClick={bringBack}>Bring back</Button>
        </div>
      </Show>
    </>
  );
}
