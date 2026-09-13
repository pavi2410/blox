import { rpc } from "../bridge";

export const web = {
  fetchJson: async (url: unknown) => {
    const res = await fetch(String(url));
    if (!res.ok) throw new Error(`fetch failed: ${res.status} ${res.statusText}`);
    return res.json();
  },
  store: (key: unknown, value: unknown) => rpc("store", String(key), value),
  load: (key: unknown) => rpc("load", String(key)),
  speak: (text: unknown) => rpc("speak", String(text)),
  tone: (hz: unknown, ms: unknown) => rpc("tone", Number(hz) || 440, Number(ms) || 0),
};
