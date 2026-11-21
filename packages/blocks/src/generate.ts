import * as Blockly from "blockly/core";
import { javascriptGenerator as js, Order } from "blockly/javascript";
import * as canvas from "./lib/canvas";
import * as events from "./lib/events";
import * as io from "./lib/io";
import * as time from "./lib/time";
import * as store from "./lib/store";
import * as turtle from "./lib/turtle";
import * as ui from "./lib/ui";
import * as web from "./lib/web";

const TICK = "await __tick(%1);\n";
const MARK = "__at(%1);\n";

js.addReservedWords(
  ["__tick", "__at", "__vars", ...io.reserved, ...time.reserved, ...events.reserved, ...canvas.reserved, ...turtle.reserved, ...store.reserved, ...web.reserved, ...ui.reserved].join(","),
);

// ---- async transform: procedures become async, calls are awaited ----
type Defs = Record<string, string>;
const defs = () => (js as unknown as { definitions_: Defs }).definitions_;

for (const type of ["procedures_defnoreturn", "procedures_defreturn"]) {
  const orig = js.forBlock[type];
  js.forBlock[type] = (b, g) => {
    orig(b, g);
    const key = "%" + g.getProcedureName(b.getFieldValue("NAME"));
    const d = defs();
    d[key] = d[key].replace(/^function /m, "async function ");
    return null;
  };
}

const origCall = js.forBlock["procedures_callreturn"];
js.forBlock["procedures_callreturn"] = (b, g) => {
  const [code] = origCall(b, g) as [string, Order];
  return [`(await ${code})`, Order.ATOMIC];
};

// ---- variable snapshot for the debugger ----
let current: Blockly.Workspace | null = null;
const origFinish = js.finish.bind(js);
js.finish = (code: string) => {
  if (current && js.STATEMENT_PREFIX === TICK) {
    // Only variables the generator actually declared; unused ones would be a ReferenceError.
    const entries = Blockly.Variables.allUsedVarModels(current).map(
      (v) => `${JSON.stringify(v.getName())}: ${js.getVariableName(v.getId())}`,
    );
    if (entries.length) code += `\n__vars(() => ({ ${entries.join(", ")} }));\n`;
  }
  return origFinish(code);
};

/**
 * - display: clean code for reading
 * - run:     mark each statement (`__at`) + yield at loop heads so Stop/events stay responsive
 * - debug:   every statement ticks (highlight, pause, step, breakpoints) + variable snapshots
 */
export type GenMode = "display" | "run" | "debug";

export function generate(ws: Blockly.Workspace, mode: GenMode = "display"): string {
  js.STATEMENT_PREFIX = mode === "debug" ? TICK : mode === "run" ? MARK : null;
  js.INFINITE_LOOP_TRAP = mode === "display" ? null : TICK;
  current = ws;
  try {
    return js.workspaceToCode(ws);
  } finally {
    current = null;
  }
}
