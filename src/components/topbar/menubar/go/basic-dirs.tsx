import { For } from "@components/for";
import { Menubar } from "@components/tredici";
import { useEnvironment } from "@contexts/environment";
import { useNavigation } from "@contexts/navigation";
import { sep } from "@tauri-apps/api/path";

const BasicDirsMenuItems = () => {
  const { cd } = useNavigation();
  const { basicDirs } = useEnvironment();

  return (
    <For of={basicDirs}>
      {({ path, icon }) => (
        <Menubar.Item key={path} leftIcon={icon} onClick={cd(path)}>
          {path.split(sep()).pop()}
        </Menubar.Item>
      )}
    </For>
  );
};

export { BasicDirsMenuItems };
