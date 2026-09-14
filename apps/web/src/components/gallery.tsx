import { For, onSettled } from "solid-js";
import { examples, type Example } from "../examples";
import { Thumb } from "../examples/thumbs";

export function Gallery(props: { onClose: () => void; onPick: (ex: Example) => void }) {
  onSettled(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div class="modal-back" onClick={props.onClose}>
      <div class="modal" role="dialog" aria-labelledby="gallery-title" onClick={(e) => e.stopPropagation()}>
        <header class="modal-head">
          <h2 id="gallery-title">Examples</h2>
          <button class="icon" onClick={props.onClose} title="Close">
            ×
          </button>
        </header>
        <p class="modal-note">Loading one replaces the current workspace.</p>
        <div class="gallery">
          <For each={examples}>
            {(ex) => (
              <button class="gallery-card" onClick={() => props.onPick(ex)}>
                <div class="gallery-thumb">
                  <Thumb id={ex.id} />
                </div>
                <span>{ex.name}</span>
              </button>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
