import { cn } from "@lib/utils";
import { ArrowLeftIcon, ClipboardIcon, EyeClosedIcon, ScissorsIcon, StarFilledIcon } from "@radix-ui/react-icons";
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
      <span
        className={cn("invisible", {
          visible: isHidden
        })}
      >
        <EyeClosedIcon />
      </span>

      <span
        className={cn("invisible", {
          visible: isSymlink
        })}
      >
        <ArrowLeftIcon />
      </span>

      <span
        className={cn("invisible", {
          visible: isStarred
        })}
      >
        <StarFilledIcon />
      </span>

      <span
        className={cn("invisible", {
          "visible": isCutting
        })}
      >
        <ScissorsIcon />
      </span>

      <span
        className={cn("invisible", {
          "visible": isCopying
        })}
      >
        <ClipboardIcon />
      </span>
    </span>
  );
};

export { EntryFlags };
