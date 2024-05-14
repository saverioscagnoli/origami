import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";

function listDirListen() {
  const setSearching = useGlobalStates(state => state.setSearching);
  const [setDir, addEntries, setEntries, replaceSelected] = useCurrentDir(state => [
    state.setDir,
    state.addEntries,
    state.setEntries,
    state.replaceSelected
  ]);

  let first = false;

  useCommandResponse(CommandName.ListDir, payload => {
    const [data, error, isFinished] = payload;

    if (error) {
      alert(error);
      return;
    }

    if (!first) {
      setEntries([]);
      setSearching({ query: "" });
      replaceSelected([]);

      first = true;
    }

    if (data) {
      const [_, entries] = data;
      addEntries(entries);
    }

    if (isFinished) {
      const [dir, _] = data!;
      setDir(dir);

      first = false;
      return;
    }
  });
}

export { listDirListen };
