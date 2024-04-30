import { Bottombar } from "@components/bottombar";
import { Sidebar } from "@components/sidebar";
import { Topbar } from "@components/topbar";
import { Workspace } from "@components/workspace";
import { useCallstack } from "@hooks/use-callstack";
import { useDispatchers } from "@hooks/use-dispatchers";
import { setupHotkeys } from "@lib/hotkeys";
import { currentDirListeners } from "@lib/operation-listeners";
import { OperationStatus } from "@lib/operations";
import { cn } from "@lib/utils";
import { invoke } from "@tauri-apps/api/core";
import { emit } from "@tauri-apps/api/event";
import { homeDir } from "@tauri-apps/api/path";
import { Command } from "@typings/command";
import { EventToBackend } from "@typings/events";
import { useEvent } from "@util-hooks/use-event";
import { useEffect } from "react";

function App() {
  // const os = useAccessor<string>("");
  // const { cd } = useNavigation();

  // useEffect(() => {
  //   invoke(Command.StartWatching)
  //     .then(() => invoke(Command.StartDisks))
  //     .then(() => invoke(Command.GetOs))
  //     .then(os.set)
  //     .then(() => homeDir())
  //     .then(home => cd(home)());
  // }, []);

  //

  currentDirListeners();
  
  // Remove the native context menu
  useEvent("contextmenu", e => e.preventDefault());

  // Emit a beforeunload event to the backend when the window is about to close
  useEvent(window, "beforeunload", () => {
    emit(EventToBackend.BeforeUnload).then(() => invoke(Command.StopAll));
  });

  const callstack = useCallstack();
  const { cd, updateOpStatus, popOp } = useDispatchers();

  // Fetch the home directory and list its contents on app start

  useEffect(() => {
    homeDir()
      .then(path => cd(path)())
      .then(() => invoke(Command.StartDisks));
  }, []);

  setupHotkeys();

  // Every time an operation in pushed to the array, check for its status
  // If it is ready, invoke, the backend function.
  // If it is over, pop it from the array.

  useEffect(() => {
    console.log(callstack.map(op => op.status));

    for (const op of callstack) {
      switch (op.status) {
        case OperationStatus.Ready:
          updateOpStatus(op.id, OperationStatus.Pending);
          invoke(op.type, { opId: op.id, ...op.args });
          break;

        case OperationStatus.Error:
        case OperationStatus.Success:
          popOp(op.id);
          break;
      }
    }
  }, [callstack]);

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

export default App;
