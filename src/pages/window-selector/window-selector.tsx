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

  useEvent<ShowWindowSelectorPayload>(BackendEvent.ShowWindowSelector, p => {
    setTitles(p.titles);
    setProcessIndex(p.index);
  });

  const [index] = useSelection(titles, async (e, _) => {
    if (e.key === "Enter") {
      let title = titles()[index()];

      if (e.ctrlKey) {
        await invoke(Command.ShowMonitorSelector, {
          title,
          index: processIndex()
        });

        return;
      } else {
        await invoke(Command.FocusWindow, {
          windowTitle: title,
          monitorNumber: 0
        });
      }
    }

    if (e.key === "-" && e.ctrlKey) {
      await invoke(Command.MinimizeWindow, {
        title: titles()[index()]
      });
    }

    if (e.key === "=" && e.ctrlKey) {
      await invoke(Command.MaximizeWindow, {
        title: titles()[index()]
      });
    }

    if (e.key === "Escape") {
      e.preventDefault();
      invoke(Command.HideWindowSelector);
    }
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
