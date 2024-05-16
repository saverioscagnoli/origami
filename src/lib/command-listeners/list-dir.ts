import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";

function listDirListen() {
  const [setSearching, setError] = useGlobalStates(state => [
    state.setSearching,
    state.setError
  ]);

  const [setDir, addEntries, setEntries, replaceSelected, setChanging] =
    useCurrentDir(state => [
      state.setDir,
      state.addEntries,
      state.setEntries,
      state.replaceSelected,
      state.setChanging
    ]);

  let first = false;

  useCommandResponse(CommandName.ListDir, payload => {
    const [data, error, isFinished] = payload;

    if (error) {
      setError(error);
      setChanging(false);
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
