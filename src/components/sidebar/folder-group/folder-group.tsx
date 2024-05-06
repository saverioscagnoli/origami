import { For } from "@components/for";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useEnvironment } from "@hooks/use-environment";
import { cn } from "@lib/utils";
import { sep } from "@tauri-apps/api/path";
import { SidebarFolder } from "./folder";

const SidebarFolderGroup = () => {
  const { basicDirs } = useEnvironment();
  const { cd } = useCurrentDir();

  return (
    <div className={cn("flex flex-col", "py-4")}>
      <For of={basicDirs}>
        {({ path, icon }) => (
          <SidebarFolder
            key={path}
            icon={icon}
            name={path.split(sep()).pop()}
            onClick={() => cd(path)}
          />
        )}
      </For>
    </div>
  );
};

export { SidebarFolderGroup };
