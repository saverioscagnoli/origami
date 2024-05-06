import { Progress } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { cn, formatBytes, percentage } from "@lib/utils";
import { BackpackIcon } from "@radix-ui/react-icons";
import { Disk as TDisk } from "@typings/disk";
import { UsbIcon } from "lucide-react";
import { FC } from "react";

const Disk: FC<TDisk> = ({ totalSpace, freeSpace, mountPoint, isRemovable }) => {
  const { cd } = useCurrentDir();

  const onClick = () => cd(mountPoint);

  return (
    <div
      className={cn(
        "w-full",
        "flex flex-col gap-2",
        "px-4 py-2.5",
        "hover:bg-[--gray-3]",
        "cursor-pointer"
      )}
      onClick={onClick}
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
