/* @refresh reload */
import { render } from "solid-js/web";

import "@style";

import { SearchBar } from "./search-bar";
import { createSignal } from "solid-js";
import { ProcessList } from "./process-list";
import { Process } from "@lib";

const WindowSwitcher = () => {
  const [processes, setProcesses] = createSignal<Process[]>([]);

  return (
    <div class="w-screen h-screen flex flex-col bg-[#1D1919] text-white">
      <SearchBar setProcesses={setProcesses} />
      <ProcessList processes={processes} setProcesses={setProcesses} />
    </div>
  );
};

render(() => <WindowSwitcher />, document.getElementById("root")!);
