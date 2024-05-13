import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName, CommandStatus } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";

function listDirListen() {
  const updateStatus = useCallstack(state => state.updateStatus);
  const setSearching = useGlobalStates(state => state.setSearching);
  const [setDir, addEntries, setEntries, replaceSelected] = useCurrentDir(state => [
    state.setDir,
    state.addEntries,
    state.setEntries,
    state.replaceSelected
  ]);

  let first = false;

  useCommandResponse(CommandName.ListDir, payload => {
    const [id, data, error, isFinished] = payload;

    if (error) {
      updateStatus(id, CommandStatus.Error);
      alert(error);
      return;
    }

    console.log("ListDir", data);

    if (!first) {
      setEntries([]);
      setSearching({ query: "" });
      replaceSelected([]);

      first = true;
    }

    if (data) {
      const [_, entries] = data;
      addEntries(entries);
    }

    if (isFinished) {
      updateStatus(id, CommandStatus.Success);

      const [dir, _] = data!;
      setDir(dir);

      first = false;
      return;
    }
  });
}

export { listDirListen };
