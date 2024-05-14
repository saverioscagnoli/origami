import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";

function renameEntryListen() {
  const [entries, setEntries] = useCurrentDir(s => [s.entries, s.setEntries]);
  const setError = useGlobalStates(state => state.setError);

  useCommandResponse(
    CommandName.RenameEntry,
    payload => {
      const [data, error, isFinished] = payload;

      if (error) {
        setError(error);
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
