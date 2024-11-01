import { FetchDisks } from "@wails/go/fs/Filesystem";
import { fs } from "@wails/go/models";
import React, { useEffect, useState } from "react";
import { useWailsEvent } from "~/hooks/use-wails-event";
import { cn } from "~/lib/utils";
import { For } from "../for";
import { Disk } from "./disk";

function nameSort(a: fs.Disk, b: fs.Disk) {
  if (a.mountpoint < b.mountpoint) return -1;
  if (a.mountpoint > b.mountpoint) return 1;
  return 0;
}

const DiskGroup: React.FC = () => {
  const [disks, setDisks] = useState<fs.Disk[]>([]);

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
    <div className={cn("flex flex-col gap-1", "mt-4")}>
      <p className={cn("pl-3", "text-sm")}>Devices</p>
      <For of={disks.sort(nameSort)}>{(d, i) => <Disk key={i} {...d} />}</For>
    </div>
  );
};

export { DiskGroup };
