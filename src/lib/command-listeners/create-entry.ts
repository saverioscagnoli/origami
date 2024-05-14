import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";

function createEntryListen() {
  const [entries, setEntries, replaceSelected] = useCurrentDir(s => [
    s.entries,
    s.setEntries,
    s.replaceSelected
  ]);

  const setError = useGlobalStates(state => state.setError);

  useCommandResponse(
    CommandName.CreateEntry,
    payload => {
      const [data, error, isFinished] = payload;

      if (error) {
        setError(error);
        return;
      }

      if (isFinished) {
        setEntries([...entries, data!]);
        replaceSelected([data!]);
      }
    },
    [entries]
  );
}

export { createEntryListen };
