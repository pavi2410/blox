import { For, Show, createEffect } from "solid-js";
import { answer, ask, logs } from "../state/runner";
import { Button } from "./button";

export function Console() {
  let list!: HTMLDivElement;
  let input!: HTMLInputElement;

  // keep scrolled to bottom as output arrives
  createEffect(
    () => logs.length,
    () => {
      list.scrollTo({ top: list.scrollHeight });
    },
  );
  createEffect(
    () => ask(),
    (a) => {
      if (a) input.focus();
    },
  );

  return (
    <div class="console">
      <div ref={list} class="panel">
        <For each={logs} fallback={<span class="muted">Press Run to see output</span>}>
          {(line) => <div class={line.level}>{line.text}</div>}
        </For>
      </div>
      <Show when={ask()}>
        {(a) => (
          <form
            class="ask"
            onSubmit={(e) => {
              e.preventDefault();
              answer(input.value);
              input.value = "";
            }}
          >
            <label>{a().prompt}</label>
            <input ref={input} type="text" autocomplete="off" />
            <Button type="submit" variant="primary">
              OK
            </Button>
          </form>
        )}
      </Show>
    </div>
  );
}
