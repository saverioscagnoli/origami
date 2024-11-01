import { ArrowLeftIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import React from "react";
import { cn } from "~/lib/utils";

type EntryFlagsProps = {
  isHidden: boolean;
  isSymlink: boolean;
};

const EntryFlags: React.FC<EntryFlagsProps> = ({ isHidden, isSymlink }) => {
  return (
    <span className={cn("flex gap-2")}>
      <EyeClosedIcon
        className={cn("invisible", {
          visible: isHidden
        })}
      />

      <ArrowLeftIcon
        className={cn("invisible", {
          visible: isSymlink
        })}
      />
    </span>
  );
};

export { EntryFlags };
