import { invoke } from "@lib/mapped-invoke";
import { Command } from "@typings/enums";
import { useCurrentDir } from "./use-current-dir";
import { useGlobalStates } from "./use-global-states";

function useCommands() {
  const { renaming, setRenaming, setErrors, setCutting, setCopying } =
    useGlobalStates();
  const { reload } = useCurrentDir();

  const renameEntry = async (newName: string) => {
    if (!renaming) return;

    setRenaming(null);
    const [_, err] = await invoke(Command.RenameEntry, {
      path: renaming.path,
      newName
    });

    if (err) {
      setErrors([err]);
      return;
    }

    reload();
  };

  const deleteEntries = async (paths: string[]) => {
    const [_, errors] = await invoke(Command.DeleteEntries, { paths });

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    reload();
  };

  const createEntry = async (path: string, isDir: boolean) => {
    const [_, error] = await invoke(Command.CreateEntry, { path, isDir });

    if (error) {
      setErrors([error]);
      return;
    }

    reload();
  };

  const starEntries = async (paths: string[]) => {
    const [_, errors] = await invoke(Command.StarEntries, { paths });

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    reload();
  };

  const unstarEntries = async (paths: string[]) => {
    const [_, errors] = await invoke(Command.UnstarEntries, { paths });

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    reload();
  };

  const pasteEntries = async (
    paths: string[],
    newDir: string,
    isCutting: boolean
  ) => {
    setCutting([]);
    setCopying([]);

    const [_, errors] = await invoke(Command.PasteEntries, {
      paths,
      newDir,
      isCutting
    });

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    reload();
  };

  return {
    renameEntry,
    deleteEntries,
    createEntry,
    starEntries,
    unstarEntries,
    pasteEntries
  };
}

export { useCommands };
