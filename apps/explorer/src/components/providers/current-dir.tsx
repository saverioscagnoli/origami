import { CurrentDirContext } from "@contexts/current-dir";
import { useAccessor } from "@hooks/use-accessor";
import { useProvider } from "@hooks/use-provider";
import { Entry } from "@types";

const CurrentDirProvider = useProvider(CurrentDirContext, () => {
  const dir = useAccessor<string>("");
  const entries = useAccessor<Entry[]>([]);
  const selected = useAccessor<Entry[]>([]);

  return { dir, entries, selected };
});

export { CurrentDirProvider };
