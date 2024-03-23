import React, { ReactNode } from "react";
import { Cross1Icon, MinusIcon, SquareIcon } from "@radix-ui/react-icons";
import { invoke } from "@tauri-apps/api";
import { cn } from "@utils";

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
  const minimize = async () => await invoke("minimize");
  const toggleMaximize = async () => await invoke("toggle_maximize");
  const quit = async () => await invoke("quit");

  return (
    <div className={cn("flex")}>
      <TopbarButton icon={<MinusIcon />} onClick={minimize} />
      <TopbarButton
        icon={<SquareIcon width={13} height={13} />}
        onClick={toggleMaximize}
      />
      <TopbarButton icon={<Cross1Icon />} onClick={quit} quitButton />
    </div>
  );
};

export { TopbarButtons };
