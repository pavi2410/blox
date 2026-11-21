import { Show, onSettled } from "solid-js";
import { closeDialog, dialog, toastText, type Dialog } from "../state/dialogs";
import { Button } from "./ui/button";
import { Overlay } from "./ui/overlay";
import { TextField } from "./ui/text-field";

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
          {(p) => <TextField ref={(el) => (input = el)} class="dialog-input" value={p().value} aria-label={p().message} />}
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
