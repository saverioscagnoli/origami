import { cn } from "@lib/utils";
import {
  ArrowLeftIcon,
  ClipboardIcon,
  EyeClosedIcon,
  ScissorsIcon,
  StarFilledIcon
} from "@radix-ui/react-icons";
import { FC } from "react";

type EntryFlagsProps = {
  isHidden: boolean;
  isSymlink: boolean;
  isStarred: boolean;
  isCutting: boolean;
  isCopying: boolean;
};

const EntryFlags: FC<EntryFlagsProps> = ({
  isHidden,
  isSymlink,
  isStarred,
  isCutting,
  isCopying
}) => {
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
      <span className={cn(isCutting ? "visible" : "invisible")}>
        <ScissorsIcon />
      </span>
      <span className={cn(isCopying ? "visible" : "invisible")}>
        <ClipboardIcon />
      </span>
    </span>
  );
};

export { EntryFlags };
