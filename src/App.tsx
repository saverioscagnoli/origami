import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useEvent } from "@util-hooks/use-event";
import { cn } from "@lib/utils";
import { Topbar } from "@components/topbar";
import { Sidebar } from "@components/sidebar";
import { Workspace } from "@components/workspace";
import { Bottombar } from "@components/bottombar";
import { Command } from "@typings/command";
import { OperationType } from "@lib/operations";
import { operations } from "main";
import { setupHotkeys } from "@lib/hotkeys";
import { homeDir } from "@tauri-apps/api/path";

function App() {
  useEffect(() => {
    invoke(Command.StartWatching)
      .then(() => homeDir())
      .then(home => operations.push(OperationType.ListDir, { path: home }));
  }, []);

  useEvent("contextmenu", e => e.preventDefault());
  useEvent(window, "beforeunload", () => invoke(Command.StopAll));

  setupHotkeys();

  return (
    <div className={cn("w-screen h-screen", "select-none")}>
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

export default App;
