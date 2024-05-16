import { For } from "@components/for";
import { Menubar } from "@components/tredici";
import { sep } from "@tauri-apps/api/path";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useEnvironment } from "@zustand/environment-store";

const BasicDirsMenuItems = () => {
  const basicDirs = useEnvironment(state => state.basicDirs);
  const cd = useCurrentDir(state => state.cd);

  const onSelect = (dir: string) => () => cd(dir);

  return (
    <For of={basicDirs}>
      {({ path, icon }) => (
        <Menubar.Item key={path} leftIcon={icon} onSelect={onSelect(path)}>
          {path.split(sep()).pop()}
        </Menubar.Item>
      )}
    </For>
  );
};

export { BasicDirsMenuItems };
