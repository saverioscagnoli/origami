import { BackendEvent, Command } from "@lib";
import { invoke } from "@tauri-apps/api";
import { MonitorInfo } from "App";
import { For, createSignal } from "solid-js";
import { render } from "solid-js/web";

import "../styles.css";
import { useEvent } from "@hooks";

const MonitorSelector = () => {
  const [payload, setPayload] = createSignal<{
    monitor_info: MonitorInfo[];
    pid: number;
  }>({} as any);
  const [index, setIndex] = createSignal<number>(0);

  useEvent<{ monitor_info: MonitorInfo[]; pid: number }>(
    BackendEvent.ShowMonitorSelector,
    setPayload
  );

  const goUp = () => {
    setIndex(
      i =>
        (i - 1 + payload().monitor_info.length) % payload().monitor_info.length
    );
  };

  const goDown = () => {
    setIndex(i => (i + 1) % payload().monitor_info.length);
  };

  window.addEventListener("keydown", evt => {
    if (evt.key === "Tab") {
      evt.preventDefault();

      if (evt.shiftKey) goUp();
      else goDown();
    }

    if (evt.key === "Enter") {
      console.log("enter");
      if (evt.shiftKey) {
        invoke(Command.ToggleMonitorSelector, {
          count: payload().monitor_info.length,
          i: 0,
          pid: payload().pid
        });
      } else {
        invoke(Command.FocusWindow, {
          pid: payload().pid,
          monitorNumber: index()
        });
      }
    }
  });

  return (
    <div
      class={`w-screen h-screen bg-[#18181b] text-[#fafafa] flex flex-col justify-center items-center`}
    >
      <For each={payload().monitor_info}>
        {(_, i) => (
          <p
            class={[
              "w-full text-center flex items-center justify-center",
              index() === i() ? "bg-yellow-400 text-[#18181b]" : ""
            ].join(" ")}
            style={{
              height: 100 / payload().monitor_info.length + "%"
            }}
          >
            Monitor {i() + 1}
          </p>
        )}
      </For>
    </div>
  );
};

render(() => <MonitorSelector />, document.getElementById("root")!);
