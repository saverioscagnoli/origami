import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";

function pasteEntriesListen() {
  const [dir, addEntries] = useCurrentDir(s => [s.dir, s.addEntries]);

  useCommandResponse(
    CommandName.PasteEntries,
    payload => {
      const [data, error, isFinished] = payload;

      if (error) {
        alert(error);
        return;
      }

      if (data!.path.startsWith(dir)) {
        addEntries([data!]);
      }

      if (isFinished) {
      }
    },
    [dir]
  );
}

export { pasteEntriesListen };
