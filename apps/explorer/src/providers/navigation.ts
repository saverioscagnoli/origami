import { NavigationContext } from "@contexts/navigation";
import { useCurrentDir } from "@hooks/use-current-dir";
import { createContextProvider } from "@lib/utils";
import { invoke } from "@tauri-apps/api/core";
import { Command } from "@typings/command";

// @ts-ignore
const NavigationProvider = createContextProvider(NavigationContext, () => {
  const { dir, selected } = useCurrentDir();

  const cd = (path: string) => () => {
    selected.reset();
    invoke(Command.RequestDirListing, { path });
  };

  const openFile = (paths: string[]) => () => {
    const promises = [];

    for (const path of paths) {
      promises.push(invoke(Command.OpenFile, { path }));
    }

    Promise.all(promises);
  };

  const reload = () => cd(dir())();

  const starEntries = () => {
    const promises = [];

    for (const path of selected().getPaths()) {
      promises.push(invoke(Command.StarEntry, { path }));
    }

    Promise.all(promises);
    reload();
  };

  const unstarEntries = () => {
    const promises = [];

    for (const { name } of selected().getEntries()) {
      promises.push(invoke(Command.UnstarEntry, { name }));
    }

    Promise.all(promises);
    reload();
  };

  const deleteEntries = () => {
    const promises = [];

    for (const [path, { name, isStarred }] of selected().getKeyValues()) {
      promises.push(invoke(Command.DeleteEntry, { path }));

      if (isStarred) {
        promises.push(invoke(Command.UnstarEntry, { name }));
      }
    }

    Promise.all(promises);
    reload();
  };

  return { cd, openFile, reload, starEntries, unstarEntries, deleteEntries };
});

export { NavigationProvider };
