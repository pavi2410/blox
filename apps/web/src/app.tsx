import { createSignal } from "solid-js";
import { Dialogs } from "./components/dialogs";
import { Editor } from "./components/editor";
import { Output } from "./components/output";
import { Splitter } from "./components/splitter";
import { Stage } from "./components/stage";
import { Toolbar } from "./components/toolbar";

const KEY = "blox.side";
const clamp = (n: number) => Math.min(720, Math.max(280, n));

export function App() {
  const [side, setSide] = createSignal(clamp(Number(localStorage.getItem(KEY)) || 420));
  const resize = (n: number) => {
    setSide(n);
    localStorage.setItem(KEY, String(n));
  };

  return (
    <div class="app">
      <Toolbar />
      <main class="main" style={{ "grid-template-columns": `1fr 6px ${side()}px` }}>
        <Editor />
        <Splitter value={side()} min={280} max={720} onChange={resize} />
        <aside class="side">
          <Stage />
          <Output />
        </aside>
      </main>
      <Dialogs />
    </div>
  );
}
