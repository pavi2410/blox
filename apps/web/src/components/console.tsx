import { For, Show, createEffect } from "solid-js";
import { answer, ask, logs } from "../state/runner";
import { Button } from "./ui/button";
import { Panel } from "./ui/panel";
import { TextField } from "./ui/text-field";

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
      <Panel ref={(el) => (list = el)}>
        <For each={logs} fallback={<span class="muted">Press Run to see output</span>}>
          {(line) => <div class={line.level}>{line.text}</div>}
        </For>
      </Panel>
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
            <TextField ref={(el) => (input = el)} aria-label={a().prompt} />
            <Button type="submit" variant="primary">
              OK
            </Button>
          </form>
        )}
      </Show>
    </div>
  );
}
