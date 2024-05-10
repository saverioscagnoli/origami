import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName, CommandStatus } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";

function renameEntryListen() {
  const updateStatus = useCallstack(state => state.updateStatus);
  const [entries, setEntries] = useCurrentDir(s => [s.entries, s.setEntries]);

  useCommandResponse(
    CommandName.RenameEntry,
    payload => {
      const [id, data, error, isFinished] = payload;

      if (error) {
        updateStatus(id, CommandStatus.Error);
        alert(error);
        return;
      }

      if (isFinished) {
        updateStatus(id, CommandStatus.Success);

        const [oldPath, newEntry] = data!;

        setEntries(
          entries.map(entry => {
            if (entry.path === oldPath) {
              return newEntry;
            }
            return entry;
          })
        );
        return;
      }
    },
    [entries]
  );
}

export { renameEntryListen };
