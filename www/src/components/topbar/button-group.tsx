import { Cross1Icon, MinusIcon, SquareIcon } from "@radix-ui/react-icons";
import { Quit, WindowMinimise, WindowToggleMaximise } from "@wails/runtime";
import { cn } from "~/lib/utils";
import { TopbarButton } from "./button";

const ButtonGroup = () => {
  return (
    <div id="topbar-button-group" className={cn("w-fit h-full", "flex gap-0")}>
      <TopbarButton
        id="topbar-button-minimize"
        icon={<MinusIcon />}
        onClick={WindowMinimise}
      />
      <TopbarButton
        id="topbar-button-toggle-maximize"
        icon={<SquareIcon />}
        onClick={WindowToggleMaximise}
      />
      <TopbarButton
        id="topbar-button-close"
        icon={<Cross1Icon />}
        onClick={Quit}
        danger
      />
    </div>
  );
};

export { ButtonGroup };
