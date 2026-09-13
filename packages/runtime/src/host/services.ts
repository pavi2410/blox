/** Default host-side implementations of worker RPCs that need main-thread APIs. */

export type RpcHandler = (...args: never[]) => unknown;
export type RpcHandlers = Record<string, RpcHandler>;

const PREFIX = "blox.store.";
let audio: AudioContext | null = null;

export const services: RpcHandlers = {
  store: (key: string, value: unknown) => localStorage.setItem(PREFIX + key, JSON.stringify(value ?? null)),
  load: (key: string) => {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? null : JSON.parse(raw);
  },
  speak: (text: string) =>
    new Promise<void>((resolve) => {
      if (!("speechSynthesis" in window)) return resolve();
      const u = new SpeechSynthesisUtterance(text);
      u.onend = u.onerror = () => resolve();
      speechSynthesis.speak(u);
      setTimeout(resolve, 1000 + text.length * 120); // onend is unreliable on some platforms
    }),
  tone: (hz: number, ms: number) =>
    new Promise<void>((resolve) => {
      audio ??= new AudioContext();
      if (audio.state === "suspended") void audio.resume();
      setTimeout(resolve, ms + 50); // don't hang the program if audio is blocked
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.frequency.value = hz;
      gain.gain.setValueAtTime(0.2, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + ms / 1000);
      osc.connect(gain).connect(audio.destination);
      osc.onended = () => resolve();
      osc.start();
      osc.stop(audio.currentTime + ms / 1000);
    }),
};
