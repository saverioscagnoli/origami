import { useEvent, useSelection } from "@hooks";
import { BackendEvent, Command, Process, cn, getExeName } from "@lib";
import { invoke } from "@tauri-apps/api";
import {
  Accessor,
  Component,
  For,
  Setter,
  createEffect,
  createSignal
} from "solid-js";

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
  const [refs, setRefs] = createSignal<HTMLDivElement[]>([]);
  let containerRef: HTMLDivElement;

  const addRef = (el: HTMLDivElement) => {
    setRefs(p => [...p, el]);
  };

  const filteredProcesses = () => {
    let s = search().toLowerCase();
    return processes().filter(
      p =>
        p.titles.some(t => t.toLowerCase().includes(s)) ||
        p.exe_path.toLowerCase().includes(s)
    );
  };

  useEvent(BackendEvent.HideWindowSwitcher, () => {
    setRefs([]);
  });

  const [index, setIndex] = useSelection(filteredProcesses, async (e, p) => {
    setTimeout(() => {
      containerRef.scrollTop = 0;
      refs()[index()]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 10);

    if (e.key === "Enter") {
      if (p.titles.length > 1) {
        await invoke(Command.ShowWindowSelector, {
          titles: p.titles,
          index: index()
        });

        return;
      }

      if (e.ctrlKey) {
        await invoke(Command.ShowMonitorSelector, {
          title: p.titles[0],
          index: index()
        });

        return;
      }

      await invoke(Command.FocusWindow, {
        windowTitle: p.titles[0],
        monitorNumber: 0
      });
    }

    if (e.key === "-" && e.ctrlKey) {
      await invoke(Command.MinimizeWindow, {
        title: p.titles[0]
      });
    }

    if (e.key === "=" && e.ctrlKey) {
      await invoke(Command.MaximizeWindow, {
        title: p.titles[0]
      });
    }

    if (e.key === "Delete") {
      let res = await invoke<Process[] | null>(Command.KillProcess, {
        pid: p.id
      });

      if (res) setProcesses(res);
    }
  });

  createEffect(() => {
    search();
    setIndex(0);
  });

  return (
    <div
      ref={containerRef!}
      class="w-full flex flex-col overflow-auto select-none"
    >
      <For each={filteredProcesses()}>
        {(p, i) => (
          <div
            ref={addRef}
            class={cn(
              "w-full flex items-center gap-4 p-2",
              index() === i() && "bg-[#FFDC34] text-black"
            )}
          >
            <img class="ml-1" src={`data:image/png;base64,${p.icon}`} />
            <div class="min-w-0 flex gap-2">
              <p class={index() === i() ? "text-black" : "text-purple-500"}>
                {"["}
                {getExeName(p.exe_path)}
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
