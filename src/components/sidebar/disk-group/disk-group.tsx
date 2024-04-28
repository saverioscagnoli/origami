import { For } from "@components/for";
import { useAccessor } from "@hooks/use-accessor";
import { useTauriEvent } from "@hooks/use-tauri-event";
import { cn } from "@lib/utils";
import { Disk as TDisk } from "@typings/disk";
import { EventFromBackend } from "@typings/events";
import { Disk } from "./disk";

const DiskGroup = () => {
  const disks = useAccessor<TDisk[]>([]);

  useTauriEvent(EventFromBackend.SendDisks, newDisks => {
    disks.set(newDisks);
  });

  return (
    <div className={cn("flex flex-col gap-1")}>
      <p className={cn("px-2", "text-sm")}>Devices</p>
      <For
        of={disks().sort((a, b) => {
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
