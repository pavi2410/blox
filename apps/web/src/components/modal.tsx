import { onSettled, type JSX } from "solid-js";

export function Modal(props: { title: string; onClose: () => void; extra?: JSX.Element; children: JSX.Element }) {
  onSettled(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div class="modal-back" onClick={props.onClose}>
      <div class="modal" role="dialog" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
        <header class="modal-head">
          <h2 id="modal-title">{props.title}</h2>
          <div class="modal-head-right">
            {props.extra}
            <button class="icon" onClick={props.onClose} title="Close">
              ×
            </button>
          </div>
        </header>
        {props.children}
      </div>
    </div>
  );
}
