import { For } from "@components/for";
import { Menubar } from "@components/tredici";
import { invoke } from "@lib/mapped-invoke";
import { sep } from "@tauri-apps/api/path";
import { CommandName } from "@typings/enums";
import { useEnvironment } from "@zustand/environment-store";

const BasicDirsMenuItems = () => {
  const basicDirs = useEnvironment(state => state.basicDirs);

  return (
    <For of={basicDirs}>
      {({ path, icon }) => (
        <Menubar.Item
          key={path}
          leftIcon={icon}
          onSelect={() => invoke(CommandName.ListDir, { dir: path })}
        >
          {path.split(sep()).pop()}
        </Menubar.Item>
      )}
    </For>
  );
};

export { BasicDirsMenuItems };
