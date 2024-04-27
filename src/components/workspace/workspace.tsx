import { useCurrentDir } from "@contexts/current-dir";
import { cn } from "@lib/utils";
import List from "rc-virtual-list";
import { Entry } from "./entry";
import { useMemo } from "react";
import { useSettings } from "@contexts/settings";

const Workspace = () => {
  const { entries } = useCurrentDir();
  const { showHidden } = useSettings();

  const filtered = useMemo(
    () =>
      entries()
        .filter(e => showHidden() || !e.isHidden)
        .sort((a, b) => {
          if (a.isDir && !b.isDir) return -1;
          if (!a.isDir && b.isDir) return 1;
          return a.name.localeCompare(b.name);
        }),
    [entries(), showHidden()]
  );
  return (
    <div className={cn("w-full h-full", "overflow-auto")}>
      <List fullHeight itemHeight={24} data={filtered} itemKey="path">
        {entry => {
          return <Entry {...entry} />;
        }}
      </List>
    </div>
  );
};

export { Workspace };
