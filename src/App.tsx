import { Bottombar } from "@components/bottombar";
import { CreateDialog } from "@components/dialogs";
import { Sidebar } from "@components/sidebar";
import { Topbar } from "@components/topbar";
import { Workspace } from "@components/workspace";
import { startCommandListeners } from "@lib/command-listeners";
import { startHotkeyListeners } from "@lib/hotkeys";
import { invoke } from "@lib/mapped-invoke";
import { cn } from "@lib/utils";
import { emit } from "@tauri-apps/api/event";
import { BasicDirLabel, CommandName, FrontendEvent } from "@typings/enums";
import { useEvent } from "@util-hooks/use-event";
import { useCallstack } from "@zustand/callstack-store";
import { useEnvironment } from "@zustand/environment-store";
import { useEffect } from "react";

function App() {
  const [basicDirs, resolveBasicDirs] = useEnvironment(state => [
    state.basicDirs,
    state.resolveBasicdirs
  ]);

  /**
   * On app start.
   * Reslve basic user directories.
   * Start disk polling.
   */
  useEffect(() => {
    resolveBasicDirs();
    invoke(CommandName.PollDisks);
    invoke(CommandName.BuildIndex);
  }, []);

  const push = useCallstack(state => state.push);

  /**
   * On basic directories resolved (app start).
   * Cd into home directory.
   */
  useEffect(() => {
    const home = basicDirs.find(dir => dir.label === BasicDirLabel.Home);

    if (home) {
      push(CommandName.ListDir, { dir: home.path });
    }
  }, [basicDirs]);

  /**
   * Start command listeners.
   */
  startCommandListeners();

  /**
   * Start hotkey listeners
   */
  startHotkeyListeners();

  useEvent(window, "beforeunload", () => emit(FrontendEvent.BeforeUnload));
  useEvent("contextmenu", e => e.preventDefault());

  return (
    <div className={cn("w-screen h-screen", "select-none")}>
      <Topbar />
      <div
        className={cn("w-full h-[calc(100vh-3.5rem)]", "fixed top-8", "flex gap-0")}
      >
        <Sidebar />
        <>
          <CreateDialog />
        </>
        <Workspace />
      </div>
      <Bottombar />
    </div>
  );
}

export { App };
