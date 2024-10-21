import {
  ArrowLeftIcon,
  ClipboardIcon,
  EyeClosedIcon,
  ScissorsIcon,
  StarFilledIcon
} from "@radix-ui/react-icons";
import { FC } from "react";
import { cn } from "~/lib/utils";

type EntryFlagsProps = {
  IsSymlink: boolean;
  IsHidden: boolean;
  IsStarred: boolean;
  isCutting: boolean;
  isCopying: boolean;
};

const EntryFlags: FC<EntryFlagsProps> = ({
  IsSymlink,
  IsHidden,
  IsStarred,
  isCutting,
  isCopying
}) => {
  return (
    <span className={cn("flex items-center gap-2")}>
      <span
        className={cn("invisible", {
          visible: IsHidden
        })}
      >
        <EyeClosedIcon />
      </span>

      <span
        className={cn("invisible", {
          visible: IsSymlink
        })}
      >
        <ArrowLeftIcon />
      </span>

      <span
        className={cn("invisible", {
          visible: IsStarred
        })}
      >
        <StarFilledIcon />
      </span>

      <span
        className={cn("invisible", {
          visible: isCutting
        })}
      >
        <ScissorsIcon />
      </span>

      <span
        className={cn("invisible", {
          visible: isCopying
        })}
      >
        <ClipboardIcon />
      </span>
    </span>
  );
};

export { EntryFlags };
