import { Menubar } from "@components/tredici";
import { useGlobalStates } from "@contexts/global-states";
import { useDispatchers } from "@hooks/use-dispatchers";
import { ClipboardIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const PasteMenuItem = () => {
  const { cutting, copying } = useGlobalStates();
  const { pasteEntries } = useDispatchers();

  const disabled = useMemo(
    () => cutting().length === 0 && copying().length === 0,
    [cutting(), copying()]
  );

  return (
    <Menubar.Item
      leftIcon={<ClipboardIcon />}
      disabled={disabled}
      onSelect={pasteEntries}
    >
      Paste
    </Menubar.Item>
  );
};

export { PasteMenuItem };

