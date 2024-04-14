import { For } from "@components/for";
import { useAccessor } from "@hooks/use-accessor";
import { cn, resolveBasicDirs } from "@lib/utils";
import { ReactNode, useEffect } from "react";
import { SidebarFolder } from "./folder";
import { sep } from "@tauri-apps/api/path";
import { useNavigation } from "@hooks/use-navigation";

const SidebarFolderGroup = () => {
  const { cd } = useNavigation();
  const dirs = useAccessor<Map<string, ReactNode>>(new Map());

  useEffect(() => {
    resolveBasicDirs().then(dirs.set);
  }, []);

  return (
    <div className={cn("flex flex-col", "py-4")}>
      <For of={Array.from(dirs().entries())}>
        {([dir, icon], i) => (
          <SidebarFolder
            key={i}
            icon={icon}
            name={dir.split(sep()).pop()}
            onClick={cd(dir)}
          />
        )}
      </For>
    </div>
  );
};

export { SidebarFolderGroup };
