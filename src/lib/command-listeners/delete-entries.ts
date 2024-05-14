import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";

function deleteEntriesListen() {
  const [entries, removeEntries, replaceSelected] = useCurrentDir(s => [
    s.entries,
    s.removeEntries,
    s.replaceSelected
  ]);

  const setError = useGlobalStates(state => state.setError);

  useCommandResponse(
    CommandName.DeleteEntries,
    payload => {
      const [data, error, isFinished] = payload;

      if (error) {
        replaceSelected([]);
        setError(error);
        return;
      }

      removeEntries([data!]);

      if (isFinished) {
        replaceSelected([]);
        return;
      }
    },
    [entries]
  );
}

export { deleteEntriesListen };
