import { GlobalStatesContext } from "@contexts/global-states";
import { useAccessor } from "@hooks/use-accessor";
import { useProvider } from "@hooks/use-provider";
import { Entry } from "@types";

const GlobalStatesProvider = useProvider(GlobalStatesContext, () => {
  const clipboardEntries = useAccessor<[Entry[], boolean] | null>(null);

  return { clipboardEntries };
});

export { GlobalStatesProvider };
