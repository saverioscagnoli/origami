import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";

function renameEntryListen() {
  const [entries, setEntries] = useCurrentDir(s => [s.entries, s.setEntries]);

  useCommandResponse(
    CommandName.RenameEntry,
    payload => {
      const [data, error, isFinished] = payload;

      if (error) {
        alert(error);
        return;
      }

      if (isFinished) {
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
