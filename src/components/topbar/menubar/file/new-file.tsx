import { Menubar } from "@components/tredici";
import { useGlobalStates } from "@contexts/global-states";
import { FilePlusIcon } from "@radix-ui/react-icons";

const NewFileMenuItem = () => {
  const { creating } = useGlobalStates();

  const onSelect = () => {
    creating.set({ state: true, isDir: false });
  };

  return (
    <Menubar.Item leftIcon={<FilePlusIcon />} onSelect={onSelect}>
      New File
    </Menubar.Item>
  );
};

export { NewFileMenuItem };
