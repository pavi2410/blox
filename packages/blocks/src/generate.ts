import type * as Blockly from "blockly/core";
import { javascriptGenerator as js, Order } from "blockly/javascript";
import * as canvas from "./lib/canvas";
import * as events from "./lib/events";
import * as io from "./lib/io";
import * as time from "./lib/time";
import * as turtle from "./lib/turtle";
import * as web from "./lib/web";

const TICK = "await __tick(%1);\n";

js.addReservedWords(
  ["__tick", "__vars", ...io.reserved, ...time.reserved, ...events.reserved, ...canvas.reserved, ...turtle.reserved, ...web.reserved].join(","),
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
  if (current && js.STATEMENT_PREFIX) {
    const entries = current
      .getVariableMap()
      .getAllVariables()
      .map((v) => `${JSON.stringify(v.getName())}: ${js.getVariableName(v.getId())}`);
    if (entries.length) code += `\n__vars(() => ({ ${entries.join(", ")} }));\n`;
  }
  return origFinish(code);
};

/**
 * Generate JS for a workspace.
 * `trace` instruments statements/loops with `await __tick(id)` for stepping, highlighting and stop.
 */
export function generate(ws: Blockly.Workspace, trace = false): string {
  js.STATEMENT_PREFIX = trace ? TICK : null;
  js.INFINITE_LOOP_TRAP = trace ? TICK : null;
  current = ws;
  try {
    return js.workspaceToCode(ws);
  } finally {
    current = null;
  }
}
