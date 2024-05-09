import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName, CommandStatus } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";

function listDirListen() {
  const updateStatus = useCallstack(state => state.updateStatus);
  const [setDir, setEntries, replaceSelected] = useCurrentDir(state => [
    state.setDir,
    state.setEntries,
    state.replaceSelected
  ]);

  useCommandResponse(CommandName.ListDir, payload => {
    const [id, data, error, isFinished] = payload;

    if (error) {
      updateStatus(id, CommandStatus.Error);
      alert(error);
      return;
    }

    if (isFinished) {
      updateStatus(id, CommandStatus.Success);

      const [dir, entries] = data!;

      setDir(dir);
      setEntries(entries);
      replaceSelected([]);
      return;
    }
  });
}

export { listDirListen };