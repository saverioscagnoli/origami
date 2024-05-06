import { For } from "@components/for";
import { useBackendEvent } from "@hooks/use-backend-event";
import { cn } from "@lib/utils";
import { Disk as TDisk } from "@typings/disk";
import { BackendEvent } from "@typings/enums";
import { useState } from "react";
import { Disk } from "./disk";

const DiskGroup = () => {
  const [disks, setDisks] = useState<TDisk[]>([]);

  useBackendEvent(BackendEvent.SendDisks, newDisks => {
    setDisks(newDisks);
  });

  return (
    <div className={cn("flex flex-col gap-1")}>
      <p className={cn("px-2", "text-sm")}>Devices</p>
      <For
        of={disks.sort((a, b) => {
          if (a.mountPoint < b.mountPoint) return -1;
          if (a.mountPoint > b.mountPoint) return 1;
          return 0;
        })}
      >
        {(d, i) => <Disk key={i} {...d} />}
      </For>
    </div>
  );
};

export { DiskGroup };
