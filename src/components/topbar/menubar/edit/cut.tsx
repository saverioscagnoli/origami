import { Menubar } from "@components/tredici";
import { useGlobalStates } from "@contexts/global-states";
import { useCurrentDir } from "@hooks/use-current-dir";
import { ScissorsIcon } from "@radix-ui/react-icons";

const CutMenuItem = () => {
  const { selected } = useCurrentDir();
  const { cutting, copying } = useGlobalStates();

  const onSelect = () => {
    cutting.set(selected);
    copying.set([]);
  };

  return (
    <Menubar.Item leftIcon={<ScissorsIcon />} onSelect={onSelect}>
      Cut
    </Menubar.Item>
  );
};

export { CutMenuItem };
