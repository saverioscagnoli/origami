import { useEvent } from "@hooks";
import { BackendEvent } from "@lib";
import { For, createSignal } from "solid-js";

interface ProcessInfo {
  pid: string;
  window_title: string[];
}

interface MonitorInfo {}

interface Info {
  process_info: ProcessInfo[];
  monitor_info: MonitorInfo[];
}

function App() {
  const [info, setInfo] = createSignal<Info>({} as Info);

  let input: HTMLInputElement;

  useEvent<Info>(BackendEvent.ShowWindowSwitcher, i => {
    input.focus();

    setInfo(i);
  });

  useEvent<string>(BackendEvent.HideWindowSwitcher, () => {
    input.blur();
  });

  return (
    <div class="w-screen h-screen flex flex-col bg-[#18181b] text-[#fafafa] select-none">
      <div class="w-full h-16 flex items-center gap-2 p-2">
        <p>{">"}</p>
        <input
          ref={input!}
          spellcheck={false}
          class="!w-full !p-2"
          style={{ all: "unset" }}
        />
      </div>
      <div class="w-full flex flex-col overflow-auto">
        <For each={info().process_info}>
          {p => (
            <div class="p-2 cursor-pointer hover:bg-yellow-400 hover:text-[#18181b]">
              <p>
                {p.window_title.length > 1
                  ? `${p.window_title.length} Windows`
                  : p.window_title[0]}
              </p>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export { App };
