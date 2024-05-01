import { Menubar } from "@components/tredici";
import { useGlobalStates } from "@contexts/global-states";
import { useCurrentDir } from "@hooks/use-current-dir";
import { ScissorsIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const CutMenuItem = () => {
  const { selected } = useCurrentDir();
  const { cutting, copying } = useGlobalStates();

  const disabled = useMemo(() => selected.length === 0, [selected]);

  const onSelect = () => {
    cutting.set(selected);
    copying.set([]);
  };

  return (
    <Menubar.Item
      leftIcon={<ScissorsIcon />}
      disabled={disabled}
      onSelect={onSelect}
    >
      Cut
    </Menubar.Item>
  );
};

export { CutMenuItem };
