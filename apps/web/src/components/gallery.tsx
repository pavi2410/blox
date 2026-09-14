import { For } from "solid-js";
import { examples, type Example } from "../examples";
import { Thumb } from "../examples/thumbs";
import { Modal } from "./modal";

export function Gallery(props: { onClose: () => void; onPick: (ex: Example) => void }) {
  return (
    <Modal title="Examples" onClose={props.onClose}>
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
    </Modal>
  );
}
