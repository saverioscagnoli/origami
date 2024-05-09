import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName, CommandStatus } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";

function deleteEntriesListen() {
  const updateStatus = useCallstack(state => state.updateStatus);
  const [entries, removeEntries, replaceSelected] = useCurrentDir(s => [
    s.entries,
    s.removeEntries,
    s.replaceSelected
  ]);

  useCommandResponse(
    CommandName.DeleteEntries,
    payload => {
      const [id, data, error, isFinished] = payload;

      if (error) {
        replaceSelected([]);
        updateStatus(id, CommandStatus.Error);
        alert(error);
        return;
      }

      removeEntries([data!]);

      if (isFinished) {
        replaceSelected([]);
        updateStatus(id, CommandStatus.Success);
        return;
      }
    },
    [entries]
  );
}

export { deleteEntriesListen };
