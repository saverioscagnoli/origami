import { FetchDisks } from "@wails/methods/fs/Filesystem";
import React, { useEffect } from "react";
import { For } from "~/components/for";
import { useWailsEvent } from "~/hooks/use-wails-events";
import { cn } from "~/lib/utils";
import { useDisks } from "~/zustand/disks";
import { Disk } from "./disk";

const DiskGroup: React.FC = () => {
  const [disks, setDisks] = useDisks(s => [s.disks, s.setDisks]);

  /**
   * On startup:
   * - Fetch the disks from the backend.
   *   This is to ensure that the disks are present
   *   when the app starts, as the interval is ~1s.
   */
  useEffect(() => {
    FetchDisks().then(setDisks);
  }, []);

  /**
   * Listen to the disks event from the backend.
   * Sends the disks every ~1s to determine if there are any changes.
   */
  useWailsEvent("disks", setDisks);

  return (
    <div className={cn("flex flex-col gap-1")}>
      <p className={cn("px-2", "text-sm")}>Devices</p>
      <For
        of={disks.sort((a, b) => {
          if (a.Mountpoint < b.Mountpoint) return -1;
          if (a.Mountpoint > b.Mountpoint) return 1;
          return 0;
        })}
      >
        {(d, i) => <Disk key={i} {...d} />}
      </For>
    </div>
  );
};

export { DiskGroup };
