import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";

function pasteEntriesListen() {
  const [dir, addEntries] = useCurrentDir(s => [s.dir, s.addEntries]);
  const setError = useGlobalStates(state => state.setError);

  useCommandResponse(
    CommandName.PasteEntries,
    payload => {
      const [data, error, isFinished] = payload;

      if (error) {
        setError(error);
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
