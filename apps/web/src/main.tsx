import { render } from "@solidjs/web";
import { App } from "./app";
import { initProjects } from "./state/projects";
import "./app.css";

void initProjects().then(() => render(() => <App />, document.getElementById("root")!));
