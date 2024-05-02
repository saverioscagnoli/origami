import { Bottombar } from "@components/bottombar";
import { CreateDialog } from "@components/dialogs";
import { Sidebar } from "@components/sidebar";
import { Topbar } from "@components/topbar";
import { Workspace } from "@components/workspace";
import { useCallstack } from "@hooks/use-callstack";
import { useDispatchers } from "@hooks/use-dispatchers";
import { useSettings } from "@hooks/use-settings";
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
import { useEffect, useRef } from "react";

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

  const { cd, updateOpStatus, popOp } = useDispatchers();

  // Fetch the home directory and list its contents on app start

  useEffect(() => {
    invoke(Command.StartDisks)
      .then(() => homeDir())
      .then(home => cd(home)());
  }, []);

  // Logic to navigate to the start directory on app start
  const started = useRef<boolean>(false);

  setupHotkeys();

  const callstack = useCallstack();

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

  const { theme } = useSettings();

  useEffect(() => {
    document.documentElement.classList.add("light", "dark");

    switch (theme) {
      case "light": {
        document.documentElement.classList.remove("dark");
        break;
      }

      case "dark": {
        document.documentElement.classList.remove("light");
        break;
      }

      case "system": {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.add("light");
        }
      }
    }
  }, [theme]);

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
        <>
          <CreateDialog />
        </>
        <Sidebar />
        <Workspace />
      </div>
      <Bottombar />
    </div>
  );
}

export default App;
