import { BackpackIcon } from "@radix-ui/react-icons";
import { fs } from "@wails/methods/models";
import React from "react";
import { Progress } from "~/components/tredici";
import { cn } from "~/lib/utils";
import { useCurrentDir } from "~/zustand/dir";

const Disk: React.FC<fs.Disk> = ({ Mountpoint, Total, Free, UsedPercent }) => {
  const cd = useCurrentDir(s => s.cd);
  const onClick = () => cd(Mountpoint);

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
          <span>
            <BackpackIcon />
          </span>
          <p className={cn("w-1/2", "truncate")}>{Mountpoint}</p>
        </span>
        <div className={cn("flex gap-1")}>
          <p className={cn("lg:block hidden text-sm")}>
            ({UsedPercent.toFixed(0)}%)
          </p>
          <p className={cn("text-sm")}>
            {(Total / 1024 / 1024 / 1024).toFixed(0)} GB
          </p>
        </div>
      </div>
      <Progress
        className={cn("w-full xl:h-[7px]", "sm:rounded-sm")}
        max={Total}
        value={Total - Free}
      />
    </div>
  );
};

export { Disk };
