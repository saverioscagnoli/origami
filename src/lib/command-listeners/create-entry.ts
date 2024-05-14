import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";

function createEntryListen() {
  const [entries, setEntries, replaceSelected] = useCurrentDir(s => [
    s.entries,
    s.setEntries,
    s.replaceSelected
  ]);

  useCommandResponse(
    CommandName.CreateEntry,
    payload => {
      const [data, error, isFinished] = payload;

      if (error) {
        alert(error);
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
