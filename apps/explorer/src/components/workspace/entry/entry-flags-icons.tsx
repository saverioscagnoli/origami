import { ArrowLeftIcon, EyeClosedIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { cn } from "@utils";
import React from "react";

type EntryFlagsIconsProps = {
  is_hidden: boolean;
  is_symlink: boolean;
  is_starred: boolean;
};

const EntryFlagsIcons: React.FC<EntryFlagsIconsProps> = ({
  is_hidden,
  is_symlink,
  is_starred
}) => {
  return (
    <span className={cn("flex gap-2")}>
      <span className={cn(is_hidden ? "visible" : "invisible")}>
        <EyeClosedIcon />
      </span>
      <span className={cn(is_symlink ? "visible" : "invisible")}>
        <ArrowLeftIcon />
      </span>
      <span className={cn(is_starred ? "visible" : "invisible")}>
        <StarFilledIcon />
      </span>
    </span>
  );
};

export { EntryFlagsIcons };
