import { GlobalStatesContext } from "@contexts/global-states";
import { useAccessor } from "@hooks/use-accessor";
import { createContextProvider } from "@lib/utils";
import { DirEntry } from "@typings/dir-entry";

const GlobalStatesProvider = createContextProvider(GlobalStatesContext, () => {
  const renaming = useAccessor<[string, DirEntry]>([null, null]);

  return {
    renaming
  };
});

export { GlobalStatesProvider };
