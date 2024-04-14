import { cn, formatBytes } from "@lib/utils";
import { BackpackIcon } from "@radix-ui/react-icons";
import { FC } from "react";
import { Disk as TDisk } from "@typings/disk";
import { Progress } from "@components/tredici";
import { useNavigation } from "@hooks/use-navigation";

const Disk: FC<TDisk> = ({ total, free, mountPoint, isRemovable }) => {
  const { cd } = useNavigation();

  return (
    <div
      className={cn(
        "w-full",
        "flex flex-col gap-2",
        "px-4 py-2.5",
        "hover:bg-[--gray-3]",
        "cursor-pointer"
      )}
      onClick={cd(mountPoint)}
    >
      <div className={cn("flex items-center justify-between")}>
        <span className={cn("flex items-center gap-2")}>
          <span>{isRemovable ? <BackpackIcon /> : <BackpackIcon />}</span>
          <p className={cn("w-1/2", "truncate")}>{mountPoint}</p>
        </span>
        <p className={cn("text-sm")}>{formatBytes(total, 0)}</p>
      </div>
      <Progress className={cn("w-full")} max={total} value={total - free} />
    </div>
  );
};

export { Disk };
