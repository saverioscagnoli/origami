import { Menubar } from "@components/tredici";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useMemo } from "react";

const BackMenuItem = () => {
  const [index, goBack] = useCurrentDir(s => [s.historyIndex, s.goBack]);

  const canGoBack = useMemo(() => index > 0, [index]);

  return (
    <Menubar.Item
      leftIcon={<ArrowLeftIcon />}
      shortcut="Ctrl + Left"
      disabled={!canGoBack}
      onSelect={goBack}
    >
      Back
    </Menubar.Item>
  );
};

export { BackMenuItem };
