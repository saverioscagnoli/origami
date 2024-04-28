import { cn, formatBytes, percentage } from "@lib/utils";
import { BackpackIcon } from "@radix-ui/react-icons";
import { FC } from "react";
import { Disk as TDisk } from "@typings/disk";
import { Progress } from "@components/tredici";
import { useNavigation } from "@contexts/navigation";
import { UsbIcon } from "lucide-react";

const Disk: FC<TDisk> = ({ totalSpace, freeSpace, mountPoint, isRemovable }) => {
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
          <span>{isRemovable ? <UsbIcon size={15} /> : <BackpackIcon />}</span>
          <p className={cn("w-1/2", "truncate")}>{mountPoint}</p>
        </span>
        <div className={cn("flex gap-1")}>
          <p className={cn("lg:block hidden text-sm")}>
            ({percentage(totalSpace - freeSpace, totalSpace)})
          </p>
          <p className={cn("text-sm")}>{formatBytes(totalSpace, 0)}</p>
        </div>
      </div>
      <Progress
        className={cn("w-full xl:h-[7px]", "sm:rounded-sm")}
        max={totalSpace}
        value={totalSpace - freeSpace}
      />
    </div>
  );
};

export { Disk };
