import { Menubar } from "@components/tredici";
import { FilePlusIcon } from "@radix-ui/react-icons";
import { useGlobalStates } from "@zustand/global-states-store";

const NewFileMenuItem = () => {
  const setCreating = useGlobalStates(state => state.setCreating);

  const onSelect = () => {
    setCreating({ state: true, isDir: false });
  };

  return (
    <Menubar.Item leftIcon={<FilePlusIcon />} shortcut="Ctrl + N" onSelect={onSelect}>
      New File...
    </Menubar.Item>
  );
};

export { NewFileMenuItem };
