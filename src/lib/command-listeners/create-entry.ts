import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName, CommandStatus } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";

function createEntryListen() {
  const updateStatus = useCallstack(s => s.updateStatus);
  const [entries, setEntries, replaceSelected] = useCurrentDir(s => [
    s.entries,
    s.setEntries,
    s.replaceSelected
  ]);

  useCommandResponse(
    CommandName.CreateEntry,
    payload => {
      const [id, data, error, isFinished] = payload;

      if (error) {
        updateStatus(id, CommandStatus.Error);
        alert(error);
        return;
      }

      if (isFinished) {
        updateStatus(id, CommandStatus.Success);
        setEntries([...entries, data!]);
        replaceSelected([data!]);
      }
    },
    [entries]
  );
}

export { createEntryListen };
