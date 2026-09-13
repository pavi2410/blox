import { toolbox } from "@blox/blocks";
import { BlocklyWorkspace } from "@blox/editor";
import { loadSaved, onWorkspaceChange, onWorkspaceReady } from "../state/editor";

const options = {
  grid: { spacing: 20, length: 3, colour: "#ccc", snap: true },
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
        onReady={onWorkspaceReady}
        onChange={onWorkspaceChange}
      />
    </section>
  );
}
