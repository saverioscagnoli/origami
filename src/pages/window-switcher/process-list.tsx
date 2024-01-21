import { Command, Process, goDown, goUp } from "@lib";
import { invoke } from "@tauri-apps/api";
import { Accessor, Component, For, Setter, createSignal } from "solid-js";

interface ProcessListProps {
  processes: Accessor<Process[]>;
  setProcesses: Setter<Process[]>;
}

const ProcessList: Component<ProcessListProps> = ({
  processes,
  setProcesses
}) => {
  const [selected, setSelected] = createSignal<number>(0);

  window.addEventListener("keydown", async e => {
    if (e.key === "Tab") {
      e.preventDefault();

      if (e.shiftKey) goUp(setSelected, processes);
      else goDown(setSelected, processes);
    }

    if (e.key === "ArrowUp") goUp(setSelected, processes);
    if (e.key === "ArrowDown") goDown(setSelected, processes);

    if (e.key === "Delete") {
      let p = processes()[selected()];

      let res = await invoke<Process[] | null>(Command.KillProcess, {
        pid: p.id
      });

      if (res) setProcesses(res);
    }
  });

  return (
    <div class="w-full flex flex-col overflow-auto select-none">
      <For each={processes()}>
        {(p, i) => (
          <div
            class={[
              "w-full flex items-center gap-4 p-2",
              selected() === i()
                ? "bg-[#FFDC34] text-black"
                : "" /* "text-[#7952B3]" */
            ].join(" ")}
          >
            <img class="ml-1" src={`data:image/png;base64,${p.icon}`} />
            <p class="overflow-hidden whitespace-nowrap text-ellipsis">
              {"["}
              {p.exe_path.split("\\").pop()!}
              {"]"} - {p.title}
            </p>
          </div>
        )}
      </For>
    </div>
  );
};

export { ProcessList };
