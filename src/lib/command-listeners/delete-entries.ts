import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";

function deleteEntriesListen() {
  const [entries, removeEntries, replaceSelected] = useCurrentDir(s => [
    s.entries,
    s.removeEntries,
    s.replaceSelected
  ]);

  useCommandResponse(
    CommandName.DeleteEntries,
    payload => {
      const [data, error, isFinished] = payload;

      if (error) {
        replaceSelected([]);
        alert(error);
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
