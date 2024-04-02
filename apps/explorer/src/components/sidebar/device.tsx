import { useCurrentDir } from "@hooks/use-current-dir";
import { BackpackIcon } from "@radix-ui/react-icons";
import { Progress } from "@tredici";
import { Disk } from "@types";
import { cn } from "@utils";
import React, { useMemo } from "react";
import { LuUsb } from "react-icons/lu";

type DeviceProps = Disk & {
  onClick: () => void;
};

const Device: React.FC<DeviceProps> = ({
  mount_point,
  total,
  free,
  is_removable,
  onClick
}) => {
  const { dir } = useCurrentDir();
  const active = useMemo(() => dir.get() === mount_point, [dir, mount_point]);

  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        "px-4 py-2.5",
        "hover:bg-[--gray-3]",
        active && "bg-[--gray-3]",
        "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className={cn("flex justify-between items-center")}>
        <span className={cn("flex items-center gap-2")}>
          {is_removable ? <LuUsb /> : <BackpackIcon />}
          <p className={cn("text-sm")}>{mount_point}</p>
        </span>
        <p className={cn("text-sm")}>{total} GB</p>
      </div>
      <Progress className={cn("w-full")} max={total} value={total - free} />
    </div>
  );
};

export { Device };
