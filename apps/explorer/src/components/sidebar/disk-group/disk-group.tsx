import { For } from "@components/for";
import { useAccessor } from "@hooks/use-accessor";
import { useTauriEvent } from "@hooks/use-tauri-event";
import { cn } from "@lib/utils";
import { Disk as TDisk } from "@typings/disk";
import { Disk } from "./disk";
import { EventFromBackend } from "@typings/events";

const DiskGroup = () => {
  const disks = useAccessor<TDisk[]>([]);

  useTauriEvent<TDisk[]>(EventFromBackend.SendDisks, d => {
    disks.set(d);
  });

  return (
    <div className={cn("flex flex-col gap-1")}>
      <p className={cn("px-2", "text-sm")}>Device(s)</p>
      <For of={disks()}>{(d, i) => <Disk key={i} {...d} />}</For>
    </div>
  );
};

export { DiskGroup };
