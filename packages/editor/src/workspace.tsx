import * as Blockly from "blockly/core";
import { onSettled } from "solid-js";

export interface WorkspaceProps {
  toolbox: Blockly.utils.toolbox.ToolboxDefinition;
  options?: Omit<Blockly.BlocklyOptions, "toolbox">;
  /** Serialized state (from `Blockly.serialization.workspaces.save`) to load on mount. */
  initialState?: object;
  onReady?: (ws: Blockly.WorkspaceSvg) => void;
  /** Fired on non-UI changes (block add/move/edit/delete). */
  onChange?: (ws: Blockly.WorkspaceSvg) => void;
  class?: string;
}

export function BlocklyWorkspace(props: WorkspaceProps) {
  let el!: HTMLDivElement;

  onSettled(() => {
    const ws = Blockly.inject(el, { ...props.options, toolbox: props.toolbox });
    if (props.initialState) Blockly.serialization.workspaces.load(props.initialState, ws);

    ws.addChangeListener((e) => {
      if (e.isUiEvent || ws.isDragging()) return;
      props.onChange?.(ws);
    });

    const ro = new ResizeObserver(() => Blockly.svgResize(ws));
    ro.observe(el);

    props.onReady?.(ws);
    return () => {
      ro.disconnect();
      ws.dispose();
    };
  });

  return <div ref={el} class={props.class} style={{ width: "100%", height: "100%" }} />;
}
