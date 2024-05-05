import { Menubar } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { CopyIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const CopyMenuItem = () => {
  const { selected } = useCurrentDir();
  const { setCopying } = useGlobalStates();

  const canCopy = useMemo(() => selected.length > 0, [selected]);

  const onSelect = () => {
    setCopying(selected);
  };

  return (
    <Menubar.Item leftIcon={<CopyIcon />} disabled={!canCopy} onSelect={onSelect}>
      Copy
    </Menubar.Item>
  );
};

export { CopyMenuItem };
