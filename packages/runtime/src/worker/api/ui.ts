import { rpc } from "../bridge";
import { setUiOpen } from "../events";

export const ui = {
  showUi: (tree: unknown) => {
    setUiOpen(tree != null);
    return rpc("showUi", tree);
  },
  uiInput: (id: unknown) => rpc<string>("uiInput", String(id ?? "")),
};
