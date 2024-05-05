import { invoke } from "@lib/mapped-invoke";
import { Command } from "@typings/enums";
import { useCurrentDir } from "./use-current-dir";
import { useGlobalStates } from "./use-global-states";

function useCommands() {
  const { renaming, setRenaming, setError } = useGlobalStates();
  const { reload } = useCurrentDir();

  const renameEntry = async (newName: string) => {
    if (!renaming) return;

    setRenaming(null);
    const [_, err] = await invoke(Command.RenameEntry, {
      path: renaming.path,
      newName
    });

    if (err) {
      setError(err);
      return;
    }

    reload();
  };

  return { renameEntry };
}

export { useCommands };
