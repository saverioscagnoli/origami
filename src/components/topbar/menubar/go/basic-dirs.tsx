import { For } from "@components/for";
import { Menubar } from "@components/tredici";
import { useEnvironment } from "@contexts/environment";
import { useDispatchers } from "@hooks/use-dispatchers";
import { sep } from "@tauri-apps/api/path";

const BasicDirsMenuItems = () => {
  const { basicDirs } = useEnvironment();
  const { cd } = useDispatchers();

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
