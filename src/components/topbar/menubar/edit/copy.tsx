import { Menubar } from "@components/tredici";
import { useGlobalStates } from "@contexts/global-states";
import { useCurrentDir } from "@hooks/use-current-dir";
import { CopyIcon } from "@radix-ui/react-icons";

const CopyMenuItem = () => {
  const { selected } = useCurrentDir();
  const { cutting, copying } = useGlobalStates();

  const onSelect = () => {
    copying.set(selected);
    cutting.set([]);
  };

  return (
    <Menubar.Item leftIcon={<CopyIcon />} onSelect={onSelect}>
      Copy
    </Menubar.Item>
  );
};

export { CopyMenuItem };
