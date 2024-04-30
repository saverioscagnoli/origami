import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useEvent } from "@util-hooks/use-event";
import { cn } from "@lib/utils";
import { Topbar } from "@components/topbar";
import { Sidebar } from "@components/sidebar";
import { Workspace } from "@components/workspace";
import { Bottombar } from "@components/bottombar";
import { Command } from "@typings/command";
import { Operation, OperationStatus, OperationType } from "@lib/operations";
import { setupHotkeys } from "@lib/hotkeys";
import { homeDir } from "@tauri-apps/api/path";
import { emit } from "@tauri-apps/api/event";
import { EventToBackend } from "@typings/events";
import { useAccessor } from "@hooks/use-accessor";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "redux/store";
import { pop, push, updateStatus } from "@redux/callstack-slice";
import { useTauriEvent } from "@hooks/use-tauri-event";
import { fetchHomeDir } from "@redux/current-dir-slice";
import { currentDirListeners } from "@lib/operation-listeners";
import { useDispatchers } from "@hooks/use-dispatchers";
import { useCallstack } from "@hooks/use-callstack";

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

  // useEvent("contextmenu", e => e.preventDefault());

  // useEvent(window, "beforeunload", () => {
  //   emit(EventToBackend.BeforeUnload).then(() => invoke(Command.StopAll));
  // });

  // setupHotkeys();

  currentDirListeners();

  const callstack = useCallstack();
  const { cd, updateOpStatus, popOp } = useDispatchers();

  // Fetch the home directory and list its contents on app start
  useEffect(() => {
    homeDir()
      .then(path => cd(path)())
      .then(() => invoke(Command.StartDisks));
  }, []);

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
