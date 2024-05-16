import { For } from "@components/for";
import { cn } from "@lib/utils";
import { sep } from "@tauri-apps/api/path";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useEnvironment } from "@zustand/environment-store";
import { SidebarFolder } from "./folder";

const SidebarFolderGroup = () => {
  const basicDirs = useEnvironment(state => state.basicDirs);
  const cd = useCurrentDir(state => state.cd);

  const onClick = (dir: string) => () => cd(dir);

  return (
    <div className={cn("flex flex-col", "py-4")}>
      <For of={basicDirs}>
        {({ path, icon }) => (
          <SidebarFolder
            key={path}
            icon={icon}
            name={path.split(sep()).pop()!}
            onClick={onClick(path)}
          />
        )}
      </For>
    </div>
  );
};

export { SidebarFolderGroup };
