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
    <span className={cn("w-fit", "flex gap-2")}>
      <span className={cn(is_hidden ? "visible" : "invisible")}>{"🙈"}</span>
      <span className={cn(is_symlink ? "visible" : "invisible")}>{"🔗"}</span>
      <span className={cn(is_starred ? "visible" : "invisible")}>{"⭐"}</span>
    </span>
  );
};

export { EntryFlagsIcons };
