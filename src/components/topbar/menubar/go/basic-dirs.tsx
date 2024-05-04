import { For } from "@components/for";
import { Menubar } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useEnvironment } from "@hooks/use-environment";
import { basicDirIconMap } from "@lib/utils";
import { sep } from "@tauri-apps/api/path";

const BasicDirsMenuItems = () => {
  const { basicDirs } = useEnvironment();
  const { cd } = useCurrentDir();

  const onSelect = (path: string) => () => {
    cd(path);
  };

  return (
    <For of={basicDirs}>
      {({ path, icon }) => (
        <Menubar.Item
          key={path}
          leftIcon={basicDirIconMap.get(icon)}
          onSelect={onSelect(path)}
        >
          {path.split(sep()).pop()}
        </Menubar.Item>
      )}
    </For>
  );
};

export { BasicDirsMenuItems };
