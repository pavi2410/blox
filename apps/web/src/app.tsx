import { Toolbar } from "./components/toolbar";
import { Editor } from "./components/editor";
import { Output } from "./components/output";

export function App() {
  return (
    <div class="app">
      <Toolbar />
      <main class="main">
        <Editor />
        <Output />
      </main>
    </div>
  );
}
