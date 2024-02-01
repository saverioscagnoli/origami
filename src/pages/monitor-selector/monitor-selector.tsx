/* @refresh reload */
import { render } from "solid-js/web";

import "@style";
import { For, createSignal } from "solid-js";
import { useEvent, useSelection } from "@hooks";
import {
  BackendEvent,
  Command,
  MonitorInfo,
  MonitorSelectorPayload,
  cn
} from "@lib";
import { invoke } from "@tauri-apps/api";

const MonitorSelector = () => {
  const [title, setTitle] = createSignal<string>("");
  const [monitors, setMonitors] = createSignal<MonitorInfo[]>([]);

  useEvent<MonitorSelectorPayload>(BackendEvent.ShowMonitorSelector, p => {
    setTitle(p.title);
    setMonitors(p.monitor_info);
  });

  useEvent(BackendEvent.HideMonitorSelector, () => {
    console.log("hide");
    setTitle("");
    setIndex(0);
  });

  const [index, setIndex] = useSelection(monitors, async (e, _) => {
    if (e.key === "Escape") {
      e.preventDefault();
      await invoke(Command.HideMonitorSelector);
    }

    if (e.key === "Enter") {
      await invoke(Command.FocusWindow, {
        windowTitle: title(),
        monitorNumber: index()
      });
    }
  });

  return (
    <div class="w-screen h-screen flex flex-col bg-[#1D1919] text-white">
      <For each={monitors()}>
        {(_, i) => (
          <p
            class={cn(
              "w-full h-12 px-2 flex items-center overflow-hidden whitespace-nowrap",
              index() === i() && "bg-[#FFDC34] text-black"
            )}
          >
            Monitor {i() + 1}
          </p>
        )}
      </For>
    </div>
  );
};

render(() => <MonitorSelector />, document.getElementById("root")!);
