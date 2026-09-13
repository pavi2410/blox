import { onSettled } from "solid-js";
import { initRuntime } from "../state/runner";

export function Stage() {
  let el!: HTMLDivElement;
  onSettled(() => initRuntime(el));
  return <div ref={el} class="stage" />;
}
