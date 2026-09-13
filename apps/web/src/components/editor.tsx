import DarkTheme from "@blockly/theme-dark";
import { toolbox } from "@blox/blocks";
import { BlocklyWorkspace } from "@blox/editor";
import "../state/breakpoints";
import { loadSaved, onChange, onReady } from "../state/workspace";

const options = {
  theme: DarkTheme,
  grid: { spacing: 20, length: 3, colour: "#333", snap: true },
  zoom: { controls: true, wheel: true, startScale: 0.9 },
  trashcan: true,
  move: { scrollbars: true, drag: true, wheel: false },
};

export function Editor() {
  return (
    <section class="editor">
      <BlocklyWorkspace
        toolbox={toolbox}
        options={options}
        initialState={loadSaved()}
        onReady={onReady}
        onChange={onChange}
      />
    </section>
  );
}
