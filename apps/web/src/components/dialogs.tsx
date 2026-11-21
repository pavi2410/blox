import { Show, onSettled } from "solid-js";
import { closeDialog, dialog, toastText, type Dialog } from "../state/dialogs";
import { Button } from "./button";
import { Overlay } from "./overlay";

function DialogBox(props: { d: Dialog }) {
  let input: HTMLInputElement | undefined;
  let ok!: HTMLButtonElement;

  onSettled(() => {
    if (input) {
      input.focus();
      input.select();
    } else ok.focus();
  });

  return (
    <Overlay onClose={() => closeDialog(null)}>
      <form
        class="modal dialog"
        role="alertdialog"
        aria-labelledby="dialog-msg"
        onSubmit={(e) => {
          e.preventDefault();
          closeDialog(props.d.kind === "prompt" ? input!.value : true);
        }}
      >
        <p id="dialog-msg" class="dialog-msg">{props.d.message}</p>
        <Show when={props.d.kind === "prompt" && props.d}>
          {(p) => <input ref={input} class="dialog-input" type="text" value={p().value} autocomplete="off" />}
        </Show>
        <div class="dialog-actions">
          <Button onClick={() => closeDialog(null)}>Cancel</Button>
          <Button
            ref={(el) => (ok = el)}
            type="submit"
            variant={props.d.kind === "confirm" && props.d.danger ? "danger" : "primary"}
          >
            {props.d.kind === "confirm" ? props.d.okLabel : "OK"}
          </Button>
        </div>
      </form>
    </Overlay>
  );
}

export function Dialogs() {
  return (
    <>
      <Show when={dialog()} keyed>
        {(d) => <DialogBox d={d} />}
      </Show>
      <Show when={toastText()}>
        {(t) => <div class="toast" role="status">{t()}</div>}
      </Show>
    </>
  );
}
