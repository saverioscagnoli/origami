import { cn } from "@lib/utils";
import { TopbarButton } from "./button";
import { Cross1Icon, MinusIcon, SquareIcon } from "@radix-ui/react-icons";
import { getCurrent } from "@tauri-apps/api/window";
import { useMemo } from "react";

const TopbarButtonGroup = () => {
  const win = useMemo(() => getCurrent(), []);

  const min = () => win.minimize();
  const toggle = () => win.toggleMaximize();
  const close = () => win.close();

  return (
    <div id="topbar-button-group" className={cn("w-fit h-full", "flex gap-0")}>
      <TopbarButton id="topbar-button-minimize" icon={<MinusIcon />} onClick={min} />
      <TopbarButton
        id="topbar-button-toggle-maximize"
        icon={<SquareIcon />}
        onClick={toggle}
      />
      <TopbarButton
        id="topbar-button-close"
        icon={<Cross1Icon />}
        onClick={close}
        danger
      />
    </div>
  );
};

export { TopbarButtonGroup };
