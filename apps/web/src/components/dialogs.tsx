import { Show, onSettled } from "solid-js";
import { closeDialog, dialog, toastText, type Dialog } from "../state/dialogs";

function DialogBox(props: { d: Dialog }) {
  let input: HTMLInputElement | undefined;
  let ok!: HTMLButtonElement;

  onSettled(() => {
    if (input) {
      input.focus();
      input.select();
    } else ok.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // capture + stop so an underlying Modal doesn't also close
      e.stopPropagation();
      closeDialog(null);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  });

  return (
    <div class="modal-back" onClick={() => closeDialog(null)}>
      <form
        class="modal dialog"
        role="alertdialog"
        aria-labelledby="dialog-msg"
        onClick={(e) => e.stopPropagation()}
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
          <button type="button" onClick={() => closeDialog(null)}>Cancel</button>
          <button
            ref={ok}
            type="submit"
            class={props.d.kind === "confirm" && props.d.danger ? "danger" : "primary"}
          >
            {props.d.kind === "confirm" ? props.d.okLabel : "OK"}
          </button>
        </div>
      </form>
    </div>
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
