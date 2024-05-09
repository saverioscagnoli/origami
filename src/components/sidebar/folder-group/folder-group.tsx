import { For } from "@components/for";
import { cn } from "@lib/utils";
import { sep } from "@tauri-apps/api/path";
import { CommandName } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";
import { useEnvironment } from "@zustand/environment-store";
import { SidebarFolder } from "./folder";

const SidebarFolderGroup = () => {
  const basicDirs = useEnvironment(state => state.basicDirs);
  const push = useCallstack(state => state.push);

  return (
    <div className={cn("flex flex-col", "py-4")}>
      <For of={basicDirs}>
        {({ path, icon }) => (
          <SidebarFolder
            key={path}
            icon={icon}
            name={path.split(sep()).pop()!}
            onClick={() => push(CommandName.ListDir, { dir: path })}
          />
        )}
      </For>
    </div>
  );
};

export { SidebarFolderGroup };
