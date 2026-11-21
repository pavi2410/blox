import type { JSX } from "@solidjs/web";
import { IconButton } from "./button";
import { Overlay } from "./overlay";

export function Modal(props: { title: string; onClose: () => void; extra?: JSX.Element; children: JSX.Element }) {
  return (
    <Overlay onClose={props.onClose}>
      <div class="modal" role="dialog" aria-labelledby="modal-title">
        <header class="modal-head">
          <h2 id="modal-title">{props.title}</h2>
          <div class="modal-head-right">
            {props.extra}
            <IconButton icon="close" label="Close" onClick={props.onClose} />
          </div>
        </header>
        {props.children}
      </div>
    </Overlay>
  );
}
