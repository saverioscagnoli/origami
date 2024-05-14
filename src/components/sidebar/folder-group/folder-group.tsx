import { For } from "@components/for";
import { cn } from "@lib/utils";
import { sep } from "@tauri-apps/api/path";
import { CommandName } from "@typings/enums";
import { useEnvironment } from "@zustand/environment-store";
import { SidebarFolder } from "./folder";
import { invoke } from "@lib/mapped-invoke";

const SidebarFolderGroup = () => {
  const basicDirs = useEnvironment(state => state.basicDirs);

  return (
    <div className={cn("flex flex-col", "py-4")}>
      <For of={basicDirs}>
        {({ path, icon }) => (
          <SidebarFolder
            key={path}
            icon={icon}
            name={path.split(sep()).pop()!}
            onClick={() => invoke(CommandName.ListDir, { dir: path })}
          />
        )}
      </For>
    </div>
  );
};

export { SidebarFolderGroup };
