import ReactDOM from "react-dom/client";
import { App } from "./App";

import { Callstack } from "@lib/callstack";
import "./styles.css";

const callstack = new Callstack();

callstack.listen();

export { callstack };

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);
