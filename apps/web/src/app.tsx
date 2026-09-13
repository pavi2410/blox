import { Editor } from "./components/editor";
import { Output } from "./components/output";
import { Stage } from "./components/stage";
import { Toolbar } from "./components/toolbar";

export function App() {
  return (
    <div class="app">
      <Toolbar />
      <main class="main">
        <Editor />
        <aside class="side">
          <Stage />
          <Output />
        </aside>
      </main>
    </div>
  );
}
