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
import { setupHotkeys } from "@lib/hotkeys";
import { homeDir } from "@tauri-apps/api/path";
import { emit } from "@tauri-apps/api/event";
import { EventToBackend } from "@typings/events";
import { useAccessor } from "@hooks/use-accessor";
import { Callstack } from "@lib/callstack";
import { useCallstack } from "@contexts/callstack";
import { useNavigation } from "@contexts/navigation";

function App() {
  const os = useAccessor<string>("");
  const { cd } = useNavigation();

  useEffect(() => {
    invoke(Command.StartWatching)
      .then(() => invoke(Command.StartDisks))
      .then(() => invoke(Command.GetOs))
      .then(os.set)
      .then(() => homeDir())
      .then(home => cd(home)());
  }, []);

  useEvent("contextmenu", e => e.preventDefault());

  useEvent(window, "beforeunload", () => {
    emit(EventToBackend.BeforeUnload).then(() => invoke(Command.StopAll));
  });

  setupHotkeys();

  return (
    <div
      className={cn(
        "w-screen h-screen",
        "select-none",
        os() === "linux" && "font-semibold"
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

export default App;
