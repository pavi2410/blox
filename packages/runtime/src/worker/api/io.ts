import { fmt, log, rpc } from "../bridge";

export const io = {
  print: (...args: unknown[]) => log(args.map(fmt).join(" ")),
  ask: (prompt: unknown) => rpc<string>("ask", fmt(prompt)),
  clearConsole: () => rpc("clearConsole"),
};
