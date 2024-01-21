//import { useSelection } from "@hooks";
import { Command, Process, goDown, goUp } from "@lib";
import { invoke } from "@tauri-apps/api";
import { Accessor, Component, For, Setter, createSignal } from "solid-js";

interface ProcessListProps {
  search: Accessor<string>;
  processes: Accessor<Process[]>;
  setProcesses: Setter<Process[]>;
}

const ProcessList: Component<ProcessListProps> = ({
  search,
  processes,
  setProcesses
}) => {
  const [selected, setSelected] = createSignal<number>(0);

  const filteredProcesses = () => {
    let s = search().toLowerCase();
    return processes().filter(
      p =>
        p.titles.some(t => t.toLowerCase().includes(s)) ||
        p.exe_path.toLowerCase().includes(s)
    );
  };

  window.addEventListener("keydown", async e => {
    if (e.key === "Tab") {
      e.preventDefault();

      if (e.shiftKey) goUp(setSelected, filteredProcesses());
      else goDown(setSelected, filteredProcesses());
    }

    if (e.key === "ArrowUp") goUp(setSelected, filteredProcesses());
    if (e.key === "ArrowDown") goDown(setSelected, filteredProcesses());

    if (e.key === "Delete") {
      let p = filteredProcesses()[selected()];

      let res = await invoke<Process[] | null>(Command.KillProcess, {
        pid: p.id
      });

      if (res) setProcesses(res);
    }

    if (e.key === "Enter") {
      let p = filteredProcesses()[selected()];

      if (p.titles.length > 1) {
        invoke(Command.ShowWindowSelector, {
          titles: p.titles,
          index: selected()
        });
      }
    }
  });

  return (
    <div class="w-full flex flex-col overflow-auto select-none">
      <For each={filteredProcesses()}>
        {(p, i) => (
          <div
            class={[
              "w-full flex items-center gap-4 p-2",
              selected() === i() ? "bg-[#FFDC34] text-black" : ""
            ].join(" ")}
          >
            <img class="ml-1" src={`data:image/png;base64,${p.icon}`} />
            <div class="min-w-0 flex gap-2">
              <p class={selected() === i() ? "text-black" : "text-purple-500"}>
                {"["}
                {p.exe_path.split("\\").pop()!}
                {"]"}
              </p>
              <p class="flex-grow overflow-hidden whitespace-nowrap text-ellipsis">
                -{" "}
                {p.titles.length === 1
                  ? p.titles[0]
                  : `${p.titles.length} Windows`}
              </p>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export { ProcessList };
