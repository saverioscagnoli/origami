import React, { ReactNode } from "react";
import { cn } from "~/lib/utils";

/**
 * Represents a button in the topbar,
 * the ones that are used to close, minimize, and maximize the window
 */

type TopbarButtonProps = {
  icon: ReactNode;
  className?: string;
  onClick: () => void;
};

const TopbarButton: React.FC<TopbarButtonProps> = ({
  icon,
  className,
  onClick
}) => {
  return (
    <button
      className={cn(
        "w-9 h-full",
        "inline-flex items-center justify-center",
        "transition-colors duration-100",
        className
      )}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export { TopbarButton };
