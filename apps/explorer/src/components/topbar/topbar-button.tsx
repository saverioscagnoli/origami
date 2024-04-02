import { cn } from "@utils";
import React, { ReactNode } from "react";

type TopbarButtonProps = {
  icon: ReactNode;
  onClick: () => void;
  danger?: boolean;
};

const TopbarButton: React.FC<TopbarButtonProps> = ({ icon, onClick, danger }) => {
  return (
    <button
      className={cn(
        "w-10 h-8",
        "inline-flex justify-center items-center",
        danger ? "hover:bg-[--red-9]" : "hover:bg-[--gray-3]",
        "transition-colors duration-75 ease-in-out"
      )}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export { TopbarButton };
