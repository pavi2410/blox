import { onSettled } from "solid-js";
import { initRuntime } from "../state/runner";

export function Stage() {
  let stage!: HTMLDivElement;
  let ui!: HTMLDivElement;
  onSettled(() => initRuntime(stage, ui));
  return (
    <div class="stage-col">
      <div ref={stage} class="stage" />
      <div ref={ui} class="ui-panel" hidden />
    </div>
  );
}
