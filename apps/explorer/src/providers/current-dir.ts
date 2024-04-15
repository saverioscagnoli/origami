import { CurrentDirContext } from "@contexts/current-dir";
import { useAccessor } from "@hooks/use-accessor";
import { EntryMap } from "@lib/entry-map";
import { createContextProvider } from "@lib/utils";
import { DirEntry } from "@typings/dir-entry";

const CurrentDirProvider = createContextProvider(CurrentDirContext, () => {
  const dir = useAccessor<string>("");
  const entries = useAccessor<EntryMap<string, DirEntry>>(new EntryMap());
  const selected = useAccessor<EntryMap<string, DirEntry>>(new EntryMap());
  const changing = useAccessor<boolean>(false);

  return { dir, entries, selected, changing };
});

export { CurrentDirProvider };
