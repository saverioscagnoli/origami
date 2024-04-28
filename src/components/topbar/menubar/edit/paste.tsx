import { Menubar } from "@components/tredici";
import { useGlobalStates } from "@contexts/global-states";
import { ClipboardIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const PasteMenuItem = () => {
  const { cutting, copying } = useGlobalStates();

  const disabled = useMemo(() => cutting().length === 0 && copying().length === 0, [cutting(), copying()]);

  return (
    <Menubar.Item leftIcon={<ClipboardIcon />} disabled={disabled}>
      Paste
    </Menubar.Item>
  );
};

export { PasteMenuItem };
