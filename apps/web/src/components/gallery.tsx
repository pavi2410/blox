import { For } from "solid-js";
import { examples, type Example } from "../examples";
import { Thumb } from "../examples/thumbs";
import { Card, CardGrid } from "./ui/card";
import { Modal } from "./ui/modal";

export function Gallery(props: { onClose: () => void; onPick: (ex: Example) => void }) {
  return (
    <Modal title="Examples" onClose={props.onClose}>
      <p class="modal-note">Loading one replaces the current workspace.</p>
      <CardGrid>
        <For each={examples}>
          {(ex) => <Card thumb={<Thumb id={ex.id} />} title={ex.name} onOpen={() => props.onPick(ex)} />}
        </For>
      </CardGrid>
    </Modal>
  );
}
