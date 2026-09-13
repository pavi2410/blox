import { wait } from "../control";

const start = performance.now();

export const time = {
  wait: (ms: unknown) => wait(Math.max(0, Number(ms) || 0)),
  waitUntil: async (cond: () => Promise<unknown>) => {
    while (!(await cond())) await wait(16);
  },
  elapsed: () => Math.round(performance.now() - start),
};
