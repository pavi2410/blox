import { AppHeader } from "./components/app-header";
import { Dialogs } from "./components/dialogs";
import { Editor } from "./components/editor";
import { Output } from "./components/output";
import { Stage } from "./components/stage";
import { SplitPane } from "./components/ui/split-pane";

export function App() {
  return (
    <div class="app">
      <AppHeader />
      <SplitPane
        storageKey="blox.side"
        initial={420}
        min={280}
        max={720}
        start={<Editor />}
        end={
          <aside class="side">
            <Stage />
            <Output />
          </aside>
        }
      />
      <Dialogs />
    </div>
  );
}
