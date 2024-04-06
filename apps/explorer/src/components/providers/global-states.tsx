import { GlobalStatesContext } from "@contexts/global-states";
import { useAccessor } from "@hooks/use-accessor";
import { useProvider } from "@hooks/use-provider";
import { Entry } from "@types";

const GlobalStatesProvider = useProvider(GlobalStatesContext, () => {
  const clipboardEntries = useAccessor<[Entry[], boolean] | null>(null);
  const renaming = useAccessor<Entry | null>(null);
  const searching = useAccessor<boolean>(false);
  const searchQuery = useAccessor<string>("");
  const creating = useAccessor<boolean>(false);
  const dragging = useAccessor<boolean>(false);

  return { clipboardEntries, renaming, searching, searchQuery, creating, dragging };
});

export { GlobalStatesProvider };
