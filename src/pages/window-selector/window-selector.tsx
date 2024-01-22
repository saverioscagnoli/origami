/* @refresh reload */
import { render } from "solid-js/web";

import "@style";

import { useEvent, useSelection } from "@hooks";
import { BackendEvent, Command, ShowWindowSelectorPayload, cn } from "@lib";
import { For, createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api";

const WindowSelector = () => {
  const [titles, setTitles] = createSignal<string[]>([]);
  const [processIndex, setProcessIndex] = createSignal<number>(0);

  const index = useSelection(titles, async (e, _) => {
    if (e.key === "Enter") {
      if (e.ctrlKey) {
        await invoke(Command.ShowMonitorSelector, {
          pid: 0,
          index: processIndex()
        });

        return;
      } else {
        await invoke(Command.FocusWindow, { pid: 0, monitorNumber: index() });
      }
    }

    if (e.key === "Escape") {
      e.preventDefault();
      invoke(Command.HideWindowSelector);
    }
  });

  useEvent<ShowWindowSelectorPayload>(BackendEvent.ShowWindowSelector, p => {
    setTitles(p.titles);
    setProcessIndex(p.index);
  });

  return (
    <div class="w-screen h-screen flex flex-col bg-[#1D1919] text-white">
      <For each={titles()}>
        {(t, i) => (
          <p
            class={cn(
              "w-full h-12 px-2 flex items-center overflow-hidden whitespace-nowrap",
              index() === i() && "bg-[#FFDC34] text-black"
            )}
          >
            {t}
          </p>
        )}
      </For>
    </div>
  );
};

render(() => <WindowSelector />, document.getElementById("root")!);
