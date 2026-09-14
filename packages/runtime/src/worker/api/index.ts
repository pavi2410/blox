import { mark, setVarsGetter, tick } from "../control";
import { on } from "../events";
import { canvas } from "./canvas";
import { io } from "./io";
import { time } from "./time";
import { turtle } from "./turtle";
import { ui } from "./ui";
import { web } from "./web";

/** Everything visible to generated code, by name. */
export const api = {
  __tick: tick,
  __at: mark,
  __on: on,
  __vars: setVarsGetter,
  ...io,
  ...time,
  ...canvas,
  ...turtle,
  ...ui,
  ...web,
};
