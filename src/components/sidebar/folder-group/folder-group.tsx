import { For } from "@components/for";
import { cn } from "@lib/utils";
import { SidebarFolder } from "./folder";
import { sep } from "@tauri-apps/api/path";
import { useNavigation } from "@contexts/navigation";
import { useEnvironment } from "@contexts/environment";

const SidebarFolderGroup = () => {
  const { cd } = useNavigation();
  const { basicDirs } = useEnvironment();

  return (
    <div className={cn("flex flex-col", "py-4")}>
      <For of={basicDirs}>
        {({ path, icon }) => (
          <SidebarFolder
            key={path}
            icon={icon}
            name={path.split(sep()).pop()}
            onClick={cd(path)}
          />
        )}
      </For>
    </div>
  );
};

export { SidebarFolderGroup };
