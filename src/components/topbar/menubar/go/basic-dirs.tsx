import { For } from "@components/for";
import { Menubar } from "@components/tredici";
import { sep } from "@tauri-apps/api/path";
import { CommandName } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";
import { useEnvironment } from "@zustand/environment-store";

const BasicDirsMenuItems = () => {
  const basicDirs = useEnvironment(state => state.basicDirs);
  const push = useCallstack(state => state.push);

  return (
    <For of={basicDirs}>
      {({ path, icon }) => (
        <Menubar.Item
          leftIcon={icon}
          onSelect={() => push(CommandName.ListDir, { dir: path })}
        >
          {path.split(sep()).pop()}
        </Menubar.Item>
      )}
    </For>
  );
};

export { BasicDirsMenuItems };
