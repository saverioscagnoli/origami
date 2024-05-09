import { Bottombar } from "@components/bottombar";
import { Sidebar } from "@components/sidebar";
import { Topbar } from "@components/topbar";
import { Workspace } from "@components/workspace";
import { useCommandResponse } from "@hooks/use-command-response";
import { invoke } from "@lib/mapped-invoke";
import { cn } from "@lib/utils";
import { emit } from "@tauri-apps/api/event";
import { CommandName, CommandStatus, FrontendEvent } from "@typings/enums";
import { useEvent } from "@util-hooks/use-event";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useEnvironment } from "@zustand/environment-store";
import { useEffect } from "react";

function App() {
  const [setDir, setEntries] = useCurrentDir(state => [
    state.setDir,
    state.setEntries
  ]);

  const [push, updateStatus] = useCallstack(state => [
    state.push,
    state.updateStatus
  ]);

  const resolveBasicDirs = useEnvironment(state => state.resolveBasicdirs);

  useEffect(() => {
    resolveBasicDirs();
    push(CommandName.ListDir, { dir: "C:\\" });
    invoke(CommandName.PollDisks);
  }, []);

  useCommandResponse(CommandName.ListDir, payload => {
    const [id, data, error, isFinished] = payload;

    if (error) {
      console.error(error);
      updateStatus(id, CommandStatus.Error);
      return;
    }

    if (isFinished) {
      updateStatus(id, CommandStatus.Success);

      const [dir, entries] = data!;

      setDir(dir);
      setEntries(entries);
      return;
    }
  });

  useEvent(window, "beforeunload", () => emit(FrontendEvent.BeforeUnload));

  return (
    <div
      className={cn(
        "w-screen h-screen",
        "select-none"
        // os() === "linux" && "font-semibold"
      )}
    >
      <Topbar />
      <div
        className={cn("w-full h-[calc(100vh-3.5rem)]", "fixed top-8", "flex gap-0")}
      >
        <Sidebar />
        <Workspace />
      </div>
      <Bottombar />
    </div>
  );
}

export { App };
