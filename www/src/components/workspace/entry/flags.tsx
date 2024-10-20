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
};

const EntryFlags: FC<EntryFlagsProps> = ({ IsSymlink, IsHidden }) => {
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
          visible: false
        })}
      >
        <StarFilledIcon />
      </span>

      <span
        className={cn("invisible", {
          visible: false
        })}
      >
        <ScissorsIcon />
      </span>

      <span
        className={cn("invisible", {
          visible: false
        })}
      >
        <ClipboardIcon />
      </span>
    </span>
  );
};

export { EntryFlags };
