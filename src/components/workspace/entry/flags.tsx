import { cn } from "@lib/utils";
import { ArrowLeftIcon, EyeClosedIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { FC } from "react";

type EntryFlagsProps = {
  isHidden: boolean;
  isSymlink: boolean;
  isStarred: boolean;
};

const EntryFlags: FC<EntryFlagsProps> = ({ isHidden, isSymlink, isStarred }) => {
  return (
    <span className={cn("flex items-center gap-2")}>
      <span className={cn(isHidden ? "visible" : "invisible")}>
        <EyeClosedIcon />
      </span>
      <span className={cn(isSymlink ? "visible" : "invisible")}>
        <ArrowLeftIcon />
      </span>
      <span className={cn(isStarred ? "visible" : "invisible")}>
        <StarFilledIcon />
      </span>
    </span>
  );
};

export { EntryFlags };
