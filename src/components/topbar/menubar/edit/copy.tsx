import { Menubar } from "@components/tredici";
import { useGlobalStates } from "@contexts/global-states";
import { useCurrentDir } from "@hooks/use-current-dir";
import { CopyIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const CopyMenuItem = () => {
  const { selected } = useCurrentDir();
  const { cutting, copying } = useGlobalStates();

  const disabled = useMemo(() => selected.length === 0, [selected]);

  const onSelect = () => {
    copying.set(selected);
    cutting.set([]);
  };

  return (
    <Menubar.Item leftIcon={<CopyIcon />} disabled={disabled} onSelect={onSelect}>
      Copy
    </Menubar.Item>
  );
};

export { CopyMenuItem };
