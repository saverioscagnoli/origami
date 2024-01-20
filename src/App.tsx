import { useEvent } from "@hooks";
import { BackendEvent, Command, trimPath } from "@lib";
import { invoke } from "@tauri-apps/api";
import { For, createEffect, createSignal } from "solid-js";

interface ProcessInfo {
  id: number;
  window_titles: string[];
  exe_path: string;
}

export interface MonitorInfo {
  position: [number, number];
}

interface Info {
  process_info: ProcessInfo[];
  monitor_info: MonitorInfo[];
}

function App() {
  const [info, setInfo] = createSignal<Info>({} as Info);
  const [filteredInfo, setFilteredInfo] = createSignal<Info>({} as Info);

  const [searchParam, setSearchParam] = createSignal<string>("");
  const [index, setIndex] = createSignal<number>(0);

  let input: HTMLInputElement;

  const goUp = () => {
    setIndex(
      i => (i - 1 + info().process_info.length) % info().process_info.length
    );
  };

  const goDown = () => {
    setIndex(i => (i + 1) % info().process_info.length);
  };

  window.addEventListener("keydown", evt => {
    if (evt.key === "Tab") {
      evt.preventDefault();

      if (evt.shiftKey) goUp();
      else goDown();
    }

    if (evt.key === "ArrowUp") goUp();
    if (evt.key === "ArrowDown") goDown();

    if (evt.key === "Delete") {
      let pid = filteredInfo().process_info[index()].id;
      onKill(pid)();
    }

    if (evt.key === "Enter") {
      if (evt.shiftKey) {
        let pid = filteredInfo().process_info[index()].id;

        invoke(Command.ToggleMonitorSelector, {
          count: filteredInfo().monitor_info.length,
          pid,
          i: index()
        });
      } else {
        let pid = filteredInfo().process_info[index()].id;

        invoke(Command.FocusWindow, { pid, monitorNumber: 0 });
        setSearchParam("");
      }
    }
  });

  useEvent<Info>(BackendEvent.ShowWindowSwitcher, info => {
    input.focus();

    setInfo(info);
    setFilteredInfo(info);
  });

  useEvent<string>(BackendEvent.HideWindowSwitcher, () => {
    input.blur();

    setSearchParam("");
    setInfo({} as Info);
  });

  createEffect(() => {
    if (searchParam() === "") setFilteredInfo(info());
    else onSearch();
  });

  const onSearch = () => {
    let filtered = info().process_info.filter(p =>
      `${trimPath(p.exe_path)} ${p.window_titles.join(" ")}`
        .toLowerCase()
        .includes(searchParam().toLowerCase())
    );

    setIndex(0);
    setFilteredInfo({ ...info(), process_info: filtered });
  };

  const onKill = (pid: number) => async () => {
    let res = await invoke<Info | string>(Command.KillProcess, { pid });
    if (typeof res !== "string") setInfo(res);
  };

  return (
    <div class="w-screen h-screen flex flex-col bg-[#18181b] text-[#fafafa] select-none">
      <div class="w-full h-16 flex items-center gap-2 p-2">
        <p>{">"}</p>
        <input
          ref={input!}
          spellcheck={false}
          class="!w-full !p-2"
          style={{ all: "unset" }}
          value={searchParam()}
          onInput={e => setSearchParam(e.currentTarget.value)}
        />
      </div>
      <div class="w-full flex flex-col overflow-auto">
        <For each={filteredInfo().process_info}>
          {(p, i) => (
            <div
              class={[
                "w-full flex gap-2 p-2",
                index() === i() ? "bg-yellow-400 text-[#18181b]" : ""
              ].join(" ")}
            >
              <p
                class={[
                  index() === i() ? "text-[#18181b]" : "text-green-500"
                ].join(" ")}
              >
                {"["}
                {trimPath(p.exe_path)}
                {"]"}
              </p>
              <p>
                -{" "}
                {p.window_titles.length > 1
                  ? `${p.window_titles.length} Windows`
                  : p.window_titles[0]}
              </p>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export { App };
