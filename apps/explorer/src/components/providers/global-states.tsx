import { GlobalStatesContext } from "@contexts/global-states";
import { useAccessor } from "@hooks/use-accessor";
import { useProvider } from "@hooks/use-provider";
import { Entry } from "@types";

const GlobalStatesProvider = useProvider(GlobalStatesContext, () => {
  const clipboardEntries = useAccessor<[Entry[], boolean] | null>(null);
  const renaming = useAccessor<Entry | null>(null);

  return { clipboardEntries, renaming };
});

export { GlobalStatesProvider };
