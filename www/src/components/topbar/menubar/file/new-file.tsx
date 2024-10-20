import { FilePlusIcon } from "@radix-ui/react-icons";
import { Menubar } from "~/components/tredici";
import { useStates } from "~/zustand/states";

const NewFileMenuItem = () => {
  const setCreating = useStates(s => s.setCreating);

  const onSelect = () => {
    setCreating({ state: true, isDir: false });
  };

  return (
    <Menubar.Item
      leftIcon={<FilePlusIcon />}
      shortcut="Ctrl + N"
      onSelect={onSelect}
    >
      New File...
    </Menubar.Item>
  );
};

export { NewFileMenuItem };
