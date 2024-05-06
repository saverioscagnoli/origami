import { Menubar } from "@components/tredici";
import { useGlobalStates } from "@hooks/use-global-states";
import { FilePlusIcon } from "@radix-ui/react-icons";

const NewFileMenuItem = () => {
  const { setCreating } = useGlobalStates();

  const onSelect = () => {
    setCreating({ state: true, isDir: false });
  };

  return (
    <Menubar.Item leftIcon={<FilePlusIcon />} onSelect={onSelect}>
      New File...
    </Menubar.Item>
  );
};

export { NewFileMenuItem };
