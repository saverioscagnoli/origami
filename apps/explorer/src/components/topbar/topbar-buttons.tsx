import React, { ReactNode } from "react";
import { Cross1Icon, MinusIcon, SquareIcon } from "@radix-ui/react-icons";
import { cn } from "@utils";
import { appWindow } from "@tauri-apps/api/window";

type TopbarButtonProps = {
  onClick: () => void;
  icon: ReactNode;
  quitButton?: boolean;
};

const TopbarButton: React.FC<TopbarButtonProps> = ({
  onClick,
  icon,
  quitButton
}) => {
  return (
    <button
      className={cn(
        "w-10 h-full",
        "inline-flex justify-center items-center",
        quitButton ? "hover:bg-[--tomato-9]" : "hover:bg-[--gray-3]",
        "transition-colors duration-75"
      )}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

const TopbarButtons = () => {
  return (
    <div className={cn("flex items-center")}>
      <TopbarButton icon={<MinusIcon />} onClick={() => appWindow.minimize()} />
      <TopbarButton
        icon={<SquareIcon width={13} height={13} />}
        onClick={() => appWindow.toggleMaximize()}
      />
      <TopbarButton
        icon={<Cross1Icon />}
        onClick={() => appWindow.close()}
        quitButton
      />
    </div>
  );
};

export { TopbarButtons };
