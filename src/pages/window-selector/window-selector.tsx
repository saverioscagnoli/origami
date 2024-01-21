/* @refresh reload */
import { render } from "solid-js/web";

import "@style";
import { useEvent } from "@hooks";
import { BackendEvent, Command, goDown, goUp } from "@lib";
import { For, createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api";

const WindowSelector = () => {
  const [selected, setSelected] = createSignal<number>(0);
  const [titles, setTitles] = createSignal<string[]>([]);

  window.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      e.preventDefault();
      invoke(Command.HideWindowSelector);
    }

    if (e.key === "Tab") {
      e.preventDefault();

      if (e.shiftKey) goUp(setSelected, titles());
      else goDown(setSelected, titles());
    }
  });

  useEvent<string[]>(BackendEvent.ShowWindowSelector, titles => {
    setTitles(titles);
  });

  return (
    <div class="w-screen h-screen flex flex-col bg-[#1D1919] text-white">
      <For each={titles()}>
        {(t, i) => (
          <p
            class={[
              "w-full h-12 px-2 flex items-center overflow-hidden whitespace-nowrap",
              selected() === i() ? "bg-[#FFDC34] text-black" : ""
            ].join(" ")}
          >
            {t}
          </p>
        )}
      </For>
    </div>
  );
};

render(() => <WindowSelector />, document.getElementById("root")!);
