import { BoxIcon, Cross1Icon, MinusIcon } from "@radix-ui/react-icons";
import { Quit, WindowMinimise, WindowToggleMaximise } from "@wails/runtime";
import React from "react";
import { cn } from "~/lib/utils";
import { TopbarButton } from "./button";

const TopbarButtonGroup: React.FC = () => {
  return (
    <div className={cn("w-fit h-full", "flex")}>
      <TopbarButton
        icon={<MinusIcon />}
        className={cn("hover:bg-[--gray-3]")}
        onClick={WindowMinimise}
      />
      <TopbarButton
        icon={<BoxIcon width={13} height={13} />}
        className={cn("hover:bg-[--gray-3]")}
        onClick={WindowToggleMaximise}
      />
      <TopbarButton
        icon={<Cross1Icon />}
        className={cn(
          "hover:bg-[--red-10] hover:text-[--slate-1]",
          "dark:hover:text-[--slate-12]"
        )}
        onClick={Quit}
      />
    </div>
  );
};

export { TopbarButtonGroup };
