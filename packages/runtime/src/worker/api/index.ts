import { setVarsGetter, tick } from "../control";
import { on } from "../events";
import { canvas } from "./canvas";
import { io } from "./io";
import { time } from "./time";
import { turtle } from "./turtle";
import { web } from "./web";

/** Everything visible to generated code, by name. */
export const api = {
  __tick: tick,
  __on: on,
  __vars: setVarsGetter,
  ...io,
  ...time,
  ...canvas,
  ...turtle,
  ...web,
};
