import { GlobalStatesContext } from "@contexts/global-states";
import { useAccessor } from "@hooks/use-accessor";
import { EntryMap } from "@lib/entry-map";
import { createContextProvider } from "@lib/utils";
import { DirEntry } from "@typings/dir-entry";

const GlobalStatesProvider = createContextProvider(GlobalStatesContext, () => {
  const renaming = useAccessor<[string, DirEntry]>([null, null]);
  const cutting = useAccessor<EntryMap | null>(null);
  const copying = useAccessor<EntryMap | null>(null);

  return {
    renaming,
    cutting,
    copying,
  };
});

export { GlobalStatesProvider };
