import React, { MouseEventHandler, ReactNode } from "react";
import { cn } from "~/lib/utils";

type TopbarButtonProps = {
  id: string;
  icon: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;

  /* Whether the button should be red */
  danger?: boolean;
};

const TopbarButton: React.FC<TopbarButtonProps> = ({
  id,
  icon,
  onClick,
  danger
}) => {
  return (
    <button
      id={id}
      className={cn(
        "w-10 h-full",
        "inline-flex items-center justify-center",
        danger
          ? "hover:bg-[--red-10] hover:text-[--slate-1] dark:hover:text-[--slate-12]"
          : "hover:bg-[--gray-3]",
        "transition-colors duration-100"
      )}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export { TopbarButton };
